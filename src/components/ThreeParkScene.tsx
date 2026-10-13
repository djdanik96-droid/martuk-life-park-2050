import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PARK_ZONES } from '../data/parkData';
import { ZoneId } from '../types';
import { Compass, RotateCcw, Eye, Layers } from 'lucide-react';

interface ThreeParkSceneProps {
  selectedZoneId: ZoneId | null;
  onSelectZone: (zoneId: ZoneId) => void;
  highlightedRouteZones?: ZoneId[];
  isDaytime?: boolean;
}

export const ThreeParkScene: React.FC<ThreeParkSceneProps> = ({
  selectedZoneId,
  onSelectZone,
  highlightedRouteZones = [],
  isDaytime = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const routeLineRef = useRef<THREE.Line | null>(null);
  const zoneInteractablesRef = useRef<{ mesh: THREE.Object3D; zoneId: ZoneId }[]>([]);
  const labelsRef = useRef<{ zoneId: ZoneId; position: THREE.Vector3 }[]>([]);
  const [screenLabels, setScreenLabels] = useState<
    { zoneId: ZoneId; x: number; y: number; name: string; areaHa: number; visible: boolean }[]
  >([]);
  const [webglError, setWebGLError] = useState<string | null>(null);
  const [cameraActiveZone, setCameraActiveZone] = useState<string>('overview');

  // Smooth camera transition state
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);

  // Focus camera smoothly on selected zone
  const focusOnZone = useCallback((zoneId: ZoneId) => {
    const zone = PARK_ZONES.find((z) => z.id === zoneId);
    if (!zone || !controlsRef.current || !cameraRef.current) return;

    targetLookAtRef.current = new THREE.Vector3(...zone.position3D);
    targetCamPosRef.current = new THREE.Vector3(
      zone.position3D[0] + 16,
      zone.position3D[1] + 15,
      zone.position3D[2] + 22
    );
    setCameraActiveZone(zoneId);
  }, []);

  // Handle Preset Camera Views
  const setCameraPreset = (preset: 'overview' | 'reset' | ZoneId) => {
    if (!controlsRef.current || !cameraRef.current) return;

    if (preset === 'overview') {
      targetCamPosRef.current = new THREE.Vector3(0, 68, 62);
      targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
      setCameraActiveZone('overview');
    } else if (preset === 'reset') {
      targetCamPosRef.current = new THREE.Vector3(-15, 48, 55);
      targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
      setCameraActiveZone('reset');
    } else {
      focusOnZone(preset);
      onSelectZone(preset);
    }
  };

  useEffect(() => {
    if (selectedZoneId) {
      focusOnZone(selectedZoneId);
    }
  }, [selectedZoneId, focusOnZone]);

  // Update Route visualization line
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (routeLineRef.current) {
      scene.remove(routeLineRef.current);
      routeLineRef.current.geometry.dispose();
      (routeLineRef.current.material as THREE.Material).dispose();
      routeLineRef.current = null;
    }

    if (highlightedRouteZones.length > 1) {
      const points: THREE.Vector3[] = [];
      highlightedRouteZones.forEach((zId) => {
        const zone = PARK_ZONES.find((z) => z.id === zId);
        if (zone) {
          points.push(new THREE.Vector3(zone.position3D[0], 2.8, zone.position3D[2]));
        }
      });

      if (points.length >= 2) {
        const curve = new THREE.CatmullRomCurve3(points);
        const curvePoints = curve.getPoints(60);
        const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const material = new THREE.LineDashedMaterial({
          color: 0x0284c7,
          linewidth: 3,
          scale: 1,
          dashSize: 1.8,
          gapSize: 0.8,
        });
        const line = new THREE.Line(geometry, material);
        line.computeLineDistances();
        scene.add(line);
        routeLineRef.current = line;
      }
    }
  }, [highlightedRouteZones]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLError('Бұл құрылғыда WebGL іске қосылмады.');
        return;
      }
    } catch {
      setWebGLError('WebGL қатесі анықталды.');
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDaytime ? 0xf0f5ee : 0x0f172a);
    scene.fog = new THREE.FogExp2(isDaytime ? 0xf0f5ee : 0x0f172a, 0.0085);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 380);
    camera.position.set(-15, 48, 55);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 8;
    controls.maxDistance = 145;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff9ed, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaec, 1.45);
    sunLight.position.set(50, 65, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 170;
    const shadowDist = 65;
    sunLight.shadow.camera.left = -shadowDist;
    sunLight.shadow.camera.right = shadowDist;
    sunLight.shadow.camera.top = shadowDist;
    sunLight.shadow.camera.bottom = -shadowDist;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xdcf0e5, 0xd4a373, 0.45);
    scene.add(hemiLight);

    // 6. Terrain & Base Grounds (10 Hectares Model)
    const groundGeo = new THREE.PlaneGeometry(125, 105, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x859e70,
      roughness: 0.9,
      metalness: 0.05,
    });
    const mainGround = new THREE.Mesh(groundGeo, groundMat);
    mainGround.rotation.x = -Math.PI / 2;
    mainGround.receiveShadow = true;
    scene.add(mainGround);

    // Steppe natural border
    const borderGeo = new THREE.RingGeometry(64, 78, 48);
    const borderMat = new THREE.MeshBasicMaterial({ color: 0x728a5e, side: THREE.DoubleSide });
    const steppeBorder = new THREE.Mesh(borderGeo, borderMat);
    steppeBorder.rotation.x = -Math.PI / 2;
    steppeBorder.position.y = -0.04;
    scene.add(steppeBorder);

    // River / Ecological buffer zone indicator (Ilek river watercourse curve)
    const riverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-58, 0.08, 44),
      new THREE.Vector3(-42, 0.08, 39),
      new THREE.Vector3(-25, 0.08, 45),
      new THREE.Vector3(0, 0.08, 43),
      new THREE.Vector3(26, 0.08, 46),
      new THREE.Vector3(58, 0.08, 41),
    ]);
    const riverGeo = new THREE.TubeGeometry(riverCurve, 40, 2.8, 12, false);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      metalness: 0.35,
      transparent: true,
      opacity: 0.85,
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    riverMesh.scale.set(1, 0.1, 1);
    scene.add(riverMesh);

    // River warning buffer boundary line
    const riverLinePoints = riverCurve.getPoints(40);
    const riverLineGeo = new THREE.BufferGeometry().setFromPoints(riverLinePoints);
    const riverLineMat = new THREE.LineBasicMaterial({ color: 0x0284c7 });
    const riverLine = new THREE.Line(riverLineGeo, riverLineMat);
    riverLine.position.y = 0.3;
    scene.add(riverLine);

    // Masterplan paved boulevards and pedestrian crossways
    const roadMat = new THREE.MeshStandardMaterial({ color: 0xd8cdbc, roughness: 0.95 });

    // Center circular promenade around Smart Hub
    const centralRoadGeo = new THREE.RingGeometry(11, 14.5, 32);
    const centralRoad = new THREE.Mesh(centralRoadGeo, roadMat);
    centralRoad.rotation.x = -Math.PI / 2;
    centralRoad.position.y = 0.02;
    centralRoad.receiveShadow = true;
    scene.add(centralRoad);

    // Radial roads to 4 outer zones
    const createRoad = (x1: number, z1: number, x2: number, z2: number, width: number = 2.6) => {
      const length = Math.hypot(x2 - x1, z2 - z1);
      const angle = Math.atan2(x2 - x1, z2 - z1);
      const roadGeometry = new THREE.PlaneGeometry(width, length);
      const road = new THREE.Mesh(roadGeometry, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.rotation.z = -angle;
      road.position.set((x1 + x2) / 2, 0.02, (z1 + z2) / 2);
      road.receiveShadow = true;
      scene.add(road);
    };

    createRoad(0, 0, -28, -20); // to Ethno
    createRoad(0, 0, 26, -22); // to Agro
    createRoad(0, 0, 28, 18); // to Martuk Dami
    createRoad(0, 0, -26, 18); // to Eco
    createRoad(-28, -20, -26, 18); // West link
    createRoad(26, -22, 28, 18); // East link

    // Materials Palette
    const mats = {
      wood: new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.8 }),
      darkWood: new THREE.MeshStandardMaterial({ color: 0x5a3818, roughness: 0.85 }),
      whiteFelt: new THREE.MeshStandardMaterial({ color: 0xf8f6f0, roughness: 0.9 }),
      ornamentRed: new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6 }),
      gold: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35, metalness: 0.7 }),
      foliageLight: new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.8 }),
      foliageDark: new THREE.MeshStandardMaterial({ color: 0x365314, roughness: 0.85 }),
      trunk: new THREE.MeshStandardMaterial({ color: 0x543d2b, roughness: 0.9 }),
      soil: new THREE.MeshStandardMaterial({ color: 0x3d2b1b, roughness: 0.95 }),
      glass: new THREE.MeshStandardMaterial({
        color: 0xa5f3fc,
        transparent: true,
        opacity: 0.6,
        roughness: 0.08,
        metalness: 0.15,
      }),
      solarBlue: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.2, metalness: 0.85 }),
      pavingEthno: new THREE.MeshStandardMaterial({ color: 0xccb795, roughness: 0.9 }),
      pavingAgro: new THREE.MeshStandardMaterial({ color: 0x486938, roughness: 0.9 }),
      pavingDami: new THREE.MeshStandardMaterial({ color: 0xbf7c5a, roughness: 0.85 }),
      pavingEco: new THREE.MeshStandardMaterial({ color: 0x6e9478, roughness: 0.9 }),
      pavingSmart: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.45, metalness: 0.25 }),
      whiteWall: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.65 }),
      awningRed: new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.8 }),
      awningGreen: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 }),
      awningCream: new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.8 }),
    };

    // Helper: Tree creator
    const createTree = (x: number, z: number, scale = 1, isPine = false) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, 0, z);

      const trunkGeo = new THREE.CylinderGeometry(0.18 * scale, 0.25 * scale, 1.8 * scale, 6);
      const trunk = new THREE.Mesh(trunkGeo, mats.trunk);
      trunk.position.y = 0.9 * scale;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      if (isPine) {
        const cone1 = new THREE.Mesh(new THREE.ConeGeometry(1.4 * scale, 2.2 * scale, 7), mats.foliageDark);
        cone1.position.y = 2.4 * scale;
        cone1.castShadow = true;
        treeGroup.add(cone1);

        const cone2 = new THREE.Mesh(new THREE.ConeGeometry(1.0 * scale, 1.8 * scale, 7), mats.foliageDark);
        cone2.position.y = 3.4 * scale;
        cone2.castShadow = true;
        treeGroup.add(cone2);
      } else {
        const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(1.3 * scale, 1), mats.foliageLight);
        crown.position.y = 2.6 * scale;
        crown.castShadow = true;
        treeGroup.add(crown);
      }

      scene.add(treeGroup);
    };

    // Reset interactables & labels
    zoneInteractablesRef.current = [];
    labelsRef.current = [];

    // ==========================================
    // 1. ЭТНОАУЫЛ АЙМАҒЫ (2 Hectares)
    // ==========================================
    const ethnoCenter = PARK_ZONES[0].position3D;
    const ethnoPadGeo = new THREE.CircleGeometry(16.5, 32);
    const ethnoPad = new THREE.Mesh(ethnoPadGeo, mats.pavingEthno);
    ethnoPad.rotation.x = -Math.PI / 2;
    ethnoPad.position.set(ethnoCenter[0], 0.03, ethnoCenter[2]);
    ethnoPad.receiveShadow = true;
    scene.add(ethnoPad);

    const ethnoInteractable = new THREE.Mesh(
      new THREE.CylinderGeometry(16.5, 16.5, 6, 16),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    ethnoInteractable.position.set(ethnoCenter[0], 3, ethnoCenter[2]);
    scene.add(ethnoInteractable);
    zoneInteractablesRef.current.push({ mesh: ethnoInteractable, zoneId: 'ethno' });
    labelsRef.current.push({
      zoneId: 'ethno',
      position: new THREE.Vector3(ethnoCenter[0], 7.2, ethnoCenter[2]),
    });

    // Detailed Kazakh Yurt generator
    const createYurt = (x: number, z: number, radius = 3.6, height = 2.4) => {
      const yurtGroup = new THREE.Group();
      yurtGroup.position.set(x, 0, z);

      // Cylindrical base wall (кереге)
      const baseGeo = new THREE.CylinderGeometry(radius, radius, height, 28);
      const baseMesh = new THREE.Mesh(baseGeo, mats.whiteFelt);
      baseMesh.position.y = height / 2;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      yurtGroup.add(baseMesh);

      // Ornamental felt band (басқұр)
      const bandGeo = new THREE.CylinderGeometry(radius * 1.01, radius * 1.01, 0.38, 28);
      const bandMesh = new THREE.Mesh(bandGeo, mats.ornamentRed);
      bandMesh.position.y = height * 0.76;
      yurtGroup.add(bandMesh);

      // Conical roof dome (уық)
      const roofHeight = radius * 0.68;
      const roofGeo = new THREE.ConeGeometry(radius * 1.05, roofHeight, 28);
      const roofMesh = new THREE.Mesh(roofGeo, mats.whiteFelt);
      roofMesh.position.y = height + roofHeight / 2;
      roofMesh.castShadow = true;
      yurtGroup.add(roofMesh);

      // Golden Shaniraq crown ring (шаңырақ)
      const shaniraqGeo = new THREE.TorusGeometry(radius * 0.24, 0.13, 8, 24);
      const shaniraqMesh = new THREE.Mesh(shaniraqGeo, mats.gold);
      shaniraqMesh.rotation.x = Math.PI / 2;
      shaniraqMesh.position.y = height + roofHeight * 0.95;
      shaniraqMesh.castShadow = true;
      yurtGroup.add(shaniraqMesh);

      // Wooden door frame (есік)
      const doorGeo = new THREE.BoxGeometry(0.85, 1.45, 0.28);
      const doorMesh = new THREE.Mesh(doorGeo, mats.wood);
      doorMesh.position.set(0, 0.725, radius * 0.95);
      doorMesh.castShadow = true;
      yurtGroup.add(doorMesh);

      scene.add(yurtGroup);
    };

    // 3 Yurts in Ethno village
    createYurt(ethnoCenter[0] - 6, ethnoCenter[2] - 3, 4.2, 2.6); // Main Khan yurt
    createYurt(ethnoCenter[0] + 5, ethnoCenter[2] - 5, 3.3, 2.2); // Craft yurt
    createYurt(ethnoCenter[0] + 6, ethnoCenter[2] + 4, 3.1, 2.1); // Guest yurt

    // Kazakh Altybaqan Swing
    const altybaqan = new THREE.Group();
    altybaqan.position.set(ethnoCenter[0] - 6, 0, ethnoCenter[2] + 6);
    const postGeo = new THREE.CylinderGeometry(0.1, 0.12, 3.6, 8);
    const p1 = new THREE.Mesh(postGeo, mats.wood);
    p1.rotation.z = 0.25;
    p1.position.set(-1.3, 1.7, 0);
    const p2 = new THREE.Mesh(postGeo, mats.wood);
    p2.rotation.z = -0.25;
    p2.position.set(1.3, 1.7, 0);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 3.2, 8), mats.wood);
    beam.rotation.z = Math.PI / 2;
    beam.position.set(0, 3.2, 0);
    altybaqan.add(p1, p2, beam);
    scene.add(altybaqan);

    // National Games arena (Asyk court)
    const asykCourt = new THREE.Mesh(new THREE.CircleGeometry(3.5, 16), mats.soil);
    asykCourt.rotation.x = -Math.PI / 2;
    asykCourt.position.set(ethnoCenter[0] + 1, 0.04, ethnoCenter[2] + 6);
    scene.add(asykCourt);

    // Craft workshop gazebo
    const craftPergola = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.35, 4.2), mats.wood);
    craftPergola.position.set(ethnoCenter[0] - 1, 2.7, ethnoCenter[2] - 9);
    scene.add(craftPergola);
    for (let px = -2.8; px <= 2.8; px += 5.6) {
      for (let pz = -1.7; pz <= 1.7; pz += 3.4) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.7, 8), mats.darkWood);
        pillar.position.set(ethnoCenter[0] - 1 + px, 1.35, ethnoCenter[2] - 9 + pz);
        scene.add(pillar);
      }
    }

    // ==========================================
    // 2. АГРОФЕРМА АЙМАҒЫ (3 Hectares)
    // ==========================================
    const agroCenter = PARK_ZONES[1].position3D;
    const agroPadGeo = new THREE.PlaneGeometry(38, 30);
    const agroPad = new THREE.Mesh(agroPadGeo, mats.pavingAgro);
    agroPad.rotation.x = -Math.PI / 2;
    agroPad.position.set(agroCenter[0], 0.03, agroCenter[2]);
    agroPad.receiveShadow = true;
    scene.add(agroPad);

    const agroInteractable = new THREE.Mesh(
      new THREE.BoxGeometry(38, 8, 30),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    agroInteractable.position.set(agroCenter[0], 4, agroCenter[2]);
    scene.add(agroInteractable);
    zoneInteractablesRef.current.push({ mesh: agroInteractable, zoneId: 'agro' });
    labelsRef.current.push({
      zoneId: 'agro',
      position: new THREE.Vector3(agroCenter[0], 7.8, agroCenter[2]),
    });

    // Modern Smart Greenhouse (Жылыжай)
    const ghGroup = new THREE.Group();
    ghGroup.position.set(agroCenter[0] - 6, 0, agroCenter[2] - 4);
    const ghBase = new THREE.Mesh(new THREE.BoxGeometry(10.5, 2.4, 6.2), mats.glass);
    ghBase.position.y = 1.2;
    ghBase.castShadow = true;
    ghGroup.add(ghBase);
    const ghRoof = new THREE.Mesh(new THREE.ConeGeometry(5.4, 2.0, 4), mats.glass);
    ghRoof.position.y = 3.2;
    ghRoof.rotation.y = Math.PI / 4;
    ghGroup.add(ghRoof);
    const ghFrame = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.12, 6.3), mats.whiteWall);
    ghFrame.position.y = 2.4;
    ghGroup.add(ghFrame);
    scene.add(ghGroup);

    // Demonstration Livestock Shelter (мал шаруашылығы алаңы)
    const barn = new THREE.Group();
    barn.position.set(agroCenter[0] + 9, 0, agroCenter[2] - 5);
    const barnWalls = new THREE.Mesh(new THREE.BoxGeometry(7.5, 3.4, 5.2), mats.darkWood);
    barnWalls.position.y = 1.7;
    barnWalls.castShadow = true;
    barn.add(barnWalls);
    const barnRoof = new THREE.Mesh(new THREE.ConeGeometry(5.0, 2.0, 4), mats.wood);
    barnRoof.position.y = 4.4;
    barnRoof.rotation.y = Math.PI / 4;
    barnRoof.castShadow = true;
    barn.add(barnRoof);
    const fenceL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, 6.5), mats.wood);
    fenceL.position.set(4.2, 0.45, 0);
    barn.add(fenceL);
    scene.add(barn);

    // Garden vegetable beds (көкөніс бақшасы)
    for (let r = 0; r < 4; r++) {
      const bed = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.35, 1.3), mats.soil);
      bed.position.set(agroCenter[0] - 6, 0.18, agroCenter[2] + 4 + r * 2.1);
      bed.receiveShadow = true;
      scene.add(bed);

      for (let c = -3.4; c <= 3.4; c += 1.4) {
        const crop = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3, 0), mats.foliageLight);
        crop.position.set(agroCenter[0] - 6 + c, 0.48, agroCenter[2] + 4 + r * 2.1);
        scene.add(crop);
      }
    }

    // Fruit orchard trees (жеміс бағы)
    for (let tx = 4; tx <= 13; tx += 4.5) {
      for (let tz = 3; tz <= 9; tz += 3.5) {
        createTree(agroCenter[0] + tx, agroCenter[2] + tz, 0.95);
      }
    }

    // Agro-education pavilion & Drip water tank
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.8, 12), mats.whiteWall);
    tank.position.set(agroCenter[0] - 13, 1.4, agroCenter[2]);
    scene.add(tank);

    // ==========================================
    // 3. «МӘРТӨК ДӘМІ» АЙМАҒЫ (1 Hectare)
    // ==========================================
    const damiCenter = PARK_ZONES[2].position3D;
    const damiPadGeo = new THREE.CircleGeometry(14, 32);
    const damiPad = new THREE.Mesh(damiPadGeo, mats.pavingDami);
    damiPad.rotation.x = -Math.PI / 2;
    damiPad.position.set(damiCenter[0], 0.03, damiCenter[2]);
    damiPad.receiveShadow = true;
    scene.add(damiPad);

    const damiInteractable = new THREE.Mesh(
      new THREE.CylinderGeometry(14, 14, 6, 16),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    damiInteractable.position.set(damiCenter[0], 3, damiCenter[2]);
    scene.add(damiInteractable);
    zoneInteractablesRef.current.push({ mesh: damiInteractable, zoneId: 'martuk_dami' });
    labelsRef.current.push({
      zoneId: 'martuk_dami',
      position: new THREE.Vector3(damiCenter[0], 7.0, damiCenter[2]),
    });

    // Market stalls with fabric awnings (Жәрмеңке павильоны)
    const createStall = (x: number, z: number, angle: number, awningMat: THREE.Material) => {
      const stall = new THREE.Group();
      stall.position.set(x, 0, z);
      stall.rotation.y = angle;

      const counter = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.05, 1.3), mats.wood);
      counter.position.y = 0.52;
      counter.castShadow = true;
      stall.add(counter);

      const roof = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 1.7), awningMat);
      roof.position.set(0, 2.3, 0);
      roof.rotation.x = 0.15;
      stall.add(roof);

      for (let sx = -1.6; sx <= 1.6; sx += 3.2) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.3, 8), mats.darkWood);
        post.position.set(sx, 1.15, 0);
        stall.add(post);
      }
      scene.add(stall);
    };

    createStall(damiCenter[0] - 5, damiCenter[2] - 4, 0.4, mats.awningRed);
    createStall(damiCenter[0] + 5, damiCenter[2] - 4, -0.4, mats.awningGreen);
    createStall(damiCenter[0] - 5, damiCenter[2] + 4, 2.7, mats.awningCream);
    createStall(damiCenter[0] + 5, damiCenter[2] + 4, -2.7, mats.awningRed);

    // Central Tasting Pavilion with seating deck (Дәм тату алаңы)
    const tastingDeck = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.0, 0.35, 16), mats.wood);
    tastingDeck.position.set(damiCenter[0], 0.18, damiCenter[2]);
    scene.add(tastingDeck);

    // Traditional outdoor hearth (қазан-ошақ)
    const oshaq = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 0.9, 12), mats.soil);
    oshaq.position.set(damiCenter[0], 0.65, damiCenter[2] + 7.5);
    scene.add(oshaq);
    const kazan = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mats.darkWood);
    kazan.position.set(damiCenter[0], 1.05, damiCenter[2] + 7.5);
    kazan.rotation.x = Math.PI;
    scene.add(kazan);

    // ==========================================
    // 4. ЭКО-ДЕМАЛЫС АЙМАҒЫ (2.5 Hectares)
    // ==========================================
    const ecoCenter = PARK_ZONES[3].position3D;
    const ecoPadGeo = new THREE.CircleGeometry(17.5, 32);
    const ecoPad = new THREE.Mesh(ecoPadGeo, mats.pavingEco);
    ecoPad.rotation.x = -Math.PI / 2;
    ecoPad.position.set(ecoCenter[0], 0.03, ecoCenter[2]);
    ecoPad.receiveShadow = true;
    scene.add(ecoPad);

    const ecoInteractable = new THREE.Mesh(
      new THREE.CylinderGeometry(17.5, 17.5, 6, 16),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    ecoInteractable.position.set(ecoCenter[0], 3, ecoCenter[2]);
    scene.add(ecoInteractable);
    zoneInteractablesRef.current.push({ mesh: ecoInteractable, zoneId: 'eco' });
    labelsRef.current.push({
      zoneId: 'eco',
      position: new THREE.Vector3(ecoCenter[0], 7.0, ecoCenter[2]),
    });

    // Organic winding eco pathway
    const ecoCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(ecoCenter[0] - 11, 0.06, ecoCenter[2] - 8),
      new THREE.Vector3(ecoCenter[0] - 2, 0.06, ecoCenter[2] - 2),
      new THREE.Vector3(ecoCenter[0] + 7, 0.06, ecoCenter[2] + 3),
      new THREE.Vector3(ecoCenter[0] + 1, 0.06, ecoCenter[2] + 11),
    ]);
    const ecoPathGeo = new THREE.TubeGeometry(ecoCurve, 32, 1.0, 8, false);
    const ecoPathMesh = new THREE.Mesh(ecoPathGeo, mats.wood);
    ecoPathMesh.scale.set(1, 0.08, 1);
    scene.add(ecoPathMesh);

    // Shaded gazebos (көлеңкелі күркелер)
    const createGazebo = (x: number, z: number) => {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      const floor = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 0.25, 8), mats.wood);
      floor.position.y = 0.12;
      g.add(floor);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(2.7, 1.5, 8), mats.darkWood);
      roof.position.y = 2.5;
      roof.castShadow = true;
      g.add(roof);
      scene.add(g);
    };
    createGazebo(ecoCenter[0] - 7, ecoCenter[2] + 3);
    createGazebo(ecoCenter[0] + 8, ecoCenter[2] - 4);

    // Safe children's playground (балалар ойын алаңы)
    const playStructure = new THREE.Group();
    playStructure.position.set(ecoCenter[0] - 2, 0, ecoCenter[2] - 6);
    const tower = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.0, 1.8), mats.wood);
    tower.position.y = 1.0;
    playStructure.add(tower);
    const slide = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 2.8), mats.awningRed);
    slide.position.set(0, 0.8, 1.8);
    slide.rotation.x = 0.5;
    playStructure.add(slide);
    scene.add(playStructure);

    // Trees and flora
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const radius = 9.5 + (i % 3) * 3;
      createTree(
        ecoCenter[0] + Math.cos(angle) * radius,
        ecoCenter[2] + Math.sin(angle) * radius,
        0.85 + (i % 3) * 0.25,
        i % 2 === 0
      );
    }

    // Solar light poles
    for (let lp = -9; lp <= 9; lp += 9) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.2, 8), mats.darkWood);
      pole.position.set(ecoCenter[0] + lp, 1.6, ecoCenter[2] - 8);
      scene.add(pole);

      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      lamp.position.set(ecoCenter[0] + lp, 3.2, ecoCenter[2] - 8);
      scene.add(lamp);
    }

    // ==========================================
    // 5. SMART HUB АЙМАҒЫ (1.5 Hectares)
    // ==========================================
    const hubCenter = PARK_ZONES[4].position3D;
    const hubPadGeo = new THREE.CircleGeometry(11.5, 32);
    const hubPad = new THREE.Mesh(hubPadGeo, mats.pavingSmart);
    hubPad.rotation.x = -Math.PI / 2;
    hubPad.position.set(hubCenter[0], 0.04, hubCenter[2]);
    hubPad.receiveShadow = true;
    scene.add(hubPad);

    const hubInteractable = new THREE.Mesh(
      new THREE.CylinderGeometry(11.5, 11.5, 6, 16),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hubInteractable.position.set(hubCenter[0], 3, hubCenter[2]);
    scene.add(hubInteractable);
    zoneInteractablesRef.current.push({ mesh: hubInteractable, zoneId: 'smart_hub' });
    labelsRef.current.push({
      zoneId: 'smart_hub',
      position: new THREE.Vector3(hubCenter[0], 7.8, hubCenter[2]),
    });

    // Modern Bioclimatic Visitor Center & Operation Pavilion
    const hubBuilding = new THREE.Group();
    hubBuilding.position.set(hubCenter[0], 0, hubCenter[2]);

    // Tier 1 Base: Cylindrical glass & sleek white structure
    const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 6.0, 2.7, 24), mats.whiteWall);
    tier1.position.y = 1.35;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    hubBuilding.add(tier1);

    const glassBand = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 1.3, 24), mats.glass);
    glassBand.position.y = 1.45;
    hubBuilding.add(glassBand);

    // Tier 2: Terraced ring with solar roof
    const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 4.4, 1.7, 24), mats.whiteWall);
    tier2.position.y = 3.3;
    tier2.castShadow = true;
    hubBuilding.add(tier2);

    const solarRoof = new THREE.Mesh(new THREE.CylinderGeometry(3.7, 3.7, 0.16, 24), mats.solarBlue);
    solarRoof.position.y = 4.2;
    hubBuilding.add(solarRoof);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.7, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), mats.glass);
    dome.position.y = 4.25;
    hubBuilding.add(dome);

    scene.add(hubBuilding);

    // Smart Info Totem
    const kiosk = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.3, 0.4), mats.whiteWall);
    kiosk.position.set(hubCenter[0] + 4.2, 1.15, hubCenter[2] + 4.2);
    kiosk.castShadow = true;
    scene.add(kiosk);

    // Renewable Wind / Solar Mast
    const turbine = new THREE.Group();
    turbine.position.set(hubCenter[0] - 6.5, 0, hubCenter[2] - 5.5);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 7.2, 8), mats.whiteWall);
    mast.position.y = 3.6;
    turbine.add(mast);
    const rotorHub = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 8), mats.solarBlue);
    rotorHub.position.y = 7.2;
    turbine.add(rotorHub);
    const bladeGeo = new THREE.BoxGeometry(2.5, 0.16, 0.04);
    const blade1 = new THREE.Mesh(bladeGeo, mats.whiteWall);
    blade1.position.set(1.25, 7.2, 0);
    const blade2 = new THREE.Mesh(bladeGeo, mats.whiteWall);
    blade2.position.set(-0.65, 7.2 + 1.1, 0);
    blade2.rotation.z = (Math.PI * 2) / 3;
    turbine.add(blade1, blade2);
    scene.add(turbine);

    // Raycasting for interactive clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      if (!rendererRef.current || !cameraRef.current) return;
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const objects = zoneInteractablesRef.current.map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(objects, false);

      if (intersects.length > 0) {
        const hit = zoneInteractablesRef.current.find((item) => item.mesh === intersects[0].object);
        if (hit) {
          onSelectZone(hit.zoneId);
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('click', handlePointerDown);

    // Animation Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      // Smooth camera interpolation
      if (targetCamPosRef.current && cameraRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.06);
        if (cameraRef.current.position.distanceTo(targetCamPosRef.current) < 0.2) {
          targetCamPosRef.current = null;
        }
      }
      if (targetLookAtRef.current && controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAtRef.current, 0.06);
        if (controlsRef.current.target.distanceTo(targetLookAtRef.current) < 0.2) {
          targetLookAtRef.current = null;
        }
      }

      controls.update();

      // Project labels to 2D screen coordinates
      if (cameraRef.current && rendererRef.current) {
        const newLabels = labelsRef.current.map((item) => {
          const zone = PARK_ZONES.find((z) => z.id === item.zoneId);
          const screenPos = item.position.clone().project(cameraRef.current!);
          const isBehind = screenPos.z > 1;
          const x = ((screenPos.x + 1) * width) / 2;
          const y = ((-screenPos.y + 1) * height) / 2;
          return {
            zoneId: item.zoneId,
            x,
            y,
            name: zone?.shortName || '',
            areaHa: zone?.areaHa || 0,
            visible: !isBehind && x >= 20 && x <= width - 20 && y >= 20 && y <= height - 20,
          };
        });
        setScreenLabels(newLabels);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      domElement.removeEventListener('click', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDaytime, onSelectZone]);

  if (webglError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-100 rounded-2xl">
        <p className="text-slate-800 font-semibold mb-2">{webglError}</p>
        <p className="text-sm text-slate-500 mb-4">
          Құрылғыңызда 3D WebGL үдеткіші болмаған жағдайда, кешеннің 2D бас жоспарын қараңыз.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[620px] bg-slate-900 rounded-2xl overflow-hidden select-none border border-slate-200/80 shadow-md">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Screen Projections of Zone Labels */}
      {screenLabels.map((lbl) => {
        const isSelected = selectedZoneId === lbl.zoneId;
        const isRoute = highlightedRouteZones.includes(lbl.zoneId);

        return (
          <button
            key={lbl.zoneId}
            onClick={() => {
              onSelectZone(lbl.zoneId);
              setCameraPreset(lbl.zoneId);
            }}
            style={{ left: `${lbl.x}px`, top: `${lbl.y}px` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md flex items-center gap-1.5 whitespace-nowrap z-10 ${
              isSelected
                ? 'bg-emerald-700 text-white ring-2 ring-emerald-300 ring-offset-1 ring-offset-slate-900 scale-105'
                : isRoute
                ? 'bg-sky-600 text-white ring-2 ring-sky-300'
                : 'bg-white/95 text-slate-800 hover:bg-white hover:text-slate-950 backdrop-blur-sm border border-slate-200'
            }`}
          >
            <span>{lbl.name}</span>
            <span className="text-[10px] opacity-75 font-normal">({lbl.areaHa} га)</span>
          </button>
        );
      })}

      {/* Top Left: 10 Hectare Scope Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 shadow-sm flex items-center gap-2">
          <span className="font-semibold text-slate-900">Шартты жобалық аумақ:</span>
          <span>10 гектар (100% модель)</span>
        </div>
      </div>

      {/* Top Right: Full Camera Control Switcher with All Required Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-sm max-w-[92vw] sm:max-w-none overflow-x-auto">
        <button
          onClick={() => setCameraPreset('overview')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            cameraActiveZone === 'overview'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Жалпы жоғарыдан шолу"
        >
          Жалпы көрініс
        </button>
        <button
          onClick={() => setCameraPreset('ethno')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            cameraActiveZone === 'ethno'
              ? 'bg-amber-600 text-white'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Этноауыл
        </button>
        <button
          onClick={() => setCameraPreset('agro')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            cameraActiveZone === 'agro'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Агроферма
        </button>
        <button
          onClick={() => setCameraPreset('martuk_dami')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            cameraActiveZone === 'martuk_dami'
              ? 'bg-rose-600 text-white'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          «Мәртөк дәмі»
        </button>
        <button
          onClick={() => setCameraPreset('eco')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            cameraActiveZone === 'eco'
              ? 'bg-teal-700 text-white'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Эко-демалыс
        </button>
        <button
          onClick={() => setCameraPreset('smart_hub')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            cameraActiveZone === 'smart_hub'
              ? 'bg-sky-700 text-white'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Smart Hub
        </button>
        <button
          onClick={() => setCameraPreset('reset')}
          className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap flex items-center gap-1"
          title="Бастапқы ракурсқа қайтару"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Бастапқы көрініс</span>
        </button>
      </div>

      {/* Bottom Mandatory Disclaimer & Controls Hint */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-2 px-3.5 py-2.5 bg-black/60 backdrop-blur-md text-white text-xs rounded-xl border border-white/10 pointer-events-none">
        <div className="flex items-center gap-2">
          <span>Тышқанмен айналдыру (ЛКМ), жақындату (дөңгелек), жылжыту (ПКМ)</span>
          <span aria-hidden="true" className="text-white/40">·</span>
          <span>Аймаққа басып, толық мәлімет алыңыз</span>
        </div>
        <div className="text-sky-300 font-medium text-center sm:text-right">
          Елек өзені маңындағы орналастыру тек жобалық идея ретінде көрсетілген. Нақты жер учаскесі мен су қорғау талаптары кейін қосымша тексеріледі.
        </div>
      </div>
    </div>
  );
};
