import { clipboard } from 'electron'

export const getClipBoard = (): void => {
  let text = ''
  if (process.platform === 'darwin') {
    // MacOS
    text = clipboard.read('public.file-url')
  } else {
    // Windows
    text = clipboard.readBuffer('FileNameW').toString('ucs2')
  } // TODO: Linux
  console.log(text)
}
