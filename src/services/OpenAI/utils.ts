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
    COURSE_INFORMATION = "course_information",
    PHONETICS = "phonetics",
    PHONOLOGY = "phonology",
    MORPHOLOGY = "morphology",
    SYNTAX = "syntax",
    SEMANTICS = "semantics",
    PRAGMATICS = "pragmatics"
}

export const isBadRunStatus = ({status}: OpenAI.Beta.Threads.Run) => {
    return status === "cancelled" || status === "cancelling" || status === "expired" || status === "failed"
}

export const retrieveThreadResponse = (msgs: OpenAI.Beta.Threads.Messages.ThreadMessagesPage, run_id: string) => {
    return msgs.data.filter((message) => message.run_id === run_id && message.role === "assistant").pop()
}

export const makeFlashcardPrompt = (topic: string, customInstructions?: string) => {

    const BASE = `I'm having trouble understanding the concept of ${topic}, could you please create a flashcard using the create_flashcard function? I want the flashcard as follows: `
    const INSTRUCTIONS = customInstructions || 'Include the topic in the front, and an explanation/example in the back.'
    const RETRIEVAL_REMINDER = " Make sure to use your retrieval tool to source the files provided."

    console.log(BASE + INSTRUCTIONS+ RETRIEVAL_REMINDER)
    return BASE + INSTRUCTIONS + RETRIEVAL_REMINDER
}

export const makeGradeFlashcardPrompt = (topic: string, userAnswer: string) => {
    return `Can you grade my flashcard? The front is asking me to define ${topic} and I have answered that it is ${userAnswer}. I am not asking you to create a flashcard (use the grade_flashcard function), and if the question is very broad, accept just a single example as a correct answer.`
}

export const filterFlashcards = (filter: Record<FlashcardCategory, boolean>, flashcards: Flashcard[]) => {
    return flashcards.filter(({category}) => !filter[category])
}