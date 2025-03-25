import { useState, useEffect } from "react";

export const GameFilterBar = ({ onFilter }) => {
  const [search, setSearch] = useState("");
  const [ruleset, setRuleset] = useState("");
  const [sessionType, setSessionType] = useState(null);
  const [rpPref, setRpPref] = useState(null);
  const [rulesets, setRulesets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8088/rulesets")
      .then((res) => res.json())
      .then(setRulesets);
  }, []);

  useEffect(() => {
    onFilter({ search, ruleset, sessionType, rpPref });
  }, [search, ruleset, sessionType, rpPref]);

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
        {rulesets.map((rs) => (
          <option key={rs.id} value={rs.id}>
            {rs.name}
          </option>
        ))}
      </select>

      {/* Session Type Radio Buttons (Deselectable) */}
      <div>
  <label>
    <input
      type="checkbox"
      value="oneshot"
      checked={sessionType === "oneshot"}
      onChange={() => handleSessionTypeChange("oneshot")}
    />
    One-Shot
  </label>
  <label>
    <input
      type="checkbox"
      value="campaign"
      checked={sessionType === "campaign"}
      onChange={() => handleSessionTypeChange("campaign")}
    />
    Campaign
  </label>
</div>

{/* Roleplaying Preference Likert Scale (Deselectable) */}
<div>
  {[1, 2, 3, 4, 5].map((num) => (
    <label key={num}>
      <input
        type="checkbox"
        value={num}
        checked={rpPref === num}
        onChange={() => handleRpPrefChange(num)}
      />
      {num}
    </label>
  ))}
</div>
    </div>
  );
};