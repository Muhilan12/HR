import { Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../api/apiConfig";

interface UserProfile {
  name: string;
  profileImage?: string;
}

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!user) return;

    // ✅ FIXED: use user.id
    fetch(`${API_ENDPOINTS.PROFILES}/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setProfile(data.profile);
        }
      })
      .catch(() => console.log("Failed to load profile"));
  }, [user]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <Avatar src={profile?.profileImage}>
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem disabled>
          <Typography variant="subtitle1">{user.name}</Typography>
        </MenuItem>

        <MenuItem onClick={() => navigate("/profile")}>
          My Profile
        </MenuItem>

        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default ProfileDropdown;
