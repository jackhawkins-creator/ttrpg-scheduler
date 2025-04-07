import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { GameList } from "../components/games/GameList";
import { NavBar } from "../components/NavBar";
import { Profile } from "../components/Profile";
import { GameDetails } from "../components/games/GameDetails";
import { getGames } from "../services/GameService";
import { CreateForm } from "../components/forms/CreateForm";
import { EditGameForm } from "../components/forms/EditGameForm";
import { EditProfileForm } from "../components/forms/EditProfileForm";
import { MyGamesList } from "../components/MyGamesList";

export const ApplicationViews = () => {
  const [games, setGames] = useState([]); //all games
  const [refreshGames, setRefreshGames] = useState(false);  // New state to trigger re-fetch

  useEffect(() => {
    // Fetch all games when the component mounts and store them in the state
    getGames().then((gamesData) => {
      setGames(gamesData);
    });
  }, [refreshGames]); // Empty array means this effect runs only once after the initial render

  const triggerGameListRefresh = () => {
    setRefreshGames((prev) => !prev);  // Toggle refreshGames to trigger useEffect
  };

  return (
    <>
      <NavBar />
      <div className="container mt-4"> {/* Added container class for padding */}
      <Routes>
        {/* Pass games as prop to GameList */}
        <Route path="/all-games" element={<GameList games={games} triggerGameListRefresh={triggerGameListRefresh} />} />
        <Route path="/profile/:userId" element={<Profile />} />{" "}
        {/* Dynamic profile route */}
        <Route path="/edit-profile" element={<EditProfileForm triggerGameListRefresh={triggerGameListRefresh} />} />
        <Route path="/create-game" element={<CreateForm triggerGameListRefresh={triggerGameListRefresh} />} />
        <Route path="/my-games" element={<MyGamesList triggerGameListRefresh={triggerGameListRefresh} />} />
        <Route path="/games/:gameId" element={<GameDetails triggerGameListRefresh={triggerGameListRefresh} />} />
        <Route path="/edit-game/:gameId" element={<EditGameForm triggerGameListRefresh={triggerGameListRefresh} />} />
      </Routes>
      </div>
    </>
  );
};
