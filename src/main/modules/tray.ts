import { app, Menu, BrowserWindow, Notification, Tray, nativeImage } from 'electron'
import path from 'path'

import { createWindow } from './createWindow'

const trayMenu = Menu.buildFromTemplate([
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

export const createTray = (): void => {
  const img = nativeImage.createFromPath(path.join(__dirname, '../../resources/tray.png'))
  const tray = new Tray(img)
  tray.setToolTip('clip-master')
  tray.setContextMenu(trayMenu)
}
