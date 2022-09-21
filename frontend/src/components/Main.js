import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card.js';

function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards, onCardLike, onCardDelete }) {
	const currentUser = useContext(CurrentUserContext);
	return (
		<>
			<section className="profile">
				<a
					className="profile__avatar-container"
					href="##" alt="аватар"
					onClick={onEditAvatar}
				>
					<img
						className="profile__avatar"
						src={currentUser?.avatar}
						alt="аватар"
					/>
				</a>
				<div className="profile__info">
					<h1 className="profile__title" name="name">{currentUser?.name}</h1>
					<button
						className="profile__edit-button"
						type="button"
						onClick={onEditProfile}
					>
					</button>
					<p
						className="profile__subtitle"
						name="about">
						{currentUser?.about}
					</p>
				</div>
				<button className="profile__add-button" type="button" onClick={onAddPlace}></button>
			</section>

			<div className="elements">
				{cards.map((item) => {
					return (
						<Card
							key={item._id}
							card={item}
							onCardClick={onCardClick}
							onCardLike={onCardLike}
							onCardDelete={onCardDelete}
						/>
					)
				})}
			</div>
		</>
	)
}

export default Main;
