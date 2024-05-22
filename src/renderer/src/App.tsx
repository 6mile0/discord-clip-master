function App(): JSX.Element {
  const getClipBoard = (): void => window.electron.ipcRenderer.send('getClipBoard')

  return (
    <>
      <h1>Clip-Master</h1>
      <button onClick={getClipBoard}>クリップボード取得</button>
      <a
        href="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=530f0a6e-bf87-4bc8-ac87-87c936e1bf3d&scope=offline_access%20files.readwrite.all&response_type=code&redirect_uri=http://localhost:4200/"
        target="_blank"
        rel="noreferrer"
      >
        OneDriveを連携
      </a>
    </>
  )
}

export default App
