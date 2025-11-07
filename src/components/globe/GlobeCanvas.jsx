import * as THREE from 'three';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Nebula from './Nebula.jsx';
import Starfield from './Starfield.jsx';
import Earth from './Earth.jsx';

const sunDirection = new THREE.Vector3(-2, 0.5, 1.5);

export default function GlobeCanvas() {
  return (
    <Canvas camera={{ position: [0, 0.1, 5] }} className="w-full h-full" gl={{ toneMapping: THREE.NoToneMapping }}>
      <Earth />
      <hemisphereLight args={[0xffffff, 0x000000, 3.0]} />
      <directionalLight position={[sunDirection.x, sunDirection.y, sunDirection.z]} />
      <Nebula />
      <Starfield />
      <OrbitControls />
    </Canvas>
  );
}
