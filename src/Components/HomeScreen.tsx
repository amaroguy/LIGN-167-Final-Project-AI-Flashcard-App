import {useState} from "react"
import { GPTService } from "../services/OpenAI/GPTService"
import { FlashcardStore } from "../services/Storage/useFlashcardStorage"
import FlashcardUI from "./Flashcard"
import './styles/HomeScreen.css'
import { AllFlashcardsDisplay } from "./AllFlashcardsDisplay"

interface HomeScreenProps {
    setLoading: (status: boolean) => any,
    gptService: GPTService,
    flashcardStore: FlashcardStore
}

export default function HomeScreen({gptService, flashcardStore}: HomeScreenProps) {
    const [areFlashcardsShowing, setAreFlashcardsShowing] = useState(false)
    const [topic, setTopic] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const renderFlashcards = () => {
        if (flashcardStore.flashcards.length === 0) {
            // Return a message if there are no flashcards
            return <h1>There are currently no flashcards generated.</h1>;
        }
        console.log("rendering")
        return flashcardStore.flashcards.map((f) => <div className="my"> <FlashcardUI front={f.front} back={f.back} category = {f.category}/> </div>)
      }

    const generateFlashcard = (topic: string) => {
        setErrorMsg("")
        gptService.generateFlashcardThread(topic).catch(e => {
            if (e instanceof Error) {
                setErrorMsg(e.message)
            }
        })
    }

    return <>
        <h2> What LIGN 101 topic would you like a Flashcard on? </h2>
        <div id="home-screen-trio">
            <input type="text" onChange={(e) => setTopic(e.target.value)} placeholder="Insert topic here..."/>
            <div>
                <button disabled = {topic.length === 0 || gptService.isFlashcardBeingGenerated} onClick={() => generateFlashcard(topic)}> Study </button>
                <button id="toggle_flashcards" onClick = {() => setAreFlashcardsShowing(!areFlashcardsShowing)}>
                 {areFlashcardsShowing ? "Hide" : "Show"} All Flashcards</button>
            </div>
        </div>
        {errorMsg && <div className="error"> {errorMsg} </div>}
        {gptService.isFlashcardBeingGenerated && <div> Generating Flashcard... </div>}

        {/* Conditional rendering for displaying flashcards or a message */}
        {flashcardStore.areFlashcardsLoading ? (
            <div>Loading...</div>
        ) : areFlashcardsShowing && (
            flashcardStore.flashcards.length > 0 ? 
            <AllFlashcardsDisplay flashcards={flashcardStore.flashcards}/> :
            <div className="flashcard-drawing"><h2>No Flashcards to Study</h2></div>
        )}
    </> 
}