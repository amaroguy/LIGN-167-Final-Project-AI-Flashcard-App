
/** IDEAS */
/** Custom prompting: "I want my flashcards to be like.. {user inputs how they want their flashcards}" */
/** Use their own api key  */
/** Input their own assistant (would require a lot of refactoring)  */
/**  */

/**
 * TODO
 * Take in the settings as an object
 */

import { useState } from "react"
import { Settings } from "../services/Settings/Settings"

interface SettingsScreenProps {
    settings: Settings
}

export const SettingsScreen = ({settings}: SettingsScreenProps) => {

    const [inputtedFlashcardPrompt, setInputtedFlashcardPrompt] = useState(settings.flashcardPrompt)
    const [inputtedApiKey, setInputtedApiKey] = useState(settings.apiKey)

    const saveSettings = () => {
        settings.setApiKey(inputtedApiKey)
        settings.setFlashcardPrompt(inputtedFlashcardPrompt)
    }

    return <div>
        this isnt finished yet lol
        <h3>Custom flashcard instructions</h3> 
        <textarea id="settings_textarea" rows="4" cols="45" placeholder="Example: Phrase the front as a question and the back as an answer" onChange = {(e) => setInputtedFlashcardPrompt(e.target.value)} value={inputtedFlashcardPrompt} maxLength={250}/> 
        <h3>API Key</h3>
        <input id="settings_input" placeholder="Your OpenAPI Key here" onChange = {(e) => setInputtedApiKey(e.target.value)} value={inputtedApiKey}/> 
        <div><button onClick = {saveSettings}> Save Settings </button></div>
    </div>
}