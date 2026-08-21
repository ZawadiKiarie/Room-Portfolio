import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  useCubeTexture,
  useCursor,
  useGLTF,
  useTexture,
  useVideoTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useAtomValue, useSetAtom } from "jotai";
import { isLoadingScreenComplete, openModalAtom } from "../utilities/utilities";
import gsap from "gsap";
import { Howl } from "howler";

const socialLinks = {
  Github: "https://github.com/ZawadiKiarie",
  Linkedin: "https://www.linkedin.com/in/zawadi-kiarie-03563714a/",
};

const CLICKABLE = new Set([
  "My_Work_Button_hover_three",
  "About_Button_hover_three",
  "Contact_Button_hover_three",
  "LinkedIn_hover_four",
  "GitHub_hover_four",
]);

const HOVER_RULES = [
  // exact names
  {
    test: (n) => n === "My_Work_Button_hover_three",
    scale: 1.15,
    rot: { x: 0.15 },
  },
  {
    test: (n) => n === "About_Button_hover_three",
    scale: 1.15,
    rot: { x: 0.15 },
  },
  {
    test: (n) => n === "Contact_Button_hover_three",
    scale: 1.15,
    rot: { x: 0.15 },
  },
  { test: (n) => n === "LinkedIn_hover_four", scale: 1.15, rot: { x: -0.15 } },
  { test: (n) => n === "GitHub_hover_four", scale: 1.15, rot: { x: -0.15 } },
  {
    test: (n) => n === "flower_basket_hover_four",
    scale: 1.15,
    rot: { y: -0.15 },
  },
  { test: (n) => n === "Organizer_hover_four", scale: 1.15, rot: { y: 0.3 } },
  { test: (n) => n === "Chair_Top_hover_four", scale: 1.15, rot: { y: -0.3 } },
  { test: (n) => n === "Big_Rabbit_hover_four", scale: 1.15, rot: { y: 0.3 } },
  {
    test: (n) => n === "Small_Rabbit_hover_four",
    scale: 1.15,
    rot: { y: -0.3 },
  },
  { test: (n) => n === "Cactus_hover_four", scale: 1.2, rot: { y: -0.5 } },
  { test: (n) => n === "Calendar_hover_four", scale: 1.2 },
  { test: (n) => n === "Can_hover_four", scale: 1.2, rot: { y: 0.5 } },
  { test: (n) => n === "Clock_hover_one", scale: 1.2, rot: { x: 0.2 } },
  { test: (n) => n === "Cup_hover_four", scale: 1.2, rot: { y: -0.5 } },
  { test: (n) => n === "Headphones_hover_four", scale: 1.2, rot: { y: -0.3 } },
  { test: (n) => n === "Keyboard_hover_four", scale: 1.15 },
  { test: (n) => n === "Lamp_hover_one", scale: 1.15, rot: { y: 0.3 } },
  { test: (n) => n === "Microphone_hover_three", scale: 1.2, rot: { y: 0.3 } },
  { test: (n) => n === "Mouse_hover_four", scale: 1.2 },
  { test: (n) => n === "Zawadi_sign_hover_three", scale: 1.15 },
  { test: (n) => n === "flowerpurple_hover_four", scale: 1.1, rot: { y: 0.5 } },
  // move a bit on hover (position offset) and rotate around Y only
  {
    test: (n) => n === "Plushie_hover_four",
    scale: 1.12,
    rot: { y: 0.25 },
    pos: { x: 0, y: 0.03, z: 0 },
  },

  // examples by prefix
  { test: (n) => n.startsWith("Bulb"), rot: { z: Math.PI * 0.1 }, scale: 1.5 },
  { test: (n) => n.startsWith("Rock"), scale: { x: 1.2, y: 1.0, z: 1.2 } },
  { test: (n) => n.startsWith("Plant"), scale: 1.2 },
  {
    test: (n) => n.startsWith("White"),
    rot: {
      x: -0.1,
    },
  },
  {
    test: (n) => n.startsWith("Black_key"),
    rot: {
      x: -0.1,
    },
  },
  {
    test: (n) => n.startsWith("Book"),
    rot: {
      y: 0.5,
    },
  },
  {
    test: (n) => n.startsWith("egg_basket"),
    rot: {
      y: 0.5,
    },
    scale: 1.2,
  },
  {
    test: (n) => n.startsWith("Drawer"),
    pos: {
      x: -0.1,
    },
  },
  {
    test: (n) => n.startsWith("Pizza"),
    rot: {
      y: -0.15,
    },
  },
  {
    test: (n) => n.startsWith("Poster"),
    rot: {
      y: 0.05,
    },
    scale: 1.3,
  },
  {
    test: (n) => n.startsWith("Flower"),
    scale: 1.2,
    rot: {
      y: -0.1,
    },
  },
  {
    test: (n) => n.startsWith("Storage_box"),
    scale: 1.2,
    rot: {
      y: 0.1,
    },
    pos: {
      x: -0.05,
    },
  },
  {
    test: (n) => n.startsWith("Slipper"),
    scale: 1.2,
    rot: {
      y: 0.1,
    },
    pos: {
      x: 0.1,
    },
  },
  {
    test: (n) => n.startsWith("Speaker"),
    scale: 1.2,
    rot: {
      y: -0.3,
    },
  },

  // fallback/default rule for anything else ending with _hover
  { test: (n) => n.includes("_hover"), scale: 1.1 },
];

const getRuleFor = (name) => HOVER_RULES.find((r) => r.test(name));

export function TextureModel3(props) {
  const { nodes } = useGLTF("/models/RoomPortfolioWTexture4-v1.glb");
  const group = useRef();
  const [hoveringClickable, setHoveringClickable] = useState(false);
  useCursor(hoveringClickable);
  const setOpenModal = useSetAtom(openModalAtom);
  const _isLoadingComplete = useAtomValue(isLoadingScreenComplete);
  // const popRef = useRef(null);

  const bottomFan1 = useRef();
  const bottomFan2 = useRef();
  const bottomFan3 = useRef();
  const sideFan1 = useRef();
  const sideFan2 = useRef();
  const sideFan3 = useRef();
  const plank1 = useRef();
  const plank2 = useRef();
  const workButton = useRef();
  const aboutButton = useRef();
  const contactButton = useRef();
  const plushie = useRef();
  const github = useRef();
  const linkedin = useRef();

  const envMap = useCubeTexture(
    ["px.webp", "nx.webp", "py.webp", "ny.webp", "pz.webp", "nz.webp"],
    { path: "/textures/skybox/" },
  );
  const videoTexture = useVideoTexture("textures/videos/cat.mp4", {
    start: true,
    loop: true,
    muted: true,
    playsInline: true,
  });
  videoTexture.flipY = false;
  videoTexture.colorSpace = THREE.SRGBColorSpace;
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.generateMipmaps = false;

  const textures = useTexture({
    TexturePackOne: "/textures/room/TexturePackOne.webp",
    TexturePackTwo: "/textures/room/TexturePackTwo.webp",
    TexturePackThree: "/textures/room/TexturePackThree.webp",
    TexturePackFour: "/textures/room/TexturePackFour.webp",
  });

  Object.values(textures).forEach((t) => {
    if (!t) return;
    t.flipY = false;
    t.colorSpace = THREE.SRGBColorSpace;
  });

  const bakedMats = useMemo(() => {
    const make = (map) =>
      new THREE.MeshBasicMaterial({
        map,
        toneMapped: false,
      });
    return {
      TexturePackOne: make(textures.TexturePackOne),
      TexturePackTwo: make(textures.TexturePackTwo),
      TexturePackThree: make(textures.TexturePackThree),
      TexturePackFour: make(textures.TexturePackFour),
    };
  }, [textures]);

  useLayoutEffect(() => {
    const g = group.current;
    if (!g) return;

    g.traverse((child) => {
      if (!(child.isMesh || child.isSkinnedMesh)) return;

      const n = child.name.toLowerCase();

      // handle both "TexturePackOne" and the typo "TexturePackone"
      if (n.includes("one")) child.material = bakedMats.TexturePackOne;
      if (n.includes("two")) child.material = bakedMats.TexturePackTwo;
      if (n.includes("three")) child.material = bakedMats.TexturePackThree;
      if (n.includes("four")) child.material = bakedMats.TexturePackFour;
    });
  }, [bakedMats]);

  useLayoutEffect(() => {
    if (!group.current) return;
    group.current.traverse((child) => {
      if (child.name === "Glass_Screen") {
        child.material = new THREE.MeshPhysicalMaterial({
          transmission: 1,
          opacity: 1,
          metalness: 0,
          roughness: 0,
          ior: 1.5,
          thickness: 0.01,
          specularIntensity: 1,
          envMap: envMap,
          envMapIntensity: 1,
        });
      }
      if (child.name === "Screen") {
        child.material = new THREE.MeshBasicMaterial({
          map: videoTexture,
          toneMapped: false,
        });
      }

      if (child.name.includes("hover")) {
        child.userData.__init = {
          scale: child.scale.clone(),
          pos: child.position.clone(),
          rot: child.rotation.clone(),
        };
      }
    });
  }, [envMap, videoTexture]);

  const playHoverAnimation = (obj, hover) => {
    const init = obj.userData.__init;
    if (!init) return;

    const rule = getRuleFor(obj.name);
    if (!rule) return;

    gsap.killTweensOf([obj.scale, obj.rotation, obj.position]);

    const scaleTarget = () => {
      if (hover && rule.scale) {
        const s = rule.scale;
        if (typeof s === "number")
          return {
            x: init.scale.x * s,
            y: init.scale.y * s,
            z: init.scale.z * s,
          };
        return {
          x: init.scale.x * (s.x ?? 1),
          y: init.scale.y * (s.y ?? 1),
          z: init.scale.z * (s.z ?? 1),
        };
      }
      return {
        x: init.scale.x,
        y: init.scale.y,
        z: init.scale.z,
      };
    };

    const rotTarget = () => {
      if (hover && rule.rot) {
        return {
          x: (rule.rot.x ?? 0) + init.rot.x,
          y: (rule.rot.y ?? 0) + init.rot.y,
          z: (rule.rot.z ?? 0) + init.rot.z,
        };
      }
      return {
        x: init.rot.x,
        y: init.rot.y,
        z: init.rot.z,
      };
    };

    const posTarget = () => {
      if (hover && rule.pos) {
        return {
          x: (rule.pos.x ?? 0) + init.pos.x,
          y: (rule.pos.y ?? 0) + init.pos.y,
          z: (rule.pos.z ?? 0) + init.pos.z,
        };
      }
      return {
        x: init.pos.x,
        y: init.pos.y,
        z: init.pos.z,
      };
    };

    const durIn = 0.5;
    const durOut = 0.3;
    const easeIn = "power2.out";
    const easeOut = "power2.out";

    const durationTime = hover ? durIn : durOut;
    const easeAnimation = hover ? easeIn : easeOut;

    if (rule.scale) {
      gsap.to(obj.scale, {
        ...scaleTarget(),
        duration: durationTime,
        ease: easeAnimation,
        overwrite: "auto",
      });
    } else {
      if (!hover)
        gsap.to(obj.scale, {
          x: init.scale.x,
          y: init.scale.y,
          z: init.scale.z,
          duration: durationTime,
          ease: easeAnimation,
          overwrite: "auto",
        });
    }

    if (rule.rot) {
      gsap.to(obj.rotation, {
        ...rotTarget(),
        duration: durationTime,
        ease: easeAnimation,
        overwrite: "auto",
      });
    } else {
      if (!hover)
        gsap.to(obj.rotation, {
          x: init.rot.x,
          y: init.rot.y,
          z: init.rot.z,
          duration: durationTime,
          ease: easeAnimation,
          overwrite: "auto",
        });
    }

    if (rule.pos) {
      gsap.to(obj.position, {
        ...posTarget(),
        duration: durationTime,
        ease: easeAnimation,
        overwrite: "auto",
      });
    } else {
      if (!hover)
        gsap.to(obj.position, {
          x: init.pos.x,
          y: init.pos.y,
          z: init.pos.z,
          duration: durationTime,
          ease: easeAnimation,
          overwrite: "auto",
        });
    }
  };

  useFrame(() => {
    sideFan1.current.rotation.x += 0.01;
    sideFan2.current.rotation.x += 0.01;
    sideFan3.current.rotation.x += 0.01;
    bottomFan1.current.rotation.z += 0.01;
    bottomFan2.current.rotation.z += 0.01;
    bottomFan3.current.rotation.z += 0.01;
  });

  const handleSocialLinkClick = (url) => {
    const newWindow = window.open();
    newWindow.opener = null;
    newWindow.location = url;
    newWindow.target = "_blank";
    newWindow.rel = "noopener noreferrer";
  };

  const findHoverNode = (obj) => {
    let cur = obj;
    while (cur && cur !== group.current) {
      if (cur.name?.includes("_hover")) {
        return cur;
      }
      cur = cur.parent;
    }
    return null;
  };

  const onOver = (e) => {
    // if (!introDone.current) return;
    const target = findHoverNode(e.object);
    if (!target) return;

    if (
      target.name === "bg" ||
      target.parent?.name === "Room" ||
      target.name === "Room"
    )
      return;

    e.stopPropagation();
    // popRef.current.play();
    playHoverAnimation(target, true);
    setHoveringClickable(CLICKABLE.has(target.name));
  };

  const onOut = (e) => {
    // if (!introDone.current) return;
    const target = findHoverNode(e.object);
    if (!target) return;

    e.stopPropagation();
    // popRef.current.pause();
    playHoverAnimation(target, false);
    setHoveringClickable(false);
  };

  const onMove = (e) => {
    // if (!introDone.current) return;
    // keeps cursor correct when sliding between children of the same group
    const target = findHoverNode(e.object);
    setHoveringClickable(!!target && CLICKABLE.has(target.name));
  };

  return (
    <group
      {...props}
      dispose={null}
      ref={group}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onPointerMove={onMove}
    >
      <mesh
        raycast={() => null}
        name="one"
        geometry={nodes.one.geometry}
        material={nodes.one.material}
        position={[0.006, 5.347, 0.026]}
      />
      <mesh
        raycast={() => null}
        name="two"
        geometry={nodes.two.geometry}
        material={nodes.two.material}
        position={[1.695, 0.053, 0.307]}
      />
      <mesh
        raycast={() => null}
        name="three"
        geometry={nodes.three.geometry}
        material={nodes.three.material}
        position={[-0.046, 1.245, -0.184]}
      />
      <mesh
        raycast={() => null}
        name="four"
        geometry={nodes.four.geometry}
        material={nodes.four.material}
        position={[2.576, 2.029, -2.236]}
      />
      <mesh
        name="Screen"
        geometry={nodes.Screen.geometry}
        material={nodes.Screen.material}
        position={[2.954, 6.04, 0.623]}
        scale={2.823}
      />
      <mesh
        name="Glass_Screen"
        geometry={nodes.Glass_Screen.geometry}
        material={nodes.Glass_Screen.material}
        position={[2.413, 4.671, 2.73]}
        scale={[0.801, 0.766, 0.267]}
      />
      <mesh
        ref={workButton}
        onClick={() => setOpenModal("work")}
        name="My_Work_Button_hover_three"
        geometry={nodes.My_Work_Button_hover_three.geometry}
        material={nodes.My_Work_Button_hover_three.material}
        position={[3.686, 6.998, -4.16]}
        rotation={[0.017, -0.002, -1.568]}
      />
      <mesh
        ref={aboutButton}
        onClick={() => setOpenModal("about")}
        name="About_Button_hover_three"
        geometry={nodes.About_Button_hover_three.geometry}
        material={nodes.About_Button_hover_three.material}
        position={[3.687, 6.37, -4.145]}
        rotation={[-0.034, 0.004, -1.577]}
      />
      <mesh
        ref={contactButton}
        onClick={() => setOpenModal("contact")}
        name="Contact_Button_hover_three"
        geometry={nodes.Contact_Button_Hover_three.geometry}
        material={nodes.Contact_Button_Hover_three.material}
        position={[3.683, 5.739, -4.157]}
        rotation={[0.032, -0.004, -1.565]}
      />
      <mesh
        name="Big_Rabbit_hover_four"
        geometry={nodes.Big_Rabbit_hover_four.geometry}
        material={nodes.Big_Rabbit_hover_four.material}
        position={[2.761, 5.139, 1.408]}
        rotation={[Math.PI, 0, Math.PI]}
      />
      <mesh
        name="Small_Rabbit_hover_four"
        geometry={nodes.Small_Rabbit_hover_four.geometry}
        material={nodes.Small_Rabbit_hover_four.material}
        position={[2.812, 5.145, 1.189]}
        rotation={[Math.PI, -0.104, Math.PI]}
      />
      <mesh
        name="Black_key1_hover_three"
        geometry={nodes.Black_key1_hover_three.geometry}
        material={nodes.Black_key1_hover_three.material}
        position={[-0.045, 4.462, 2.833]}
      />
      <mesh
        name="Black_key3_hover_three"
        geometry={nodes.Black_key3_hover_three.geometry}
        material={nodes.Black_key3_hover_three.material}
        position={[-0.69, 4.458, 2.833]}
      />
      <mesh
        name="Black_key2_hover_three"
        geometry={nodes.Black_key2_hover_three.geometry}
        material={nodes.Black_key2_hover_three.material}
        position={[-0.259, 4.462, 2.833]}
      />
      <mesh
        name="Black_key6_hover_three"
        geometry={nodes.Black_key6_hover_three.geometry}
        material={nodes.Black_key6_hover_three.material}
        position={[-1.536, 4.462, 2.833]}
      />
      <mesh
        name="Black_key7_hover_three"
        geometry={nodes.Black_key7_hover_three.geometry}
        material={nodes.Black_key7_hover_three.material}
        position={[-1.75, 4.462, 2.833]}
      />
      <mesh
        name="Black_key4_hover_three"
        geometry={nodes.Black_key4_hover_three.geometry}
        material={nodes.Black_key4_hover_three.material}
        position={[-0.905, 4.458, 2.833]}
      />
      <mesh
        name="Black_key5_hover_three"
        geometry={nodes.Black_key5_hover_three.geometry}
        material={nodes.Black_key5_hover_three.material}
        position={[-1.117, 4.458, 2.833]}
      />
      <mesh
        name="Black_key8_hover_three"
        geometry={nodes.Black_key8_hover_three.geometry}
        material={nodes.Black_key8_hover_three.material}
        position={[-2.176, 4.458, 2.833]}
      />
      <mesh
        name="Black_key9_hover_three"
        geometry={nodes.Black_key9_hover_three.geometry}
        material={nodes.Black_key9_hover_three.material}
        position={[-2.39, 4.458, 2.833]}
      />
      <mesh
        name="Black_key10_hover_three"
        geometry={nodes.Black_key10_hover_three.geometry}
        material={nodes.Black_key10_hover_three.material}
        position={[-2.602, 4.458, 2.833]}
      />
      <mesh
        name="White_key1_hover_three"
        geometry={nodes.White_key1_hover_three.geometry}
        material={nodes.White_key1_hover_three.material}
        position={[0.052, 4.4, 2.837]}
      />
      <mesh
        name="White_key2_hover_three"
        geometry={nodes.White_key2_hover_three.geometry}
        material={nodes.White_key2_hover_three.material}
        position={[-0.16, 4.4, 2.837]}
      />
      <mesh
        name="White_key3_hover_three"
        geometry={nodes.White_key3_hover_three.geometry}
        material={nodes.White_key3_hover_three.material}
        position={[-0.372, 4.4, 2.837]}
      />
      <mesh
        name="White_key4_hover_three"
        geometry={nodes.White_key4_hover_three.geometry}
        material={nodes.White_key4_hover_three.material}
        position={[-0.584, 4.4, 2.837]}
      />
      <mesh
        name="White_key5_hover_three"
        geometry={nodes.White_key5_hover_three.geometry}
        material={nodes.White_key5_hover_three.material}
        position={[-0.796, 4.4, 2.837]}
      />
      <mesh
        name="White_key6_hover_three"
        geometry={nodes.White_key6_hover_three.geometry}
        material={nodes.White_key6_hover_three.material}
        position={[-1.008, 4.4, 2.837]}
      />
      <mesh
        name="White_key7_hover_three"
        geometry={nodes.White_key7_hover_three.geometry}
        material={nodes.White_key7_hover_three.material}
        position={[-1.22, 4.4, 2.837]}
      />
      <mesh
        name="White_key8_hover_three"
        geometry={nodes.White_key8_hover_three.geometry}
        material={nodes.White_key8_hover_three.material}
        position={[-1.433, 4.4, 2.837]}
      />
      <mesh
        name="White_key9_hover_three"
        geometry={nodes.White_key9_hover_three.geometry}
        material={nodes.White_key9_hover_three.material}
        position={[-1.645, 4.4, 2.837]}
      />
      <mesh
        name="White_key10_hover_three"
        geometry={nodes.White_key10_hover_three.geometry}
        material={nodes.White_key10_hover_three.material}
        position={[-1.857, 4.4, 2.837]}
      />
      <mesh
        name="White_key11_hover_three"
        geometry={nodes.White_key11_hover_three.geometry}
        material={nodes.White_key11_hover_three.material}
        position={[-2.069, 4.4, 2.837]}
      />
      <mesh
        name="White_key12_hover_three"
        geometry={nodes.White_key12_hover_three.geometry}
        material={nodes.White_key12_hover_three.material}
        position={[-2.281, 4.4, 2.837]}
      />
      <mesh
        name="White_key13_hover_three"
        geometry={nodes.White_key13_hover_three.geometry}
        material={nodes.White_key13_hover_three.material}
        position={[-2.493, 4.4, 2.837]}
      />
      <mesh
        name="White_key14_hover_three"
        geometry={nodes.White_key14_hover_three.geometry}
        material={nodes.White_key14_hover_three.material}
        position={[-2.705, 4.4, 2.837]}
      />
      <mesh
        name="Book1_hover_four"
        geometry={nodes.Book1_hover_four.geometry}
        material={nodes.Book1_hover_four.material}
        position={[3.266, 7.107, -2.514]}
        rotation={[Math.PI, -1.548, Math.PI]}
      />
      <mesh
        name="Book2_hover_four"
        geometry={nodes.Book2_hover_four.geometry}
        material={nodes.Book2_hover_four.material}
        position={[2.875, 4.475, -2.615]}
        rotation={[0, -1.277, 0]}
      />
      <mesh
        name="Book3_hover_four"
        geometry={nodes.Book3_hover_four.geometry}
        material={nodes.Book3_hover_four.material}
        position={[2.935, 4.287, -2.609]}
        rotation={[0, -0.611, 0]}
      />
      <mesh
        name="Book4_hover_four"
        geometry={nodes.Book4_hover_four.geometry}
        material={nodes.Book4_hover_four.material}
        position={[2.958, 4.82, 0.235]}
        rotation={[Math.PI, -1.306, Math.PI]}
      />
      <mesh
        name="Book5_hover_four"
        geometry={nodes.Book5_hover_four.geometry}
        material={nodes.Book5_hover_four.material}
        position={[3.015, 4.832, 1.24]}
        rotation={[Math.PI, -1.541, Math.PI]}
      />
      <mesh
        ref={bottomFan2}
        name="Bottom_Fan2_four"
        geometry={nodes.Bottom_Fan2_four.geometry}
        material={nodes.Bottom_Fan2_four.material}
        position={[2.325, 5.105, 2.494]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        ref={bottomFan3}
        name="Bottom_Fan3_four"
        geometry={nodes.Bottom_Fan3_four.geometry}
        material={nodes.Bottom_Fan3_four.material}
        position={[1.991, 5.105, 2.494]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        ref={bottomFan1}
        name="Bottom_Fan1_four"
        geometry={nodes.Bottom_Fan1_four.geometry}
        material={nodes.Bottom_Fan1_four.material}
        position={[2.656, 5.105, 2.494]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        ref={sideFan1}
        name="Side_Fan1_four"
        geometry={nodes.Side_Fan1_four.geometry}
        material={nodes.Side_Fan1_four.material}
        position={[3.13, 5.681, 2.823]}
        rotation={[0, 0, -Math.PI / 2]}
      />
      <mesh
        ref={sideFan2}
        name="Side_Fan2_four"
        geometry={nodes.Side_Fan2_four.geometry}
        material={nodes.Side_Fan2_four.material}
        position={[3.13, 5.348, 2.823]}
        rotation={[0, 0, -Math.PI / 2]}
      />
      <mesh
        ref={sideFan3}
        name="Side_Fan3_four"
        geometry={nodes.Side_Fan3_four.geometry}
        material={nodes.Side_Fan3_four.material}
        position={[3.13, 5.017, 2.823]}
        rotation={[0, 0, -Math.PI / 2]}
      />
      <mesh
        name="Bulb1_hover_four"
        geometry={nodes.Bulb1_hover_four.geometry}
        material={nodes.Bulb1_hover_four.material}
        position={[3.082, 6.866, -1.611]}
        rotation={[2.733, -1.501, -0.407]}
      />
      <mesh
        name="Bulb2_hover_four"
        geometry={nodes.Bulb2_hover_four.geometry}
        material={nodes.Bulb2_hover_four.material}
        position={[3.084, 6.767, -1.216]}
        rotation={[2.733, -1.501, -0.407]}
      />
      <mesh
        name="Bulb3_hover_four"
        geometry={nodes.Bulb3_hover_four.geometry}
        material={nodes.Bulb3_hover_four.material}
        position={[3.094, 6.774, -0.807]}
        rotation={[2.733, -1.501, -0.407]}
      />
      <mesh
        name="Bulb4_hover_four"
        geometry={nodes.Bulb4_hover_four.geometry}
        material={nodes.Bulb4_hover_four.material}
        position={[3.114, 6.886, -0.416]}
        rotation={[2.733, -1.501, -0.407]}
      />
      <mesh
        name="Bulb5_hover_four"
        geometry={nodes.Bulb5_hover_four.geometry}
        material={nodes.Bulb5_hover_four.material}
        position={[3.143, 7.067, -0.054]}
        rotation={[2.733, -1.501, -0.407]}
      />
      <mesh
        name="Bulb6_hover_four"
        geometry={nodes.Bulb6_hover_four.geometry}
        material={nodes.Bulb6_hover_four.material}
        position={[3.185, 7.283, 0.284]}
        rotation={[2.733, -1.501, -0.407]}
      />
      <mesh
        name="Bulb7_hover_four"
        geometry={nodes.Bulb7_hover_four.geometry}
        material={nodes.Bulb7_hover_four.material}
        position={[3.306, 7.44, 1.793]}
        rotation={[2.733, -1.501, -0.407]}
      />
      <mesh
        name="Bulb8_hover_four"
        geometry={nodes.Bulb8_hover_four.geometry}
        material={nodes.Bulb8_hover_four.material}
        position={[3.042, 7.233, 2.011]}
        rotation={[2.733, -1.501, -0.407]}
      />
      <mesh
        name="Bulb9_hover_four"
        geometry={nodes.Bulb9_hover_four.geometry}
        material={nodes.Bulb9_hover_four.material}
        position={[2.773, 7.076, 2.264]}
        rotation={[2.733, -1.501, -0.407]}
      />
      <mesh
        name="Bulb10_hover_four"
        geometry={nodes.Bulb10_hover_four.geometry}
        material={nodes.Bulb10_hover_four.material}
        position={[2.515, 6.988, 2.558]}
        rotation={[2.733, -1.501, -0.407]}
      />
      <mesh
        name="Bulb11_hover_four"
        geometry={nodes.Bulb11_hover_four.geometry}
        material={nodes.Bulb11_hover_four.material}
        position={[2.294, 6.98, 2.891]}
        rotation={[2.733, -1.501, -0.407]}
      />
      <mesh
        name="Cactus_hover_four"
        geometry={nodes.Cactus_hover_four.geometry}
        material={nodes.Cactus_hover_four.material}
        position={[3.239, 6.154, -1.612]}
      />
      <mesh
        name="Calendar_hover_four"
        geometry={nodes.Calendar_hover_four.geometry}
        material={nodes.Calendar_hover_four.material}
        position={[2.299, 4.739, -0.552]}
      />
      <mesh
        name="Can_hover_four"
        geometry={nodes.Can_hover_four.geometry}
        material={nodes.Can_hover_four.material}
        position={[-2.265, 2.765, 0.532]}
      />
      <mesh
        name="Carpet_hover_three"
        geometry={nodes.Carpet_hover_three.geometry}
        material={nodes.Carpet_hover_three.material}
        position={[-1.358, 1.977, -1.144]}
      />
      <mesh
        name="Chair_Top_hover_four"
        geometry={nodes.Chair_Top_hover_four.geometry}
        material={nodes.Chair_Top_hover_four.material}
        position={[0.494, 3.509, 0.786]}
        rotation={[0, -1.571, 0]}
      />
      <mesh
        name="Cup_hover_four"
        geometry={nodes.Cup_hover_four.geometry}
        material={nodes.Cup_hover_four.material}
        position={[1.423, 4.694, -0.732]}
      />
      <mesh
        name="Clock_hover_one"
        geometry={nodes.Clock_hover_one.geometry}
        material={nodes.Clock_hover_one.material}
        position={[3.533, 7.751, -0.5]}
        rotation={[0, 0, -Math.PI / 2]}
      />
      <mesh
        name="Drawer1_hover_four"
        geometry={nodes.Drawer1_hover_four.geometry}
        material={nodes.Drawer1_hover_four.material}
        position={[1.741, 3.671, -2.236]}
      />
      <mesh
        name="Drawer2_hover_four"
        geometry={nodes.Drawer2_hover_four.geometry}
        material={nodes.Drawer2_hover_four.material}
        position={[2.511, 3.045, -2.236]}
      />
      <mesh
        name="Drawer3_hover_four"
        geometry={nodes.Drawer3_hover_four.geometry}
        material={nodes.Drawer3_hover_four.material}
        position={[2.511, 2.423, -2.236]}
      />
      <mesh
        name="egg_basket2_hover_four"
        geometry={nodes.egg_basket2_hover_four.geometry}
        material={nodes.egg_basket2_hover_four.material}
        position={[3.231, 7.61, 1.963]}
      />
      <mesh
        name="egg_basket1_hover_four"
        geometry={nodes.egg_basket1_hover_four.geometry}
        material={nodes.egg_basket1_hover_four.material}
        position={[3.231, 7.61, 0.999]}
      />
      <mesh
        name="Flower_1_hover_four"
        geometry={nodes.Flower_1_hover_four.geometry}
        material={nodes.Flower_1_hover_four.material}
        position={[3.035, 4.89, -1.026]}
        rotation={[0.438, -0.391, 0.841]}
      />
      <mesh
        name="Flower_3_hover_four"
        geometry={nodes.Flower_3_hover_four.geometry}
        material={nodes.Flower_3_hover_four.material}
        position={[3.128, 4.829, -1.14]}
        rotation={[-0.404, -0.391, 0.841]}
      />
      <mesh
        name="Flower_2_hover_four"
        geometry={nodes.Flower_2_hover_four.geometry}
        material={nodes.Flower_2_hover_four.material}
        position={[3.068, 4.818, -1.087]}
      />
      <mesh
        name="flower_basket_hover_four"
        geometry={nodes.flower_basket_hover_four.geometry}
        material={nodes.flower_basket_hover_four.material}
        position={[2.339, 4.156, -2.064]}
      />
      <mesh
        name="flowerpurple_hover_four"
        geometry={nodes.flowerpurple_hover_four.geometry}
        material={nodes.flowerpurple_hover_four.material}
        position={[3.091, 5.379, -2.72]}
        rotation={[0.438, -0.391, 0.841]}
      />
      <mesh
        ref={github}
        onClick={() => handleSocialLinkClick(socialLinks.Github)}
        name="GitHub_hover_four"
        geometry={nodes.GitHub_hover_four.geometry}
        material={nodes.GitHub_hover_four.material}
        position={[1.902, 7.194, 3.082]}
        rotation={[1.865, 0, 0]}
      />
      <mesh
        ref={plank1}
        name="Hanging_Plank1_three"
        geometry={nodes.Hanging_Plank1_hover_three.geometry}
        material={nodes.Hanging_Plank1_hover_three.material}
        position={[3.742, 7.594, -3.263]}
      />
      <mesh
        ref={plank2}
        name="Hanging_Plank2_three"
        geometry={nodes.Hanging_Plank2_hover_three.geometry}
        material={nodes.Hanging_Plank2_hover_three.material}
        position={[3.787, 7.404, -4.197]}
      />
      <mesh
        name="Headphones_hover_four"
        geometry={nodes.Headphones_hover_four.geometry}
        material={nodes.Headphones_hover_four.material}
        position={[1.921, 4.705, -1.173]}
        rotation={[0, 0.907, 0]}
      />
      <mesh
        name="Keyboard_hover_four"
        geometry={nodes.Keyboard_hover_four.geometry}
        material={nodes.Keyboard_hover_four.material}
        position={[1.68, 4.73, 0.709]}
      />
      <mesh
        name="Lamp_hover_one"
        geometry={nodes.Lamp_hover_one.geometry}
        material={nodes.Lamp_hover_one.material}
        position={[0.488, 2.022, 2.701]}
      />
      <mesh
        ref={linkedin}
        onClick={() => handleSocialLinkClick(socialLinks.Linkedin)}
        name="LinkedIn_hover_four"
        geometry={nodes.LinkedIn_hover_four.geometry}
        material={nodes.LinkedIn_hover_four.material}
        position={[1.214, 7.183, 3.082]}
        rotation={[1.865, 0, 0]}
      />
      <mesh
        name="Microphone_hover_three"
        geometry={nodes.Microphone_hover_three.geometry}
        material={nodes.Microphone_hover_three.material}
        position={[-2.98, 4.564, 2.931]}
      />
      <mesh
        name="Mouse_hover_four"
        geometry={nodes.Mouse_hover_four.geometry}
        material={nodes.Mouse_hover_four.material}
        position={[1.706, 4.714, 2.002]}
      />
      <mesh
        name="Organizer_hover_four"
        geometry={nodes.Organizer_hover_four.geometry}
        material={nodes.Organizer_hover_four.material}
        position={[2.882, 4.554, -2.63]}
        rotation={[0, 1.421, 0]}
      />
      <mesh
        name="Pizza1_hover_four"
        geometry={nodes.Pizza1_hover_four.geometry}
        material={nodes.Pizza1_hover_four.material}
        position={[-2.093, 2.925, 1.137]}
        rotation={[-2.873, -0.962, -2.896]}
      />
      <mesh
        name="Pizza2_hover_four"
        geometry={nodes.Pizza2_hover_four.geometry}
        material={nodes.Pizza2_hover_four.material}
        position={[-2.544, 2.856, 1.086]}
        rotation={[-3.119, 0.01, -3.12]}
      />
      <mesh
        name="Plant1_hover_three"
        geometry={nodes.Plant1_hover_three.geometry}
        material={nodes.Plant1_hover_three.material}
        position={[3.124, 0.481, -3.846]}
        rotation={[0, 0.721, 0]}
      />
      <mesh
        name="Plant3_hover_three"
        geometry={nodes.Plant3_hover_three.geometry}
        material={nodes.Plant3_hover_three.material}
        position={[2.676, 0.482, -3.799]}
        rotation={[0.059, 0.462, 0.03]}
      />
      <mesh
        name="Plant2_hover_three"
        geometry={nodes.Plant2_hover_three.geometry}
        material={nodes.Plant2_hover_three.material}
        position={[3.175, 0.398, -4.224]}
        rotation={[0.782, 1.399, -0.875]}
      />
      <mesh
        name="Plant5_hover_three"
        geometry={nodes.Plant5_hover_three.geometry}
        material={nodes.Plant5_hover_three.material}
        position={[0.657, 0.546, -3.543]}
        rotation={[0.053, -0.029, 0.058]}
      />
      <mesh
        name="Plant4_hover_three"
        geometry={nodes.Plant4_hover_three.geometry}
        material={nodes.Plant4_hover_three.material}
        position={[0.313, 0.545, -3.96]}
        rotation={[0.059, 1.093, -0.023]}
      />
      <mesh
        name="Plant6_hover_three"
        geometry={nodes.Plant6_hover_three.geometry}
        material={nodes.Plant6_hover_three.material}
        position={[-3.321, 0.434, -3.579]}
        rotation={[0.041, 0.851, -0.002]}
      />
      <mesh
        name="Plant7_hover_three"
        geometry={nodes.Plant7_hover_three.geometry}
        material={nodes.Plant7_hover_three.material}
        position={[-3.591, 0.544, -3.351]}
        rotation={[0.054, 0.234, 0.044]}
      />
      <mesh
        name="Plant8_hover_three"
        geometry={nodes.Plant8_hover_three.geometry}
        material={nodes.Plant8_hover_three.material}
        position={[-3.741, 0.416, -3.041]}
        rotation={[0.059, 1.093, -0.023]}
      />
      <mesh
        name="Plant9_hover_three"
        geometry={nodes.Plant9_hover_three.geometry}
        material={nodes.Plant9_hover_three.material}
        position={[-4.366, 0.527, 0.225]}
        rotation={[0.249, 1.461, -0.219]}
      />
      <mesh
        name="Plant10_hover_three"
        geometry={nodes.Plant10_hover_three.geometry}
        material={nodes.Plant10_hover_three.material}
        position={[-3.894, 0.481, 1.741]}
        rotation={[0.249, 1.461, -0.219]}
      />
      <mesh
        name="Plant11_hover_three"
        geometry={nodes.Plant11_hover_three.geometry}
        material={nodes.Plant11_hover_three.material}
        position={[-3.999, 0.484, 2.087]}
        rotation={[0, 1.386, 0]}
      />
      <mesh
        name="Plant12_hover_three"
        geometry={nodes.Plant12_hover_three.geometry}
        material={nodes.Plant12_hover_three.material}
        position={[-3.917, 0.48, 2.739]}
        rotation={[0.249, 1.461, -0.219]}
      />
      <mesh
        ref={plushie}
        name="Plushie_hover_four"
        geometry={nodes.Plushie_hover_four.geometry}
        material={nodes.Plushie_hover_four.material}
        position={[2.495, 7.17, 3.106]}
      />
      <mesh
        name="Poster1_hover_two"
        geometry={nodes.Poster1_hover_two.geometry}
        material={nodes.Poster1_hover_two.material}
        position={[3.305, 7.03, -1.786]}
        rotation={[0, -0.143, -0.202]}
      />
      <mesh
        name="Poster2_hover_two"
        geometry={nodes.Poster2_hover_two.geometry}
        material={nodes.Poster2_hover_two.material}
        position={[3.232, 7.179, -2.508]}
        rotation={[0.003, 0.027, -0.311]}
      />
      <mesh
        name="Poster3_hover_two"
        geometry={nodes.Poster3_hover_two.geometry}
        material={nodes.Poster3_hover_two.material}
        position={[3.27, 6.331, -2.151]}
        rotation={[0, 0.027, -0.202]}
      />
      <mesh
        name="Rock1_hover_three"
        geometry={nodes.Rock1_hover_three.geometry}
        material={nodes.Rock1_hover_three.material}
        position={[5.293, -0.083, -2.752]}
        rotation={[0, 1.254, 0]}
      />
      <mesh
        name="Rock2_hover_three"
        geometry={nodes.Rock2_hover_three.geometry}
        material={nodes.Rock2_hover_three.material}
        position={[1.647, 0.3, -4.28]}
        rotation={[0, 0.459, 0]}
      />
      <mesh
        name="Rock3_hover_three"
        geometry={nodes.Rock3_hover_three.geometry}
        material={nodes.Rock3_hover_three.material}
        position={[-1.183, 0.36, -4.025]}
      />
      <mesh
        name="Rock4_hover_three"
        geometry={nodes.Rock4_hover_three.geometry}
        material={nodes.Rock4_hover_three.material}
        position={[-4.102, 0.526, -1.699]}
      />
      <mesh
        name="Rock7_hover_three"
        geometry={nodes.Rock7_hover_three.geometry}
        material={nodes.Rock7_hover_three.material}
        position={[-2.959, -0.188, 4.917]}
        rotation={[0, 0.569, 0]}
      />
      <mesh
        name="Rock6_hover_three"
        geometry={nodes.Rock6_hover_three.geometry}
        material={nodes.Rock6_hover_three.material}
        position={[-4.343, 0.445, 1.067]}
      />
      <mesh
        name="Rock5_hover_three"
        geometry={nodes.Rock5_hover_three.geometry}
        material={nodes.Rock5_hover_three.material}
        position={[-5.112, 0.413, -1.685]}
        rotation={[0, -0.325, 0]}
      />
      <mesh
        name="Slipper1_hover_four"
        geometry={nodes.Slipper1_hover_four.geometry}
        material={nodes.Slipper1_hover_four.material}
        position={[2.083, 2.009, 0.875]}
        rotation={[0, -1.404, 0]}
      />
      <mesh
        name="Slipper2_hover_four"
        geometry={nodes.Slipper2_hover_four.geometry}
        material={nodes.Slipper2_hover_four.material}
        position={[2.596, 2.009, 1.619]}
        rotation={[Math.PI, -1.154, Math.PI]}
      />
      <mesh
        name="Speaker1_hover_four"
        geometry={nodes.Speaker1_hover_four.geometry}
        material={nodes.Speaker1_hover_four.material}
        position={[2.91, 5.152, -0.279]}
        rotation={[0, 0.157, 0]}
      />
      <mesh
        name="Speaker2_hover_four"
        geometry={nodes.Speaker2_hover_four.geometry}
        material={nodes.Speaker2_hover_four.material}
        position={[2.91, 5.152, 1.735]}
        rotation={[0, -0.468, 0]}
      />
      <mesh
        name="Storage_box3_hover_four"
        geometry={nodes.Storage_box3_hover_four.geometry}
        material={nodes.Storage_box3_hover_four.material}
        position={[2.619, 2.012, -0.396]}
      />
      <mesh
        name="Storage_box2_hover_four"
        geometry={nodes.Storage_box2_hover_four.geometry}
        material={nodes.Storage_box2_hover_four.material}
        position={[2.371, 2.647, -0.415]}
        rotation={[0, -0.284, 0]}
      />
      <mesh
        name="Storage_box1_hover_four"
        geometry={nodes.Storage_box1_hover_four.geometry}
        material={nodes.Storage_box1_hover_four.material}
        position={[2.288, 3.129, -0.509]}
        rotation={[0, 0.085, 0]}
      />
      <mesh
        name="Zawadi_sign_hover_three"
        geometry={nodes.Zawadi_sign_hover_three.geometry}
        material={nodes.Zawadi_sign_hover_three.material}
        position={[-1.317, 5.236, 3.364]}
        rotation={[Math.PI / 2, 0, Math.PI]}
      />
    </group>
  );
}

useGLTF.preload("/models/RoomPortfolioWTexture4-v1.glb");
useTexture.preload(
  [
    "TexturePackOne.webp",
    "TexturePackTwo.webp",
    "TexturePackThree.webp",
    "TexturePackFour.webp",
  ],
  { path: "/textures/room/" },
);
useCubeTexture.preload(
  ["px.webp", "nx.webp", "py.webp", "ny.webp", "pz.webp", "nz.webp"],
  { path: "/textures/skybox/" },
);
