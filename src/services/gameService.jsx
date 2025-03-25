export const getGames = async () => {
  const res = await fetch("http://localhost:8088/games");
  const games = await res.json();

  const users = await fetch("http://localhost:8088/users").then((res) =>
    res.json()
  );
  const participants = await fetch(
    "http://localhost:8088/game_participants"
  ).then((res) => res.json());
  const rulesets = await fetch("http://localhost:8088/rulesets").then((res) =>
    res.json()
  );

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

export const postGameParticipant = async (gameId, userId) => {
  const response = await fetch("http://localhost:8088/game_participants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      game_id: gameId,
      user_id: userId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add participant");
  }

  return await response.json();
};

export const updateGame = async (gameId, updatedGame) => {
  const res = await fetch(`http://localhost:8088/games/${gameId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedGame),
  });

  if (!res.ok) {
    throw new Error("Failed to update game");
  }

  return await res.json();
};

export const deleteGameParticipant = async (gameId, userId) => {
    // Find the participant record
    const participants = await fetch("http://localhost:8088/game_participants")
      .then((res) => res.json())
      .then((data) =>
        data.find(
          (participant) => participant.game_id === gameId && participant.user_id === userId
        )
      );
  
    if (!participants) {
      throw new Error("Participant not found.");
    }
  
    // Delete the participant from the join table
    const response = await fetch(`http://localhost:8088/game_participants/${participants.id}`, {
      method: "DELETE",
    });
  
    if (!response.ok) {
      throw new Error("Failed to leave game");
    }
  
    return await response.json();
  };
  
  export const deleteGame = async (gameId) => {
    // First, delete all participants from the game
    const participants = await fetch("http://localhost:8088/game_participants")
      .then((res) => res.json())
      .then((data) =>
        data.filter((participant) => participant.game_id === gameId)
      );
  
    // Delete each participant
    await Promise.all(
      participants.map((participant) =>
        fetch(`http://localhost:8088/game_participants/${participant.id}`, {
          method: "DELETE",
        })
      )
    );
  
    // Now delete the game itself
    const response = await fetch(`http://localhost:8088/games/${gameId}`, {
      method: "DELETE",
    });
  
    if (!response.ok) {
      throw new Error("Failed to delete game");
    }
  
    return await response.json();
  };