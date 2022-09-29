import { useEffect, useState } from 'react';

import Footer from './Footer.js';
import api from '../utils/api.js';
import Main from './Main.js';
import Header from './Header.js';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.js';
import Login from './Login.js';
import Register from './Register.js';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/auth';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null);
  const [isSuccessTooltipStatus, setIsSuccessTooltipStatus] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [emailInfo, setEmailInfo] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if(!loggedIn) {
     api.getInfoUsers()
      .then((userInfo) => {
        setCurrentUser(userInfo);
        setLoggedIn(true);
      })
      .catch((err) => console.log(err))
    }
  }, [loggedIn]);

  useEffect(() => {
    if(!loggedIn) {
      api.getCards()
      .then((card) => {
        setCards(card);
        setLoggedIn(true);
      })
      .catch((err) => console.log(err))
    }
  }, [loggedIn]);

  function onLogout() {
    return auth.logout()
    .then(() => {
      setLoggedIn(false);
      history.push('/signin');
    })
    .catch((err) => console.log(err))
  };

  function onRegister(data) {
    return auth.register(data)
      .then(() => {
        if(data) {
          setIsInfoTooltipOpen(true);
          setIsSuccessTooltipStatus(true);
          history.push('/signin')         
        }
        else{
          setIsSuccessTooltipStatus(true);
        }
      })
      .catch(() => {
        setIsInfoTooltipOpen(true);
        setIsSuccessTooltipStatus(false);
      });
  }

  function onLogin(data) {
    return auth.authorize(data)
      .then(({token}) => {
        if ({token}) {
          setEmailInfo(data.email);
          setLoggedIn(true);
          history.push('/');
        }
        else {
          setIsInfoTooltipOpen(true);
          setIsSuccessTooltipStatus(true);
        }
      })
      .catch(() => {
        setIsInfoTooltipOpen(true);
        setIsSuccessTooltipStatus(false);
      });
  };

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser({ name, about }) {
    api.patchEditProfile({ name, about })
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((res) => {
        console.log(res)
      })
  }

  function handleUpdateAvatar({ avatar }) {
    api.updateAvatarUser({ avatar })
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((res) => {
        console.log(res)
      })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser?._id);
    api.toggleLike(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((d) => (d._id !== card._id)));
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(card) {
    api.addNewCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          email={emailInfo}
          onLogin={onLogin}
          onLogout={onLogout}
        />
        <Switch>
          <Route
            path="/signup"
          >
            <Register onRegister={onRegister} />
          </Route>
          <Route
            path="/signin"
          >
            <Login onLogin={onLogin} />
          </Route>
          <ProtectedRoute
            exact path='/'
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            setCards={setCards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            loggedIn={loggedIn}
            onLogout={onLogout}
          />
          <ProtectedRoute
            exact path='/'
            component={Footer}
            loggedIn={loggedIn}
            onLogout={onLogout}
          />
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route>
        </Switch>
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <PopupWithForm
          name="delete-card"
          title="Вы уверены?"
        />
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          auth={isSuccessTooltipStatus}
          name='info'
        />
        <Footer />
      </CurrentUserContext.Provider>
    </div>

  );
}

export default App;