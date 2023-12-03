
import { useState, useEffect } from "react"
import { FlashcardCategory } from "../services/OpenAI/utils"

export interface FlashcardFilterSelectorProps {
    onChange: (filters: Record<string, boolean>) => void
}

const initFilter = Object.values(FlashcardCategory).reduce((initFilter, cat) => ({...initFilter, [cat]: true}), {} as Record<string, boolean>)

export const FlashcardFilterSelector = ({onChange}: FlashcardFilterSelectorProps) => {
    
    const [flashcardFilter, setFlashcardFilterer] = useState<Record<string,boolean>>(initFilter)

    const toggleCategory = (category: string) => setFlashcardFilterer((old) => ({...old, [category]: !old[category]}))

    useEffect(() => {
        onChange(flashcardFilter)
    }, [flashcardFilter])


    return <div>
        {Object.values(FlashcardCategory).map((category) => 
            <>
                <input type="checkbox" onChange={() => toggleCategory(category)} checked={flashcardFilter[category]}/>
                <label>{category.split("_").join(" ")}</label>
            </>
        )}
    </div>
}