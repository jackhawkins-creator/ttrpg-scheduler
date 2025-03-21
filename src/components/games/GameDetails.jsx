import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getGames, getUserById } from "../../services/GameService";
import { postGameParticipant } from "../../services/GameService";

export const GameDetails = () => {
  const { gameId } = useParams(); // Get the game ID from the URL
  const [game, setGame] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isUserParticipating, setIsUserParticipating] = useState(false);
  const [isGameFull, setIsGameFull] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("ttrpg_user"));

  // Fetch game details when the component mounts
  useEffect(() => {
    getGames().then((games) => {
      const selectedGame = games.find((game) => game.id === parseInt(gameId));
      setGame(selectedGame);

      // Get the organizer info
      getUserById(selectedGame.organizer_id).then(setOrganizer);

      // Get player info (excluding the organizer)
      const playerPromises = selectedGame.participants.map((participant) =>
        getUserById(participant.user_id)
      );
      Promise.all(playerPromises).then((fetchedPlayers) => {
        setPlayers(fetchedPlayers);
      });

      // Check if the current user is already a participant
      setIsUserParticipating(
        selectedGame.participants.some(
          (participant) => participant.user_id === currentUser.id
        )
      );

      // Check if the game is full
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
      await postGameParticipant(game.id, currentUser.id); // Create this function in GameService
      setIsUserParticipating(true);
    } catch (error) {
      console.error("Error joining game:", error);
      window.alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="game-details">
      <h1>{game.group_name}</h1>
      <p>
        <strong>Ruleset:</strong> {game.ruleset}
      </p>
      <p>
        <strong>Organizer:</strong>{" "}
        <Link to={`/profile/${organizer.id}`}>{organizer.username}</Link>
      </p>

      <h3>Players:</h3>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            <Link to={`/profile/${player.id}`}>{player.username}</Link>
          </li>
        ))}
      </ul>

      <p>
        <strong>Session Date:</strong> {game.date} from {game.start_time} to{" "}
        {game.end_time}
      </p>
      <p>
        <strong>Join URL:</strong>{" "}
        <a href={game.join_url} target="_blank" rel="noopener noreferrer">
          Join Game
        </a>
      </p>
      
      {/* Display the "Edit Game" button only if the current user is the organizer */}
      {currentUser.id === game.organizer_id && (
        <Link to={`/edit-game/${game.id}`} className="btn btn-primary">
          Edit Game
        </Link>
      )}

      {/* Display the "Join Game" button if the user is not a participant and the game is not full */}
      {currentUser.id !== game.organizer_id &&
        !isUserParticipating &&
        !isGameFull && <button onClick={handleJoinGame}>Join Game</button>}

      {isGameFull && <p>This game is full.</p>}
      {isUserParticipating && (
        <p>You are already a participant in this game.</p>
      )}
    </div>
  );
};
