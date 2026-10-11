import * as THREE from 'three';
import gsap from 'gsap';
import { TextureFactory } from '../scene/TextureFactory';
import { SlotType } from '../types';

export class CatActor {
  public group: THREE.Group;
  public baseMesh: THREE.Mesh;
  public faceMesh: THREE.Mesh;
  public headMesh: THREE.Mesh | null = null;
  public bodyMesh: THREE.Mesh | null = null;
  public itemMesh: THREE.Mesh | null = null;

  // Dimensões do plano proporcional ao canvas universal 1024x1024
  private readonly planeWidth = 2.4;
  private readonly planeHeight = 2.4;

  private currentExpression: 'neutral' | 'happy' | 'sad' = 'neutral';
  private expressionTimeout: number | null = null;

  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, 0.25, 0);

    const geometry = new THREE.PlaneGeometry(this.planeWidth, this.planeHeight);

    // 1. Mascote Base (Corpo desenhado por Cris Alves)
    const baseTexture = TextureFactory.createCatBaseTexture();
    const baseMaterial = new THREE.MeshStandardMaterial({
      map: baseTexture,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.8,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    this.baseMesh = new THREE.Mesh(geometry, baseMaterial);
    this.baseMesh.castShadow = true;
    this.baseMesh.receiveShadow = false;
    this.baseMesh.position.set(0, 0, 0);
    this.baseMesh.userData = { isCat: true };
    this.group.add(this.baseMesh);

    // 2. Rosto com Expressão Facial Separada (Camada Z intermediária)
    const faceTexture = TextureFactory.getCatFaceTexture('neutral');
    const faceMaterial = new THREE.MeshStandardMaterial({
      map: faceTexture,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.8,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    this.faceMesh = new THREE.Mesh(geometry, faceMaterial);
    this.faceMesh.position.set(0, 0, 0.015);
    this.faceMesh.userData = { isCat: true };
    this.group.add(this.faceMesh);

    // Respiração suave constante (idle breathing de recorte de papel)
    this.initIdleAnimation();
  }

  private initIdleAnimation() {
    gsap.to(this.group.scale, {
      y: 1.025,
      x: 0.985,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  /**
   * Altera a expressão facial do gatinho (neutro, feliz, triste)
   */
  public setExpression(expression: 'neutral' | 'happy' | 'sad', autoResetMs: number = 0) {
    if (this.expressionTimeout) {
      window.clearTimeout(this.expressionTimeout);
      this.expressionTimeout = null;
    }

    this.currentExpression = expression;
    const newTexture = TextureFactory.getCatFaceTexture(expression);
    const mat = this.faceMesh.material as THREE.MeshStandardMaterial;
    mat.map = newTexture;
    mat.needsUpdate = true;

    // Micro-pulo de expressão
    gsap.fromTo(
      this.faceMesh.scale,
      { x: 1.05, y: 1.05 },
      { x: 1, y: 1, duration: 0.3, ease: 'back.out(2)' }
    );

    if (autoResetMs > 0 && expression !== 'neutral') {
      this.expressionTimeout = window.setTimeout(() => {
        this.setExpression('neutral');
      }, autoResetMs);
    }
  }

  /**
   * Equipa uma peça com animação elástica de adesivo caindo no papel
   */
  public equipPiece(slot: SlotType, pieceId: string) {
    this.unequipPiece(slot);

    const geometry = new THREE.PlaneGeometry(this.planeWidth, this.planeHeight);
    const texture = TextureFactory.createPieceTexture(pieceId);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.8,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.userData = { slot, pieceId };

    // Camadas Z específicas para evitar Z-fighting e manter a ordem das camadas
    let zOffset = 0.03; // corpo
    if (slot === 'head') zOffset = 0.05; // peruca/chapéu
    if (slot === 'item') zOffset = 0.07; // acessório/espada

    mesh.position.set(0, 0, zOffset);

    // Animação de chegada de adesivo: cai do alto com leve balanço
    mesh.scale.set(0.7, 0.7, 1);
    mesh.position.y = 0.35;
    mesh.rotation.z = (Math.random() - 0.5) * 0.15;

    this.group.add(mesh);

    if (slot === 'head') this.headMesh = mesh;
    if (slot === 'body') this.bodyMesh = mesh;
    if (slot === 'item') this.itemMesh = mesh;

    gsap.to(mesh.position, {
      y: 0,
      duration: 0.38,
      ease: 'bounce.out'
    });

    gsap.to(mesh.scale, {
      x: 1,
      y: 1,
      duration: 0.35,
      ease: 'back.out(1.8)'
    });

    gsap.to(mesh.rotation, {
      z: 0,
      duration: 0.28,
      ease: 'power2.out'
    });
  }

  /**
   * Remove uma peça com efeito de descolar adesivo
   */
  public unequipPiece(slot: SlotType) {
    let meshToRemove: THREE.Mesh | null = null;
    if (slot === 'head') { meshToRemove = this.headMesh; this.headMesh = null; }
    if (slot === 'body') { meshToRemove = this.bodyMesh; this.bodyMesh = null; }
    if (slot === 'item') { meshToRemove = this.itemMesh; this.itemMesh = null; }

    if (meshToRemove) {
      const target = meshToRemove;
      gsap.to(target.scale, {
        x: 0.15,
        y: 0.15,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          this.group.remove(target);
          target.geometry.dispose();
          if (Array.isArray(target.material)) {
            target.material.forEach((m) => m.dispose());
          } else {
            target.material.dispose();
          }
        }
      });
    }
  }

  public clearAllPieces() {
    this.unequipPiece('head');
    this.unequipPiece('body');
    this.unequipPiece('item');
    this.setExpression('neutral');
  }

  /**
   * Reação de carinho no gatinho ao clicar nele diretamente
   */
  public playPetAnimation(): void {
    this.setExpression('happy', 1400);

    const tl = gsap.timeline();
    tl.to(this.group.scale, {
      x: 1.08,
      y: 0.92,
      duration: 0.15,
      ease: 'power1.out'
    }).to(this.group.scale, {
      x: 0.96,
      y: 1.05,
      duration: 0.2,
      ease: 'back.out(2)'
    }).to(this.group.scale, {
      x: 1,
      y: 1,
      duration: 0.2,
      ease: 'power1.inOut'
    });
  }

  /**
   * Comemoração de Vitória: Expressão Feliz + Salto com Giro 360° no Eixo Y
   */
  public playVictoryAnimation(): Promise<void> {
    this.setExpression('happy');

    return new Promise((resolve) => {
      // 1. Salto animado
      gsap.to(this.group.position, {
        y: 0.75,
        duration: 0.45,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
      });

      // 2. Giro completo estilo folha de adesivo Paper Mario
      gsap.to(this.group.rotation, {
        y: Math.PI * 2,
        duration: 0.9,
        ease: 'power1.inOut',
        onComplete: () => {
          this.group.rotation.y = 0;
          resolve();
        }
      });
    });
  }

  /**
   * Feedback de Erro: Expressão Triste + Desequilíbrio de Cartolina
   */
  public playFailureAnimation() {
    this.setExpression('sad', 2800);

    const tl = gsap.timeline();
    tl.to(this.group.rotation, { z: -0.16, x: 0.1, duration: 0.12, ease: 'power1.out' })
      .to(this.group.rotation, { z: 0.14, x: -0.06, duration: 0.12, ease: 'power1.out' })
      .to(this.group.rotation, { z: -0.09, x: 0.05, duration: 0.1, ease: 'power1.out' })
      .to(this.group.rotation, { z: 0, x: 0, duration: 0.15, ease: 'power2.out' });
  }
}
