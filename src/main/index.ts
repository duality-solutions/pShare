import './setAppName'
import { app, BrowserWindow, Menu, shell } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF } from 'electron-devtools-installer';
import installExtensionsAsync from './installExtensionsAsync';
import startDynamicd from './startDynamicd'

declare module 'electron' {
  interface BrowserWindow {
    inspectElement(x: number, y: number): void
  }
  interface Menu {
    popup(window: BrowserWindow): void
  }
}
//console.log(process.env)
startDynamicd()
  .then(proc => app.on('before-quit', async () => {
    console.log("before quit")
    proc.dispose()
    console.log("proc disposed")
  }))
  .catch(err => console.error(err));
const devToolsExtensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF];


const isDevelopment = process.env.NODE_ENV === 'development'
const isSpectron = process.env.IS_SPECTRON === 'true'

isDevelopment && (!isSpectron) && app.commandLine.appendSwitch('remote-debugging-port', '9223')
//isSpectron && app.commandLine.appendSwitch('headless')
isSpectron && app.commandLine.appendSwitch('disable-gpu')
// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null

function createMainWindow() {
  const window = new BrowserWindow()

  // if (isDevelopment) {
  //   window.webContents.openDevTools()
  // }


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

  console.log(`loading templateUrl : ${templateUrl}`)
  window.loadURL(templateUrl)



  window.on('closed', () => {
    mainWindow = null
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
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  isDevelopment && await installExtensionsAsync(devToolsExtensions);
  mainWindow = createMainWindow()
  setAppMenu(mainWindow);
  // if (menu) {
  //   menu.insert(10000,new MenuItem({submenu:new Menu()}))
  //   Menu.setApplicationMenu(menu);
  //   //var fileMenuItem=blinq(menu.items).single(item=>item.label==="File");
  //   //console.log(fileMenuItem)
  // }
  if (isDevelopment) {
    // auto-open dev tools
    // mainWindow.webContents.openDevTools();

    // add inspect element on right click menu
    mainWindow.webContents.on('context-menu', (e, props) => {
      mainWindow && Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click() {
            if (mainWindow) {
              mainWindow.webContents.openDevTools({ mode: "detach" });
              mainWindow.inspectElement(props.x, props.y);
            }
          },
        },
      ]).popup(mainWindow);
    });
  }
})



function setAppMenu(mainWindow: BrowserWindow) {
  const template = [
    {
      label: 'Edit',
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
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        {
          label: 'Reset redux store',
          async click() {
            console.log("reset");
            mainWindow && await mainWindow.webContents.executeJavaScript("window.resetStore && window.resetStore()")
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
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() { shell.openExternal('https://electronjs.org'); }
        }
      ]
    }
  ];
  if (process.platform === 'darwin') {
    template.unshift(<any>{
      label: app.getName(),
      submenu: [
        { role: 'about' },
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
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ];
  }
  const menu = Menu.buildFromTemplate(<any>template);
  Menu.setApplicationMenu(menu);
}

