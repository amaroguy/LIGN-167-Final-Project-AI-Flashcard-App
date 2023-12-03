import { FlashcardFilterSelector } from "./FlashcardFilterer"

export const DebugScreen = () => {
    return <>
        <FlashcardFilterSelector onChange={(x) => console.log(x)}/>
    </>
}