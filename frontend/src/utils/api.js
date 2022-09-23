 class Api {
  constructor(url) {
    this._url = url;
    this._headers = {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Credentials": true,
    }
  }

  _checkingTheResponse(res) {
    if(res.ok) {
      return res.json();
    }
    return Promise.reject(`'Ошибка': ${res.status}`);
  }

  getInfoUsers() {
    return fetch(`${this._url}/users/me`, {
      credentials: 'include',
      headers: this._headers
    })
      .then(this._checkingTheResponse);
  }

  getCards() {
    return fetch(`${this._url}/cards`, {
      credentials: 'include',
      headers: this._headers
    })
      .then(this._checkingTheResponse);

  }

  patchEditProfile(item) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({name: item.name, about: item.about})
    })
    .then(this._checkingTheResponse);
  }

  addNewCard(item) {
    return fetch(`${this._url}/cards`, {
      headers: this._headers,
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({name: item.name, link: item.link})
    })
    .then(this._checkingTheResponse);
  }

  toggleLike(data, isLiked) {
    return fetch(`${this._url}/cards/${data}/likes`, {
      headers: this._headers,
      credentials: 'include',
      method: `${isLiked ? 'DELETE' : 'PUT'}`
    })
      .then(this._checkingTheResponse); 
  }

  updateAvatarUser(item) {
    return fetch(`${this._url}/users/me/avatar`, {
      headers: this._headers,
      credentials: 'include',
      method: 'PATCH',
      body: JSON.stringify({avatar: item.avatar})
    })
    .then(this._checkingTheResponse);
  }

  
  deleteCard(card) {
    return fetch(`${this._url}/cards/${card}`, {
      headers: this._headers,
      credentials: 'include',
      method: 'DELETE',
    })
    .then(this._checkingTheResponse);
  }
}

 const api = new Api('http://localhost:4000'); 

 export default api;