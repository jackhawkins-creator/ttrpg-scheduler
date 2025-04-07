import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getGames,
  postGameParticipant,
  deleteGameParticipant,
} from "../../services/GameService";
import { getUserById } from "../../services/userService";

export const GameDetails = ({ triggerGameListRefresh }) => {
  const { gameId } = useParams(); // Get the game ID from the URL
  const [game, setGame] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isUserParticipating, setIsUserParticipating] = useState(false);
  const [isGameFull, setIsGameFull] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("ttrpg_user"));

  // Fetch game details when the component mounts
  useEffect(() => {
    getGames().then((games) => {
      const selectedGame = games.find((game) => game.id === parseInt(gameId));
      setGame(selectedGame);

      // Get the organizer info (including profile pic)
      setOrganizer({
        username: selectedGame.organizerUsername,
        profilePic: selectedGame.organizerProfilePic,
      });

      // Get player info (excluding the organizer)
      const playerPromises = selectedGame.participants.map((participant) =>
        getUserById(participant.user_id)
      );
      Promise.all(playerPromises).then((fetchedPlayers) => {
        setPlayers(fetchedPlayers);
      });

      // Check if the current user is a participant
      const userIsParticipant =
        selectedGame.participants.filter(
          (participant) => participant.user_id === currentUser.id
        ).length > 0;
      setIsUserParticipating(userIsParticipant);

      setIsGameFull(selectedGame.currentPlayers >= selectedGame.max_players);
    });
  }, [gameId]);

  // Handle loading state
  if (!game || !organizer) {
    return <p>Loading...</p>;
  }

  // Handle "Join Game" button click
  const handleJoinGame = async () => {
    try {
      await postGameParticipant(game.id, currentUser.id); // Add user to the game
      setIsUserParticipating(true);

      triggerGameListRefresh();

      // After joining, navigate to "My Games"
      navigate("/my-games");
    } catch (error) {
      console.error("Error joining game:", error);
      window.alert("An error occurred. Please try again.");
    }
  };

  // Handle player removal confirmation
  const handleRemovePlayer = (playerId) => {
    setConfirmation({
      playerId: playerId,
      message: `Are you sure you want to remove this player from the game?`,
    });
  };

  // Confirm removal of the player
  const confirmRemoval = async () => {
    try {
      await deleteGameParticipant(game.id, confirmation.playerId);
      setPlayers(
        players.filter((player) => player.id !== confirmation.playerId)
      ); // Update the player list
      setConfirmation(null); // Close the confirmation dialog
      triggerGameListRefresh(); // Refresh the game list
    } catch (error) {
      console.error("Error removing player:", error);
      window.alert("An error occurred while removing the player.");
    }
  };

  // Handle canceling the removal action
  const cancelRemoval = () => {
    setConfirmation(null); // Close the confirmation dialog
  };

  return (
    <div className="game-details">
      <h1 className="text-center">{game.group_name}</h1>
      <div>
        <strong>Ruleset:</strong> {game.ruleset}
      </div>
      <div>
        <strong>Organizer:</strong>
        <div className="user-info">
          <img
            src={organizer.profilePic}
            alt={`${organizer.username}'s profile`}
            width={50}
            height={50}
            style={{ borderRadius: "50%" }}
          />{" "}
          <Link to={`/profile/${game.organizer_id}`}>{organizer.username}</Link>
        </div>
      </div>

      <h3>Players:</h3>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            <div className="user-info">
              <img
                src={player.profile_pic}
                alt={`${player.username}'s profile`}
                width={50}
                height={50}
                style={{ borderRadius: "50%" }}
              />{" "}
              <Link to={`/profile/${player.id}`}>{player.username}</Link>
              {currentUser.id === game.organizer_id && (
                <button
                  className="remove-player-btn"
                  onClick={() => handleRemovePlayer(player.id)}
                  style={{
                    fontSize: "24px",
                    color: "red",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ❌
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {confirmation && (
        <div className="confirmation-dialog">
          <p>{confirmation.message}</p>
          <button onClick={confirmRemoval}>Yes</button>
          <button onClick={cancelRemoval}>No</button>
        </div>
      )}

      <p>
        <strong>Session Date:</strong> {game.date} from {game.start_time} to{" "}
        {game.end_time}
      </p>

      {currentUser.id !== game.organizer_id &&
        !isUserParticipating &&
        !isGameFull && <button onClick={handleJoinGame}>Join Game</button>}

      {isGameFull && <p>This game is full.</p>}
      {isUserParticipating && (
        <p>You are already a participant in this game.</p>
      )}

      {currentUser.id === game.organizer_id && (
        <Link to={`/edit-game/${game.id}`} className="btn btn-primary">
          Edit Game
        </Link>
      )}
    </div>
  );
};
