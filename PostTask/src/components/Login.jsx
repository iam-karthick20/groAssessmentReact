import React, { useState } from "react";
import { TextField, Box, Fab, Typography } from "@mui/material";
import { BaseURL } from "../assets/Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bg from "../assets/Background.jpg";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BaseURL}Auth/login`, {
        username: username,
        password: password,
      });

      console.log("Login success:", response.data);

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      if (response.data.accessToken) {
        navigate("/datagram");
      }
      alert("Login Successful");
    } catch (error) {
      console.error("Error response:", error.response.data);
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 400,
            p: 5,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255, 0.8)"
          }}
        >
          <TextField
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            required
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Fab
            sx={{ mt: 2, mb: 2 }}
            onClick={handleLogin}
            variant="extended"
            size="medium"
            color="secondary"
            style={{
              backgroundColor: "#2C7EDA",
              width: 400,
              textAlign: "center",
            }}
          >
            Login
          </Fab>

          <Typography
            variant="subtitle2"
            style={{ color: "#000", cursor: "pointer" }}
            sx={{ textDecoration: "underline" }}
            onClick={() => navigate("/register")}
          >
            New User?
          </Typography>
        </Box>
      </Box>
    </>
  );
}
