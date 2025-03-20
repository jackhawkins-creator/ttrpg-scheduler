import { useEffect, useState } from "react";
import { getGames, getUserById } from "../services/GameService";

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("ttrpg_user"));

    if (storedUser) {
      // Fetch the user details using the stored user ID
      getUserById(storedUser.id).then((fetchedUser) => {
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
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile">
      <h2>Welcome, {user.username}!</h2>
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
    </div>
  );
};
