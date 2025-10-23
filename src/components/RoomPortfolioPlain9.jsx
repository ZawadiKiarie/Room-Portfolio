import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  useCubeTexture,
  useCursor,
  useGLTF,
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
  "My_Work_Button_hover",
  "About_Button_hover",
  "Contact_Button_hover",
  "LinkedIn__hover",
  "GitHub_hover",
]);

const HOVER_RULES = [
  // exact names
  { test: (n) => n === "My_Work_Button_hover", scale: 1.15, rot: { x: 0.15 } },
  { test: (n) => n === "About_Button_hover", scale: 1.15, rot: { x: 0.15 } },
  { test: (n) => n === "Contact_Button_hover", scale: 1.15, rot: { x: 0.15 } },
  { test: (n) => n === "LinkedIn__hover", scale: 1.15, rot: { x: -0.15 } },
  { test: (n) => n === "GitHub_hover", scale: 1.15, rot: { x: -0.15 } },
  { test: (n) => n === "flower_basket_hover", scale: 1.15, rot: { y: -0.15 } },
  { test: (n) => n === "Organizer_hover", scale: 1.15, rot: { y: 0.3 } },
  { test: (n) => n === "Chair_Top_hover", scale: 1.15, rot: { y: -0.3 } },
  { test: (n) => n === "Big_rabbit_hover", scale: 1.15, rot: { y: 0.3 } },
  { test: (n) => n === "Small_Rabbit_hover", scale: 1.15, rot: { y: -0.3 } },
  { test: (n) => n === "Cactus_hover", scale: 1.2, rot: { y: -0.5 } },
  { test: (n) => n === "Calendar_hover", scale: 1.2 },
  { test: (n) => n === "Can_hover", scale: 1.2, rot: { y: 0.5 } },
  { test: (n) => n === "Clock_hover", scale: 1.2, rot: { x: 0.2 } },
  { test: (n) => n === "Cup_hover", scale: 1.2, rot: { y: -0.5 } },
  { test: (n) => n === "Headphones_hover", scale: 1.2, rot: { y: -0.3 } },
  { test: (n) => n === "Keyboard_hover", scale: 1.15 },
  { test: (n) => n === "Lamp_hover", scale: 1.15, rot: { y: 0.3 } },
  { test: (n) => n === "Microphone_hover", scale: 1.2, rot: { y: 0.3 } },
  { test: (n) => n === "Mouse_hover", scale: 1.2 },
  { test: (n) => n === "Zawadi_sign_hover", scale: 1.15 },
  { test: (n) => n === "flowerpurple_hover", scale: 1.1, rot: { y: 0.5 } },
  // move a bit on hover (position offset) and rotate around Y only
  {
    test: (n) => n === "Plushie_hover",
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
  { test: (n) => n.endsWith("_hover"), scale: 1.1 },
];

const getRuleFor = (name) => HOVER_RULES.find((r) => r.test(name));

export function PlainModel8(props) {
  const { nodes, materials } = useGLTF("/models/RoomPortfolioPlain9v2-v3.glb");
  const group = useRef();
  const [hoveringClickable, setHoveringClickable] = useState(false);
  useCursor(hoveringClickable);
  const setOpenModal = useSetAtom(openModalAtom);
  const isLoadingComplete = useAtomValue(isLoadingScreenComplete);
  const popRef = useRef(null);

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
    { path: "/textures/skybox/" }
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

  //store initial transforms once
  useLayoutEffect(() => {
    if (!group.current) return;
    group.current.traverse((child) => {
      if (child.isMesh || child.isSkinnedMesh) {
        child.castShadow = true;
        child.receiveShadow = true; // or only for floors if you want to optimize
      }
      if (child.name === "Glass_Screen") {
        child.material = new THREE.MeshPhysicalMaterial({
          transmission: 1, // real glass
          opacity: 1,
          metalness: 0,
          roughness: 0, // tiny roughness helps sell the look
          ior: 1.5,
          thickness: 0.01, // >0 to see refraction
          specularIntensity: 1,
          envMap: envMap, // use the loaded cube
          envMapIntensity: 1, // bump if reflections feel dull
        });
      }
      if (child.name === "Screen") {
        child.material = new THREE.MeshBasicMaterial({
          map: videoTexture,
          toneMapped: false,
        });
      }
      if (child.name === "My_Work_Button_hover") {
        child.scale.setScalar(0.355);
      } else if (child.name === "About_Button_hover") {
        child.scale.set(0.923, 1, 1.063);
      } else if (child.name === "Contact_Button_hover") {
        child.scale.set(0.923, 1, 1.063);
      } else if (child.name === "Plushie_hover") {
        child.scale.set(1, 0.925, 1);
      } else if (child.name === "LinkedIn__hover") {
        child.scale.setScalar(0.086);
      } else if (child.name === "GitHub_hover") {
        child.scale.setScalar(2.297);
      }
      // if (child.name.includes("hover")) {
      //   child.userData.initialScale = new THREE.Vector3().copy(child.scale);
      //   child.userData.initialPosition = new THREE.Vector3().copy(
      //     child.position
      //   );
      //   child.userData.initialRotation = new THREE.Euler().copy(child.rotation);
      // }
      if (child.name.includes("hover")) {
        child.userData.__init = {
          scale: child.scale.clone(),
          pos: child.position.clone(),
          rot: child.rotation.clone(),
        };
      }

      if (child.name.includes("Hanging_Plank1")) {
        child.scale.set(0, 1, 0);
      } else if (child.name.includes("Hanging_Plank2")) {
        child.scale.set(0, 0, 0);
      } else if (child.name.includes("My_Work_Button")) {
        child.scale.set(0, 0, 0);
      } else if (child.name.includes("About_Button")) {
        child.scale.set(0, 0, 0);
      } else if (child.name.includes("Contact_Button")) {
        child.scale.set(0, 0, 0);
      } else if (child.name.includes("LinkedIn")) {
        child.scale.set(0, 0, 0);
      } else if (child.name.includes("GitHub")) {
        child.scale.set(0, 0, 0);
      } else if (child.name.includes("Plushie")) {
        child.scale.set(0, 0, 0);
      }
    });
  }, []);

  const introDone = useRef(false);
  const toInitScale = (obj) => {
    const s = obj.userData.__init?.scale;
    return s ? { x: s.x, y: s.y, z: s.z } : { x: 1, y: 1, z: 1 };
  };

  const playIntroAnimation = () => {
    const t1 = gsap.timeline({
      defaults: { duration: 0.8, ease: "back.out(1.8)" },
      onComplete: () => {
        introDone.current = true;
      },
    });

    t1.to(plank1.current.scale, toInitScale(plank1.current))
      .to(plank2.current.scale, toInitScale(plank2.current), "-=0.5")
      .to(workButton.current.scale, toInitScale(workButton.current), "-=0.6")
      .to(aboutButton.current.scale, toInitScale(aboutButton.current), "-=0.6")
      .to(
        contactButton.current.scale,
        toInitScale(contactButton.current),
        "-=0.5"
      );
    // .to(plushie.current.scale, toInitScale(plushie.current), "-=0.5")
    // .to(github.current.scale, toInitScale(github.current), "-=0.5")
    // .to(linkedin.current.scale, toInitScale(linkedin.current), "-=0.6");
    const t2 = gsap.timeline({
      defaults: { duration: 0.8, ease: "back.out(1.8)" },
      onComplete: () => {
        introDone.current = true;
      },
    });
    t2.timeScale(0.8);

    t2.to(plushie.current.scale, toInitScale(plushie.current), "+=0.5")
      .to(github.current.scale, toInitScale(github.current), "-=0.5")
      .to(linkedin.current.scale, toInitScale(linkedin.current), "-=0.6");
  };

  useEffect(() => {
    if (introDone.current) return;
    if (isLoadingComplete) playIntroAnimation();
  }, [isLoadingComplete]);

  useEffect(() => {
    popRef.current = new Howl({
      src: ["music/bubble3.mp3"],
      volume: 0.6,
    });
  }, []);

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
      if (cur.name?.endsWith("hover")) {
        // console.log(cur);
        return cur;
      }
      cur = cur.parent;
    }
    return null;
  };

  const onOver = (e) => {
    if (!introDone.current) return;
    const target = findHoverNode(e.object);
    if (!target) return;

    if (
      target.name === "bg" ||
      target.parent?.name === "Room" ||
      target.name === "Room"
    )
      return;

    e.stopPropagation();
    popRef.current.play();
    playHoverAnimation(target, true);
    setHoveringClickable(CLICKABLE.has(target.name));
  };

  const onOut = (e) => {
    if (!introDone.current) return;
    const target = findHoverNode(e.object);
    if (!target) return;

    e.stopPropagation();
    popRef.current.pause();
    playHoverAnimation(target, false);
    setHoveringClickable(false);
  };

  const onMove = (e) => {
    if (!introDone.current) return;
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
        name="bg"
        raycast={() => null}
        geometry={nodes.bg.geometry}
        material={materials.SoftPurple}
        position={[1.695, 0.053, 0.307]}
        scale={[1.172, 1, 1.172]}
      />
      <group name="Room" position={[0.006, 5.347, 0.026]}>
        <mesh
          raycast={() => null}
          name="Cube024"
          geometry={nodes.Cube024.geometry}
          material={materials.SoftPink}
        />
        <mesh
          raycast={() => null}
          name="Cube024_1"
          geometry={nodes.Cube024_1.geometry}
          material={materials["posty notes"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_2"
          geometry={nodes.Cube024_2.geometry}
          material={materials.socket}
        />
        <mesh
          raycast={() => null}
          name="Cube024_3"
          geometry={nodes.Cube024_3.geometry}
          material={materials.charger}
        />
        <mesh
          raycast={() => null}
          name="Cube024_4"
          geometry={nodes.Cube024_4.geometry}
          material={materials.carpet}
        />
        <mesh
          raycast={() => null}
          name="Cube024_5"
          geometry={nodes.Cube024_5.geometry}
          material={materials["egg in carpet"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_6"
          geometry={nodes.Cube024_6.geometry}
          material={materials.Roof}
        />
        <mesh
          raycast={() => null}
          name="Cube024_7"
          geometry={nodes.Cube024_7.geometry}
          material={materials.Blinds}
        />
        <mesh
          raycast={() => null}
          name="Cube024_8"
          geometry={nodes.Cube024_8.geometry}
          material={materials["Material.028"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_9"
          geometry={nodes.Cube024_9.geometry}
          material={materials.puddle}
        />
        <mesh
          raycast={() => null}
          name="Cube024_10"
          geometry={nodes.Cube024_10.geometry}
          material={materials.leaves}
        />
        <mesh
          raycast={() => null}
          name="Cube024_11"
          geometry={nodes.Cube024_11.geometry}
          material={materials["Material.010"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_12"
          geometry={nodes.Cube024_12.geometry}
          material={materials.cupboard}
        />
        <mesh
          raycast={() => null}
          name="Cube024_13"
          geometry={nodes.Cube024_13.geometry}
          material={materials["Material.018"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_14"
          geometry={nodes.Cube024_14.geometry}
          material={materials["Material.019"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_15"
          geometry={nodes.Cube024_15.geometry}
          material={materials["Material.020"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_16"
          geometry={nodes.Cube024_16.geometry}
          material={materials.bulb}
        />
        <mesh
          name="Cube024_17"
          geometry={nodes.Cube024_17.geometry}
          material={materials.DarkerWood}
        />
        <mesh
          raycast={() => null}
          name="Cube024_18"
          geometry={nodes.Cube024_18.geometry}
          material={materials["Material.005"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_19"
          geometry={nodes.Cube024_19.geometry}
          material={materials.keyboard}
        />
        <mesh
          raycast={() => null}
          name="Cube024_20"
          geometry={nodes.Cube024_20.geometry}
          material={materials["Keyboard legs"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_21"
          geometry={nodes.Cube024_21.geometry}
          material={materials["chair bottom"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_22"
          geometry={nodes.Cube024_22.geometry}
          material={materials["black tip"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_23"
          geometry={nodes.Cube024_23.geometry}
          material={materials["Material.026"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_24"
          geometry={nodes.Cube024_24.geometry}
          material={materials["desktop image"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_25"
          geometry={nodes.Cube024_25.geometry}
          material={materials["pc cover"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_26"
          geometry={nodes.Cube024_26.geometry}
          material={materials["Material.024"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_27"
          geometry={nodes.Cube024_27.geometry}
          material={materials["Material.025"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_28"
          geometry={nodes.Cube024_28.geometry}
          material={materials["Material.022"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_29"
          geometry={nodes.Cube024_29.geometry}
          material={materials["Material.023"]}
        />
        <mesh
          raycast={() => null}
          name="Cube024_30"
          geometry={nodes.Cube024_30.geometry}
          material={materials["Light Strip"]}
        />
      </group>
      <mesh
        ref={plank1}
        name="Hanging_Plank1"
        geometry={nodes.Hanging_Plank1_hover.geometry}
        material={materials.Roof}
        position={[3.742, 7.594, -3.263]}
      />
      <group
        ref={workButton}
        onClick={() => setOpenModal("work")}
        name="My_Work_Button_hover"
        position={[3.697, 6.955, -4.733]}
        rotation={[1.587, 0.003, 1.573]}
        // scale={0.355}
      >
        <mesh
          name="Text001"
          geometry={nodes.Text001.geometry}
          material={materials["Material.021"]}
        />
        <mesh
          name="Text001_1"
          geometry={nodes.Text001_1.geometry}
          material={materials.Roof}
        />
      </group>
      <group
        ref={aboutButton}
        onClick={() => setOpenModal("about")}
        name="About_Button_hover"
        position={[3.775, 6.364, -4.185]}
        rotation={[-0.034, 0.004, -1.577]}
        // scale={[0.923, 1, 1.063]}
      >
        <mesh
          name="Plane148"
          geometry={nodes.Plane148.geometry}
          material={materials.Roof}
        />
        <mesh
          name="Plane148_1"
          geometry={nodes.Plane148_1.geometry}
          material={materials["Material.021"]}
        />
      </group>
      <group
        ref={contactButton}
        onClick={() => setOpenModal("contact")}
        name="Contact_Button_hover"
        position={[3.773, 5.727, -4.182]}
        rotation={[0.032, -0.004, -1.565]}
        // scale={[0.923, 1, 1.063]}
      >
        <mesh
          name="Plane149"
          geometry={nodes.Plane149.geometry}
          material={materials.Roof}
        />
        <mesh
          name="Plane149_1"
          geometry={nodes.Plane149_1.geometry}
          material={materials["Material.021"]}
        />
      </group>
      <mesh
        ref={plank2}
        name="Hanging_Plank2"
        geometry={nodes.Hanging_Plank2_hover.geometry}
        material={materials.Roof}
        position={[3.787, 7.404, -4.197]}
      />
      <group
        name="Poster1_hover"
        position={[3.305, 7.03, -1.786]}
        rotation={[0, -0.143, -0.202]}
        scale={[0.543, 0.946, 0.692]}
      >
        <mesh
          name="Plane039"
          geometry={nodes.Plane039.geometry}
          material={materials["Material.028"]}
        />
        <mesh
          name="Plane039_1"
          geometry={nodes.Plane039_1.geometry}
          material={materials["Material.007"]}
        />
      </group>
      <group
        name="Poster3_hover"
        position={[3.204, 6.175, -2.149]}
        rotation={[0, 0.027, -0.202]}
        scale={[0.437, 0.761, 0.486]}
      >
        <mesh
          name="Plane102"
          geometry={nodes.Plane102.geometry}
          material={materials["Material.028"]}
        />
        <mesh
          name="Plane102_1"
          geometry={nodes.Plane102_1.geometry}
          material={materials["Material.008"]}
        />
      </group>
      <group
        name="Poster2_hover"
        position={[3.232, 7.179, -2.508]}
        rotation={[0.003, 0.027, -0.311]}
        scale={[0.342, 0.596, 0.381]}
      >
        <mesh
          name="Plane105"
          geometry={nodes.Plane105.geometry}
          material={materials["Material.028"]}
        />
        <mesh
          name="Plane105_1"
          geometry={nodes.Plane105_1.geometry}
          material={materials["Material.009"]}
        />
      </group>
      <group
        name="Flower_1_hover"
        position={[3.035, 4.89, -1.026]}
        rotation={[0.438, -0.391, 0.841]}
        scale={[0.383, 0.145, 0.383]}
      >
        <mesh
          name="Cube006"
          geometry={nodes.Cube006.geometry}
          material={materials.flowers}
        />
        <mesh
          name="Cube006_1"
          geometry={nodes.Cube006_1.geometry}
          material={materials["hanging pot leaves"]}
        />
      </group>
      <group
        name="Flower_3_hover"
        position={[3.128, 4.829, -1.14]}
        rotation={[-0.404, -0.391, 0.841]}
        scale={[0.259, 0.098, 0.259]}
      >
        <mesh
          name="Cube008"
          geometry={nodes.Cube008.geometry}
          material={materials.flowers}
        />
        <mesh
          name="Cube008_1"
          geometry={nodes.Cube008_1.geometry}
          material={materials["hanging pot leaves"]}
        />
      </group>
      <group
        name="Flower_2_hover"
        position={[3.068, 4.818, -1.087]}
        scale={2.166}
      >
        <mesh
          name="BézierCurve006"
          geometry={nodes.BézierCurve006.geometry}
          material={materials["hanging pot leaves"]}
        />
        <mesh
          name="BézierCurve006_1"
          geometry={nodes.BézierCurve006_1.geometry}
          material={materials.flowers}
        />
      </group>
      <group
        name="Cat_Poster"
        position={[0.886, 5.89, 3.307]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.544, 0.216, 0.714]}
      >
        <mesh
          name="Plane139"
          geometry={nodes.Plane139.geometry}
          material={materials.poster}
        />
        <mesh
          name="Plane139_1"
          geometry={nodes.Plane139_1.geometry}
          material={materials["Material.001"]}
        />
      </group>
      <group
        ref={plushie}
        name="Plushie_hover"
        position={[2.495, 7.17, 3.106]}
        // scale={[1, 0.925, 1]}
      >
        <mesh
          name="Plane057"
          geometry={nodes.Plane057.geometry}
          material={materials["Material.002"]}
        />
        <mesh
          name="Plane057_1"
          geometry={nodes.Plane057_1.geometry}
          material={materials["Material.003"]}
        />
        <mesh
          name="Plane057_2"
          geometry={nodes.Plane057_2.geometry}
          material={materials["black tip"]}
        />
      </group>
      <group
        ref={linkedin}
        onClick={() => handleSocialLinkClick(socialLinks.Linkedin)}
        name="LinkedIn__hover"
        position={[1.214, 7.183, 3.082]}
        rotation={[1.853, 0, Math.PI]}
        // scale={0.086}
      >
        <mesh
          name="linkedin-#161001"
          geometry={nodes["linkedin-#161001"].geometry}
          material={materials.microphone}
        />
        <mesh
          name="linkedin-#161001_1"
          geometry={nodes["linkedin-#161001_1"].geometry}
          material={materials["Material.028"]}
        />
      </group>
      <group
        ref={github}
        onClick={() => handleSocialLinkClick(socialLinks.Github)}
        name="GitHub_hover"
        position={[1.902, 7.194, 3.082]}
        rotation={[1.865, 0, Math.PI]}
        // scale={2.297}
      >
        <mesh
          name="Curve002"
          geometry={nodes.Curve002.geometry}
          material={materials["black tip.001"]}
        />
        <mesh
          name="Curve002_1"
          geometry={nodes.Curve002_1.geometry}
          material={materials["Material.028"]}
        />
      </group>
      <group
        name="Chair_Top_hover"
        position={[0.497, 3.746, 0.786]}
        rotation={[0, -1.571, 0]}
        scale={[0.711, 0.784, 0.711]}
      >
        <mesh
          name="Plane026"
          geometry={nodes.Plane026.geometry}
          material={materials["chair bottom"]}
        />
        <mesh
          name="Plane026_1"
          geometry={nodes.Plane026_1.geometry}
          material={materials.cupboard}
        />
      </group>
      <mesh
        name="Glass_Screen"
        geometry={nodes.Glass_Screen.geometry}
        material={materials.Material}
        position={[2.413, 4.671, 2.73]}
        scale={[0.801, 0.766, 0.267]}
      />
      <group
        name="Clock_hover"
        position={[3.489, 7.736, -0.491]}
        rotation={[1.085, 0, 0]}
        scale={[0.043, 0.024, 0.019]}
      >
        <mesh
          name="Plane069"
          geometry={nodes.Plane069.geometry}
          material={materials.DarkerWood}
        />
        <mesh
          name="Plane069_1"
          geometry={nodes.Plane069_1.geometry}
          material={materials.Roof}
        />
      </group>
      <mesh
        name="Screen"
        geometry={nodes.Screen.geometry}
        material={materials["desktop image"]}
        position={[0.006, 5.347, 0.026]}
      />
      <mesh
        ref={bottomFan1}
        name="Bottom_Fan1"
        geometry={nodes.Bottom_Fan1.geometry}
        material={materials["Material.022"]}
        position={[1.991, 5.105, 2.495]}
      />
      <mesh
        ref={bottomFan2}
        name="Bottom_Fan2"
        geometry={nodes.Bottom_Fan2.geometry}
        material={materials["Material.022"]}
        position={[2.325, 5.105, 2.495]}
      />
      <mesh
        ref={bottomFan3}
        name="Bottom_Fan3"
        geometry={nodes.Bottom_Fan3.geometry}
        material={materials["Material.022"]}
        position={[2.656, 5.105, 2.495]}
      />
      <mesh
        ref={sideFan1}
        name="Side_Fan1"
        geometry={nodes.Side_Fan1.geometry}
        material={materials["Material.023"]}
        position={[3.131, 5.017, 2.823]}
      />
      <mesh
        ref={sideFan2}
        name="Side_Fan2"
        geometry={nodes.Side_Fan2.geometry}
        material={materials["Material.023"]}
        position={[3.131, 5.348, 2.823]}
      />
      <mesh
        ref={sideFan3}
        name="Side_Fan3"
        geometry={nodes.Side_Fan3.geometry}
        material={materials["Material.023"]}
        position={[3.131, 5.681, 2.823]}
      />
      <group
        // ref={bulb6Ref}
        // onPointerEnter={() => handlePointerOver(bulb6Ref.current)}
        // onPointerLeave={() => handlePointerOut(bulb6Ref.current)}
        name="Bulb6_hover"
        position={[3.195, 7.256, 0.3]}
      >
        <mesh
          name="Cube013"
          geometry={nodes.Cube013.geometry}
          material={materials.bulb}
        />
        <mesh
          name="Cube013_1"
          geometry={nodes.Cube013_1.geometry}
          material={materials.DarkerWood}
        />
      </group>
      <group
        // ref={bulb5Ref}
        // onPointerEnter={() => handlePointerOver(bulb5Ref.current)}
        // onPointerLeave={() => handlePointerOut(bulb5Ref.current)}
        name="Bulb5_hover"
        position={[3.153, 7.039, -0.038]}
      >
        <mesh
          name="Cube015"
          geometry={nodes.Cube015.geometry}
          material={materials.bulb}
        />
        <mesh
          name="Cube015_1"
          geometry={nodes.Cube015_1.geometry}
          material={materials.DarkerWood}
        />
      </group>
      <group
        // ref={bulb4Ref}
        // onPointerEnter={() => handlePointerOver(bulb4Ref.current)}
        // onPointerLeave={() => handlePointerOut(bulb4Ref.current)}
        name="Bulb4_hover"
        position={[3.124, 6.856, -0.401]}
      >
        <mesh
          name="Cube017"
          geometry={nodes.Cube017.geometry}
          material={materials.bulb}
        />
        <mesh
          name="Cube017_1"
          geometry={nodes.Cube017_1.geometry}
          material={materials.DarkerWood}
        />
      </group>
      <group
        // ref={bulb3Ref}
        // onPointerEnter={() => handlePointerOver(bulb3Ref.current)}
        // onPointerLeave={() => handlePointerOut(bulb3Ref.current)}
        name="Bulb3_hover"
        position={[3.103, 6.741, -0.795]}
      >
        <mesh
          name="Cube022"
          geometry={nodes.Cube022.geometry}
          material={materials.bulb}
        />
        <mesh
          name="Cube022_1"
          geometry={nodes.Cube022_1.geometry}
          material={materials.DarkerWood}
        />
      </group>
      <group
        // ref={bulb2Ref}
        // onPointerEnter={() => handlePointerOver(bulb2Ref.current)}
        // onPointerLeave={() => handlePointerOut(bulb2Ref.current)}
        name="Bulb2_hover"
        position={[3.089, 6.734, -1.227]}
      >
        <mesh
          name="Cube025"
          geometry={nodes.Cube025.geometry}
          material={materials.bulb}
        />
        <mesh
          name="Cube025_1"
          geometry={nodes.Cube025_1.geometry}
          material={materials.DarkerWood}
        />
      </group>
      <group
        // ref={bulb1Ref}
        // onPointerEnter={() => handlePointerOver(bulb1Ref.current)}
        // onPointerLeave={() => handlePointerOut(bulb1Ref.current)}
        name="Bulb1_hover"
        position={[3.091, 6.836, -1.627]}
      >
        <mesh
          name="Cube027"
          geometry={nodes.Cube027.geometry}
          material={materials.bulb}
        />
        <mesh
          name="Cube027_1"
          geometry={nodes.Cube027_1.geometry}
          material={materials.DarkerWood}
        />
      </group>
      <group
        // ref={bulb11Ref}
        // onPointerEnter={() => handlePointerOver(bulb11Ref.current)}
        // onPointerLeave={() => handlePointerOut(bulb11Ref.current)}
        name="Bulb11_hover"
        position={[2.298, 6.944, 2.901]}
      >
        <mesh
          name="Cube029"
          geometry={nodes.Cube029.geometry}
          material={materials.bulb}
        />
        <mesh
          name="Cube029_1"
          geometry={nodes.Cube029_1.geometry}
          material={materials.DarkerWood}
        />
      </group>
      <group
        // ref={bulb10Ref}
        // onPointerEnter={() => handlePointerOver(bulb10Ref.current)}
        // onPointerLeave={() => handlePointerOut(bulb10Ref.current)}
        name="Bulb10_hover"
        position={[2.527, 6.953, 2.555]}
      >
        <mesh
          name="Cube031"
          geometry={nodes.Cube031.geometry}
          material={materials.bulb}
        />
        <mesh
          name="Cube031_1"
          geometry={nodes.Cube031_1.geometry}
          material={materials.DarkerWood}
        />
      </group>
      <group
        // ref={bulb9Ref}
        // onPointerEnter={() => handlePointerOver(bulb9Ref.current)}
        // onPointerLeave={() => handlePointerOut(bulb9Ref.current)}
        name="Bulb9_hover"
        position={[2.788, 7.043, 2.251]}
      >
        <mesh
          name="Cube033"
          geometry={nodes.Cube033.geometry}
          material={materials.bulb}
        />
        <mesh
          name="Cube033_1"
          geometry={nodes.Cube033_1.geometry}
          material={materials.DarkerWood}
        />
      </group>
      <group
        // ref={bulb8Ref}
        // onPointerEnter={() => handlePointerOver(bulb8Ref.current)}
        // onPointerLeave={() => handlePointerOut(bulb8Ref.current)}
        name="Bulb8_hover"
        position={[3.058, 7.202, 1.996]}
      >
        <mesh
          name="Cube035"
          geometry={nodes.Cube035.geometry}
          material={materials.bulb}
        />
        <mesh
          name="Cube035_1"
          geometry={nodes.Cube035_1.geometry}
          material={materials.DarkerWood}
        />
      </group>
      <group
        // ref={bulb7Ref}
        // onPointerEnter={() => handlePointerOver(bulb7Ref.current)}
        // onPointerLeave={() => handlePointerOut(bulb7Ref.current)}
        name="bulb7_hover"
        position={[3.324, 7.412, 1.777]}
      >
        <mesh
          name="Cube037"
          geometry={nodes.Cube037.geometry}
          material={materials.bulb}
        />
        <mesh
          name="Cube037_1"
          geometry={nodes.Cube037_1.geometry}
          material={materials.DarkerWood}
        />
      </group>
      <mesh
        name="Rock3_hover"
        geometry={nodes.Rock3_hover.geometry}
        material={materials["Material.012"]}
        position={[-1.138, 0.799, -4.025]}
      />
      <mesh
        name="Rock2_hover"
        geometry={nodes.Rock2_hover.geometry}
        material={materials["Material.014"]}
        position={[1.647, 0.629, -4.265]}
      />
      <mesh
        name="Rock4_hover"
        geometry={nodes.Rock4_hover.geometry}
        material={materials["Material.013"]}
        position={[-4.096, 0.634, -1.696]}
      />
      <mesh
        name="Rock1_hover"
        geometry={nodes.Rock1_hover.geometry}
        material={materials["Material.016"]}
        position={[5.294, 0.429, -2.762]}
      />
      <mesh
        name="Rock7_hover"
        geometry={nodes.Rock7_hover.geometry}
        material={materials["Material.016"]}
        position={[-2.973, 0.324, 4.917]}
      />
      <mesh
        name="Rock6_hover"
        geometry={nodes.Rock6_hover.geometry}
        material={materials["Material.015"]}
        position={[-4.345, 0.699, 1.051]}
      />
      <mesh
        name="Rock5_hover"
        geometry={nodes.Rock5_hover.geometry}
        material={materials["Material.011"]}
        position={[-5.121, 0.484, -1.678]}
      />
      <mesh
        name="Plant1_hover"
        geometry={nodes.Plant1_hover.geometry}
        material={materials.leaves}
        position={[3.15, 1.255, -3.852]}
      />
      <mesh
        name="Plant3_hover"
        geometry={nodes.Plant3_hover.geometry}
        material={materials.leaves}
        position={[2.676, 0.981, -3.766]}
      />
      <mesh
        name="Plant2_hover"
        geometry={nodes.Plant2_hover.geometry}
        material={materials.leaves}
        position={[3.222, 0.804, -4.265]}
      />
      <mesh
        name="Plant4_hover"
        geometry={nodes.Plant4_hover.geometry}
        material={materials.leaves}
        position={[0.637, 1.136, -3.514]}
      />
      <mesh
        name="Plant5_hover"
        geometry={nodes.Plant5_hover.geometry}
        material={materials.leaves}
        position={[0.324, 0.956, -3.95]}
      />
      <mesh
        name="Plant6_hover"
        geometry={nodes.Plant6_hover.geometry}
        material={materials.leaves}
        position={[-3.31, 0.87, -3.566]}
      />
      <mesh
        name="Plant7_hover"
        geometry={nodes.Plant7_hover.geometry}
        material={materials.leaves}
        position={[-3.601, 1.134, -3.319]}
      />
      <mesh
        name="Plant8_hover"
        geometry={nodes.Plant8_hover.geometry}
        material={materials.leaves}
        position={[-3.73, 0.827, -3.031]}
      />
      <mesh
        name="Plant9_hover"
        geometry={nodes.Plant9_hover.geometry}
        material={materials.leaves}
        position={[-4.365, 0.938, 0.229]}
      />
      <mesh
        name="Plant10_hover"
        geometry={nodes.Plant10_hover.geometry}
        material={materials.leaves}
        position={[-3.894, 0.828, 1.745]}
      />
      <mesh
        name="Plant11_hover"
        geometry={nodes.Plant11_hover.geometry}
        material={materials.leaves}
        position={[-4.002, 1.078, 2.076]}
      />
      <mesh
        name="Plant12_hover"
        geometry={nodes.Plant12_hover.geometry}
        material={materials.leaves}
        position={[-3.916, 0.828, 2.743]}
      />
      <group name="flower_basket_hover" position={[2.377, 4.173, -2.064]}>
        <mesh
          name="Cube572"
          geometry={nodes.Cube572.geometry}
          material={materials["Material.028"]}
        />
        <mesh
          name="Cube572_1"
          geometry={nodes.Cube572_1.geometry}
          material={materials["flower basket"]}
        />
      </group>
      <group name="Cactus_hover" position={[3.258, 6.164, -1.605]}>
        <mesh
          name="Cube400"
          geometry={nodes.Cube400.geometry}
          material={materials["Material.028"]}
        />
        <mesh
          name="Cube400_1"
          geometry={nodes.Cube400_1.geometry}
          material={materials.leaves}
        />
      </group>
      <group name="egg_basket2_hover" position={[3.231, 7.646, 1.963]}>
        <mesh
          name="Cube413"
          geometry={nodes.Cube413.geometry}
          material={materials["posty notes"]}
        />
        <mesh
          name="Cube413_1"
          geometry={nodes.Cube413_1.geometry}
          material={materials["Material.028"]}
        />
        <mesh
          name="Cube413_2"
          geometry={nodes.Cube413_2.geometry}
          material={materials.cupboard}
        />
        <mesh
          name="Cube413_3"
          geometry={nodes.Cube413_3.geometry}
          material={materials.flowers}
        />
      </group>
      <group name="egg_basket1_hover" position={[3.231, 7.602, 0.999]}>
        <mesh
          name="Cube417"
          geometry={nodes.Cube417.geometry}
          material={materials["posty notes"]}
        />
        <mesh
          name="Cube417_1"
          geometry={nodes.Cube417_1.geometry}
          material={materials["Material.028"]}
        />
        <mesh
          name="Cube417_2"
          geometry={nodes.Cube417_2.geometry}
          material={materials.cupboard}
        />
        <mesh
          name="Cube417_3"
          geometry={nodes.Cube417_3.geometry}
          material={materials.flowers}
        />
      </group>
      <mesh
        name="flowerpurple_hover"
        geometry={nodes.flowerpurple_hover.geometry}
        material={materials.cupboard}
        position={[3.091, 5.379, -2.72]}
      />
      <group name="Storage_box3_hover" position={[2.598, 2.329, -0.396]}>
        <mesh
          name="Cube432"
          geometry={nodes.Cube432.geometry}
          material={materials["Material.028"]}
        />
        <mesh
          name="Cube432_1"
          geometry={nodes.Cube432_1.geometry}
          material={materials["box cover"]}
        />
        <mesh
          name="Cube432_2"
          geometry={nodes.Cube432_2.geometry}
          material={materials["box label"]}
        />
      </group>
      <group name="Storage_box2_hover" position={[2.36, 2.936, -0.415]}>
        <mesh
          name="Cube435"
          geometry={nodes.Cube435.geometry}
          material={materials["Material.028"]}
        />
        <mesh
          name="Cube435_1"
          geometry={nodes.Cube435_1.geometry}
          material={materials["box cover"]}
        />
        <mesh
          name="Cube435_2"
          geometry={nodes.Cube435_2.geometry}
          material={materials["box label"]}
        />
      </group>
      <group name="Storage_box1_hover" position={[2.277, 3.345, -0.509]}>
        <mesh
          name="Cube438"
          geometry={nodes.Cube438.geometry}
          material={materials["Material.028"]}
        />
        <mesh
          name="Cube438_1"
          geometry={nodes.Cube438_1.geometry}
          material={materials["box cover"]}
        />
        <mesh
          name="Cube438_2"
          geometry={nodes.Cube438_2.geometry}
          material={materials["box label"]}
        />
      </group>
      <mesh
        name="Slipper1_hover"
        geometry={nodes.Slipper1_hover.geometry}
        material={materials["lamp head"]}
        position={[2.147, 2.15, 0.857]}
      />
      <mesh
        name="Slipper2_hover"
        geometry={nodes.Slipper2_hover.geometry}
        material={materials["lamp head"]}
        position={[2.656, 2.15, 1.653]}
      />
      <group name="Lamp_hover" position={[0.488, 2.022, 2.701]}>
        <mesh
          name="Cube430"
          geometry={nodes.Cube430.geometry}
          material={materials["lamp head"]}
        />
        <mesh
          name="Cube430_1"
          geometry={nodes.Cube430_1.geometry}
          material={materials["Material.028"]}
        />
      </group>
      <group name="Headphones_hover" position={[1.921, 4.7, -1.173]}>
        <mesh
          name="Cube619"
          geometry={nodes.Cube619.geometry}
          material={materials.Roof}
        />
        <mesh
          name="Cube619_1"
          geometry={nodes.Cube619_1.geometry}
          material={materials.microphone}
        />
        <mesh
          name="Cube619_2"
          geometry={nodes.Cube619_2.geometry}
          material={materials["Floor Plankj"]}
        />
        <mesh
          name="Cube619_3"
          geometry={nodes.Cube619_3.geometry}
          material={materials["headphone ears"]}
        />
        <mesh
          name="Cube619_4"
          geometry={nodes.Cube619_4.geometry}
          material={materials.muffs}
        />
      </group>
      <group name="Calendar_hover" position={[2.287, 4.7, -0.586]}>
        <mesh
          name="Cube611"
          geometry={nodes.Cube611.geometry}
          material={materials.pages}
        />
        <mesh
          name="Cube611_1"
          geometry={nodes.Cube611_1.geometry}
          material={materials["Book cover"]}
        />
      </group>
      <group name="Speaker1_hover" position={[2.91, 5.152, -0.279]}>
        <mesh
          name="Cube617"
          geometry={nodes.Cube617.geometry}
          material={materials["keyboard keys"]}
        />
        <mesh
          name="Cube617_1"
          geometry={nodes.Cube617_1.geometry}
          material={materials.speaker}
        />
      </group>
      <group name="Speaker2_hover" position={[2.91, 5.152, 1.735]}>
        <mesh
          name="Cube618"
          geometry={nodes.Cube618.geometry}
          material={materials["keyboard keys"]}
        />
        <mesh
          name="Cube618_1"
          geometry={nodes.Cube618_1.geometry}
          material={materials.speaker}
        />
      </group>
      <group name="Big_rabbit_hover" position={[2.761, 5.152, 1.408]}>
        <mesh
          name="Cube643"
          geometry={nodes.Cube643.geometry}
          material={materials["black tip"]}
        />
        <mesh
          name="Cube643_1"
          geometry={nodes.Cube643_1.geometry}
          material={materials["Material.002"]}
        />
        <mesh
          name="Cube643_2"
          geometry={nodes.Cube643_2.geometry}
          material={materials["Material.024"]}
        />
      </group>
      <group name="Small_Rabbit_hover" position={[2.812, 5.152, 1.19]}>
        <mesh
          name="Cube651"
          geometry={nodes.Cube651.geometry}
          material={materials["black tip"]}
        />
        <mesh
          name="Cube651_1"
          geometry={nodes.Cube651_1.geometry}
          material={materials["Material.002"]}
        />
        <mesh
          name="Cube651_2"
          geometry={nodes.Cube651_2.geometry}
          material={materials["Material.025"]}
        />
      </group>
      <group name="Mouse_hover" position={[1.689, 4.7, 2.002]}>
        <mesh
          name="Cube642"
          geometry={nodes.Cube642.geometry}
          material={materials.keyboard}
        />
        <mesh
          name="Cube642_1"
          geometry={nodes.Cube642_1.geometry}
          material={materials.keycaps}
        />
      </group>
      <group name="Keyboard_hover" position={[1.68, 4.735, 0.709]}>
        <mesh
          name="Cube608"
          geometry={nodes.Cube608.geometry}
          material={materials.cupboard}
        />
        <mesh
          name="Cube608_1"
          geometry={nodes.Cube608_1.geometry}
          material={materials.keycaps}
        />
        <mesh
          name="Cube608_2"
          geometry={nodes.Cube608_2.geometry}
          material={materials.backsapce}
        />
      </group>
      <group name="Microphone_hover" position={[-2.98, 4.564, 2.962]}>
        <mesh
          name="Cube518"
          geometry={nodes.Cube518.geometry}
          material={materials["keyboard keys"]}
        />
        <mesh
          name="Cube518_1"
          geometry={nodes.Cube518_1.geometry}
          material={materials.microphone}
        />
      </group>
      <mesh
        name="White_key1_hover"
        geometry={nodes.White_key1_hover.geometry}
        material={materials["Material.017"]}
        position={[0.052, 4.4, 2.837]}
      />
      <mesh
        name="White_key2_hover"
        geometry={nodes.White_key2_hover.geometry}
        material={materials["Material.017"]}
        position={[-0.16, 4.4, 2.837]}
      />
      <mesh
        name="White_key3_hover"
        geometry={nodes.White_key3_hover.geometry}
        material={materials["Material.017"]}
        position={[-0.372, 4.4, 2.837]}
      />
      <mesh
        name="White_key4_hover"
        geometry={nodes.White_key4_hover.geometry}
        material={materials["Material.017"]}
        position={[-0.584, 4.4, 2.837]}
      />
      <mesh
        name="White_key5_hover"
        geometry={nodes.White_key5_hover.geometry}
        material={materials["Material.017"]}
        position={[-0.796, 4.4, 2.837]}
      />
      <mesh
        name="White_key6_hover"
        geometry={nodes.White_key6_hover.geometry}
        material={materials["Material.017"]}
        position={[-1.008, 4.4, 2.837]}
      />
      <mesh
        name="White_key7_hover"
        geometry={nodes.White_key7_hover.geometry}
        material={materials["Material.017"]}
        position={[-1.22, 4.4, 2.837]}
      />
      <mesh
        name="White_key8_hover"
        geometry={nodes.White_key8_hover.geometry}
        material={materials["Material.017"]}
        position={[-1.433, 4.4, 2.837]}
      />
      <mesh
        name="White_key9_hover"
        geometry={nodes.White_key9_hover.geometry}
        material={materials["Material.017"]}
        position={[-1.645, 4.4, 2.837]}
      />
      <mesh
        name="White_key10_hover"
        geometry={nodes.White_key10_hover.geometry}
        material={materials["Material.017"]}
        position={[-1.857, 4.4, 2.837]}
      />
      <mesh
        name="White_key11_hover"
        geometry={nodes.White_key11_hover.geometry}
        material={materials["Material.017"]}
        position={[-2.069, 4.4, 2.837]}
      />
      <mesh
        name="White_key12_hover"
        geometry={nodes.White_key12_hover.geometry}
        material={materials["Material.017"]}
        position={[-2.281, 4.4, 2.837]}
      />
      <mesh
        name="White_key13_hover"
        geometry={nodes.White_key13_hover.geometry}
        material={materials["Material.017"]}
        position={[-2.493, 4.4, 2.837]}
      />
      <mesh
        name="White_key14_hover"
        geometry={nodes.White_key14_hover.geometry}
        material={materials["Material.017"]}
        position={[-2.705, 4.4, 2.837]}
      />
      <mesh
        name="Black_key1_hover"
        geometry={nodes.Black_key1_hover.geometry}
        material={materials["keyboard keys"]}
        position={[-0.045, 4.462, 2.833]}
      />
      <mesh
        name="Black_key2_hover"
        geometry={nodes.Black_key2_hover.geometry}
        material={materials["keyboard keys"]}
        position={[-0.259, 4.462, 2.833]}
      />
      <mesh
        name="Black_key6_hover"
        geometry={nodes.Black_key6_hover.geometry}
        material={materials["keyboard keys"]}
        position={[-1.536, 4.462, 2.833]}
      />
      <mesh
        name="Black_key7_hover"
        geometry={nodes.Black_key7_hover.geometry}
        material={materials["keyboard keys"]}
        position={[-1.75, 4.462, 2.833]}
      />
      <mesh
        name="Black_key3_hover"
        geometry={nodes.Black_key3_hover.geometry}
        material={materials["keyboard keys"]}
        position={[-0.69, 4.458, 2.833]}
      />
      <mesh
        name="Black_key4_hover"
        geometry={nodes.Black_key4_hover.geometry}
        material={materials["keyboard keys"]}
        position={[-0.905, 4.458, 2.833]}
      />
      <mesh
        name="Black_key5_hover"
        geometry={nodes.Black_key5_hover.geometry}
        material={materials["keyboard keys"]}
        position={[-1.117, 4.458, 2.833]}
      />
      <mesh
        name="Black_key8_hover"
        geometry={nodes.Black_key8_hover.geometry}
        material={materials["keyboard keys"]}
        position={[-2.176, 4.458, 2.833]}
      />
      <mesh
        name="Black_key9_hover"
        geometry={nodes.Black_key9_hover.geometry}
        material={materials["keyboard keys"]}
        position={[-2.39, 4.458, 2.833]}
      />
      <mesh
        name="Black_key10_hover"
        geometry={nodes.Black_key10_hover.geometry}
        material={materials["keyboard keys"]}
        position={[-2.602, 4.458, 2.833]}
      />
      <mesh
        name="Zawadi_sign_hover"
        geometry={nodes.Zawadi_sign_hover.geometry}
        material={materials["Material.028"]}
        position={[-1.299, 5.236, 3.364]}
      />
      <group name="Book1_hover" position={[3.26, 7.103, -2.514]}>
        <mesh
          name="Cube291"
          geometry={nodes.Cube291.geometry}
          material={materials["book vover blue"]}
        />
        <mesh
          name="Cube291_1"
          geometry={nodes.Cube291_1.geometry}
          material={materials.pages}
        />
      </group>
      <group name="Book3_hover" position={[2.931, 4.282, -2.605]}>
        <mesh
          name="Cube545"
          geometry={nodes.Cube545.geometry}
          material={materials.pages}
        />
        <mesh
          name="Cube545_1"
          geometry={nodes.Cube545_1.geometry}
          material={materials["Book cover"]}
        />
      </group>
      <group name="Book2_hover" position={[2.87, 4.473, -2.613]}>
        <mesh
          name="Cube548"
          geometry={nodes.Cube548.geometry}
          material={materials["book vover blue"]}
        />
        <mesh
          name="Cube548_1"
          geometry={nodes.Cube548_1.geometry}
          material={materials.pages}
        />
      </group>
      <group name="Book4_hover" position={[2.965, 4.814, 0.236]}>
        <mesh
          name="Cube639"
          geometry={nodes.Cube639.geometry}
          material={materials.pages}
        />
        <mesh
          name="Cube639_1"
          geometry={nodes.Cube639_1.geometry}
          material={materials["book cover green"]}
        />
      </group>
      <group name="Book5_hover" position={[3.023, 4.825, 1.24]}>
        <mesh
          name="Cube637"
          geometry={nodes.Cube637.geometry}
          material={materials.pages}
        />
        <mesh
          name="Cube637_1"
          geometry={nodes.Cube637_1.geometry}
          material={materials["Book cover"]}
        />
      </group>
      <group name="Organizer_hover" position={[2.879, 4.556, -2.63]}>
        <mesh
          name="Cube538"
          geometry={nodes.Cube538.geometry}
          material={materials["Material.028"]}
        />
        <mesh
          name="Cube538_1"
          geometry={nodes.Cube538_1.geometry}
          material={materials["black tip"]}
        />
        <mesh
          name="Cube538_2"
          geometry={nodes.Cube538_2.geometry}
          material={materials["Floor Plankj"]}
        />
      </group>
      <mesh
        name="Drawer1_hover"
        geometry={nodes.Drawer1_hover.geometry}
        material={materials.drawers}
        position={[2.511, 3.667, -2.236]}
      />
      <mesh
        name="Drawer2_hover"
        geometry={nodes.Drawer2_hover.geometry}
        material={materials.drawers}
        position={[2.511, 3.045, -2.236]}
      />
      <mesh
        name="Drawer3_hover"
        geometry={nodes.Drawer3_hover.geometry}
        material={materials.drawers}
        position={[2.511, 2.423, -2.236]}
      />
      <group name="Pizza2_hover" position={[-2.55, 2.822, 1.089]}>
        <mesh
          name="Cube447"
          geometry={nodes.Cube447.geometry}
          material={materials.cheese}
        />
        <mesh
          name="Cube447_1"
          geometry={nodes.Cube447_1.geometry}
          material={materials.crust}
        />
        <mesh
          name="Cube447_2"
          geometry={nodes.Cube447_2.geometry}
          material={materials.pepperoni}
        />
        <mesh
          name="Cube447_3"
          geometry={nodes.Cube447_3.geometry}
          material={materials["onion ring"]}
        />
        <mesh
          name="Cube447_4"
          geometry={nodes.Cube447_4.geometry}
          material={materials.cactus}
        />
      </group>
      <group name="Pizza1_hover" position={[-2.057, 2.871, 1.206]}>
        <mesh
          name="Cube465"
          geometry={nodes.Cube465.geometry}
          material={materials.cheese}
        />
        <mesh
          name="Cube465_1"
          geometry={nodes.Cube465_1.geometry}
          material={materials.crust}
        />
        <mesh
          name="Cube465_2"
          geometry={nodes.Cube465_2.geometry}
          material={materials.pepperoni}
        />
        <mesh
          name="Cube465_3"
          geometry={nodes.Cube465_3.geometry}
          material={materials["onion ring"]}
        />
        <mesh
          name="Cube465_4"
          geometry={nodes.Cube465_4.geometry}
          material={materials.cactus}
        />
      </group>
      <group name="Cup_hover" position={[1.423, 4.7, -0.685]}>
        <mesh
          name="Cube636"
          geometry={nodes.Cube636.geometry}
          material={materials.microphone}
        />
        <mesh
          name="Cube636_1"
          geometry={nodes.Cube636_1.geometry}
          material={materials["Material.027"]}
        />
      </group>
      <group name="Can_hover" position={[-2.265, 2.762, 0.532]}>
        <mesh
          name="Cube481"
          geometry={nodes.Cube481.geometry}
          material={materials.can}
        />
        <mesh
          name="Cube481_1"
          geometry={nodes.Cube481_1.geometry}
          material={materials["Material.004"]}
        />
        <mesh
          name="Cube481_2"
          geometry={nodes.Cube481_2.geometry}
          material={materials["can opener"]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/RoomPortfolioPlain9v2-v3.glb");
