
import { useState, useEffect } from "react"
import { FlashcardCategory } from "../services/OpenAI/utils"
import "./styles/FlashcardFilterer.css"

export interface FlashcardFilterSelectorProps {
    onChange: (filters: Record<string, boolean>) => void
}

const initFilter = Object.values(FlashcardCategory).reduce((initFilter, cat) => ({...initFilter, [cat]: true}), {} as Record<string, boolean>)

export const FlashcardFilterSelector = ({onChange}: FlashcardFilterSelectorProps) => {
    
    const [flashcardFilter, setFlashcardFilterer] = useState<Record<string,boolean>>(initFilter)
    const [showFilters, setShowFilters] = useState(false)

    const toggleCategory = (category: string) => setFlashcardFilterer((old) => ({...old, [category]: !old[category]}))
    const toggleAllCategories = () => setFlashcardFilterer(Object.keys(flashcardFilter).reduce((filter, cat) => ({...filter, [cat]: true}) ,{} as Record<string,boolean>))

    useEffect(() => {
        onChange(flashcardFilter)
    }, [flashcardFilter])


    if(!showFilters){
        return <button onClick = {() => setShowFilters(true)} className={"filters-top-margin"}> Show filters </button>
    }

    return <div>
        <button onClick = {() => setShowFilters(false)} className = {"filters-top-margin"}> Hide Filters </button>
        <div className="filter-btns">
            {Object.values(FlashcardCategory).map((category) => 
                <button className={`filter-btn filter-${flashcardFilter[category] ? "on" : "off"}`} onClick = {() => toggleCategory(category)}> {`${flashcardFilter[category] ? "✔️" : "❌"}` + category.split("_").join(" ")} </button>
            )}
            <button className={'filter-btn'} onClick={toggleAllCategories}> Show All </button>
        </div>
    </div>
}