import { BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

export const createDropDetectorWindow = (): void => {
  const window = new BrowserWindow({
    title: 'Drop detector',
    autoHideMenuBar: true,
    opacity: 0.3
  })

  window.on('ready-to-show', () => {
    window.show()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/drop-detector.html`)
  } else {
    window.loadFile(join(__dirname, '../renderer/drop-detector.html'))
  }
}
