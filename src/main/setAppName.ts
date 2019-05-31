import { app } from 'electron'
import * as path from 'path'
const appName = 'pShare';
app.setName(appName);
const appData = app.getPath('appData');
app.setPath('userData', path.join(appData, appName));