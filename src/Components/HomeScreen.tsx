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
                <button disabled = {topic.length === 0} onClick={() => generateFlashcard(topic)}> Study </button>
                <button onClick = {() => setAreFlashcardsShowing(!areFlashcardsShowing)}> {areFlashcardsShowing ? "Hide" : "Show"} all flashcards </button>
            </div>
        </div>
        {/* <div className="flashcard-drawing"><h2>Show All Flashcards...</h2></div> */}
        {errorMsg && <div> {errorMsg} </div>}
        {gptService.isFlashcardBeingGenerated && <div> Generating Flashcard... </div>}
        {<div>{flashcardStore.areFlashcardsLoading ? "Loading..." : areFlashcardsShowing && <AllFlashcardsDisplay flashcards={flashcardStore.flashcards}/>}</div>}
    </> 
}