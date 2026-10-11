export type SlotType = 'head' | 'body' | 'item';

export interface DistractorPiece {
  id: string;
  type: SlotType;
  name: string;
}

export interface CosplayCharacter {
  id: string;
  name: string;
  anime: string;
  riddle: string;
  hint: string;
  characterQuote: string;
  requiredPieces: {
    head: string;
    body: string;
    item: string;
  };
  pieceNames: {
    [key: string]: string;
  };
  distractors: DistractorPiece[];
}

export interface EquippedSlots {
  head: string | null;
  body: string | null;
  item: string | null;
}

export interface InventoryItem {
  id: string;
  type: SlotType;
  name: string;
  characterId: string;
  isCorrectForCurrent: boolean;
}
