
import { useState } from "react";
import "./styles/Flashcard.css"
import { Flashcard } from "../services/Storage/FlashcardStorage";
import { FlashcardStore } from "../services/Storage/useFlashcardStorage";


interface FlashcardProps {
    flashcard: Flashcard
    flashcardStore: FlashcardStore
}

export default function FlashcardUI({flashcard, flashcardStore}: FlashcardProps){ 
    
    const {front, back, category, threadId} = flashcard
    const [isFlipped, setIsFlipped] = useState(false)
    const flipCard = () => setIsFlipped(!isFlipped)



    return <div className="flashcard">
        <div className = "flashcard-nav">
            <button className = "flashcard-button" onClick={() => flashcardStore.deleteSingularFlashcard(threadId)}> 🗑️ </button>
            <div className = "flashcard-category"> Category: {category} </div>
        </div>
        <div className="flashcard-container">
            <div className = "flashcard-content"> {!isFlipped ? front : back} </div>
            <div className="flashcard-bottom">
                <button onClick = {flipCard}> {isFlipped ? "Hide" : "Show"} Answer </button>
            </div>
        </div>
    </div>

}