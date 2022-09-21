import ImgOk from '../images/img_ok.svg';
import ImgErr from '../images/img_err.png';

function InfoTooltip(props) {
  return (
    <div
      className={`popup popup_${props.name} ${props.isOpen && 'popup_is-active'} `}
    >
      <div className="popup__info-container">
        <button className="popup__close" type="button" onClick={props.onClose}></button>
        <img className="popup__info-img" src={props.auth ? `${ImgOk}` : `${ImgErr}`} alt="результат регистрации" />
        <p className="popup__info-text">
          {props.auth ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте ещё раз."}
        </p>
      </div>
    </div>
  )
}

export default InfoTooltip;