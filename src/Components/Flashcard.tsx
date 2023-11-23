
import { useState } from "react";
import "./styles/Flashcard.css"
import { FlashcardCategory } from "../services/OpenAI/utils";


interface FlashcardProps {
    front: string;
    back: string;
    category: FlashcardCategory
}

export default function FlashcardUI({front, back, category}: FlashcardProps){ 
    
    const [isFlipped, setIsFlipped] = useState(false)
    const flipCard = () => setIsFlipped(!isFlipped)



    return <div className="flashcard">
        <div className = "flashcard-category"> Category: {category} </div>
        <div className="flashcard-container">
            <div className = "flashcard-content"> {!isFlipped ? front : back} </div>
            <div className="flashcard-bottom">
                <button onClick = {flipCard}> {isFlipped ? "Hide" : "Show"} Answer </button>
            </div>
        </div>
    </div>

}