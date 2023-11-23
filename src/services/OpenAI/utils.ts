import OpenAI from "openai"
export const LIGN_ASSISTANT_ID = "asst_UgrkuyoYPJdVahOsiGuTMQJM"
export const MODEL = 'gpt-3.5-turbo'

import { Flashcard } from "../Storage/FlashcardStorage"

export interface FlashcardFunctionArgs {
    front: string,
    back: string,
    category: string
}

export enum FlashcardCategory {
    COURSE_INFORMATION = "COURSE_INFORMATION",
    PHONETICS = "PHONETICS",
    PHONOLOGY = "PHONOLOGY",
    MORPHOLOGY = "MORPHOLOGY",
    SYNTAX = "SYNTAX",
    SEMANTICS = "SEMANTICS",
    PRAGMATICS = "PRAGMATICS"
}

export const isBadRunStatus = ({status}: OpenAI.Beta.Threads.Run) => {
    return status === "cancelled" || status === "cancelling" || status === "expired" || status === "failed"
}

export const retrieveThreadResponse = (msgs: OpenAI.Beta.Threads.Messages.ThreadMessagesPage, run_id: string) => {
    return msgs.data.filter((message) => message.run_id === run_id && message.role === "assistant").pop()
}

export const makeFlashcardPrompt = (topic: string) => {
    return `I'm having trouble understanding the concept of ${topic}, could you please create a flashcard that includes the topic in the front, and an explanation/example in the back using your Retrieval tool to source the files provided?`
}

export const makeGradeFlashcardPrompt = (topic: string, userAnswer: string) => {
    return `Can you grade my flashcard? The front is asking me to define ${topic} and I have answered that it is ${userAnswer}. I am not asking you to create a flashcard.`
}

export const filterFlashcards = (filter: Record<FlashcardCategory, boolean>, flashcards: Flashcard[]) => {
    return flashcards.filter(({category}) => !filter[category])
}