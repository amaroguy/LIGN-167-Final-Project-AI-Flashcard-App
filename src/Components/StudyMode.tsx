import { useState } from "react"
import { Flashcard } from "../services/Storage/FlashcardStorage"
import FlashcardUI from "./Flashcard"
import { APP_MODE } from "../utils"
import { GPTService } from "../services/OpenAI/GPTService"
import "./styles/StudyMode.css"

interface StudyModeProps {
    flashcards: Flashcard[]
    setAppState: (appState: APP_MODE) => void,
    gptService: GPTService
}

enum CorrectnessState {
    UNDECIDED = "UNDECIDED",
    CORRECT = "CORRECT",
    INCORRECT = "INCORRED"
}

//if correct no explanation needed
export interface FlashcardGradeResult {
    threadId?: string
    correctness: CorrectnessState,
    explanation?: string
}

const UNDECIDED_STATE: FlashcardGradeResult = {
    correctness: CorrectnessState.UNDECIDED
}

export const StudyMode = ({flashcards, setAppState, gptService}: StudyModeProps) => {
    

    console.log(flashcards)

    let [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
    let [isStudyModeFinished, setIsStudyModeFinished] = useState(false)
    let [userAnswer, setUserAnswer] = useState("")
    let [flashcardGradeResult, setFlashcardGradeResult] = useState<FlashcardGradeResult>(UNDECIDED_STATE)
    let [isGrading, setIsGrading] = useState(false)
    let [errorMessage, setErrorMessage] = useState("")

    const restartStudySession = () => {
        setIsStudyModeFinished(false)
        setCurrentFlashcardIndex(0)
    }

    const previousFlashcard = () => {
        setFlashcardGradeResult(UNDECIDED_STATE)
        setUserAnswer("")
        if(currentFlashcardIndex === 0){
            return
        }
        
        setCurrentFlashcardIndex(currentFlashcardIndex -1)
    }
    
    const nextFlashcard = () => {
        setUserAnswer("")
        setFlashcardGradeResult(UNDECIDED_STATE)
        
        if(currentFlashcardIndex + 1 >= flashcards.length){
            setIsStudyModeFinished(true)
        }

        setCurrentFlashcardIndex(currentFlashcardIndex + 1)
    }

    const gradeFlashcard = async (userAnswer: string) => {
        try {
            setIsGrading(true)
            const topic = flashcards[currentFlashcardIndex].front
            const result = await gptService.gradeFlashcard(topic, userAnswer) as FlashcardGradeResult
            setFlashcardGradeResult(result)
            setIsGrading(false)
        } catch(e) {
            if(e instanceof Error){
                setErrorMessage(e.message)
            }
        } finally {
            setIsGrading(false)
        }
        

        // setFlashcardGradeResult((oldState) => ({...oldState, correctness: CorrectnessState.INCORRECT, clarification: "Drop out"}))
    }

    const getCorrectnessUI = ({correctness, explanation: clarification}: FlashcardGradeResult) => {
        
        console.log(correctness, clarification)

        if(correctness === CorrectnessState.CORRECT){
            return <div className = "study-grade-result grade-correct"> Correct! </div>
        } else if (clarification) {
            return <div className = "study-grade-result grade-incorrect"> Incorrect! {clarification} </div>
        }

    }

    if(isStudyModeFinished){
        return <>
            <h1> Thats all your flashcards. </h1>
            <button onClick = {restartStudySession} > Restart </button>
            <button onClick = {() => setAppState(APP_MODE.HOME_SCREEN)}> Home </button>
        </>
    }

    if(flashcards.length == 0){
        return <>
            <h1> No Flashcards to Study! </h1>
            <div className="flashcard-drawing"><h2>Empty...</h2></div>
        </>
    }

    return <>
        <h3> {(currentFlashcardIndex + 1) + "/" + flashcards.length} </h3>
        <FlashcardUI front={flashcards[currentFlashcardIndex].front} back={flashcards[currentFlashcardIndex].back} category={flashcards[currentFlashcardIndex].category}/>
        
        <div className = "study-container">
            <div className = "study-answer-container">
                <input placeholder="Your answer here..." value={userAnswer} onChange = {(e) => setUserAnswer(e.target.value)} disabled={isGrading}/>    
                <button onClick = {() => gradeFlashcard(userAnswer)} disabled={isGrading}> Submit answer </button>
            </div>
            {errorMessage.length && <div className="error"> {errorMessage} </div>}
            {gptService.isFlashcardBeingGraded && <div> Grading Flashcard... </div>}
            {flashcardGradeResult.correctness !== CorrectnessState.UNDECIDED && !isGrading && getCorrectnessUI(flashcardGradeResult) } 
            <div className = "study-mode-controls">
                <button onClick = {previousFlashcard}> ⬅️ Last Flashcard </button>
                <button onClick = {nextFlashcard}> ➡️ Next Flashcard </button>
                {/* <button onClick = {() => console.log(flashcardGradeResult)}> debug </button> */}
            </div>
        </div>
    </>
}