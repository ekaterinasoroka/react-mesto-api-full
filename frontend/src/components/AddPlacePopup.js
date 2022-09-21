import { useEffect, useRef } from "react";
import PopupWithForm from './PopupWithForm.js';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const cardNameRef = useRef();
  const cardLinkRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name: cardNameRef.current.value,
      link: cardLinkRef.current.value,
    });
  }

  useEffect(() => {
    cardNameRef.current.value = '';
    cardLinkRef.current.value = '';
  }, [isOpen]);

  return (
    <PopupWithForm
      name="add"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="form__input-container">
        <input
          className="form__input"
          name="cardname"
          type="text"
          id="form__input_cardname"
          placeholder="Название"
          required
          minLength="2"
          maxLength="30"
          ref={cardNameRef}
        />
        <span id="form__input_cardname-error"></span>
      </div>
      <div className="form__input-container">
        <input
          className="form__input"
          name="link"
          type="url"
          id="form__input_link"
          placeholder="Ссылка на картинку"
          required
          ref={cardLinkRef}
        />
        <span id="form__input_link-error"></span>
      </div>
    </PopupWithForm>
  )
}

export default AddPlacePopup;