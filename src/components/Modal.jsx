export const ModalWrapper = () => {
  return (
    <div>
      <div className="work modal">
        <h1 className="modal-title">WORK</h1>
        <button className="modal-exit-button">EXIT</button>
      </div>
      <div className="about modal">
        <h1 className="modal-title">ABOUT</h1>
        <button className="modal-exit-button">EXIT</button>
      </div>
      <div className="contact modal">
        <h1 className="modal-title">CONTACT</h1>
        <button className="modal-exit-button">EXIT</button>
      </div>
    </div>
  );
};
