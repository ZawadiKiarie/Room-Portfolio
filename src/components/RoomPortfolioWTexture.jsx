import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Model(props) {
  const { nodes } = useGLTF("/models/RoomPortfolioWBakedTexture-v1.glb");
  const group = useRef();

  const textures = useTexture({
    TexturePackOne: "/textures/TexturePackOne.webp",
    TexturePackTwo: "/textures/TexturePackTwo.webp",
    TexturePackThree: "/textures/TexturePackThree.webp",
    TexturePackFour: "/textures/TexturePackFour.webp",
    // If you have a fifth bake:
    // TexturePackFive: "/textures/TexturePackFive.webp",
  });

  Object.values(textures).forEach((t) => {
    if (!t) return;
    t.flipY = false;
    // three r152+
    t.colorSpace = THREE.SRGBColorSpace;
  });

  const bakedMats = useMemo(() => {
    const make = (map) =>
      new THREE.MeshBasicMaterial({
        map,
        toneMapped: false, // baked colors shouldn't be tone mapped again
      });
    return {
      TexturePackOne: make(textures.TexturePackOne),
      TexturePackTwo: make(textures.TexturePackTwo),
      TexturePackThree: make(textures.TexturePackThree),
      TexturePackFour: make(textures.TexturePackFour),
      // TexturePackFive: make(textures.TexturePackFive),
    };
  }, [textures]);

  useLayoutEffect(() => {
    const g = group.current;
    if (!g) return;

    g.traverse((child) => {
      if (!(child.isMesh || child.isSkinnedMesh)) return;

      const n = child.name.toLowerCase();

      // handle both "TexturePackOne" and the typo "TexturePackone"
      if (n.includes("texturepackone"))
        child.material = bakedMats.TexturePackOne;
      if (n.includes("texturepacktwo"))
        child.material = bakedMats.TexturePackTwo;
      if (n.includes("texturepackthree"))
        child.material = bakedMats.TexturePackThree;
      if (n.includes("texturepackfour"))
        child.material = bakedMats.TexturePackFour;
      // if (n.includes("texturepackfive")) child.material = bakedMats.TexturePackFive;

      // Optional: if you still want shadows for non-baked bits (glass, etc.)
      child.castShadow = true;
      child.receiveShadow = true;
    });
  }, [bakedMats]);

  return (
    <group {...props} dispose={null} ref={group}>
      <mesh
        name="Original_Leaf"
        geometry={nodes.Original_Leaf.geometry}
        material={nodes.Original_Leaf.material}
        position={[2.899, 6.777, -0.102]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.22}
      />
      <mesh
        name="Cube"
        geometry={nodes.Cube.geometry}
        material={nodes.Cube.material}
      />
      <mesh
        name="Cube023"
        geometry={nodes.Cube023.geometry}
        material={nodes.Cube023.material}
      />
      <mesh
        name="Plane055"
        geometry={nodes.Plane055.geometry}
        material={nodes.Plane055.material}
      />
      <mesh
        name="Plane068"
        geometry={nodes.Plane068.geometry}
        material={nodes.Plane068.material}
      />
      <mesh
        name="Cylinder010"
        geometry={nodes.Cylinder010.geometry}
        material={nodes.Cylinder010.material}
      />
      <mesh
        name="Plane069"
        geometry={nodes.Plane069.geometry}
        material={nodes.Plane069.material}
      />
      <mesh
        name="Plane070"
        geometry={nodes.Plane070.geometry}
        material={nodes.Plane070.material}
      />
      <mesh
        name="Plane071"
        geometry={nodes.Plane071.geometry}
        material={nodes.Plane071.material}
      />
      <mesh
        name="Plane072"
        geometry={nodes.Plane072.geometry}
        material={nodes.Plane072.material}
      />
      <mesh
        name="Plane073"
        geometry={nodes.Plane073.geometry}
        material={nodes.Plane073.material}
      />
      <mesh
        name="Plane074"
        geometry={nodes.Plane074.geometry}
        material={nodes.Plane074.material}
      />
      <mesh
        name="Plane075"
        geometry={nodes.Plane075.geometry}
        material={nodes.Plane075.material}
      />
      <mesh
        name="Plane076"
        geometry={nodes.Plane076.geometry}
        material={nodes.Plane076.material}
      />
      <mesh
        name="Plane077"
        geometry={nodes.Plane077.geometry}
        material={nodes.Plane077.material}
      />
      <mesh
        name="Plane078"
        geometry={nodes.Plane078.geometry}
        material={nodes.Plane078.material}
      />
      <mesh
        name="Plane079"
        geometry={nodes.Plane079.geometry}
        material={nodes.Plane079.material}
      />
      <mesh
        name="Plane080"
        geometry={nodes.Plane080.geometry}
        material={nodes.Plane080.material}
      />
      <mesh
        name="Plane081"
        geometry={nodes.Plane081.geometry}
        material={nodes.Plane081.material}
      />
      <mesh
        name="Plane082"
        geometry={nodes.Plane082.geometry}
        material={nodes.Plane082.material}
      />
      <mesh
        name="Plane083"
        geometry={nodes.Plane083.geometry}
        material={nodes.Plane083.material}
      />
      <mesh
        name="Plane084"
        geometry={nodes.Plane084.geometry}
        material={nodes.Plane084.material}
      />
      <mesh
        name="Plane085"
        geometry={nodes.Plane085.geometry}
        material={nodes.Plane085.material}
      />
      <mesh
        name="Plane035"
        geometry={nodes.Plane035.geometry}
        material={nodes.Plane035.material}
      />
      <mesh
        name="Cube018"
        geometry={nodes.Cube018.geometry}
        material={nodes.Cube018.material}
      />
      <mesh
        name="Cube019"
        geometry={nodes.Cube019.geometry}
        material={nodes.Cube019.material}
      />
      <mesh
        name="Cube020"
        geometry={nodes.Cube020.geometry}
        material={nodes.Cube020.material}
      />
      <mesh
        name="Vert001"
        geometry={nodes.Vert001.geometry}
        material={nodes.Vert001.material}
      />
      <mesh
        name="Plane031"
        geometry={nodes.Plane031.geometry}
        material={nodes.Plane031.material}
      />
      <mesh
        name="Plane032"
        geometry={nodes.Plane032.geometry}
        material={nodes.Plane032.material}
      />
      <mesh
        name="TexturePackone"
        geometry={nodes.TexturePackone.geometry}
        material={nodes.TexturePackone.material}
        position={[2.264, 2.114, 0.847]}
        rotation={[0, -1.404, 0]}
        scale={0.79}
      />
      <mesh
        name="TexturePackTwo"
        geometry={nodes.TexturePackTwo.geometry}
        material={nodes.TexturePackTwo.material}
        position={[3.038, 5.797, -2.732]}
        rotation={[0.438, -0.391, 0.841]}
        scale={[0.277, 0.105, 0.277]}
      />
      <mesh
        name="TexturePackThree"
        geometry={nodes.TexturePackThree.geometry}
        material={nodes.TexturePackThree.material}
        position={[-2.618, 2.323, 1.328]}
        rotation={[-0.154, 0.015, -0.097]}
        scale={[0.182, 0.236, 0.182]}
      />
      <mesh
        name="TexturePackFour"
        geometry={nodes.TexturePackFour.geometry}
        material={nodes.TexturePackFour.material}
        position={[2.231, 5.752, 2.699]}
        scale={[1.468, 1.888, 1.468]}
      />
      <mesh
        name="TexturePackFive"
        geometry={nodes.TexturePackFive.geometry}
        material={nodes.TexturePackFive.material}
        position={[1.695, 0.053, 0.307]}
        scale={[1.172, 1, 1.172]}
      />
      <mesh
        name="Monitor_Screen_Four"
        geometry={nodes.Monitor_Screen_Four.geometry}
        material={nodes.Monitor_Screen_Four.material}
        position={[2.969, 6.04, 0.623]}
        scale={2.823}
      />
      <mesh
        name="Computer_glass_Four"
        geometry={nodes.Computer_glass_Four.geometry}
        material={nodes.Computer_glass_Four.material}
        position={[2.413, 4.671, 2.73]}
        scale={[0.801, 0.766, 0.267]}
      />
      <mesh
        name="Plushie_Two"
        geometry={nodes.Plushie_Two.geometry}
        material={nodes.Plushie_Two.material}
        position={[2.495, 7.17, 3.106]}
        scale={[1, 0.925, 1]}
      />
      <mesh
        name="Github_Two"
        geometry={nodes.Github_Two.geometry}
        material={nodes.Github_Two.material}
        position={[1.902, 7.194, 3.082]}
        rotation={[1.865, 0, 0]}
        scale={1.373}
      />
      <mesh
        name="Linkedin_Two"
        geometry={nodes.Linkedin_Two.geometry}
        material={nodes.Linkedin_Two.material}
        position={[1.214, 7.183, 3.082]}
        rotation={[1.865, 0, 0]}
        scale={1.373}
      />
      <mesh
        name="Hanging_Plank_1_One"
        geometry={nodes.Hanging_Plank_1_One.geometry}
        material={nodes.Hanging_Plank_1_One.material}
        position={[3.742, 7.594, -3.263]}
      />
      <mesh
        name="Hanging_Plank_2_One"
        geometry={nodes.Hanging_Plank_2_One.geometry}
        material={nodes.Hanging_Plank_2_One.material}
        position={[3.787, 7.404, -4.197]}
      />
      <mesh
        name="My_Work_Button_One"
        geometry={nodes.My_Work_Button_One.geometry}
        material={nodes.My_Work_Button_One.material}
        position={[3.773, 6.996, -4.183]}
        rotation={[0.017, -0.002, -1.568]}
        scale={[0.923, 1, 1.063]}
      />
      <mesh
        name="About_Button_One"
        geometry={nodes.About_Button_One.geometry}
        material={nodes.About_Button_One.material}
        position={[3.775, 6.364, -4.185]}
        rotation={[-0.034, 0.004, -1.577]}
        scale={[0.923, 1, 1.063]}
      />
      <mesh
        name="Contact_button_One"
        geometry={nodes.Contact_button_One.geometry}
        material={nodes.Contact_button_One.material}
        position={[3.773, 5.727, -4.182]}
        rotation={[0.032, -0.004, -1.565]}
        scale={[0.923, 1, 1.063]}
      />
      <mesh
        name="Chair_Top_Three"
        geometry={nodes.Chair_Top_Three.geometry}
        material={nodes.Chair_Top_Three.material}
        position={[0.097, 4.627, 0.755]}
        scale={[0.188, 0.542, 0.758]}
      />
      <mesh
        name="Poster_1_Two"
        geometry={nodes.Poster_1_Two.geometry}
        material={nodes.Poster_1_Two.material}
        position={[3.305, 7.03, -1.786]}
        rotation={[0, -0.143, -0.202]}
        scale={[0.543, 0.946, 0.692]}
      />
      <mesh
        name="Poster_3_Two"
        geometry={nodes.Poster_3_Two.geometry}
        material={nodes.Poster_3_Two.material}
        position={[3.204, 6.175, -2.149]}
        rotation={[0, 0.027, -0.202]}
        scale={[0.437, 0.761, 0.486]}
      />
      <mesh
        name="Poster_2_Two"
        geometry={nodes.Poster_2_Two.geometry}
        material={nodes.Poster_2_Two.material}
        position={[3.232, 7.179, -2.508]}
        rotation={[0.003, 0.027, -0.311]}
        scale={[0.342, 0.596, 0.381]}
      />
      <mesh
        name="Poster_4"
        geometry={nodes.Poster_4.geometry}
        material={nodes.Poster_4.material}
        position={[0.886, 5.89, 3.307]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.544, 0.216, 0.714]}
      />
      <mesh
        name="Clock_One"
        geometry={nodes.Clock_One.geometry}
        material={nodes.Clock_One.material}
        position={[3.533, 7.751, -0.5]}
        rotation={[0, 0, -Math.PI / 2]}
      />
      <mesh
        name="Flower_1_Four"
        geometry={nodes.Flower_1_Four.geometry}
        material={nodes.Flower_1_Four.material}
        position={[3.035, 4.89, -1.026]}
        rotation={[0.438, -0.391, 0.841]}
        scale={[0.383, 0.145, 0.383]}
      />
      <mesh
        name="Flower_3_Four"
        geometry={nodes.Flower_3_Four.geometry}
        material={nodes.Flower_3_Four.material}
        position={[3.128, 4.829, -1.14]}
        rotation={[-0.404, -0.391, 0.841]}
        scale={[0.259, 0.098, 0.259]}
      />
      <mesh
        name="Flower_2_Four"
        geometry={nodes.Flower_2_Four.geometry}
        material={nodes.Flower_2_Four.material}
        position={[3.068, 4.818, -1.087]}
        scale={2.166}
      />
    </group>
  );
}

useGLTF.preload("/models/RoomPortfolioWBakedTexture-v1.glb");
