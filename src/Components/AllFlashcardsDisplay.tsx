import { FlashcardCategory } from "../services/OpenAI/utils"
import { Flashcard } from "../services/Storage/FlashcardStorage"
import FlashcardUI from "./Flashcard"
import { FlashcardFilterSelector } from "./FlashcardFilterer"
import { useState } from "react"
import { lowerCase } from "lodash"

interface AllFlashcardsDisplayProps {
    flashcards: Flashcard[]
}

export const AllFlashcardsDisplay = ({flashcards}: AllFlashcardsDisplayProps) => {
    
    const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>(flashcards)

    const filterFlashcards = (flashcardFilter: Record<string, boolean>) => {
        console.log(flashcardFilter)
        console.log(flashcards[0].category)
        setFilteredFlashcards(flashcards.filter(f => flashcardFilter[f.category]))
    }


   return <>
        <FlashcardFilterSelector onChange = {filterFlashcards}/>
        {filteredFlashcards.map((f) => <div className="my"> <FlashcardUI front={f.front} back={f.back} category = {f.category}/> </div>)}
    </>
}