import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import * as THREE from "three";
import { ModalWrapper } from "./components/Modal";
import { WorkModal } from "./components/WorkModal";
import { AboutModal } from "./components/AboutModal";
import { ContactModal } from "./components/ContactModal";
import { useSetAtom } from "jotai";
import { openModalAtom } from "./utilities/utilities";
import { LoadingScreen } from "./components/LoadingScreen";
import { MusicToggle } from "./components/MusicToggle";
import { Leva } from "leva";

function App() {
  const setOpenModal = useSetAtom(openModalAtom);
  return (
    <>
      <LoadingScreen />
      <div className="experience">
        <Canvas
          onPointerMissed={() => {
            setOpenModal(null);
          }}
          className="exprience-canvas"
          shadows={{ type: THREE.PCFSoftShadowMap }}
        >
          <Experience />
        </Canvas>
      </div>
      <MusicToggle />
      <WorkModal />
      <AboutModal />
      <ContactModal />
    </>
  );
}

export default App;
