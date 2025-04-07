import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getUserByEmail } from "../../services/userService";

export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  });

  const navigate = useNavigate();

  const updateFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          profilePic: reader.result, // Set base64 string as profile picture
        }));
      };
      reader.readAsDataURL(file); // Read file as base64 URL
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword, profilePic } = formData;

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

      const newUser = await createUser({
        username,
        email,
        password,
        profile_pic: profilePic,
      });

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
        <h1 className="text-center">RollCall</h1>
        <h2 className="text-center">Please Register</h2>
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
          <div className="form-group">
            <label htmlFor="profilePic" className="profile-pic-label">
              Upload Profile Picture (Optional)
            </label>
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
          </div>
        </fieldset>
        <fieldset className="text-center">
          <button className="login-btn form-btn btn-secondary" type="submit">
            Register
          </button>
        </fieldset>
      </form>
    </main>
  );
};
