import {useState, useEffect, useContext} from 'react';

import PopupWithForm from './PopupWithForm.js';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function EditProfilePopup({isOpen, onClose, onUpdateUser}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    setName(currentUser?.name);
    setDescription(currentUser?.about);
  }, [currentUser, isOpen]);

  function handleInputChangeName(e) {
    setName(e.target.value)
  }

  function handleInputChangeAbout(e) {
    setDescription(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }
  
  return (
    <PopupWithForm 
      name="edit" 
      title="Редактировать профиль"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="form__input-container">
        <input 
          className="form__input" 
          name="name" 
          type="text" 
          id="form__input_name" 
          placeholder="Имя" 
          required 
          minLength="2" 
          maxLength="40"
          value={name || ''}
          onChange={handleInputChangeName}
        />
        <span id="form__input_name-error"></span>
      </div>
      <div className="form__input-container">
        <input 
          className="form__input" 
          name="about" 
          type="text" 
          id="form__input_profession" 
          placeholder="Профессия" 
          required 
          minLength="2" 
          maxLength="200"
          value={description || ''}
          onChange={handleInputChangeAbout}
        />
        <span id="form__input_profession-error"></span>
      </div>
    </PopupWithForm>
  )
}

export default EditProfilePopup;