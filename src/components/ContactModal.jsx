import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { contactAtom, openModalAtom } from "../utilities/utilities";
import gsap from "gsap";
import { IoLogoLinkedin } from "react-icons/io";
import { IoLogoGithub } from "react-icons/io";
import { IoMail } from "react-icons/io5";
import emailjs from "@emailjs/browser";

export const ContactModal = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({
    ok: false,
    msg: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const contactModal = useRef();
  const setContactModal = useSetAtom(contactAtom);
  const [openModal, setOpenModal] = useAtom(openModalAtom);
  const isOpen = openModal === "contact";
  useEffect(() => {
    setContactModal(contactModal.current);

    const el = contactModal.current;
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
  }, [setContactModal, isOpen]);

  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return "Please enter a valid email.";
    if (!form.message.trim()) return "please enter a message";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({
      ok: false,
      msg: "",
    });

    const err = validate();
    if (err) {
      setStatus({ ok: false, msg: err });
      return;
    }

    try {
      setSubmitting(true);
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      const templateParams = {
        title: "Room Portfolio Message",
        from_name: form.name,
        reply_to: form.email,
        message: form.message,
      };

      const res = await emailjs.send(serviceId, templateId, templateParams, {
        publicKey,
      });
      if (res.status !== 200) throw new Error("EmailJS error");
      setStatus({ ok: true, msg: "Message sent!" });
      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      setStatus({ ok: false, msg: "Failed to send.Please try again" });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <div
        ref={contactModal}
        className="contact-modal contact"
        style={{ display: "none" }}
      >
        <div className="modal-header">
          <h1 className="modal-title">CONTACT</h1>
          <button
            onClick={() => setOpenModal(null)}
            className="modal-exit-button"
          >
            EXIT
          </button>
        </div>
        <div className="modal-content-container">
          <div className="contact-content">
            <div className="contact-links">
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
              <a
                href="mailto:zawadikiarie@gmail.com"
                target="blank"
                rel="noreferrer"
              >
                <IoMail className="contact-icons mail" />
              </a>
              <p className="contact-email">zawadikiarie@gmail.com</p>
            </div>

            {/* FORM */}
            <form className="contact-form" onSubmit={onSubmit} noValidate>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Your Message"
                  value={form.message}
                  onChange={onChange}
                  required
                />
              </div>
              {status.msg && (
                <div className={`form-status ${status.ok ? "ok" : "err"}`}>
                  {status.msg}
                </div>
              )}
              <button
                className="contact-btn solid"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Sending" : "Send message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
