import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { TextureFactory } from './TextureFactory';
import { CatActor } from '../game/CatActor';
import { SlotType } from '../types';

export class DioramaScene {
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public cameraRig: CameraRig;
  public catActor: CatActor;

  private clock = new THREE.Clock();
  private canvas: HTMLCanvasElement;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();

  public onMeshClick?: (type: 'cat' | 'piece', slot?: SlotType, pieceId?: string) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();

    // Fundo acolhedor estilo quarto / mesa artesanal
    this.scene.background = new THREE.Color(0xf6efe6);
    this.scene.fog = new THREE.FogExp2(0xf6efe6, 0.08);

    // Renderer com suporte a sombras suaves
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // Câmera 3D com rig de giroscópio e paralaxe suave
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.cameraRig = new CameraRig(width, height);

    // Luzes
    this.setupLighting();

    // Elementos de Cenário
    this.setupScenery();

    // Mascote Felino
    this.catActor = new CatActor();
    this.scene.add(this.catActor.group);

    // Interações de clique 3D
    this.setupInteractions();

    // Listeners de Redimensionamento
    window.addEventListener('resize', () => this.handleResize());

    // Início do Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  private setupLighting() {
    // 1. Luz Ambiente suave e quente
    const ambientLight = new THREE.AmbientLight(0xfff6ec, 1.25);
    this.scene.add(ambientLight);

    // 2. Luz Direcional principal simulando luminária de mesa (Paper Shadows)
    const dirLight = new THREE.DirectionalLight(0xffeed6, 1.6);
    dirLight.position.set(2.5, 4.0, 3.5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 15;
    dirLight.shadow.camera.left = -3;
    dirLight.shadow.camera.right = 3;
    dirLight.shadow.camera.top = 3;
    dirLight.shadow.camera.bottom = -3;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    // 3. Luz de preenchimento azulada no lado oposto para contraste artístico
    const fillLight = new THREE.DirectionalLight(0xcde6ff, 0.45);
    fillLight.position.set(-3.0, 2.0, 2.0);
    this.scene.add(fillLight);
  }

  private setupScenery() {
    // Chão / Mesa de madeira e tapete onde a sombra do gatinho se projeta
    const deskGeo = new THREE.PlaneGeometry(6, 6);
    const deskTex = TextureFactory.createDeskSurfaceTexture();
    const deskMat = new THREE.MeshStandardMaterial({
      map: deskTex,
      roughness: 0.9,
      metalness: 0.05
    });

    const deskMesh = new THREE.Mesh(deskGeo, deskMat);
    deskMesh.rotation.x = -Math.PI / 2 + 0.15; // leve inclinação para visual isométrico
    deskMesh.position.set(0, -0.22, 0.2);
    deskMesh.receiveShadow = true;
    this.scene.add(deskMesh);

    // Parede de fundo do diorama
    const wallGeo = new THREE.PlaneGeometry(10, 10);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xfaebd7,
      roughness: 1.0,
      metalness: 0.0
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(0, 1.5, -1.8);
    wallMesh.receiveShadow = true;
    this.scene.add(wallMesh);
  }

  private setupInteractions() {
    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.cameraRig.camera);

      // Checa colisões com as partes do gatinho e roupas
      const intersects = this.raycaster.intersectObjects(this.catActor.group.children, true);

      if (intersects.length > 0) {
        // Ordena por maior profundidade z para priorizar peças superiores
        const hit = intersects[0];
        const obj = hit.object;

        if (obj.userData?.slot) {
          // Clicou numa peça equipada
          this.onMeshClick?.('piece', obj.userData.slot, obj.userData.pieceId);
        } else if (obj.userData?.isCat) {
          // Clicou no gatinho
          this.catActor.playPetAnimation();
          this.onMeshClick?.('cat');
        }
      }
    });
  }

  public handleResize() {
    const parent = this.canvas.parentElement;
    const width = parent ? parent.clientWidth : window.innerWidth;
    const height = parent ? parent.clientHeight : window.innerHeight;

    this.renderer.setSize(width, height, false);
    this.cameraRig.resize(width, height);
  }

  private animate() {
    requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();

    // Atualiza a física de paralaxe da câmera
    this.cameraRig.update(delta);

    // Renderiza a cena
    this.renderer.render(this.scene, this.cameraRig.camera);
  }
}
