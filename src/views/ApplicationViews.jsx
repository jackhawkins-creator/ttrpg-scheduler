import { Routes, Route } from "react-router-dom";
import { GameList } from "../components/games/GameList";
import { GameFilterBar } from "../components/games/GameFilterBar";
import { NavBar } from "../components/NavBar";
import { Profile } from "../components/Profile";
import { GameDetails } from "../components/games/GameDetails";
import { useEffect, useState } from "react";
import { getGames } from "../services/GameService";
import { CreateForm } from "../components/forms/CreateForm";
import { EditGameForm } from "../components/forms/EditGameForm";
import { EditProfileForm } from "../components/forms/editProfileForm";
import { MyGamesList } from "../components/MyGamesList";


export const ApplicationViews = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    getGames().then((gamesData) => {
      setGames(gamesData);
      setFilteredGames(gamesData);
    });
  }, []);

  const handleFilter = ({ search, ruleset, sessionType, rpPref }) => {
    let filtered = [...games];

    if (search) {
      filtered = filtered.filter(
        (game) =>
          game.group_name.toLowerCase().includes(search.toLowerCase()) ||
          game.organizerUsername.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (ruleset) {
      filtered = filtered.filter((game) => game.ruleset_id === parseInt(ruleset));
    }

    if (sessionType) {
      filtered = filtered.filter(
        (game) => game.isOneShot === (sessionType === "oneshot")
      );
    }

    if (rpPref) {
      filtered = filtered.filter((game) => game.rp_pref === parseInt(rpPref));
    }

    setFilteredGames(filtered);
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/all-games" element={<><GameFilterBar onFilter={handleFilter} /><GameList games={filteredGames} /></>} />
        <Route path="/my-games" element={<MyGamesList />} />
        <Route path="/profile/:userId" element={<Profile />} /> {/* Dynamic profile route */}
        <Route path="/edit-profile" element={<EditProfileForm />} />
        <Route path="/create-game" element={<CreateForm />} />
        <Route path="/games/:gameId" element={<GameDetails />} />
        <Route path="/edit-game/:gameId" element={<EditGameForm />} />
      </Routes>
    </>
  );
};
