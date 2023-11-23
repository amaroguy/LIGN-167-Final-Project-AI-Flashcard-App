import { useState } from 'react'
import HomeScreen from './Components/HomeScreen'
import './App.css'
import { createGPTService } from './services/OpenAI/GPTService'
import { useFlashcardStorage } from './services/Storage/useFlashcardStorage'
import { APP_MODE } from './utils'
import { StudyMode } from './Components/StudyMode'
import { DebugScreen } from './Components/DebugScreen'
import { SettingsScreen } from './Components/SettingsScreen'

function App() {
  console.log("Starting!")

  const API_KEY = ""
  const [isLoading, setIsLoading] = useState(false)
  const flashcardStore = useFlashcardStorage()
  const gptService = createGPTService(API_KEY, setIsLoading, flashcardStore)
  const [appState, setAppState] = useState<APP_MODE>(APP_MODE.HOME_SCREEN)

  const getAppScreen = (appMode: APP_MODE) => {
    switch(appMode) {
      case APP_MODE.HOME_SCREEN: {
        return <HomeScreen setLoading = {setIsLoading} gptService={gptService} flashcardStore = {flashcardStore}/>
      }
      case APP_MODE.STUDY_MODE: {
        return <StudyMode flashcards = {flashcardStore.flashcards} setAppState = {setAppState} gptService={gptService}/>
      }
      case APP_MODE.DEBUG_MODE: {
        return <DebugScreen />
      }
      case APP_MODE.SETTINGS_SCREEN: {
        return <SettingsScreen />
      }
    }
  }

  return (
    <>
      <nav>
        <button onClick = {() => setIsLoading(false)} className="nav-btn"> RESET LOADING </button>
        <button onClick = {() => setAppState(APP_MODE.STUDY_MODE)}  className="nav-btn"> Study Mode </button>
        <button onClick={() => setAppState(APP_MODE.HOME_SCREEN)} className="nav-btn"> Home </button>
        <button onClick= {() => setAppState(APP_MODE.DEBUG_MODE)} className="nav-btn"> DEBUG MODE </button>
        <button onClick = {() => setAppState(APP_MODE.SETTINGS_SCREEN)}> Settings </button>
      </nav>
      <div id = "main-app">
        <div className="card">
          {!API_KEY.length && "YOU HAVE NOT SET YOUR API KEY IN APP.TSX!!!"}
          {
            isLoading ? 
            <div> Loading </div> : 
            getAppScreen(appState)
          }
        </div>
      </div>     
    </>
  )
}

export default App
