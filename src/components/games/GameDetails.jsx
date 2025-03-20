import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getGames } from "../../services/GameService";  // Fetch game data from your service
import { getUserById } from "../../services/GameService"; // Fetch user details

export const GameDetails = () => {
  const { gameId } = useParams(); // Get the game ID from the URL
  const [game, setGame] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [players, setPlayers] = useState([]);

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
    });
  }, [gameId]);

  // Handle loading state
  if (!game || !organizer) {
    return <p>Loading...</p>;
  }

  return (
    <div className="game-details">
      <h1>{game.group_name}</h1>
      <p><strong>Ruleset:</strong> {game.ruleset}</p>
      <p><strong>Organizer:</strong> <Link to={`/profile/${organizer.id}`}>{organizer.username}</Link></p>

      <h3>Players:</h3>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            <Link to={`/profile/${player.id}`}>{player.username}</Link>
          </li>
        ))}
      </ul>

      <p><strong>Session Date:</strong> {game.date} from {game.start_time} to {game.end_time}</p>
      <p><strong>Join URL:</strong> <a href={game.join_url} target="_blank" rel="noopener noreferrer">Join Game</a></p>
    </div>
  );
};
