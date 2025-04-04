import { useState, useEffect } from "react";

export const GameFilterBar = ({ onFilter }) => {
  const [search, setSearch] = useState("");
  const [ruleset, setRuleset] = useState("");
  const [sessionType, setSessionType] = useState(null);
  const [rpPref, setRpPref] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [rulesets, setRulesets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8088/rulesets")
      .then((res) => res.json())
      .then(setRulesets);
  }, []);

  useEffect(() => {
    onFilter({ search, ruleset, sessionType, rpPref, startTime, endTime });
  }, [search, ruleset, sessionType, rpPref, startTime, endTime]); //updates whenever we hear a change

  const handleSessionTypeChange = (value) => {
    setSessionType((prev) => (prev === value ? null : value));
  };

  const handleRpPrefChange = (value) => {
    setRpPref((prev) => (prev === value ? null : value));
  };

  return (
    <div className="game-filter-bar">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by group name or organizer"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Ruleset Dropdown */}
      <select value={ruleset} onChange={(e) => setRuleset(e.target.value)}>
        <option value="">All Rulesets</option>
        {rulesets.map((rset) => (
          <option key={rset.id} value={rset.id}>
            {rset.name}
          </option>
        ))}
      </select>

      {/* Session Type Radio Buttons (Deselectable) */}
      <div>
        <strong>Session Type</strong>
        <div className="form-check form-check-inline">
          <input
            type="checkbox"
            className="form-check-input"
            id="oneshot"
            name="sessionType"
            value="oneshot"
            checked={sessionType === "oneshot"}
            onChange={() => handleSessionTypeChange("oneshot")}
          />
          <label className="form-check-label" htmlFor="oneshot">
            One-Shot
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            type="checkbox"
            className="form-check-input"
            id="campaign"
            name="sessionType"
            value="campaign"
            checked={sessionType === "campaign"}
            onChange={() => handleSessionTypeChange("campaign")}
          />
          <label className="form-check-label" htmlFor="campaign">
            Campaign
          </label>
        </div>
      </div>

      {/* Roleplaying Preference Likert Scale (Deselectable) */}
      <div>
        <strong>Roleplay Preference</strong>
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
            <div
              key={option.value}
              className="form-check form-check-inline"
              style={{ marginRight: "15px" }} // Ensure spacing
            >
              <input
                type="checkbox"
                value={option.value}
                checked={rpPref === option.value}
                onChange={() => handleRpPrefChange(option.value)}
                className="form-check-input"
                id={option.value}
              />
              <label className="form-check-label" htmlFor={option.value}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      {/* Start Time Filter */}
      <div>
        <label>Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      {/* End Time Filter */}
      <div>
        <label>End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
    </div>
  );
};
