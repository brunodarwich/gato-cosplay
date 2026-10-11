import confetti from 'canvas-confetti';
import { DressUpEngine } from '../game/DressUpEngine';
import { InventoryItem, SlotType } from '../types';

export class HUD {
  private engine: DressUpEngine;
  private onEquipCallback: (slot: SlotType, pieceId: string) => void;
  private onUnequipCallback: (slot: SlotType) => void;
  private onClearCallback: () => void;
  private onConfirmCallback: () => void;
  private onNextCallback: () => void;
  private onHintCallback: () => void;
  private onToggleSoundCallback: () => void;

  constructor(
    engine: DressUpEngine,
    callbacks: {
      onEquip: (slot: SlotType, pieceId: string) => void;
      onUnequip: (slot: SlotType) => void;
      onClear: () => void;
      onConfirm: () => void;
      onNext: () => void;
      onHint: () => void;
      onToggleSound: () => void;
    }
  ) {
    this.engine = engine;
    this.onEquipCallback = callbacks.onEquip;
    this.onUnequipCallback = callbacks.onUnequip;
    this.onClearCallback = callbacks.onClear;
    this.onConfirmCallback = callbacks.onConfirm;
    this.onNextCallback = callbacks.onNext;
    this.onHintCallback = callbacks.onHint;
    this.onToggleSoundCallback = callbacks.onToggleSound;

    this.bindEvents();
  }

  private bindEvents() {
    document.getElementById('btn-confirm')?.addEventListener('click', () => {
      this.onConfirmCallback();
    });

    document.getElementById('btn-clear')?.addEventListener('click', () => {
      this.onClearCallback();
      this.updateSlotBadges();
      this.renderInventory();
    });

    document.getElementById('btn-next-level')?.addEventListener('click', () => {
      this.hidePolaroidModal();
      this.onNextCallback();
    });

    document.getElementById('btn-hint')?.addEventListener('click', () => {
      this.onHintCallback();
    });

    document.getElementById('btn-sound')?.addEventListener('click', () => {
      this.onToggleSoundCallback();
    });

    // Toque nos badges de slot para desequipar diretamente
    ['head', 'body', 'item'].forEach((slotStr) => {
      const slot = slotStr as SlotType;
      document.getElementById(`slot-indicator-${slot}`)?.addEventListener('click', () => {
        if (this.engine.equippedSlots[slot]) {
          this.onUnequipCallback(slot);
          this.engine.unequip(slot);
          this.updateSlotBadges();
          this.renderInventory();
        }
      });
    });
  }

  public renderRound() {
    const char = this.engine.currentCharacter;
    if (!char) return;

    // Atualiza Card da Charada
    const riddleText = document.getElementById('riddle-text');
    if (riddleText) riddleText.textContent = `"${char.riddle}"`;

    // Reseta Dica Revelada
    const hintBox = document.getElementById('hint-revealed-box');
    if (hintBox) hintBox.classList.add('hidden');

    // Atualiza contadores
    this.updateCounters();
    this.updateSlotBadges();
    this.renderInventory();
  }

  public updateCounters() {
    const streakVal = document.getElementById('streak-val');
    if (streakVal) streakVal.textContent = String(this.engine.streak);

    const hintVal = document.getElementById('hint-val');
    if (hintVal) hintVal.textContent = String(this.engine.hintsRemaining);
  }

  public updateSlotBadges() {
    const slots: SlotType[] = ['head', 'body', 'item'];

    slots.forEach((slot) => {
      const badge = document.getElementById(`slot-indicator-${slot}`);
      const statusText = document.getElementById(`status-${slot}`);
      const pieceId = this.engine.equippedSlots[slot];
      const isEquipped = !!pieceId;

      if (badge && statusText) {
        if (isEquipped) {
          badge.classList.add('equipped');
          const equippedItem = this.engine.currentInventory.find((i) => i.id === pieceId);
          statusText.textContent = equippedItem ? `${equippedItem.name} ✓` : 'Vestido ✓';
          badge.title = `Vestido com ${equippedItem ? equippedItem.name : 'peça'}. Clique para desequipar.`;
        } else {
          badge.classList.remove('equipped');
          statusText.textContent = 'Vazio';
          badge.title = `Slot ${slot === 'head' ? 'de cabeça' : slot === 'body' ? 'de corpo' : 'de item'} vazio`;
        }
      }
    });
  }

  public renderInventory() {
    const container = document.getElementById('inventory-grid');
    if (!container) return;

    container.innerHTML = '';

    this.engine.currentInventory.forEach((item: InventoryItem) => {
      const card = document.createElement('div');
      card.className = 'item-card';

      const isEquipped = this.engine.equippedSlots[item.type] === item.id;
      if (isEquipped) {
        card.classList.add('equipped-active');
      }

      // Ícone emoji correspondente
      let icon = '👒';
      if (item.type === 'body') icon = '👘';
      if (item.type === 'item') icon = '🗡️';
      if (item.id.includes('wand')) icon = '🪄';
      if (item.id.includes('hat')) icon = '👒';

      card.innerHTML = `
        <div class="item-icon-preview">${icon}</div>
        <div class="item-card-title">${item.name}</div>
      `;

      card.addEventListener('click', () => {
        if (isEquipped) {
          // Se já está equipado, tira
          this.engine.unequip(item.type);
          this.onUnequipCallback(item.type);
        } else {
          // Equipa
          this.engine.equip(item.type, item.id);
          this.onEquipCallback(item.type, item.id);
        }
        this.updateSlotBadges();
        this.renderInventory();
      });

      container.appendChild(card);
    });
  }

  public showCatSpeech(text: string, durationMs = 2000) {
    const speech = document.getElementById('cat-speech');
    const speechText = document.getElementById('cat-speech-text');
    if (speech && speechText) {
      speechText.textContent = text;
      speech.classList.remove('hidden');

      setTimeout(() => {
        speech.classList.add('hidden');
      }, durationMs);
    }
  }

  public showHint(text: string) {
    const hintBox = document.getElementById('hint-revealed-box');
    const hintText = document.getElementById('hint-revealed-text');
    if (hintBox && hintText) {
      hintText.textContent = text;
      hintBox.classList.remove('hidden');
    }
    this.updateCounters();
    this.renderInventory();
  }

  public showPolaroidModal() {
    const modal = document.getElementById('polaroid-modal');
    const char = this.engine.currentCharacter;
    if (!modal || !char) return;

    const charName = document.getElementById('polaroid-char-name');
    const animeName = document.getElementById('polaroid-anime-name');
    const quote = document.getElementById('polaroid-quote');

    if (charName) charName.textContent = `${char.name}!`;
    if (animeName) animeName.textContent = char.anime;
    if (quote) quote.textContent = `"${char.characterQuote}"`;

    modal.classList.remove('hidden');

    // Confetes festivos de papel em 3D
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6584', '#ffbe3b', '#3bceac', '#ffffff', '#e04768']
    });
  }

  public hidePolaroidModal() {
    const modal = document.getElementById('polaroid-modal');
    if (modal) modal.classList.add('hidden');
  }

  public updateSoundIcon(isMuted: boolean) {
    const icon = document.getElementById('sound-icon');
    if (icon) {
      icon.textContent = isMuted ? '🔇' : '🔊';
    }
  }
}
