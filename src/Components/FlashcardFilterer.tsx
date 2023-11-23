
import { useState, useEffect } from "react"
import { FlashcardCategory } from "../services/OpenAI/utils"

export interface FlashcardFilterSelectorProps {
    onChange: (filters: Record<FlashcardCategory, boolean>) => void
}

const initFilter = Object.keys(FlashcardCategory).reduce((initFilter, cat) => ({...initFilter, [cat]: true}), {} as Record<FlashcardCategory, boolean>)

export const FlashcardFilterSelector = ({onChange}: FlashcardFilterSelectorProps) => {
    
    const [flashcardFilter, setFlashcardFilterer] = useState<Record<FlashcardCategory,boolean>>(initFilter)

    const toggleCategory = (category: FlashcardCategory) => setFlashcardFilterer((old) => ({...old, [category]: !old[category]}))

    useEffect(() => {
        onChange(flashcardFilter)
    }, [flashcardFilter])


    return <div>
        {Object.keys(FlashcardCategory).map((category) => 
            <>
                <input type="checkbox" onChange={() => toggleCategory(category as FlashcardCategory)} checked={flashcardFilter[category as FlashcardCategory]}/>
                <label>{category}</label>
            </>
        )}
    </div>
}