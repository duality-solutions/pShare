// sometimes node and rxjs6 don't play well together,
// so we ensure that symbolObservable is defined from the
// very outset, so that all observables use this symbol,
// not their own definition of it.
// See https://github.com/ReactiveX/rxjs/issues/3828
import symbolObservable from 'symbol-observable'
console.log(symbolObservable);

import './setAppName'
import { app, BrowserWindow, Menu, shell, MessageBoxOptions, dialog } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF } from 'electron-devtools-installer';
import { installExtensionsAsync } from './installExtensionsAsync';
import { configureStore } from './store';
import { install as installDevtron } from 'devtron'
import { AppActions } from '../shared/actions/app';
import { divertConsoleToLogger } from './system/divertConsoleToLogger';
import { version } from '../../getVersion';


declare module 'electron' {
  interface BrowserWindow {
    inspectElement(x: number, y: number): void
  }
  interface Menu {
    popup(window: BrowserWindow): void
  }
}

const hasLock = app.requestSingleInstanceLock()
if (!hasLock) {
  app.on("ready", () => {
    const messageBoxOptions: MessageBoxOptions = {
      type: "warning",
      title: "Oops...",
      message: `pShare is already running`,
      detail: `You can only run one pShare at a time`,
      normalizeAccessKeys: true,
      buttons: ["&Ok"],
      noLink: true,
      cancelId: 0,
      defaultId: 0
    };
    dialog.showMessageBox(messageBoxOptions, (res, checked) => {
      app.exit()
    });
  })

} else {




  //defines paths into the store that will be persisted
  const persistencePaths = ['user.syncAgreed', 'user.userName', 'user.accountCreationTxId', 'user.accountCreated', 'rtcConfig'];
  let mainWindow: BrowserWindow | null
  let rtcWindow: BrowserWindow | null
  let aboutPanelWindow: BrowserWindow | null

  const store = configureStore(() => mainWindow, persistencePaths)
  store.getState();

  const devToolsExtensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF];


  const isDevelopment = process.env.NODE_ENV === 'development'
  const isSpectron = process.env.IS_SPECTRON === 'true'

  isDevelopment && (!isSpectron) && app.commandLine.appendSwitch('remote-debugging-port', '9223')
  //isSpectron && app.commandLine.appendSwitch('headless')
  isSpectron && app.commandLine.appendSwitch('disable-gpu')
  // global reference to mainWindow (necessary to prevent window from being garbage collected)

  const templateUrl =
    isSpectron
      ? formatUrl({
        pathname: path.join(__dirname, '..', 'renderer', 'index.html'),
        protocol: 'file',
        slashes: true
      })
      : isDevelopment
        ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
        : formatUrl({
          pathname: path.join(__dirname, 'index.html'),
          protocol: 'file',
          slashes: true
        })

  function createRtcWindow() {
    const window = new BrowserWindow({ width: 1, height: 1, show: false })
    window.loadURL(`${templateUrl}?role=rtc`)
    return window
  }

  function createAboutPanelWindow() {
    const window = new BrowserWindow({ width: 420, height: 300, resizable:false});
    window.setMenuBarVisibility(false);
    window.on('closed', () => {
      aboutPanelWindow = null
    })
    const loadView = ( props: { title: string, version: string, }) => {

      return (`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${props.title}</title>
            <meta charset="UTF-8">
            <style>
             body {
              @import url('https://fonts.googleapis.com/css?family=Open+Sans');
              font-family: 'Open Sans', sans-serif;
               text-align: center;
               overflow:hidden;
               width: 100vw;
               height: 80vh;
               display: flex;
               flex-direction: column;
               padding: 20px 0;
               justify-content: space-around;
               align-items: center;
               background: white;
             }
             #link {
              cursor: pointer;
              color: #2e77d0;
            }
            #title {
              color : #4a4a4a;
              // color: white;
              font-size: 24px;
              font-weight: 800;
              line-height: 24px;
              margin: 0;
            }
            #version {
              color : #4a4a4a;
              // color: white;
              font-size: 14px;
              font-weight: 400;
              margin:0;
            }
            svg {
              height: 100px;
              width: 100px;
            }
         </style>
          </head>
          <body>
            <p id="title">pShare</p>
              
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 500 500">
                    <defs>
                      <style>.cls-1{fill:#fff;}.cls-2{fill:#2e77d0;}.cls-3{opacity:0.1;}.cls-4{opacity:0.05;}</style>
                    </defs>
                    <title>p-share-logo-svgs</title>
                    <polygon class="cls-1" points="289.712 249.111 289.712 203.256 250 180.329 210.288 203.256 210.288 249.111 250 272.039 289.712 249.111"/>
                    <path class="cls-2" d="M250,129.71487l-83.366,48.13141V370.28513l43.65448-25.40119V299.313L250,322.24045,333.366,274.109V177.84628Zm39.71155,119.19025L250,271.83255l-39.71155-22.92743V203.0502L250,180.12277l39.71149,22.92743Z"/><polygon class="cls-3" points="333.366 274.109 250 322.24 250.347 226.184 333.366 177.846 333.366 274.109"/>
                    <polygon class="cls-4" points="250.347 226.184 166.634 177.846 250 129.715 333.366 177.846 250.347 226.184"/>
              </svg>
            <p id="trademark1">Powered by <b>Duality™</b></p>
            <p id="trademark3"><b><i>Think Inside The Block™</i></b></p>
            <a id="link" onClick="handleClick()">
                https://duality.solutions/pshare
            </a>
            <p id="version">Version: ${props.version}</p>
            <script type="text/javascript">
              const shell = require("electron").shell;
              function handleClick () {
                shell.openExternal('https://duality.solutions/pshare')
                return false;
              }
            </script>
             </body>
        </html>
      `)
    }

    const content = 'data:text/html;charset=UTF-8,' + encodeURIComponent(loadView({
      title: "About pShare",
      version: version || "Not found",
    }));
    window.loadURL(content);

    return window;
  }

  function createMainWindow() {
    const window = new BrowserWindow({ width: 1024, height: 768 })

    console.log(`loading templateUrl : ${templateUrl}`)
    window.loadURL(`${templateUrl}?role=renderer`)



    window.on('closed', () => {
      mainWindow = null
      if (rtcWindow) {
        console.log("closing rtc window")
        rtcWindow.close()
      }
      if (aboutPanelWindow) {
        console.log("closing about window");
        aboutPanelWindow.close();
      }
    })

    window.webContents.on('devtools-opened', () => {
      window.focus()
      setImmediate(() => {
        window.focus()
      })
    })

    return window
  }

  // quit application when all windows are closed
  app.on('window-all-closed', () => {

    console.log("EVENT - window-all-closed")
    app.quit()
    //store.dispatch(process.platform !== 'darwin' ? AppActions.shuttingDown() : AppActions.sleep())
    //storeCancellationToken.cancel()
    //store.dispatch(AppActions.shuttingDown())

  })
  app.on('before-quit', e => {
    console.log("EVENT - before-quit")
    if (store.getState().app.hasShutdown) {
      console.log("store indicates hasShutdown=true, safe to quit")
      app.releaseSingleInstanceLock()
      return //now everything is cleaned up, return and allow app to quit
    }

    //1st time round
    //prevent this quit and cleanup. 
    //The when cleanup is complete this will cause a second app.quit() 
    //See function orchestrateShutdown in src/main/store/hot-reload/runRootSagaWithHotReload.ts
    console.log("not yet cleaned up, cancelling quit")
    e.preventDefault()
    store.dispatch(AppActions.shuttingDown())

  })

  app.on('quit', () => {

    console.log("EVENT - quit")

  })



  app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
      mainWindow = createMainWindow()
    }
  })

  // create main BrowserWindow when electron is ready
  app.on('ready', async () => {

    if (!isDevelopment) {
      await divertConsoleToLogger()
    }

    if (isDevelopment) {
      const installPromise = installExtensionsAsync(devToolsExtensions);
      installDevtron();
      await installPromise;
    }
    mainWindow = createMainWindow()
    rtcWindow = createRtcWindow()

    setAppMenu(mainWindow);

    const contextMenu = [   
      {
        label: 'Cut',
        role: 'cut'
      },
      {
        label: 'Copy',
        role: 'copy'
      },
      {
        label: 'Paste',
        role: 'paste'
      }
    ]
   if (isDevelopment) {
      // add inspect element on right click menu
      mainWindow.webContents.on('context-menu', (e, props) => {
        mainWindow && Menu.buildFromTemplate([
          ...contextMenu,
          {
            label: 'Inspect element',
            click() {
              if (mainWindow) {
                mainWindow.webContents.openDevTools({ mode: "detach" });
                mainWindow.inspectElement(props.x, props.y);
              }
            }
          },
          {
            label: 'RTC devtools',
            click() {
              if (rtcWindow) {
                rtcWindow.webContents.openDevTools({ mode: "detach" });

              }
            }
          },
        ]).popup(mainWindow);
      });
    }
    else {
          mainWindow.webContents.on('context-menu', () => {
            mainWindow && Menu.buildFromTemplate(contextMenu).popup(mainWindow);
          })
        }
  })


  function setAppMenu(mainWindow: BrowserWindow) {
    const template = [
      {
        label: 'Edit',
        id: 'edit-menu',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteandmatchstyle' },
          { role: 'delete' },
          { role: 'selectall' }
        ]
      },
      {
        role: 'Help',
        id: 'help-menu',
        submenu: [
          {
            label: 'Support',
            click() { shell.openExternal('https://discord.gg/87be63e')}
          },
          {
            label: 'About pShare',
            click() {
              if(aboutPanelWindow) return;
              aboutPanelWindow = createAboutPanelWindow()
            }
          }
        ]
      }
    ];
    if (isDevelopment) {
      template.push(<any>{
        label: 'View',
        id: 'view-menu',
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          {
            label: 'Reset redux store',
            async click() {
              mainWindow && await mainWindow.webContents.executeJavaScript("window.resetStore && window.resetStore()")
            }
          },
          {
            label: 'Toggle RTC window devtools',
            click() {
              rtcWindow && rtcWindow.webContents.openDevTools({ mode: "detach" });
            }
          },
          { role: 'toggledevtools' },
          { type: 'separator' },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      })
    }

    if (process.platform === 'darwin') {
      template.unshift(<any>{
        label: 'pShare',
        submenu: [
          { 
            label: 'About pShare',
            click() {
              if(aboutPanelWindow) return;
              aboutPanelWindow = createAboutPanelWindow()
            }
          },
          { type: 'separator' },
          { role: 'services', submenu: [] },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      });
      // // Edit menu
      // template[1].submenu.push(
      //   {type: 'separator'},
      //   {
      //     label: 'Speech',
      //     submenu: [
      //       {role: 'startspeaking'},
      //       {role: 'stopspeaking'}
      //     ]
      //   }
      // )
      // Window menu
      // template[3].submenu = [
        // { role: 'close' },
        // { role: 'minimize' },
        // { role: 'zoom' },
        // { type: 'separator' },
        // { role: 'front' }
      // ];
    }
    const menu = Menu.buildFromTemplate(<any>template);
    Menu.setApplicationMenu(menu);
  }

}