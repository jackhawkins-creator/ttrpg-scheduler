import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createGame } from "../../services/GameService";

export const CreateForm = ({ triggerGameListRefresh }) => {
  const [groupName, setGroupName] = useState("");
  const [ruleset, setRuleset] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [joinUrl, setJoinUrl] = useState("");
  const [rulesets, setRulesets] = useState([]);
  const [isOneShot, setIsOneShot] = useState(false); // Default is Multi-Session
  const [rpPref, setRpPref] = useState("Both");
  const [maxPlayers, setMaxPlayers] = useState(6); // Default max players

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch rulesets from the API
    fetch("http://localhost:8088/rulesets")
      .then((res) => res.json())
      .then(setRulesets);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName || !ruleset || !date || !startTime || !endTime || !joinUrl) {
      window.alert("Please fill out all fields");
      return;
    }

    // Get user ID from localStorage
    const userId = JSON.parse(localStorage.getItem("ttrpg_user"))?.id;

    const newGame = {
      group_name: groupName,
      ruleset_id: parseInt(ruleset),
      date: date,
      start_time: startTime,
      end_time: endTime,
      join_url: joinUrl,
      organizer_id: userId,
      isOneShot: isOneShot, // Set value for session type
      rp_pref: rpPref, // Set roleplay preference
      max_players: maxPlayers, // Set max players
    };

    try {
      await createGame(newGame);
      triggerGameListRefresh();
      navigate("/my-games");
    } catch (error) {
      console.error("Error creating game:", error);
      window.alert("Failed to create game. Please try again.");
    }
  };

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <h2 className="text-center">Create New Game</h2>

      {/* Group Name */}
      <div>
        <label style={{ marginRight: '8px' }}>Group Name</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
          required
        />
      </div>

      {/* Ruleset Dropdown */}
      <div>
        <label style={{ marginRight: '8px' }}>Ruleset</label>
        <select
          value={ruleset}
          onChange={(e) => setRuleset(e.target.value)}
          required
        >
          <option value="">Select Ruleset</option>
          {rulesets.map((rs) => (
            <option key={rs.id} value={rs.id}>
              {rs.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label style={{ marginRight: '8px' }}>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* Start Time */}
      <div>
        <label style={{ marginRight: '8px' }}>Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>

      {/* End Time */}
      <div>
        <label style={{ marginRight: '8px' }}>End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>

      {/* Join URL */}
      <div>
        <label style={{ marginRight: '8px' }}>Join URL</label>
        <input
          type="url"
          value={joinUrl}
          onChange={(e) => setJoinUrl(e.target.value)}
          placeholder="Join URL"
          required
        />
      </div>

      {/* Session Type (One-Shot or Multi-Session) */}
      <div>
        <label style={{ fontWeight: "bold", marginRight: '8px' }}>Session Type</label>
        <div className="form-check form-check-inline">
          <input
            type="checkbox"
            name="sessionType"
            value="oneshot"
            checked={isOneShot}
            onChange={() => setIsOneShot(true)}
            className="form-check-input"
          />
          <label className="form-check-label">One-Shot</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            type="checkbox"
            name="sessionType"
            value="multisession"
            checked={!isOneShot}
            onChange={() => setIsOneShot(false)}
            className="form-check-input"
          />
          <label className="form-check-label">Multi-Session</label>
        </div>
      </div>

      {/* Roleplay Preference */}
      <div>
        <label style={{ fontWeight: "bold" }}>Roleplay Preference</label>
        <div>
          {[
            { value: "Heavy Gameplay Focus", label: "Heavy Gameplay Focus" },
            {
              value: "Mostly Gameplay, Some Roleplay",
              label: "Mostly Gameplay, Some Roleplay",
            },
            { value: "Both", label: "Both" },
            {
              value: "Mostly Roleplay, Some Gameplay",
              label: "Mostly Roleplay, Some Gameplay",
            },
            { value: "Heavy Roleplay Focus", label: "Heavy Roleplay Focus" },
          ].map((option) => (
            <div key={option.value} className="form-check form-check-inline">
              <input
                type="checkbox"
                value={option.value}
                checked={rpPref === option.value}
                onChange={() => setRpPref(option.value)}
                className="form-check-input"
              />
              <label className="form-check-label">{option.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Max Players */}
      <div>
        <label style={{ marginRight: '8px' }}>Max Players:</label>
        <input
          type="number"
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(Math.max(1, e.target.value))}
          min="1"
          required
        />
      </div>

      {/* Submit Button */}
      <button type="submit">Create Game</button>
    </form>
  );
};
