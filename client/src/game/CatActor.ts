import * as THREE from 'three';
import gsap from 'gsap';
import { TextureFactory } from '../scene/TextureFactory';
import { SlotType } from '../types';

export class CatActor {
  public group: THREE.Group;
  private baseMesh: THREE.Mesh;
  private headMesh: THREE.Mesh | null = null;
  private bodyMesh: THREE.Mesh | null = null;
  private itemMesh: THREE.Mesh | null = null;

  // Tamanho padrão dos planos de recorte de papel
  private readonly planeWidth = 2.4;
  private readonly planeHeight = 2.4;

  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, 0.25, 0);

    // 1. Mascote Base
    const geometry = new THREE.PlaneGeometry(this.planeWidth, this.planeHeight);
    const texture = TextureFactory.createCatBaseTexture();
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    this.baseMesh = new THREE.Mesh(geometry, material);
    this.baseMesh.castShadow = true;
    this.baseMesh.receiveShadow = false;
    this.baseMesh.position.set(0, 0, 0);
    this.group.add(this.baseMesh);

    // Respiração suave constante (idle breathing de papel)
    this.initIdleAnimation();
  }

  private initIdleAnimation() {
    gsap.to(this.baseMesh.scale, {
      y: 1.025,
      x: 0.985,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  /**
   * Equipa uma peça com animação de impacto elástico de adesivo/papel
   */
  public equipPiece(slot: SlotType, pieceId: string) {
    // Se já havia uma peça no slot, remove suavemente
    this.unequipPiece(slot);

    const geometry = new THREE.PlaneGeometry(this.planeWidth, this.planeHeight);
    const texture = TextureFactory.createPieceTexture(pieceId);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;

    // Profundidade Z sutil para evitar Z-fighting e dar relevo de papel real
    let zOffset = 0.02;
    if (slot === 'body') zOffset = 0.03;
    if (slot === 'head') zOffset = 0.05;
    if (slot === 'item') zOffset = 0.07;

    mesh.position.set(0, 0, zOffset);

    // Animação de chegada: surge de cima com leve rotação e quica
    mesh.scale.set(0.6, 0.6, 1);
    mesh.position.y = 0.4;
    mesh.rotation.z = (Math.random() - 0.5) * 0.2;

    this.group.add(mesh);

    if (slot === 'head') this.headMesh = mesh;
    if (slot === 'body') this.bodyMesh = mesh;
    if (slot === 'item') this.itemMesh = mesh;

    // GSAP Paper Drop & Bounce
    gsap.to(mesh.position, {
      y: 0,
      duration: 0.4,
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
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  /**
   * Remove uma peça com animação
   */
  public unequipPiece(slot: SlotType) {
    let meshToRemove: THREE.Mesh | null = null;
    if (slot === 'head') { meshToRemove = this.headMesh; this.headMesh = null; }
    if (slot === 'body') { meshToRemove = this.bodyMesh; this.bodyMesh = null; }
    if (slot === 'item') { meshToRemove = this.itemMesh; this.itemMesh = null; }

    if (meshToRemove) {
      const target = meshToRemove;
      gsap.to(target.scale, {
        x: 0.2,
        y: 0.2,
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
  }

  /**
   * Comemoração de Vitória: Salto + Giro 360° no Eixo Y (Estilo Paper Mario)
   */
  public playVictoryAnimation(): Promise<void> {
    return new Promise((resolve) => {
      // 1. Salto no eixo Y
      gsap.to(this.group.position, {
        y: 0.7,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
      });

      // 2. Giro completo de 360 graus mostrando a finura de folha de papel!
      gsap.to(this.group.rotation, {
        y: Math.PI * 2,
        duration: 0.8,
        ease: 'power1.inOut',
        onComplete: () => {
          this.group.rotation.y = 0;
          resolve();
        }
      });
    });
  }

  /**
   * Feedback de Erro: Tombo de Papelão Desequilibrado
   */
  public playFailureAnimation() {
    const tl = gsap.timeline();
    tl.to(this.group.rotation, { z: -0.15, x: 0.1, duration: 0.12, ease: 'power1.out' })
      .to(this.group.rotation, { z: 0.12, x: -0.05, duration: 0.12, ease: 'power1.out' })
      .to(this.group.rotation, { z: -0.08, x: 0.05, duration: 0.1, ease: 'power1.out' })
      .to(this.group.rotation, { z: 0, x: 0, duration: 0.15, ease: 'power2.out' });
  }
}
