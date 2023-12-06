import { FlashcardCategory } from "../services/OpenAI/utils"
import { Flashcard } from "../services/Storage/FlashcardStorage"
import FlashcardUI from "./Flashcard"
import { FlashcardFilterSelector } from "./FlashcardFilterer"
import { useEffect, useState } from "react"
import { lowerCase } from "lodash"

interface AllFlashcardsDisplayProps {
    flashcards: Flashcard[]
}

export const AllFlashcardsDisplay = ({flashcards}: AllFlashcardsDisplayProps) => {

    
    
    const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>(flashcards)
    const [currentFilter, setCurrentFilter] = useState<Record<string, boolean>>({})
    
    useEffect(() => {
        setFilteredFlashcards(flashcards.filter(f => currentFilter[f.category] ?? true))
    }, [flashcards, currentFilter])

    if(flashcards.length === 0){
        return <div> You have no flashcards! </div>
    }
    const filterFlashcards = (flashcardFilter: Record<string, boolean>) => {
        console.log(flashcardFilter)
        console.log(flashcards[0].category)
        setCurrentFilter(flashcardFilter)
        setFilteredFlashcards(flashcards.filter(f => flashcardFilter[f.category]))
    }


   return <>
        <FlashcardFilterSelector onChange = {filterFlashcards}/>
        {filteredFlashcards.map((f) => <div key={f.threadId + "-div"} className="my"> <FlashcardUI key={f.threadId + "-fc"} front={f.front} back={f.back} category = {f.category}/> </div>)}
    </>
}