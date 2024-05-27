import { app, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'

import { createTray } from './modules/tray'
import { createWindow } from './modules/createWindow'
import { createDropDetectorWindow } from './modules/createDropDetectorWindow'

import { getClipBoard } from './ipcs/getClipBoard'
import { expressServer } from './server'

function main(): void {
  app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    ipcMain.on('getClipBoard', () => getClipBoard())

    createTray()
    createWindow()
    createDropDetectorWindow()

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform === 'darwin') {
      app.dock.hide()
    }
  })

  expressServer()
}

main()
