import { DioramaScene } from './scene/DioramaScene';
import { DressUpEngine } from './game/DressUpEngine';
import { HUD } from './ui/HUD';
import { AudioService } from './services/AudioService';
import { SlotType } from './types';

async function bootstrap() {
  const canvas = document.getElementById('three-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Elemento canvas não encontrado');
    return;
  }

  // 1. Inicializa a Cena 2.5D Paper Mario com Three.js
  const diorama = new DioramaScene(canvas);

  // 2. Inicializa o serviço de áudio
  const audio = new AudioService();

  // 3. Inicializa o motor de lógica de jogo
  const engine = new DressUpEngine();
  await engine.loadCharacters();

  // 4. Inicializa o HUD com callbacks conectados
  const hud = new HUD(engine, {
    onEquip: (slot: SlotType, pieceId: string) => {
      diorama.catActor.equipPiece(slot, pieceId);
      audio.playEquipSound();
    },

    onUnequip: (slot: SlotType) => {
      diorama.catActor.unequipPiece(slot);
      audio.playUnequipSound();
    },

    onClear: () => {
      diorama.catActor.clearAllPieces();
      engine.resetSlots();
      audio.playUnequipSound();
      hud.showCatSpeech('Fiquei peladinho de novo! 🐾');
    },

    onConfirm: async () => {
      const result = engine.validate();

      if (result.isVictory) {
        // VITÓRIA!
        audio.playVictoryJingle();
        hud.showCatSpeech('MIAU! VOCÊ ACERTOU! 🎉', 3000);
        engine.streak++;

        // Executa a animação de salto + giro 360° em moeda
        await diorama.catActor.playVictoryAnimation();

        // Toca som de câmera e abre o Polaroid 3D
        audio.playCameraSnapshot();
        hud.showPolaroidModal();
      } else {
        // ERRO / TENTATIVA
        audio.playFailureSound();
        diorama.catActor.playFailureAnimation();

        if (result.correctCount === 2) {
          hud.showCatSpeech('Quase lá! 2 de 3 peças certas... 👀');
        } else if (result.correctCount === 1) {
          hud.showCatSpeech('1 peça certa! Tente trocar as outras! 🤔');
        } else {
          hud.showCatSpeech('Hmm, não me sinto esse personagem ainda! 🐱');
        }
      }
    },

    onNext: () => {
      diorama.catActor.clearAllPieces();
      engine.nextCharacter();
      hud.renderRound();
      hud.showCatSpeech('Quem será agora? 🐾');
    },

    onHint: () => {
      const hintData = engine.useHint();
      if (hintData.textHint) {
        audio.playEquipSound();
        hud.showHint(hintData.textHint);
        hud.showCatSpeech('💡 Uma peça errada sumiu do armário!');
      } else {
        hud.showCatSpeech('Sem dicas restantes! Você consegue! 💪');
      }
    },

    onToggleSound: () => {
      const isMuted = audio.toggleMute();
      hud.updateSoundIcon(isMuted);
    }
  });

  // Renderiza a primeira rodada
  hud.renderRound();
  hud.showCatSpeech('Olá! Vista-me com o cosplay certo! ✨', 3500);

  console.log('🐾 Gato Cosplay 2.5D Paper Mario iniciado com sucesso!');
}

window.addEventListener('DOMContentLoaded', bootstrap);
