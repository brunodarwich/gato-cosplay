import { CosplayCharacter, EquippedSlots, InventoryItem, SlotType } from '../types';

export class DressUpEngine {
  public characters: CosplayCharacter[] = [];
  public currentIndex: number = 0;
  public currentCharacter: CosplayCharacter | null = null;

  public equippedSlots: EquippedSlots = {
    head: null,
    body: null,
    item: null
  };

  public currentInventory: InventoryItem[] = [];
  public hintsRemaining: number = 2;
  public streak: number = 1;

  public async loadCharacters(): Promise<void> {
    try {
      const response = await fetch('./data/characters.json');
      this.characters = await response.json();
      this.setCurrentCharacterIndex(0);
    } catch (err) {
      console.error('Falha ao carregar characters.json:', err);
    }
  }

  public setCurrentCharacterIndex(index: number) {
    if (this.characters.length === 0) return;
    this.currentIndex = index % this.characters.length;
    this.currentCharacter = this.characters[this.currentIndex];
    this.resetSlots();
    this.buildInventoryForCurrent();
  }

  public nextCharacter() {
    this.setCurrentCharacterIndex(this.currentIndex + 1);
  }

  public resetSlots() {
    this.equippedSlots = { head: null, body: null, item: null };
  }

  public equip(slot: SlotType, pieceId: string) {
    this.equippedSlots[slot] = pieceId;
  }

  public unequip(slot: SlotType) {
    this.equippedSlots[slot] = null;
  }

  /**
   * Monta o inventário misturando as 3 peças certas + distratores
   */
  private buildInventoryForCurrent() {
    if (!this.currentCharacter) return;

    const items: InventoryItem[] = [];

    // Peças certas
    items.push({
      id: this.currentCharacter.requiredPieces.head,
      type: 'head',
      name: this.currentCharacter.pieceNames[this.currentCharacter.requiredPieces.head] || 'Cabeça',
      characterId: this.currentCharacter.id,
      isCorrectForCurrent: true
    });

    items.push({
      id: this.currentCharacter.requiredPieces.body,
      type: 'body',
      name: this.currentCharacter.pieceNames[this.currentCharacter.requiredPieces.body] || 'Corpo',
      characterId: this.currentCharacter.id,
      isCorrectForCurrent: true
    });

    items.push({
      id: this.currentCharacter.requiredPieces.item,
      type: 'item',
      name: this.currentCharacter.pieceNames[this.currentCharacter.requiredPieces.item] || 'Acessório',
      characterId: this.currentCharacter.id,
      isCorrectForCurrent: true
    });

    // Distratores
    this.currentCharacter.distractors.forEach((d) => {
      items.push({
        id: d.id,
        type: d.type,
        name: d.name,
        characterId: 'distractor',
        isCorrectForCurrent: false
      });
    });

    // Embaralha as peças (Fisher-Yates)
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    this.currentInventory = items;
  }

  /**
   * Validação de Vitória
   */
  public validate(): {
    isVictory: boolean;
    correctCount: number;
    headCorrect: boolean;
    bodyCorrect: boolean;
    itemCorrect: boolean;
  } {
    if (!this.currentCharacter) {
      return { isVictory: false, correctCount: 0, headCorrect: false, bodyCorrect: false, itemCorrect: false };
    }

    const headCorrect = this.equippedSlots.head === this.currentCharacter.requiredPieces.head;
    const bodyCorrect = this.equippedSlots.body === this.currentCharacter.requiredPieces.body;
    const itemCorrect = this.equippedSlots.item === this.currentCharacter.requiredPieces.item;

    let correctCount = 0;
    if (headCorrect) correctCount++;
    if (bodyCorrect) correctCount++;
    if (itemCorrect) correctCount++;

    return {
      isVictory: correctCount === 3,
      correctCount,
      headCorrect,
      bodyCorrect,
      itemCorrect
    };
  }

  /**
   * Elimina um distrator usando a dica
   */
  public useHint(): { removedItemId: string | null; textHint: string } {
    if (this.hintsRemaining <= 0 || !this.currentCharacter) {
      return { removedItemId: null, textHint: '' };
    }

    this.hintsRemaining--;

    // Encontra o primeiro distrator que ainda está na gaveta
    const distractor = this.currentInventory.find((item) => !item.isCorrectForCurrent);
    let removedId: string | null = null;

    if (distractor) {
      removedId = distractor.id;
      this.currentInventory = this.currentInventory.filter((item) => item.id !== distractor.id);
    }

    return {
      removedItemId: removedId,
      textHint: this.currentCharacter.hint
    };
  }
}
