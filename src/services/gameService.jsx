export const getGames = async () => {
    const res = await fetch("http://localhost:8088/games");
    const games = await res.json();
  
    const users = await fetch("http://localhost:8088/users").then((res) => res.json());
    const participants = await fetch("http://localhost:8088/game_participants").then((res) => res.json());
    const rulesets = await fetch("http://localhost:8088/rulesets").then((res) => res.json());
  
    return games.map((game) => {
      const organizer = users.find((user) => user.id === game.organizer_id);
      const currentPlayers = participants.filter((p) => p.game_id === game.id);
  
      const ruleset = rulesets.find((rs) => rs.id === game.ruleset_id);
  
      return {
        ...game,
        organizerUsername: organizer ? organizer.username : "Unknown",
        currentPlayers: currentPlayers.length,
        participants: currentPlayers,
        ruleset: ruleset ? ruleset.name : "Unknown",
      };
    });
  };
  

export const createGame = async (game) => {
  const res = await fetch("http://localhost:8088/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(game),
  });

  if (!res.ok) {
    throw new Error("Failed to create game");
  }

  return await res.json();
};

export const getUserById = (id) => {
    return fetch(`http://localhost:8088/users/${id}`)
      .then((res) => res.json());
  };