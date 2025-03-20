import { useEffect, useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { GameList } from "../components/games/GameList";
import { GameFilterBar } from "../components/games/GameFilterBar";
import { getGames } from "../services/GameService";
import { CreateForm } from "../components/forms/CreateForm";

export const ApplicationViews = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    getGames().then((gamesData) => {
      setGames(gamesData);
      setFilteredGames(gamesData);
    });
  }, []);

  // Filter handler function
  const handleFilter = ({ search, ruleset, sessionType, rpPref }) => {
    let filtered = [...games];

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (game) =>
          game.group_name.toLowerCase().includes(search.toLowerCase()) ||
          game.organizerUsername.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by ruleset
    if (ruleset) {
      filtered = filtered.filter((game) => game.ruleset_id === parseInt(ruleset));
    }

    // Filter by session type
    if (sessionType) {
      filtered = filtered.filter(
        (game) => game.isOneShot === (sessionType === "oneshot")
      );
    }

    // Filter by roleplaying preference
    if (rpPref) {
      filtered = filtered.filter((game) => game.rp_pref === parseInt(rpPref));
    }

    setFilteredGames(filtered);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <Outlet />
          </>
        }
      >
        <Route
          path="/all-games"
          element={
            <>
              <GameFilterBar onFilter={handleFilter} />
              <GameList games={filteredGames} />
            </>
          }
        />
      </Route>
      <Route path="/create-game" element={<CreateForm />} />
    </Routes>
  );
};
