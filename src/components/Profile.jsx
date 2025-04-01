import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getGames } from "../services/GameService";
import { getUserById } from "../services/userService";

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
        const userGames = allGames.filter((game) => {
          const isOrganizer = game.organizer_id === fetchedUser.id;
          const isParticipant =
            game.participants.filter((p) => p.user_id === fetchedUser.id)
              .length > 0;
          return isOrganizer || isParticipant;
        });
        setGames(userGames);
      });
    });
  }, [userId]);
  // Depend on userId so the data re-fetches when the URL changes

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile">
      <h2 className="text-center">{user.username}</h2>
      {user.profile_pic && (
        <div className="profile-pic">
          <img
            src={user.profile_pic}
            alt={`${user.username}'s profile`}
            width={150}
            height={150}
            style={{ borderRadius: "50%" }}
          />
        </div>
      )}
      <h3>Current Games:</h3>
      {games.length > 0 ? (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              {game.group_name} – {game.date} ({game.start_time} to{" "}
              {game.end_time})
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
