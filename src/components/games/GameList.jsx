import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameFilterBar } from "./GameFilterBar";

export const GameList = ({ games }) => {
  const navigate = useNavigate();
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    if (games.length > 0) {
      setFilteredGames(games); // Once games are fetched, set them
    }
  }, [games]); //will run whenever "games" prop changes

  const handleFilter = ({ search, ruleset, sessionType, rpPref }) => {
    let filtered = [...games]; // Shallow copy to avoid mutating original state

    // Search filter (group_name or organizer username)
    if (search) {
      filtered = filtered.filter(
        (game) =>
          game.group_name.toLowerCase().includes(search.toLowerCase()) ||
          game.organizerUsername.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Ruleset filter
    if (ruleset) {
      filtered = filtered.filter(
        (game) => game.ruleset_id === parseInt(ruleset)
      );
    }

    // Session Type filter (one-shot vs. campaign)
    if (sessionType) {
      filtered = filtered.filter(
        (game) => game.isOneShot === (sessionType === "oneshot")
      );
    }

    // RP Preference filter
    if (rpPref) {
      filtered = filtered.filter((game) => game.rp_pref === rpPref);
    }

    setFilteredGames(filtered); // Update filtered games state
  };

  return (
    <div className="game-list">
      <h2 className="text-center">All Games</h2>

      {/* Game Filter Bar with handleFilter func as prop */}
      <GameFilterBar onFilter={handleFilter} />

      {/* Display each filtered games in a card */}
      {filteredGames.map((game) => (
        <div key={game.id} className="game-card">
          <button
            onClick={() => navigate(`/games/${game.id}`)} //navigate to game deets
            className="group-name"
          >
            {game.group_name}
          </button>
          <p>
            Scheduled: {game.date} from {game.start_time} to {game.end_time}
          </p>
          <p>Organizer: {game.organizerUsername}</p>
          <p>
            Player Slots Filled: {game.currentPlayers}/{game.max_players}
          </p>
        </div>
      ))}
    </div>
  );
};
