import { app, BrowserWindow, ipcMain} from 'electron'
import path from 'node:path'
import Store from 'electron-store'
 import { Flashcard } from '../src/services/Storage/FlashcardStorage'
// import type { Flashcard } from '../src/services/Storage/FlashcardStorage'
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC as string, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false
    },
  })
  
  
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST as string, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


app.whenReady().then(() => {
  const store = new Store()

  // ipcMain.handle('foo', (x,y) => {
  //   console.log(y)  
  //   return store.get("foo", 12345)
  // })
  ipcMain.handle("fc:deleteAll", () => store.delete('flashcards'))
  ipcMain.handle('fc:getAll', () => {
    const x = store.get("flashcards") as Flashcard[]
    console.log("GOT", x)
    return x
  })
  //@ts-ignore
  ipcMain.handle('fc:set', (event, flashcards) => {
    store.set("flashcards", flashcards)})
  //@ts-ignore
  ipcMain.handle('fc:add', (event, flashcard) => {
    let flashcards = store.get('flashcards', []) as any[]
    console.log("GOT FLASHCARD", flashcard)
    flashcards.push(flashcard)
    store.set('flashcards', flashcards)
    console.log("SHOULD BE", store.get('flashcards'))
  })

  //@ts-ignore
  ipcMain.handle('fc:deleteSingular', (event, flashcardId) => {
    let flashcards = store.get('flashcards', []) as Flashcard[]
    flashcards = flashcards.filter(({threadId}) => threadId !== flashcardId)
    store.set('flashcards', flashcards)
    console.log("SHOULD BE", store.get('flashcards'))
  })
  
  ipcMain.handle('settings:getApiKey', () => {
    console.log("getting the apikey!")
    return store.get('apiKey', "")
  })
  
  //@ts-ignore
  ipcMain.handle('settings:setApiKey', (event, apiKey) => {
    console.log("setting the apikey to", apiKey, "event is", event)
    return store.set('apiKey', apiKey)
  })
  
  //@ts-ignore
  ipcMain.handle('settings:setFlashcardPrompt', (event, flashcardPrompt) => {
    return store.set("flashcardPrompt", flashcardPrompt)
  })
  ipcMain.handle('settings:getFlashcardPrompt', () => {
    return store.get("flashcardPrompt", "")
  })

  createWindow()
})
