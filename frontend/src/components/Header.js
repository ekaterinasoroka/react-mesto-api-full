import logo from '../images/logo.svg';
import { Route, Link } from 'react-router-dom';

function Header({ email, onLogout }) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип" />
      <div className="header__info">
        <Route
          exact path="/"
        >
          <p className="header__link">{email}</p>
          <a onClick={onLogout} className="header__link">Выйти</a>
        </Route>

        <Route
          path="/signin"
        >
          <Link to="/signup" className="header__link">Зарегистрироваться</Link>
        </Route>
        <Route
          path="/signup"
        ><Link to='/signin' className="header__link">Войти</Link></Route>
      </div>

    </header>
  );
}

export default Header;
