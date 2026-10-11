import confetti from 'canvas-confetti';
import { DressUpEngine } from '../game/DressUpEngine';
import { InventoryItem, SlotType } from '../types';
import { TextureFactory } from '../scene/TextureFactory';

export class HUD {
  private engine: DressUpEngine;
  private selectedCategory: 'all' | SlotType = 'all';

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
    // Botão Confirmar
    document.getElementById('btn-confirm')?.addEventListener('click', () => {
      this.onConfirmCallback();
    });

    // Botão Despir Tudo
    document.getElementById('btn-clear')?.addEventListener('click', () => {
      this.onClearCallback();
      this.updateSlotBadges();
      this.renderInventory();
    });

    // Botão Próximo Cosplay
    document.getElementById('btn-next-level')?.addEventListener('click', () => {
      this.hidePolaroidModal();
      this.onNextCallback();
    });

    // Botão Dica
    document.getElementById('btn-hint')?.addEventListener('click', () => {
      this.onHintCallback();
    });

    // Botão Som
    document.getElementById('btn-sound')?.addEventListener('click', () => {
      this.onToggleSoundCallback();
    });

    // Abas de Categoria de Roupa (Todos, Cabeça, Corpo, Item)
    const tabs = document.querySelectorAll<HTMLButtonElement>('.cat-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const cat = tab.dataset.category as 'all' | SlotType;
        this.selectedCategory = cat || 'all';
        this.renderInventory();
      });
    });

    // Toque nos badges de slot ou no botão "✕" para desequipar
    const slots: SlotType[] = ['head', 'body', 'item'];
    slots.forEach((slot) => {
      // Clique no botão ✕ dedicado
      document.getElementById(`slot-remove-${slot}`)?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.unequipSlot(slot);
      });

      // Clique no badge geral do slot
      document.getElementById(`slot-indicator-${slot}`)?.addEventListener('click', () => {
        if (this.engine.equippedSlots[slot]) {
          this.unequipSlot(slot);
        }
      });
    });
  }

  public unequipSlot(slot: SlotType) {
    if (this.engine.equippedSlots[slot]) {
      this.onUnequipCallback(slot);
      this.engine.unequip(slot);
      this.updateSlotBadges();
      this.renderInventory();
    }
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

    // Volta a aba para 'all'
    this.selectedCategory = 'all';
    const tabs = document.querySelectorAll<HTMLButtonElement>('.cat-tab');
    tabs.forEach((tab) => {
      if (tab.dataset.category === 'all') tab.classList.add('active');
      else tab.classList.remove('active');
    });

    // Atualiza contadores e interface
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

    const defaultIcons: Record<SlotType, string> = {
      head: '👒',
      body: '👘',
      item: '🪄'
    };

    slots.forEach((slot) => {
      const badge = document.getElementById(`slot-indicator-${slot}`);
      const thumbBox = document.getElementById(`slot-thumb-${slot}`);
      const statusText = document.getElementById(`status-${slot}`);
      const removeBtn = document.getElementById(`slot-remove-${slot}`);

      const pieceId = this.engine.equippedSlots[slot];
      const isEquipped = !!pieceId;

      if (!badge || !thumbBox || !statusText) return;

      if (isEquipped) {
        badge.classList.add('equipped');
        removeBtn?.classList.remove('hidden');

        const equippedItem = this.engine.currentInventory.find((i) => i.id === pieceId);
        statusText.textContent = equippedItem ? equippedItem.name : 'Equipado';
        badge.title = `Vestido com ${equippedItem ? equippedItem.name : 'peça'}. Clique para desequipar.`;

        // Coloca a miniatura real da peça no badge
        thumbBox.innerHTML = `
          <img src="${TextureFactory.getThumbUrl(pieceId!)}" 
               alt="${pieceId}" 
               class="slot-thumb-img" 
               onerror="this.outerHTML='<span class=\"slot-icon\">${defaultIcons[slot]}</span>'" />
        `;
      } else {
        badge.classList.remove('equipped');
        removeBtn?.classList.add('hidden');
        statusText.textContent = 'Vazio';
        badge.title = `Slot de ${slot === 'head' ? 'cabeça' : slot === 'body' ? 'corpo' : 'item'} vazio`;
        thumbBox.innerHTML = `<span class="slot-icon">${defaultIcons[slot]}</span>`;
      }
    });
  }

  public renderInventory() {
    const container = document.getElementById('inventory-grid');
    if (!container) return;

    container.innerHTML = '';

    // Filtra pela categoria selecionada
    const items = this.engine.currentInventory.filter((item) => {
      if (this.selectedCategory === 'all') return true;
      return item.type === this.selectedCategory;
    });

    if (items.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'empty-inventory-msg';
      emptyMsg.textContent = 'Nenhuma peça nesta categoria!';
      container.appendChild(emptyMsg);
      return;
    }

    const typeLabels: Record<SlotType, string> = {
      head: 'Cabeça',
      body: 'Roupa',
      item: 'Acessório'
    };

    const typeEmojis: Record<SlotType, string> = {
      head: '👒',
      body: '👘',
      item: '🪄'
    };

    items.forEach((item: InventoryItem) => {
      const card = document.createElement('div');
      card.className = 'item-card';

      const isEquipped = this.engine.equippedSlots[item.type] === item.id;
      if (isEquipped) {
        card.classList.add('equipped-active');
      }

      card.innerHTML = `
        <div class="item-thumb-wrapper">
          <img src="${TextureFactory.getThumbUrl(item.id)}" 
               alt="${item.name}" 
               class="item-thumb-img" 
               loading="lazy"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <span class="item-emoji-fallback" style="display:none;">${typeEmojis[item.type]}</span>
        </div>
        <div class="item-card-title">${item.name}</div>
        <span class="item-type-pill item-pill-${item.type}">${typeLabels[item.type]}</span>
      `;

      card.addEventListener('click', () => {
        if (isEquipped) {
          // Já está equipado -> remove
          this.engine.unequip(item.type);
          this.onUnequipCallback(item.type);
        } else {
          // Equipa a nova peça
          this.engine.equip(item.type, item.id);
          this.onEquipCallback(item.type, item.id);
        }
        this.updateSlotBadges();
        this.renderInventory();
      });

      container.appendChild(card);
    });
  }

  public showCatSpeech(text: string, durationMs = 2200) {
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
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#ff6584', '#ffbe3b', '#3bceac', '#ffffff', '#e04768', '#48dbfb']
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
