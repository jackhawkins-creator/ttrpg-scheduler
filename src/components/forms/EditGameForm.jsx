import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGames, updateGame } from "../../services/GameService";

export const EditGameForm = ({ triggerGameListRefresh }) => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [ruleset, setRuleset] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [joinUrl, setJoinUrl] = useState("");
  const [isOneShot, setIsOneShot] = useState(null);
  const [rpPref, setRpPref] = useState("Both");
  const [maxPlayers, setMaxPlayers] = useState(6); // Default max players
  const [rulesets, setRulesets] = useState([]);

  useEffect(() => {
    // Fetch game data and rulesets
    getGames().then((games) => {
      const selectedGame = games.find((game) => game.id === parseInt(gameId));
      setGame(selectedGame);
      if (selectedGame) {
        setGroupName(selectedGame.group_name);
        setRuleset(selectedGame.ruleset_id);
        setDate(selectedGame.date);
        setStartTime(selectedGame.start_time);
        setEndTime(selectedGame.end_time);
        setJoinUrl(selectedGame.join_url);
        setIsOneShot(selectedGame.isOneShot);
        setRpPref(selectedGame.rp_pref);
        setMaxPlayers(selectedGame.max_players);
      }
    });

    fetch("http://localhost:8088/rulesets")
      .then((res) => res.json())
      .then(setRulesets);
  }, [gameId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the game
    const updatedGame = {
      group_name: groupName,
      ruleset_id: parseInt(ruleset),
      date,
      start_time: startTime,
      end_time: endTime,
      join_url: joinUrl,
      isOneShot,
      rp_pref: rpPref,
      max_players: maxPlayers,
    };

    updateGame(gameId, updatedGame)
      .then(() => {
        triggerGameListRefresh();
        navigate(`/games/${gameId}`); // Go back to GameDetails view
      })
      .catch((err) => {
        console.error("Error updating game", err);
        alert("There was an error updating the game.");
      });
  };

  return (
    <div className="edit-game-form">
      <h2>Edit Game</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Ruleset</label>
          <select
            value={ruleset}
            onChange={(e) => setRuleset(e.target.value)}
            required
          >
            {rulesets.map((rs) => (
              <option key={rs.id} value={rs.id}>
                {rs.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label>End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Join URL</label>
          <input
            type="url"
            value={joinUrl}
            onChange={(e) => setJoinUrl(e.target.value)}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="radio"
              name="sessionType"
              value="oneshot"
              checked={isOneShot}
              onChange={() => setIsOneShot(true)}
            />
            One-Shot
          </label>
          <label>
            <input
              type="radio"
              name="sessionType"
              value="multisession"
              checked={!isOneShot}
              onChange={() => setIsOneShot(false)}
            />
            Multi-Session
          </label>
        </div>

        <div>
          <label>Roleplay Preference: </label>
          {[
            { value: "Heavy Gameplay Focus", label: "Heavy Gameplay Focus" },
            { value: "Mostly Gameplay, Some Roleplay", label: "Mostly Gameplay, Some Roleplay" },
            { value: "Both", label: "Both" },
            { value: "Mostly Roleplay, Some Gameplay", label: "Mostly Roleplay, Some Gameplay" },
            { value: "Heavy Roleplay Focus", label: "Heavy Roleplay Focus" },
          ].map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="rpPref"
                value={option.value}
                checked={rpPref === option.value}
                onChange={() => setRpPref(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>

        <div>
          <label>Max Players:</label>
          <input
            type="number"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(Math.max(1, e.target.value))}
            min="1"
            required
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditGameForm;
