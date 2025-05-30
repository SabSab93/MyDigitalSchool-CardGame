import { CardModel } from "./cardModel-type";


export interface DeckWithCardsModel {
    id: string | undefined;     
    name: string;               
    cards: CardModel[];         
}


export interface DeckModel {
    id: string     
    name: string;               
    cards: string[];            
}
