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

  const handleFilter = ({
    search,
    ruleset,
    sessionType,
    rpPref,
    startTime,
    endTime,
  }) => {
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

    // Start Time Filter
    if (startTime) {
      filtered = filtered.filter((game) => game.start_time >= startTime);
    }

    // End Time Filter
    if (endTime) {
      filtered = filtered.filter((game) => game.end_time <= endTime);
    }

    setFilteredGames(filtered); // Update filtered games state
  };

  return (
    <div className="game-list">
      <h2 className="text-center">All Games</h2>

      <GameFilterBar onFilter={handleFilter} />

      {/* Grid layout for game cards */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredGames.map((game) => (
          <div key={game.id} className="col">
            <div className="game-card p-3 border rounded shadow-sm">
              <button
                onClick={() => navigate(`/games/${game.id}`)}
                className="group-name btn btn-link"
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
          </div>
        ))}
      </div>
    </div>
  );
};
