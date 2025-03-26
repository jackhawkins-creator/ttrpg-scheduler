import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getUserByEmail } from "../../services/userService";

export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const updateFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      window.alert("Please fill out all fields");
      return;
    }

    if (password !== confirmPassword) {
      window.alert("Passwords do not match");
      return;
    }

    try {
      const existingUsers = await getUserByEmail(email);

      if (existingUsers.length > 0) {
        window.alert("Account with that email already exists");
        return;
      }

      const newUser = await createUser({ username, email, password });

      if (newUser?.id) {
        localStorage.setItem("ttrpg_user", JSON.stringify({ id: newUser.id }));
        navigate("/all-games");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      window.alert("An error occurred. Please try again.");
    }
  };

  return (
    <main className="container-login">
      <form className="form-login" onSubmit={handleRegister}>
        <h1>TTRPG Scheduler</h1>
        <h2>Please Register</h2>
        <fieldset>
          <div className="form-group">
            <input
              type="text"
              id="username"
              className="form-control"
              value={formData.username}
              onChange={updateFormData}
              placeholder="Username"
              required
            />
          </div>
        </fieldset>
        <fieldset>
          <div className="form-group">
            <input
              type="email"
              id="email"
              className="form-control"
              value={formData.email}
              onChange={updateFormData}
              placeholder="Email Address"
              required
            />
          </div>
        </fieldset>
        <fieldset>
          <div className="form-group">
            <input
              type="password"
              id="password"
              className="form-control"
              value={formData.password}
              onChange={updateFormData}
              placeholder="Password"
              required
            />
          </div>
        </fieldset>
        <fieldset>
          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={updateFormData}
              placeholder="Confirm Password"
              required
            />
          </div>
        </fieldset>
        <fieldset>
          <button className="login-btn form-btn btn-secondary" type="submit">
            Register
          </button>
        </fieldset>
      </form>
    </main>
  );
};
