import { Routes, Route } from "react-router-dom";
import { GameList } from "../components/games/GameList";
import { NavBar } from "../components/NavBar";
import { Profile } from "../components/Profile";
import { GameDetails } from "../components/games/GameDetails";
import { useEffect, useState } from "react";
import { getGames } from "../services/GameService";
import { CreateForm } from "../components/forms/CreateForm";
import { EditGameForm } from "../components/forms/EditGameForm";
import { EditProfileForm } from "../components/forms/editProfileForm";

export const ApplicationViews = () => {
  const [games, setGames] = useState([]); //all games

  useEffect(() => {
    // Fetch all games when the component mounts and store them in the state
    getGames().then((gamesData) => {
      setGames(gamesData);
    });
  }, []); // Empty array means this effect runs only once after the initial render

  return (
    <>
      <NavBar />
      <Routes>
        {/* Pass games as prop to GameList */}
        <Route path="/all-games" element={<GameList games={games} />} />
        <Route path="/profile/:userId" element={<Profile />} />{" "}
        {/* Dynamic profile route */}
        <Route path="/edit-profile" element={<EditProfileForm />} />
        <Route path="/create-game" element={<CreateForm />} />
        <Route path="/games/:gameId" element={<GameDetails />} />
        <Route path="/edit-game/:gameId" element={<EditGameForm />} />
      </Routes>
    </>
  );
};
