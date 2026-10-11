import * as THREE from 'three';

export class CameraRig {
  public camera: THREE.PerspectiveCamera;
  private targetRotation = new THREE.Vector2(0, 0);
  private currentRotation = new THREE.Vector2(0, 0);
  private basePosition = new THREE.Vector3(0, 0.45, 4.65);

  constructor(width: number, height: number) {
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.resize(width, height);
    this.camera.position.copy(this.basePosition);
    this.setupParallaxListeners();
  }

  public resize(width: number, height: number) {
    const aspect = width / height;
    this.camera.aspect = aspect;

    // Ajuste dinâmico de enquadramento para manter o modelo perfeitamente no vão livre entre a charada e o armário
    if (aspect < 0.55) {
      // Telas de celular estreitas/compridas (ex: 9:19.5, 9:20, desktop wrapper padrão 480x900)
      this.basePosition.set(0, 0.44, 4.85);
      this.camera.fov = 40;
    } else if (aspect < 0.72) {
      // Telas mobile padrão / compactas (ex: 9:16 como iPhone SE, Galaxy A, telas menores)
      this.basePosition.set(0, 0.35, 5.25);
      this.camera.fov = 40;
    } else {
      // Telas mais largas / janelas quadradas
      this.basePosition.set(0, 0.36, 5.1);
      this.camera.fov = 38;
    }

    this.camera.updateProjectionMatrix();
  }

  private setupParallaxListeners() {
    // 1. Mouse / Touch Parallax (Desktop e Toque)
    const onMove = (clientX: number, clientY: number) => {
      const normX = (clientX / window.innerWidth) * 2 - 1;
      const normY = -(clientY / window.innerHeight) * 2 + 1;

      // Limite suave de rotação (efeito espiar dentro de diorama)
      this.targetRotation.x = normY * 0.08;
      this.targetRotation.y = normX * 0.12;
    };

    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    // 2. Giroscópio Mobile Real (DeviceOrientation API)
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (event) => {
        if (event.gamma !== null && event.beta !== null) {
          // gamma: inclinação esquerda/direita (-90 a 90)
          // beta: inclinação frente/trás (-180 a 180)
          const clampedGamma = Math.max(-30, Math.min(30, event.gamma)) / 30;
          const clampedBeta = Math.max(10, Math.min(70, event.beta) - 40) / 30;

          this.targetRotation.y = clampedGamma * 0.15;
          this.targetRotation.x = clampedBeta * 0.1;
        }
      });
    }
  }

  public update(delta: number) {
    // Interpolação suave (Damping / LERP)
    const lerpFactor = 0.08;
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * lerpFactor;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * lerpFactor;

    this.camera.rotation.x = this.currentRotation.x;
    this.camera.rotation.y = this.currentRotation.y;

    // Deslocamento sutil de posição acompanhando a rotação somado à posição base
    this.camera.position.x = this.basePosition.x + this.currentRotation.y * 0.4;
    this.camera.position.y = this.basePosition.y - this.currentRotation.x * 0.3;
    this.camera.position.z = this.basePosition.z;
  }
}
