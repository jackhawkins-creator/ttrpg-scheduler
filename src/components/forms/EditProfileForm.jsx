import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUserProfile } from "../../services/userService";

export const EditProfileForm = ({ triggerGameListRefresh }) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("ttrpg_user"));

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (currentUser) {
      getUserById(currentUser.id).then((userData) => {
        setUsername(userData.username);
        setEmail(userData.email);
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      username,
      email,
      password: password || undefined, // Only update if a new password is entered
    };

    updateUserProfile(currentUser.id, updatedUser)
      .then(() => {
        alert("Profile updated successfully!");
        triggerGameListRefresh();
        navigate(`/profile/${currentUser.id}`);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert("There was an error updating your profile.");
      });
  };

  return (
    <div className="edit-profile-form">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password (optional)"
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfileForm;
