import { useAtom, useSetAtom } from "jotai";
import { openModalAtom, workAtom } from "../utilities/utilities";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { config } from "../config";

export const WorkModal = () => {
  const workModal = useRef();
  const setWorkModal = useSetAtom(workAtom);
  const [openModal, setOpenModal] = useAtom(openModalAtom);
  const isOpen = openModal === "work";

  useEffect(() => {
    setWorkModal(workModal.current);

    const el = workModal.current;
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
  }, [setWorkModal, isOpen]);
  return (
    <>
      <div ref={workModal} className="modal work" style={{ display: "none" }}>
        <div className="modal-header">
          <h1 className="modal-title">MY WORK</h1>
          <button
            onClick={() => setOpenModal(null)}
            className="modal-exit-button"
          >
            EXIT
          </button>
        </div>
        <div className="modal-content-container">
          <div className="modal-content">
            {config.work.map((project, idx) => (
              <article key={idx} className="project-card">
                <img
                  className="project-image"
                  src={project.image}
                  alt={project.name}
                />
                <div className="project-body">
                  <h2 className="project-title">{project.title}</h2>
                  <div className="project-tech">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="project-description">{project.description}</p>

                  <div className="project-actions">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="btn ghost"
                      >
                        GitHub
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="btn solid"
                      >
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
