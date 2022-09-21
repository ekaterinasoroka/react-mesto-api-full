function PopupWithForm(props) {
  return (
    <div 
      className={`popup popup_${props.name} ${props.isOpen && 'popup_is-active'} `}
    >
      <div className="popup__container">
        <button className="popup__close" type="button" onClick={props.onClose}></button>
        <form className={`form form_popup_${props.name}`} onSubmit={props.onSubmit}>
          <h3 className="form__title" >{props.title}</h3>
          {props.children}
          <button className="form__save" type="submit"></button>
        </form>
      </div>
    </div>
  )
}

export default PopupWithForm;