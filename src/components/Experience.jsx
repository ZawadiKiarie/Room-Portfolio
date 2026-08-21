import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { openModalAtom } from "../utilities/utilities";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMobile } from "../hooks/useMobile";
import { TextureModel3 } from "./RoomPortfolioWTexture3";

export const Experience = () => {
  const controls = useRef();
  const openModal = useAtomValue(openModalAtom);
  // const lightRef = useRef();
  const camera = useRef();
  const { isMobile } = useMobile();

  const initialTarget = new THREE.Vector3(1, 5.35, 0.03);

  const panBounds = {
    minX: -1,
    maxX: 2,
    minY: 0,
    maxY: 7,
    minZ: -2,
    maxZ: 2,
  };

  const _clamped = new THREE.Vector3();
  const _delta = new THREE.Vector3();

  useEffect(() => {
    const c = controls.current;
    if (!c) return;

    c.target.copy(initialTarget);
    c.update();
  }, []);

  useFrame(() => {
    const c = controls.current;
    if (!c) return;

    const t = c.target;

    _clamped.set(
      THREE.MathUtils.clamp(t.x, panBounds.minX, panBounds.maxX),
      THREE.MathUtils.clamp(t.y, panBounds.minY, panBounds.maxY),
      THREE.MathUtils.clamp(t.z, panBounds.minZ, panBounds.maxZ)
    );

    if (!_clamped.equals(t)) {
      _delta.subVectors(_clamped, t);
      t.copy(_clamped);
      c.object.position.add(_delta);
      c.update();
    }
  });
  return (
    <>
      <PerspectiveCamera
        ref={camera}
        makeDefault
        // position={[position.x, position.y, position.z]}
        position={isMobile ? [-45.5, 9.0, -42.5] : [-25.5, 9, -16.5]}
        near={1}
        far={100}
        fov={25}
        zoom={1}
      />
      <OrbitControls
        ref={controls}
        enableDamping={true}
        dampingFactor={0.05}
        enabled={!openModal}
        minPolarAngle={0}
        maxPolarAngle={THREE.MathUtils.degToRad(73)}
        minAzimuthAngle={-Math.PI}
        maxAzimuthAngle={-Math.PI / 2}
        minDistance={10}
        maxDistance={isMobile ? 45 : 30}
        enablePan
      />
      {/* <PlainModel scale={isMobile ? 0.7 : 1} position={[1, -4, 1]} /> */}
      <TextureModel3 scale={isMobile ? 0.7 : 1} position={[1, -4, 1]} />
    </>
  );
};
