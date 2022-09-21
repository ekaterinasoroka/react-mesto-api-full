import { useEffect, useRef } from 'react';

import PopupWithForm from './PopupWithForm.js';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const currentUser = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: currentUser.current.value,
    });
  }

  useEffect(() => {
    currentUser.current.value = '';
  }, [isOpen])

  return (
    <PopupWithForm
      name="avatar"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="form__input-container">
        <input
          className="form__input"
          name="link"
          type="url"
          id="form__input_link-avatar"
          placeholder="Ссылка на картинку"
          required
          ref={currentUser}
        />
        <span id="form__input_link-avatar-error"></span>
      </div>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;