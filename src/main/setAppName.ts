import { app } from 'electron'
import * as path from 'path'
const appName = 'electron-starter';
app.setName(appName);
const appData = app.getPath('appData');
app.setPath('userData', path.join(appData, appName));