import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { aboutAtom, openModalAtom } from "../utilities/utilities";
import gsap from "gsap";
import { IoLogoLinkedin } from "react-icons/io";
import { IoLogoGithub } from "react-icons/io";
import { config } from "../config";

export const AboutModal = () => {
  const aboutModal = useRef();
  const setAboutModal = useSetAtom(aboutAtom);
  const [openModal, setOpenModal] = useAtom(openModalAtom);
  const isOpen = openModal === "about";

  useEffect(() => {
    setAboutModal(aboutModal.current);
    const el = aboutModal.current;
    if (isOpen) {
      gsap.set(el, {
        display: "block",
        opacity: 0,
      });
      gsap.to(el, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(el, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => gsap.set(el, { display: "none" }),
      });
    }
  }, [setAboutModal, isOpen]);
  return (
    <>
      <div
        ref={aboutModal}
        className="about-modal about"
        style={{ display: "none" }}
      >
        <div className="exit">
          <button
            onClick={() => setOpenModal(null)}
            className="modal-exit-button"
          >
            EXIT
          </button>
        </div>
        <div className="about-modal-inner">
          <div className="about-modal-content">
            <h1 className="about-modal-title">HI, I'M ZAWADI</h1>
            <h2 className="about-modal-subtitle">Creative Developer </h2>
            <p className="about-description">{config.about.description}</p>
            <div className="tech-container">
              <div className="tech-row">
                <div className="about-tech-pill">CSS</div>
                <div className="about-tech-pill">HTML</div>
                <div className="about-tech-pill">JavaScript</div>
                <div className="about-tech-pill">Python</div>
              </div>
              <div className="tech-row">
                <div className="about-tech-pill">React</div>
                <div className="about-tech-pill">PostgreSQL</div>
                <div className="about-tech-pill">Firebase</div>
              </div>
              <div className="tech-row">
                <div className="about-tech-pill">Git</div>
                <div className="about-tech-pill">Github</div>
                <div className="about-tech-pill">Docker</div>
              </div>
              <div className="tech-row">
                <div className="about-tech-pill">Blender</div>
                <div className="about-tech-pill">Adobe Illustrator</div>
                <div className="about-tech-pill">Procreate</div>
              </div>
            </div>
            <div className="about-social-links">
              <a
                href="https://www.linkedin.com/in/zawadi-kiarie-03563714a/"
                target="blank"
                rel="noreferrer"
              >
                <IoLogoLinkedin className="contact-icons linkedin" />
              </a>
              <a
                href="https://github.com/ZawadiKiarie"
                target="blank"
                rel="noreferrer"
              >
                <IoLogoGithub className="contact-icons github" />
              </a>
            </div>
          </div>

          <img
            className="about-profile"
            src="images/profile2.png"
            alt="my picture"
          />
        </div>
      </div>
    </>
  );
};
