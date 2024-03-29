/// <reference types="vite-plugin-electron/electron-env" />
import { Flashcard } from '../src/services/Storage/FlashcardStorage'

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    DIST: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
declare global{
  interface Window {
    ipcRenderer: import('electron').IpcRenderer,
    mockStore: {foo: (x: any) => number}
    flashcardStore: {
      getAll: () => Promise<Flashcard[]>,
      set:  (flashcards : Flashcard[]) => void
      add: (flashcard: Flashcard) => void
      deleteAll: () => void,
      deleteSingular: (flashcardId: string) => void
    },
    settings: {
      getApiKey: () => Promise<string>,
      setApiKey: (apiKey: string) => void,
      setFlashcardPrompt: (apiKey: string) => void,
      getFlashcardPrompt: () => Promise<string>
    }
  }
}
