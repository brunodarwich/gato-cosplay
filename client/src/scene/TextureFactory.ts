import * as THREE from 'three';

/**
 * Cria texturas procedurais no estilo adesivo de papel / Paper Cutout
 * com contorno recortado e sombreamento acolhedor.
 */
export class TextureFactory {
  private static cache: Map<string, THREE.CanvasTexture> = new Map();

  /**
   * Textura do Mascote Gatinho Base em Recorte de Papel
   */
  public static createCatBaseTexture(): THREE.CanvasTexture {
    const key = 'cat_base';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Fundo transparente
    ctx.clearRect(0, 0, size, size);

    // Corpo do Gato (Estilo Ilustração Fofa com Borda Recortada de Cartolina)
    ctx.save();
    ctx.translate(size / 2, size / 2 + 30);

    // 1. Sombra e Borda Externa de Adesivo Branco (Die-Cut Sticker Outline)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#3a302f';
    ctx.lineWidth = 10;
    ctx.lineJoin = 'round';

    // Forma combinada: Orelhas + Cabeça + Tronco
    // Corpo
    ctx.beginPath();
    ctx.ellipse(0, 70, 110, 100, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cabeça
    ctx.beginPath();
    ctx.ellipse(0, -30, 130, 105, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Orelha Esquerda
    ctx.beginPath();
    ctx.moveTo(-110, -70);
    ctx.lineTo(-70, -170);
    ctx.lineTo(-20, -100);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Orelha Direita
    ctx.beginPath();
    ctx.moveTo(110, -70);
    ctx.lineTo(70, -170);
    ctx.lineTo(20, -100);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 2. Preenchimento do Gato (Pelagem Creme Alaranjada Fofa)
    ctx.fillStyle = '#ffdfba';
    
    // Tronco
    ctx.beginPath();
    ctx.ellipse(0, 70, 100, 90, 0, 0, Math.PI * 2);
    ctx.fill();

    // Barriguinha branca
    ctx.fillStyle = '#fff9f0';
    ctx.beginPath();
    ctx.ellipse(0, 80, 60, 65, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cabeça
    ctx.fillStyle = '#ffdfba';
    ctx.beginPath();
    ctx.ellipse(0, -30, 120, 95, 0, 0, Math.PI * 2);
    ctx.fill();

    // Interior da orelha (Rosa)
    ctx.fillStyle = '#ffb3ba';
    ctx.beginPath();
    ctx.moveTo(-95, -75);
    ctx.lineTo(-65, -150);
    ctx.lineTo(-30, -95);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(95, -75);
    ctx.lineTo(65, -150);
    ctx.lineTo(30, -95);
    ctx.closePath();
    ctx.fill();

    // Olhos Grandes Anime (Estilo Kawaii)
    ctx.fillStyle = '#2c2523';
    // Olho Esquerdo
    ctx.beginPath();
    ctx.ellipse(-48, -35, 14, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    // Olho Direito
    ctx.beginPath();
    ctx.ellipse(48, -35, 14, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Brilho dos Olhos
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-52, -42, 6, 0, Math.PI * 2);
    ctx.arc(-43, -28, 3, 0, Math.PI * 2);
    ctx.arc(44, -42, 6, 0, Math.PI * 2);
    ctx.arc(53, -28, 3, 0, Math.PI * 2);
    ctx.fill();

    // Bochechas Rosadas
    ctx.fillStyle = 'rgba(255, 130, 140, 0.45)';
    ctx.beginPath();
    ctx.ellipse(-65, -15, 16, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(65, -15, 16, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Focinho e Boquinha de Gato ":3"
    ctx.fillStyle = '#ff828c';
    ctx.beginPath();
    ctx.ellipse(0, -20, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#2c2523';
    ctx.lineWidth = 4;
    ctx.beginPath();
    // Boca esquerda
    ctx.arc(-9, -15, 9, 0.2, Math.PI * 0.9);
    // Boca direita
    ctx.arc(9, -15, 9, 0.1, Math.PI * 0.8);
    ctx.stroke();

    // Bigodes Fofos
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Bigodes esquerdos
    ctx.moveTo(-75, -20); ctx.lineTo(-125, -28);
    ctx.moveTo(-75, -10); ctx.lineTo(-125, -10);
    // Bigodes direitos
    ctx.moveTo(75, -20); ctx.lineTo(125, -28);
    ctx.moveTo(75, -10); ctx.lineTo(125, -10);
    ctx.stroke();

    // Patinhas dianteiras
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#3a302f';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(-45, 115, 22, 16, 0, 0, Math.PI * 2);
    ctx.ellipse(45, 115, 22, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Textura do Chão / Mesa de Madeira Estilo Papercraft
   */
  public static createDeskSurfaceTexture(): THREE.CanvasTexture {
    const key = 'desk_surface';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Fundo aconchegante de mesa com textura de papel de scrapbook
    ctx.fillStyle = '#e9dcc9';
    ctx.fillRect(0, 0, size, size);

    // Listras sutis ou padrão de madeira suave
    ctx.fillStyle = 'rgba(210, 185, 150, 0.3)';
    for (let i = 0; i < size; i += 40) {
      ctx.fillRect(i, 0, 20, size);
    }

    // Tapetinho / Toalha de feltro azul pastel sob o gatinho
    ctx.fillStyle = '#d2e7e4';
    ctx.beginPath();
    ctx.roundRect(40, 40, size - 80, size - 80, 24);
    ctx.fill();

    // Borda pontilhada estilo costura
    ctx.strokeStyle = '#7caea7';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Textura de Peças de Roupa / Acessórios
   */
  public static createPieceTexture(pieceId: string): THREE.CanvasTexture {
    if (this.cache.has(pieceId)) return this.cache.get(pieceId)!;

    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size / 2);

    // Outline grosso recortado estilo adesivo
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#3a302f';
    ctx.lineJoin = 'round';

    switch (pieceId) {
      // INUYASHA
      case 'inuyasha_head':
        // Cabelo prateado longo com orelhas de cachorro branco
        ctx.fillStyle = '#ffffff';
        // Fitas e franjas de cabelo
        ctx.beginPath();
        ctx.moveTo(-110, -40);
        ctx.lineTo(-80, -130);
        ctx.lineTo(-30, -110);
        ctx.lineTo(0, -150);
        ctx.lineTo(30, -110);
        ctx.lineTo(80, -130);
        ctx.lineTo(110, -40);
        ctx.lineTo(80, -20);
        ctx.lineTo(0, -60);
        ctx.lineTo(-80, -20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Orelhas de cachorro fofas brancas com interior rosa
        ctx.fillStyle = '#fff5f7';
        ctx.beginPath();
        ctx.ellipse(-55, -110, 24, 34, -0.2, 0, Math.PI * 2);
        ctx.ellipse(55, -110, 24, 34, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffb3ba';
        ctx.beginPath();
        ctx.ellipse(-55, -110, 12, 18, -0.2, 0, Math.PI * 2);
        ctx.ellipse(55, -110, 12, 18, 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'inuyasha_body':
        // Quimono Vermelho Hakama
        ctx.fillStyle = '#d63031';
        ctx.beginPath();
        ctx.moveTo(-75, 10);
        ctx.lineTo(-95, 90);
        ctx.lineTo(95, 90);
        ctx.lineTo(75, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Gola branca por baixo
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-35, 10);
        ctx.lineTo(0, 50);
        ctx.lineTo(35, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cordão preto da cintura
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-85, 70);
        ctx.lineTo(85, 70);
        ctx.stroke();
        break;

      case 'inuyasha_item':
        // Espada Tessaiga + Colar Kotodama
        // Colar de contas roxas com dentes
        ctx.strokeStyle = '#6c5ce7';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(0, 15, 60, 25, 0, 0, Math.PI);
        ctx.stroke();

        // Espada Tessaiga
        ctx.save();
        ctx.translate(75, 45);
        ctx.rotate(0.35);
        ctx.fillStyle = '#dfe6e9';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.rect(-12, -80, 24, 110);
        ctx.fill();
        ctx.stroke();

        // Guarda-mão de pele felpuda
        ctx.fillStyle = '#fdcb6e';
        ctx.beginPath();
        ctx.arc(0, 30, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Cabo
        ctx.fillStyle = '#d63031';
        ctx.fillRect(-6, 30, 12, 40);
        ctx.strokeRect(-6, 30, 12, 40);
        ctx.restore();
        break;

      // SAILOR MOON
      case 'sailormoon_head':
        // Cabelo loiro com dois coques Odango e chiquinhas longas
        ctx.fillStyle = '#fed330';
        // Coque esquerdo
        ctx.beginPath();
        ctx.arc(-70, -110, 28, 0, Math.PI * 2);
        ctx.arc(70, -110, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Tiara dourada com gema vermelha
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.rect(-50, -60, 100, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(0, -55, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;

      case 'sailormoon_body':
        // Roupa de Marinheira Branca com Laço Vermelho
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(0, 50, 70, 45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Laço Vermelho Grande
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.moveTo(0, 35);
        ctx.lineTo(-40, 15);
        ctx.lineTo(-40, 55);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 35);
        ctx.lineTo(40, 15);
        ctx.lineTo(40, 55);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Broche no centro do laço
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(0, 35, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;

      case 'sailormoon_item':
        // Cetro da Lua
        ctx.save();
        ctx.translate(75, 45);
        ctx.rotate(0.2);
        // Haste rosa
        ctx.fillStyle = '#ff7675';
        ctx.fillRect(-6, -30, 12, 100);
        ctx.strokeRect(-6, -30, 12, 100);
        // Lua dourada no topo
        ctx.fillStyle = '#fdcb6e';
        ctx.beginPath();
        ctx.arc(0, -45, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        break;

      // NARUTO
      case 'naruto_head':
        // Cabelo espetado loiro + Bandana ninja com placa metálica
        ctx.fillStyle = '#fed330';
        ctx.beginPath();
        ctx.moveTo(-90, -70);
        ctx.lineTo(-80, -130);
        ctx.lineTo(-40, -110);
        ctx.lineTo(0, -155);
        ctx.lineTo(40, -110);
        ctx.lineTo(80, -130);
        ctx.lineTo(90, -70);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Faixa azul marinho
        ctx.fillStyle = '#222f3e';
        ctx.fillRect(-70, -80, 140, 22);
        ctx.strokeRect(-70, -80, 140, 22);

        // Placa de ferro
        ctx.fillStyle = '#c8d6e5';
        ctx.fillRect(-35, -78, 70, 18);
        ctx.strokeRect(-35, -78, 70, 18);
        break;

      case 'naruto_body':
        // Agasalho Laranja clássico com gola alta branca
        ctx.fillStyle = '#ff9f43';
        ctx.beginPath();
        ctx.roundRect(-75, 15, 150, 75, 16);
        ctx.fill();
        ctx.stroke();

        // Gola alta branca felpuda
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(-50, 5, 100, 22, 10);
        ctx.fill();
        ctx.stroke();

        // Detalhe azul nos ombros
        ctx.fillStyle = '#10ac84';
        ctx.fillRect(-75, 15, 30, 30);
        ctx.fillRect(45, 15, 30, 30);
        break;

      case 'naruto_item':
        // Pergaminho Ninja gigante nas costas
        ctx.fillStyle = '#ee5253';
        ctx.save();
        ctx.translate(-70, 45);
        ctx.rotate(-0.3);
        ctx.fillRect(-15, -60, 30, 120);
        ctx.strokeRect(-15, -60, 30, 120);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-12, -40, 24, 80);
        ctx.restore();
        break;

      // DISTRATORES
      case 'straw_hat':
        // Chapéu de Palha (Luffy)
        ctx.fillStyle = '#f9ca24';
        ctx.beginPath();
        ctx.ellipse(0, -85, 100, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(0, -105, 55, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Faixa vermelha
        ctx.fillStyle = '#eb4d4b';
        ctx.fillRect(-50, -95, 100, 12);
        break;

      case 'magic_wand':
      case 'kunai':
      default:
        // Ícone genérico de adereço
        ctx.fillStyle = '#a55eea';
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
    }

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set(pieceId, texture);
    return texture;
  }
}
