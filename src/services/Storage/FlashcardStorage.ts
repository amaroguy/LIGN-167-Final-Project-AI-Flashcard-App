import { FlashcardCategory } from "../OpenAI/utils";

//Too lazy to move this into its own file

export type Flashcard = {
    threadId: string;
    front: string;
    back: string;
    category: FlashcardCategory
}
