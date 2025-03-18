import { useEffect, useState } from "react";

export const ApplicationViews = () => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const localTtrpgUser = localStorage.getItem("ttrpg_user");
    const ttrpgUserObject = JSON.parse(localTtrpgUser);

    setCurrentUser(ttrpgUserObject);
  }, []);

  return (
    <p>lol</p>
  );
};
