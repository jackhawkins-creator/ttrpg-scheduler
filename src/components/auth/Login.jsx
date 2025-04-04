import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserByEmail } from "../../services/userService";

export const Login = () => {
  const [username, setUsername] = useState("DungeonMaster42");
  const [email, setEmail] = useState("dm42@example.com");
  const [password, setPassword] = useState("hashedpassword1");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      window.alert("Please fill out all fields");
      return;
    }

    try {
      // Fetch user data by email
      const foundUsers = await getUserByEmail(email);
  
      // Check if the user exists
      if (foundUsers.length === 1) {
        const user = foundUsers[0];
  
        // Compare the entered password with the stored hashed password
        if (user.password === password) { // Replace this with actual hashed password comparison if needed
          // Store user information in local storage if login is successful
          localStorage.setItem("ttrpg_user", JSON.stringify({ id: user.id }));
          navigate("/all-games");
        } else {
          window.alert("Incorrect password. Please try again.");
        }
      } else {
        window.alert("No user found with that email address.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      window.alert("An error occurred. Please try again.");
    }
  };

  return (
    <main className="container-login">
      <section>
        <form className="form-login" onSubmit={handleLogin}>
          <h1 className="text-center">Rollcall</h1>
          <h2 className="text-center">Please sign in</h2>
          <fieldset>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
          </fieldset>
          <fieldset>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
              />
            </div>
          </fieldset>
          <fieldset>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
          </fieldset>
          <fieldset className="text-center">
            <button className="login-btn form-btn btn-secondary" type="submit">
              Sign In
            </button>
          </fieldset>
        </form>
      </section>
      <section className="text-center">
        <Link to="/register">Not a member yet?</Link>
      </section>
    </main>
  );
};
