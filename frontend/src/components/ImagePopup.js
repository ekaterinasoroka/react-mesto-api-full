function ImagePopup(props) {
  return(
    <div
      className={`popup popup_full-size ${props.card ? 'popup_is-active' : ''}`}>
        <div className="popup__container popup__container_view">
          <button className="popup__close popup__close_full-size" type="button" onClick={props.onClose}></button>
          <img className="popup__big-img" src={`${props.card ? props.card.link : ""}`} alt={`${props.card ? props.card.name : ""}`} />
          <p className="popup__subtitle">{`${props.card && props.card.name}`}</p>
        </div>
    </div>
  )
}

export default ImagePopup;