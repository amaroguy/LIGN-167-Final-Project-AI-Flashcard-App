import OpenAI from "openai";
import { isBadRunStatus, retrieveThreadResponse, LIGN_ASSISTANT_ID, makeFlashcardPrompt, makeGradeFlashcardPrompt, FlashcardCategory} from "./utils";
import { Flashcard } from "../Storage/FlashcardStorage";
import { FlashcardStore } from "../Storage/useFlashcardStorage";
import { FlashcardGradeResult } from "../../Components/StudyMode";
import { useState } from "react"

export interface GPTService {
    askAssistant: (msg: string) => Promise<void>,
    generateFlashcardThread: (topic: string) => Promise<void>
    gradeFlashcard: (topic: string, userAnswer: string) => Promise<FlashcardGradeResult | undefined>
    isFlashcardBeingGraded: boolean,
    isFlashcardBeingGenerated: boolean
}

//@ts-ignore
const MOCK_FLASHCARD: Flashcard = {
    threadId: "TEST_THREAD",
    front: "FRONT",
    back: "BACK",
    category: FlashcardCategory.PHONETICS
}

export function createGPTService(
    API_KEY: string, 
    setIsLoading: (l: boolean) => any,
    flashcardStore: FlashcardStore): GPTService {
    
    // const flashcardStore = useFlashcardStore()
    const openai = new OpenAI({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true
    })
       
    const [isFlashcardBeingGenerated, setIsFlashcardBeingGenerated] = useState(false)
    const [isFlashcardBeingGraded, setIsFlashcardBeingGraded] = useState(false)


    const createAndProcessMessage = async (threadId: string, assistantId: string, msg: string) => {
        //Create the message
        await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: msg,
        })
    
        //Start processing the message
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistantId,
        })

        return run
    }
        
    const askAssistant = async (msg: string) => {
        setIsLoading(true)
        
        const thread = await openai.beta.threads.create()
        const run = await createAndProcessMessage(thread.id, LIGN_ASSISTANT_ID, msg)

        let runStatus = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
        );
        
        console.log("created message")
        //WAIT FOR THE MESSAGE TO BE PROCESSED
        while (runStatus.status !== "completed") {
            console.log("polling")
            await new Promise((resolve) => setTimeout(resolve, 2000));
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
            
            if(isBadRunStatus(runStatus)){
                console.log("Something went very wrong", runStatus)
                return
            }
        }

        console.log("retrieved!")
        //OpenAI finished procesing it, now retrieve it
        //Unfortunately have to retrieve the entire thread
        const messages = await openai.beta.threads.messages.list(thread.id);
        const response = retrieveThreadResponse(messages, run.id)

        console.log(response)
        setIsLoading(false)
    }

    const gradeFlashcard = async (topic: string, userAnswer: string) => {

        setIsFlashcardBeingGraded(true)
        console.log("Grading the flashcard!")

        const prompt = makeGradeFlashcardPrompt(topic, userAnswer)
        const thread = await openai.beta.threads.create()
        const run = await createAndProcessMessage(thread.id, LIGN_ASSISTANT_ID, prompt)
        let gradeResult = undefined


        let runStatus = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
        );

        while(runStatus.status !== "completed"){
            console.log("polling for grading")
            await new Promise((resolve) => setTimeout(resolve, 2000));
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

            if(runStatus.status === "requires_action" && runStatus.required_action){

                console.log(runStatus)

                const [flashcardCall] = runStatus.required_action.submit_tool_outputs.tool_calls
                
                gradeResult = JSON.parse(flashcardCall.function.arguments) as FlashcardGradeResult
                gradeResult.threadId = thread.id
                
                //Tell it that it did a good job
                await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
                    tool_outputs: [
                        {tool_call_id: flashcardCall.id, output: JSON.stringify({status: "success"})}
                    ]
                })

            } else if(isBadRunStatus(runStatus)){
                console.log("Something went very wrong", runStatus)
                setIsFlashcardBeingGraded(false)
                return
            }
        }
        
        
        setIsFlashcardBeingGraded(false)
        return gradeResult
    }

    const generateFlashcardThread = async (topic: string) => {
        
        setIsFlashcardBeingGenerated(true)
        // UNCOMMENT THIS
        const prompt = makeFlashcardPrompt(topic)
        const thread = await openai.beta.threads.create()
        const run = await createAndProcessMessage(thread.id, LIGN_ASSISTANT_ID, prompt)

        let runStatus = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
        );

        while(runStatus.status !== "completed"){
            console.log("polling")
            await new Promise((resolve) => setTimeout(resolve, 2000));
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

            if(runStatus.status === "requires_action" && runStatus.required_action){
                const [flashcardCall] = runStatus.required_action.submit_tool_outputs.tool_calls
                
                let parsedArgs = JSON.parse(flashcardCall.function.arguments)
                parsedArgs.threadId = thread.id
                flashcardStore.addFlashcard(parsedArgs as Flashcard)

                console.log("FLASHCARD CALL", parsedArgs)
                //TODO CREATE THE FLASHCARD

                //Tell it that it did a good job
                await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
                    tool_outputs: [
                        {tool_call_id: flashcardCall.id, output: JSON.stringify({status: "success"})}
                    ]
                })

            } else if(isBadRunStatus(runStatus)){
                console.log("Something went very wrong", runStatus)
                setIsFlashcardBeingGenerated(false)
                return
            }
        }
        
        setIsFlashcardBeingGenerated(false)
        return
    }

    return {
        askAssistant,
        generateFlashcardThread,
        gradeFlashcard,
        isFlashcardBeingGraded,
        isFlashcardBeingGenerated
    }

}