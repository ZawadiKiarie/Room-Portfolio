import { Howl } from "howler";
import { useEffect, useRef, useState } from "react";

export const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const bgmRef = useRef();

  useEffect(() => {
    bgmRef.current = new Howl({
      src: ["music/bgmusic.mp3"],
      loop: true,
      volume: 0.4,
    });
  }, []);

  const onToggle = () => {
    const sound = bgmRef.current;
    if (!sound) return;
    if (isPlaying) {
      sound.pause();
    } else {
      sound.play();
    }
    setIsPlaying((prev) => !prev);
  };
  return (
    <div
      className={`toggle-container music ${isPlaying ? "" : "is-paused"}`}
      onClick={onToggle}
    >
      <div className="wrapper">
        <div className="bar bar1"></div>
        <div className="bar bar2"></div>
        <div className="bar bar3"></div>
        <div className="bar bar4"></div>
        <div className="bar bar5"></div>
        <div className="bar bar6"></div>
        <div className="bar bar7"></div>
      </div>
    </div>
  );
};
