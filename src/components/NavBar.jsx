import { Link, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();
  
  // Get the current user's data from localStorage
  const currentUser = JSON.parse(localStorage.getItem("ttrpg_user"));

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
      {/* Profile link: if the user is logged in, navigate to their profile */}
      {currentUser ? (
        <li className="navbar-item">
          <Link to={`/profile/${currentUser.id}`}>Profile</Link>
        </li>
      ) : (
        <li className="navbar-item">
          <Link to="/login">Login</Link>
        </li>
      )}
      {currentUser && (
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
      )}
    </ul>
  );
};
