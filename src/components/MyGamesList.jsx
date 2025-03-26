import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteGame,
  deleteGameParticipant,
  getGames,
} from "../services/GameService";

export const MyGamesList = ({ triggerGameListRefresh }) => {
  const [myGames, setMyGames] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("ttrpg_user"));
  const navigate = useNavigate();

  useEffect(() => {
    getGames().then((games) => {
      const filteredGames = games.filter(
        (game) =>
          game.organizer_id === currentUser.id ||
          game.participants.some((p) => p.user_id === currentUser.id)
      );
      setMyGames(filteredGames);
    });
  }, [triggerGameListRefresh]); // Depend on triggerGameListRefresh

  // Handle "Leave Game" button click
  const handleLeaveGame = async (gameId) => {
    try {
      await deleteGameParticipant(gameId, currentUser.id);
      setMyGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
    triggerGameListRefresh();
    } catch (error) {
      console.error("Error leaving game:", error);
      window.alert("An error occurred. Please try again.");
    }
  };

  // Handle "Delete Game" button click (organizer only)
  const handleDeleteGame = async (gameId) => {
    try {
      await deleteGame(gameId); // Call the delete function in the service
      setMyGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
      window.alert("Game deleted successfully.");
      triggerGameListRefresh();
    } catch (error) {
      console.error("Error deleting game:", error);
      window.alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="game-list">
      <h2 className="text-center">My Games</h2>
      {myGames.length > 0 ? (
        <ul>
          {myGames.map((game) => (
            <li key={game.id}>
              <button
                onClick={() => navigate(`/games/${game.id}`)}
                className="group-name"
              >
                {game.group_name}
              </button>
              <p>
                Scheduled: {game.date} from {game.start_time} to {game.end_time}
              </p>
              <p>Organizer: {game.organizerUsername}</p>
              <p>
                Players: {game.currentPlayers}/{game.max_players}
              </p>

              {/* Show "Leave Game" button if the current user is a participant, but not the organizer */}
              {game.organizer_id !== currentUser.id &&
                game.participants.filter((p) => p.user_id === currentUser.id)
                  .length > 0 && (
                  <button onClick={() => handleLeaveGame(game.id)}>
                    Leave Game
                  </button>
                )}

              {/* Show "Delete Game" button if the current user is the organizer */}
              {game.organizer_id === currentUser.id && (
                <button onClick={() => handleDeleteGame(game.id)}>
                  Delete Game
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>You are not currently in any games.</p>
      )}
    </div>
  );
};
