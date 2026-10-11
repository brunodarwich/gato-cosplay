import * as THREE from 'three';

/**
 * Gerenciador e fábrica de texturas para os personagens e adesivos recortados 2.5D Paper Mario.
 * Carrega os arquivos PNG da ilustradora Cris Alves e os cosplays adicionais,
 * com fallback e cache de alta performance.
 */
export class TextureFactory {
  private static loader = new THREE.TextureLoader();
  private static textureCache: Map<string, THREE.Texture> = new Map();

  public static readonly ASSET_MAP: Record<string, string> = {
    cat_base: './assets/cat/corpo.png',
    cat_face_neutral: './assets/cat/neutro.png',
    cat_face_happy: './assets/cat/feliz.png',
    cat_face_sad: './assets/cat/triste.png',

    // Inuyasha (Cris Alves)
    inuyasha_head: './assets/cosplay/inuyasha/inuyasha_head.png',
    inuyasha_body: './assets/cosplay/inuyasha/inuyasha_body.png',
    inuyasha_item: './assets/cosplay/inuyasha/inuyasha_item.png',

    // Sailor Moon
    sailormoon_head: './assets/cosplay/sailormoon/sailormoon_head.png',
    sailormoon_body: './assets/cosplay/sailormoon/sailormoon_body.png',
    sailormoon_item: './assets/cosplay/sailormoon/sailormoon_item.png',

    // Naruto
    naruto_head: './assets/cosplay/naruto/naruto_head.png',
    naruto_body: './assets/cosplay/naruto/naruto_body.png',
    naruto_item: './assets/cosplay/naruto/naruto_item.png',

    // Distratores
    straw_hat: './assets/cosplay/distractors/straw_hat.png',
    shinobi_vest: './assets/cosplay/distractors/shinobi_vest.png',
    magic_wand: './assets/cosplay/distractors/magic_wand.png',
    super_saiyan_hair: './assets/cosplay/distractors/super_saiyan_hair.png',
    pirate_coat: './assets/cosplay/distractors/pirate_coat.png',
    kunai: './assets/cosplay/distractors/kunai.png'
  };

  /**
   * Retorna a URL da miniatura recortada (sticker) para uso na interface gráfica
   */
  public static getThumbUrl(pieceId: string): string {
    return `./assets/thumbs/${pieceId}.png`;
  }

  /**
   * Carrega e armazena em cache qualquer textura registrada
   */
  public static getTexture(key: string): THREE.Texture {
    if (this.textureCache.has(key)) {
      return this.textureCache.get(key)!;
    }

    const path = this.ASSET_MAP[key];
    if (path) {
      const tex = this.loader.load(path);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      this.textureCache.set(key, tex);
      return tex;
    }

    // Se não encontrou no mapa, cria textura procedural genérica
    const fallback = this.createFallbackTexture(key);
    this.textureCache.set(key, fallback);
    return fallback;
  }

  /**
   * Textura do mascote gato base (desenho de Cris Alves)
   */
  public static createCatBaseTexture(): THREE.Texture {
    return this.getTexture('cat_base');
  }

  /**
   * Textura da expressão facial do gato
   */
  public static getCatFaceTexture(expression: 'neutral' | 'happy' | 'sad'): THREE.Texture {
    const key = `cat_face_${expression}`;
    return this.getTexture(key);
  }

  /**
   * Textura de uma peça de vestimenta / cosplay
   */
  public static createPieceTexture(pieceId: string): THREE.Texture {
    return this.getTexture(pieceId);
  }

  /**
   * Superfície da mesa de madeira / tapetinho artesanal
   */
  public static createDeskSurfaceTexture(): THREE.CanvasTexture {
    const key = 'desk_surface';
    if (this.textureCache.has(key)) {
      return this.textureCache.get(key) as THREE.CanvasTexture;
    }

    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Fundo aconchegante de mesa com textura de papel de scrapbook
    ctx.fillStyle = '#f0e3ce';
    ctx.fillRect(0, 0, size, size);

    // Listras de madeira suave
    ctx.fillStyle = 'rgba(215, 190, 155, 0.35)';
    for (let i = 0; i < size; i += 48) {
      ctx.fillRect(i, 0, 24, size);
    }

    // Tapete de feltro pastel com cantos arredondados
    ctx.fillStyle = '#d2e7e4';
    ctx.beginPath();
    ctx.roundRect(40, 40, size - 80, size - 80, 28);
    ctx.fill();

    // Borda pontilhada estilo costura artesanal
    ctx.strokeStyle = '#7caea7';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.textureCache.set(key, texture);
    return texture;
  }

  /**
   * Fallback visual simples caso falte algum asset
   */
  private static createFallbackTexture(name: string): THREE.CanvasTexture {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#ff7675';
    ctx.beginPath();
    ctx.roundRect(20, 20, size - 40, size - 40, 20);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
}
