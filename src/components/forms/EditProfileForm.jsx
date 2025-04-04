import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUserProfile } from "../../services/userService";

export const EditProfileForm = ({ triggerGameListRefresh }) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("ttrpg_user"));

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (currentUser) {
      getUserById(currentUser.id).then((userData) => {
        setUsername(userData.username);
        setEmail(userData.email);
        setProfilePic(userData.profile_pic);
      });
    }
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // Set base64 string as profile picture
      };
      reader.readAsDataURL(file); // Read file as base64 URL
    }
  };

  // Handle Delete Profile Picture
  const handleDeleteProfilePic = () => {
    setProfilePic(
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      username,
      email,
      password: password || undefined, // Only update if a new password is entered
      profile_pic: profilePic,
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
      <h2 className="text-center">Edit Profile</h2>
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

        <div>
          <label>Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
          />
          {profilePic && (
            <>
              <img src={profilePic} alt="Profile Preview" width={100} />
              <button
                type="button"
                onClick={handleDeleteProfilePic}
                className="delete-btn"
              >
                Delete Profile Picture
              </button>
            </>
          )}
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfileForm;
