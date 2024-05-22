import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray,
  nativeImage,
  Notification,
  clipboard
} from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import express from 'express'

const expressApp = express()

expressApp.get('/', (req, res) => {
  console.log(req.query)
  res.send('認可に成功しました!<br/>このページを閉じてください。')
})

expressApp.listen(4200)

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const img = nativeImage.createFromPath(path.join(__dirname, '../../resources/tray.png'))
  const tray = new Tray(img)
  tray.setToolTip('clip-master')
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'コントロールパネル',
        click: (): void => {
          // もしウィンドウが存在しない場合は作成
          if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
          } else {
            // 縮小化されている場合は元に戻す
            const window: Electron.BrowserWindow = BrowserWindow.getAllWindows()[0]
            if (window.isMinimized()) {
              window.restore()
            }
          }
          if (process.platform === 'darwin') {
            app.dock.show()
          }
        }
      },
      {
        label: '一時停止',
        click: (): void => {
          new Notification({
            title: '一時停止',
            body: '通知を一時停止しました'
          }).show()
        }
      },
      { label: '終了', role: 'quit' }
    ])
  )

  ipcMain.on('getClipBoard', () => {
    let text = ''
    if (process.platform === 'darwin') {
      // MacOS
      text = clipboard.read('public.file-url')
    } else {
      // Windows
      text = clipboard.readBuffer('FileNameW').toString('ucs2')
    } // TODO: Linux
    console.log(text)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    app.dock.hide()
  }
})
