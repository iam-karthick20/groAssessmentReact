import React, { useState, useEffect } from "react";
import axios from "axios";
import { BaseURL, BaseImageURL } from "../../assets/Api";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import FavoriteIcon from "@mui/icons-material/Favorite";

export default function DataGram() {
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

  // Post
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${BaseURL}Post`, {
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

  const handleLike = async (postId) => {
    try {
      console.log(postId);

      const response = await axios.post(
        `${BaseURL}Post/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      if (response.data) {
        alert("Post Liked Sucessfull");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error response:", error.response.data);
      alert(error.response.data.message);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postImage, setPostImage] = useState(null);

  const handleOpen = (user) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("Title", postTitle);
      formData.append("Description", postDescription);
      formData.append("ImageFile", postImage);
      formData.append("CreatedBy", "75d19cf9-82c4-4ce2-8b55-08ddeaac8eaf");

      console.log(formData);
      
      const response = await axios.post(
        `${BaseURL}Post`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Post created:", response.data);
      alert("Post created successfully");
      setOpen(false);
      setPostTitle("");
      setPostDescription("");
      setPostImage(null);
      window.location.reload();
    } catch (error) {
      console.error(error.message);
      alert("Error creating post");
    }
  };

  return (
    <div
      style={{
        height: "80vh",
        width: "100%",
        maxWidth: "100%",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <div style={{height: '10vh', position: 'sticky', top: 0, backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div >
           <Button variant="contained" color="primary" onClick={handleOpen} style={{marginRight: 30}}>
          Add New Post
        </Button>

        <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')} style={{marginRight: 30}}>
          Dashboard
        </Button>

        <Button variant="contained" color="primary" onClick={() => navigate('/userlist')} >
          User List
        </Button>

        </div>
        <div>
          <Typography
            variant="h4"
            style={{ textAlign: "center"}}
          >
            Datagram
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

      <div >
      <Grid container spacing={2} sx={{ py: 1 }}>
        {posts.map((post, index) => (
          <Grid key={index} size={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 2,
                p: 5,
                boxShadow: 3,
                borderRadius: 2,
                height: 300
              }}
            >
              <img
                src={`${BaseImageURL}${post.imageUrl}`}
                alt={post.title}
                style={{ width: "200px", borderRadius: 8 }}
              />

              <Typography variant="h6" textAlign="center">
                {post.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                {post.description}
              </Typography>

              <Typography></Typography>
              <Button
                variant={"outlined"}
                color="error"
                startIcon={<FavoriteIcon />}
                onClick={() => handleLike(post.postID)}
              >
                Like {post.liked}
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </div>

      {/* New Post Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6">New Post</Typography>

          <Box>
            <TextField
              fullWidth
              margin="normal"
              label="Post Title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Post Description"
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
            />

            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setPostImage(e.target.files[0])}
              />
            </Button>
            {postImage && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {postImage.name}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={handleClose} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handlePost}>
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
