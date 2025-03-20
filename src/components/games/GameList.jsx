import { useNavigate } from "react-router-dom";

export const GameList = ({ games }) => {
  const navigate = useNavigate();

  return (
    <div className="game-list">
      <h2>All Games</h2>
      {games.map((game) => (
        <div key={game.id} className="game-card">
          <button onClick={() => navigate(`/games/${game.id}`)} className="group-name">
            {game.group_name}
          </button>
          <p>
            Scheduled: {game.date} from {game.start_time} to {game.end_time}
          </p>
          <p>Organizer: {game.organizerUsername}</p>
          <p>
            Slots Filled: {game.currentPlayers}/{game.max_players}
          </p>
        </div>
      ))}
    </div>
  );
};
