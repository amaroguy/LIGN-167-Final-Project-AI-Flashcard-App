
import {useState, useEffect} from 'react'

export interface Settings {
    apiKey: string,
    flashcardPrompt: string,
    areSettingsLoading: boolean,
    setFlashcardPrompt: (apiKey: string) => void
    setApiKey: (apiKey: string) => void
}

export const useSettings = (): Settings => {

    const [flashcardPrompt, setFlashcardPromptReactState] = useState("")
    const [apiKey, setApiKeyReactState] = useState("")
    const [areSettingsLoading, setAreSettingsLoading] = useState(false)

    const loadSettingsFromDisk = async () => {
        setAreSettingsLoading(true)
        
        const disk_apikey = await window.settings.getApiKey()
        const disk_flashcardPrompt = await window.settings.getFlashcardPrompt()
    
        console.log("read apikey from disk", disk_apikey)
        console.log("read flashcardprompt from disk", disk_flashcardPrompt)

        setFlashcardPromptReactState(disk_flashcardPrompt)
        setApiKeyReactState(disk_apikey)


        setAreSettingsLoading(false)
    }
    
    const setApiKey = (apiKey: string) => {
        setAreSettingsLoading(true)

        console.log("from hook: setting apikey to", apiKey)
        window.settings.setApiKey(apiKey)
        setApiKeyReactState(apiKey)

        setAreSettingsLoading(false)
    }
    
    const setFlashcardPrompt = (flashcardPrompt: string) => {
        setAreSettingsLoading(true)

        window.settings.setFlashcardPrompt(flashcardPrompt)
        setFlashcardPromptReactState(flashcardPrompt)

        setAreSettingsLoading(false)
    }

    useEffect(() => {
        loadSettingsFromDisk()
    }, [])



    return {
        apiKey,
        flashcardPrompt,
        areSettingsLoading,
        setFlashcardPrompt,
        setApiKey
    }
}