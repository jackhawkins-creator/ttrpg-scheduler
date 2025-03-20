import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { getUserByEmail } from "../../services/userService";

export const Login = () => {
  const [username, setUsername] = useState("ElfWarrior");
  const [email, setEmail] = useState("elf@example.com");
  const [password, setPassword] = useState("hashedpassword2");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      window.alert("Please fill out all fields");
      return;
    }

    try {
      const foundUsers = await getUserByEmail(email);

      if (foundUsers.length === 1 && foundUsers[0].username === username) {
        localStorage.setItem(
          "ttrpg_user",
          JSON.stringify({ id: foundUsers[0].id })
        );
        navigate("/all-games");
      } else {
        window.alert("Invalid login. Check username and email.");
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
          <h1>TTRPG Scheduler</h1>
          <h2>Please sign in</h2>
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
          <fieldset>
            <button className="login-btn form-btn btn-secondary" type="submit">
              Sign In
            </button>
          </fieldset>
        </form>
      </section>
      <section>
        <Link to="/register">Not a member yet?</Link>
      </section>
    </main>
  );
};
