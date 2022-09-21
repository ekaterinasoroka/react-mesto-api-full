import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card(props) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = props.card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = (
    `element__delete ${isOwn ? 'element__delete_visible' : 'element__delete_hidden'}`
  );
  const isLiked = props.card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = `element__like ${isLiked ? 'element__like_is-active' : ''}`;
  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card)
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card)
  }

  return (
    <div className="element">
      <img
        className="element__img"
        alt={props.card.name}
        src={props.card.link}
        onClick={handleClick}
      />
      <button className={cardDeleteButtonClassName} type="button" onClick={handleDeleteClick}></button>
      <div className="element__rectangle">
        <h2 className="element__name">{props.card.name}</h2>
        <div className="element__group-like">
          <button className={cardLikeButtonClassName} type="button" onClick={handleLikeClick}></button>
          <p className="element__like-number">{props.card.likes.length}</p>
        </div>
      </div>
    </div>
  )
}

export default Card;