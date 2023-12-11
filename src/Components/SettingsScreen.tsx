
/** IDEAS */
/** Custom prompting: "I want my flashcards to be like.. {user inputs how they want their flashcards}" */
/** Use their own api key  */
/** Input their own assistant (would require a lot of refactoring)  */
/**  */

/**
 * TODO
 * Take in the settings as an object
 */

import { useState, useEffect } from "react"
import { Settings } from "../services/Settings/Settings"
import { FlashcardStore } from "../services/Storage/useFlashcardStorage"

interface SettingsScreenProps {
    settings: Settings,
    flashcardStore: FlashcardStore
}

export const SettingsScreen = ({settings, flashcardStore}: SettingsScreenProps) => {

    const [inputtedFlashcardPrompt, setInputtedFlashcardPrompt] = useState(settings.flashcardPrompt)
    const [inputtedApiKey, setInputtedApiKey] = useState(settings.apiKey)
    const [deleteAllConfirmation, setDeleteAllConfirmation] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Added this line

    const saveSettings = () => {
        settings.setApiKey(inputtedApiKey)
        settings.setFlashcardPrompt(inputtedFlashcardPrompt)
        setShowSuccessMessage(true); // Show success message
    }

    useEffect(() => {
        if (showSuccessMessage) {
            const timer = setTimeout(() => setShowSuccessMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessMessage]);

    return <div>
        {showSuccessMessage && <div className="success" style={{width: '50%'}}>Settings saved!</div>}
        <h3>Custom flashcard instructions</h3> 
        <p> This is set by default to provide the topic in the front, and an example/explanation in the back</p> 
        <textarea id="settings_textarea" rows={4} cols={45} placeholder="Example: Phrase the front as a question and the back as an answer" onChange = {(e) => setInputtedFlashcardPrompt(e.target.value)} value={inputtedFlashcardPrompt} maxLength={250}/> 
        <h3>API Key</h3>
        <input id="settings_input" placeholder="Your OpenAPI Key here" onChange = {(e) => setInputtedApiKey(e.target.value)} value={inputtedApiKey}/> 
        <div><button onClick = {saveSettings}> Save Settings </button></div>
        <h3 id="settings_delete_h3">Delete All Flashcards</h3>
        <div>
            <div>
                <input type="checkbox" checked={deleteAllConfirmation} onChange={() => setDeleteAllConfirmation(!deleteAllConfirmation)}/>
                <label>I am sure I want to delete all my flashcards</label>
            </div>
            <button onClick = {() => flashcardStore.deleteAllFlashcards()} disabled={!deleteAllConfirmation}> Delete All Flashcards </button>
        </div>
    </div>
}