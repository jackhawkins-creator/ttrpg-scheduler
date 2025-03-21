import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById, getGames } from "../services/GameService";

export const Profile = () => {
  const { userId } = useParams(); // Get the userId from the URL
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("ttrpg_user"));

  useEffect(() => {
    // Fetch the user details based on the userId
    getUserById(userId).then((fetchedUser) => {
      setUser(fetchedUser);

      // Fetch all games and filter ones the user is involved in
      getGames().then((allGames) => {
        const userGames = allGames.filter(
          (game) =>
            game.organizer_id === fetchedUser.id ||
            game.participants?.some((p) => p.user_id === fetchedUser.id)
        );
        setGames(userGames);
      });
    });
  }, [userId]); // Depend on userId so the data re-fetches when the URL changes

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile">
      <h2>{user.username}</h2>
      <h3>Your Games:</h3>
      {games.length > 0 ? (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              {game.group_name} – {game.date} ({game.start_time} to {game.end_time})
            </li>
          ))}
        </ul>
      ) : (
        <p>You are not currently in any games.</p>
      )}

      {/* Only show the "Edit Profile" button if the logged-in user is viewing their own profile */}
      {currentUser && currentUser.id === user.id && (
        <Link to="/edit-profile">
          <button>Edit Profile</button>
        </Link>
      )}
    </div>
  );
};
