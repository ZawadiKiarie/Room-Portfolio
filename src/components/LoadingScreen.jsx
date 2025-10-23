import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { isLoadingScreenComplete } from "../utilities/utilities";

export const LoadingScreen = () => {
  const { active } = useProgress();
  const [isEntered, setIsEntered] = useState(false);
  const loadingScreen = useRef();
  const setIsLoadingScreenComplete = useSetAtom(isLoadingScreenComplete);

  const playReveal = () => {
    const tl = gsap.timeline();

    tl.to(loadingScreen.current, {
      scale: 0.5,
      duration: 1.2,
      delay: 0.25,
      ease: "back.in(1.8)",
    }).to(
      loadingScreen.current,
      {
        y: "200vh",
        transform: "perspective(1000px) rotateX(45deg) rotateY(-35deg)",
        duration: 1.2,
        ease: "back.in(1.8)",
        onComplete: () => {
          setIsLoadingScreenComplete(true);
          loadingScreen.current.remove();
        },
      },
      "-=0.1"
    );
  };

  useEffect(() => {
    if (isEntered) {
      playReveal();
    }
  }, [isEntered]);

  return (
    <div
      ref={loadingScreen}
      className={`loading-screen ${isEntered ? "entered-screen" : ""}`}
    >
      <button
        onClick={() => setIsEntered(true)}
        className={
          active
            ? "loading-screen-button"
            : isEntered
            ? "entered-screen-button"
            : "enter-screen-button"
        }
      >
        {active
          ? "loading..."
          : isEntered
          ? "ZAWADI KIARIE'S PORTFOLIO"
          : "Enter"}
      </button>
    </div>
  );
};
