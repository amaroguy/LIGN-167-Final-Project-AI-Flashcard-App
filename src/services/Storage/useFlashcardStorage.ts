import { useState, useEffect } from "react"
import { Flashcard } from "./FlashcardStorage"

export interface FlashcardStore {
    flashcards: Flashcard[],
    areFlashcardsLoading: boolean,
    addFlashcard: (flashcard: Flashcard) => Promise<void>,
    deleteAllFlashcards: () => Promise<void>,
    deleteSingularFlashcard: (flashcardId: string) => Promise<void>,
    _deleteAllFlashcards: () => Promise<void>
}

export const useFlashcardStorage = () => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [areFlashcardsLoading, setAreFlashcardsLoading] = useState(false)

    const fetchFlashcards = async () => {
        setAreFlashcardsLoading(true)

        const flashcards = await window.flashcardStore.getAll()
        setFlashcards(flashcards ?? [])

        setAreFlashcardsLoading(false)
        return
    }

    const addFlashcard = async (flashcard : Flashcard) => {
        console.log("FOO")
        setFlashcards([flashcard, ...flashcards])
        window.flashcardStore.add(flashcard)
    }

    const deleteAllFlashcards = async () => {
        window.flashcardStore.deleteAll()
        setFlashcards([])
    }

    const deleteSingularFlashcard = async (flashcardId: string) => {
        window.flashcardStore.deleteSingular(flashcardId)
        setFlashcards((old) => old.filter(({threadId}) => threadId !== flashcardId))
    }
    
    const _deleteAllFlashcards = async () => {
        window.flashcardStore.deleteAll()
        setFlashcards([])
    }


    useEffect(() => {
        fetchFlashcards()
    }, [])

    return {
        flashcards,
        areFlashcardsLoading,
        addFlashcard,
        deleteAllFlashcards,
        deleteSingularFlashcard,
        _deleteAllFlashcards
    } as FlashcardStore
}