import { Link, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();

  return (
    <ul className="navbar">
      <li className="navbar-item">
        <Link to="/all-games">All Games</Link>
      </li>
      <li className="navbar-item">
        <Link to="/my-games">My Games</Link>
      </li>
      <li className="navbar-item">
        <Link to="/create-game">Create Game</Link>
      </li>
      <li className="navbar-item">
        <Link to="/profile">Profile</Link>
      </li>
      {localStorage.getItem("ttrpg_user") ? (
        <li className="navbar-item navbar-logout">
          <Link
            className="navbar-link"
            to=""
            onClick={() => {
              localStorage.removeItem("ttrpg_user");
              navigate("/", { replace: true });
            }}
          >
            Logout
          </Link>
        </li>
      ) : (
        ""
      )}
    </ul>
  );
};
