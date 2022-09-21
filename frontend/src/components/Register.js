import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register({ onRegister }) {

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    onRegister(registerData)
  }

  return (
    <div className="identification">
      <p className="identification__welcome">
        Регистрация
      </p>
      <form onSubmit={handleSubmit} className="identification__form">
        <input className="identification__input"
          name="email"
          type="email"
          value={registerData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input className="identification__input"
          name="password"
          type="password"
          value={registerData.password}
          onChange={handleChange}
          placeholder="Пароль"
        />
        <button type="submit" className="identification__subButton">Зарегистрироваться</button>
      </form>
      <div className="identification__sign">
        <p>Уже зарегистрированы?</p>
        <Link to="/signin" className="identification__login-link">Войти</Link>
      </div>
    </div>
  )
}

export default Register;