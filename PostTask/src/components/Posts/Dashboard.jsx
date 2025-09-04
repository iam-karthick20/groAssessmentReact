import React, { useState, useEffect } from "react";
import axios from "axios";
import { BaseURL } from "../../assets/Api";
import {
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { PieChart } from "@mui/x-charts/PieChart";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const refreshToken = localStorage.getItem("refreshToken");

  const Logout = async () => {
    try {
      const response = await axios.post(`${BaseURL}Auth/logout`, {
        refreshToken: refreshToken,
      });
      console.log(response.data);

      if (response.data) {
        alert("Logout Sucessfull");
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error response:", error.response.data);
      alert(error.response.data.message);
    }
  };

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${BaseURL}Post/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);
  console.log(posts);

  const chartData = posts.map((post, index) => ({
    id: index,
    value: post.liked,
    label: post.title,
  }));

  return (
    <div
      style={{
        height: "80vh",
        width: "100%",
        maxWidth: "100%",
        overflowX: "auto",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          height: "10vh",
          position: "sticky",
          top: 0,
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/datagram")}
            style={{ marginRight: 30 }}
          >
            Datagram
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/userlist")}
          >
            User List
          </Button>
        </div>
        <div>
          <Typography variant="h4" style={{ textAlign: "center" }}>
            Dashboard
          </Typography>
        </div>

        <div>
          <h2 style={{ textAlign: "right" }}>
            <Button variant="contained" color="error" onClick={Logout}>
              Logout
            </Button>
          </h2>
        </div>
      </div>

      <div>
        <PieChart
          series={[
            {
              data: chartData,
            },
          ]}
          width={400}
          height={400}
        />
      </div>
    </div>
  );
}
