import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { BaseURL } from "../../assets/Api";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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

export default function UserList() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const fetchUsers = async () => {
    try {
      if (!token) {
        setError("No access token found, login first.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BaseURL}User`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("res", response.data);

      const mappedData = response.data.map((user, index) => {
        const createdDate = new Date(user.createdOn);
        const formattedDate =
          createdDate.toLocaleDateString("en-GB") +
          " " +
          createdDate.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

        return {
          id: index + 1,
          userId: user.userId,
          username: user.username,
          email: user.emailAddress,
          role: user.role,
          isActive: user.isActive,
          createdOn: formattedDate,
        };
      });

      setUsers(mappedData);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = (user) => {
    setSelectedUser({ ...user, password: "" });

    setOpen(true);
    console.log("ok", selectedUser);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    try {
      const userValues = {
        userId: selectedUser.userId,
        username: selectedUser.username,
        password: selectedUser.password,
        role: selectedUser.role,
        emailAddress: selectedUser.email,
        isActive: selectedUser.isActive,
        modifiedBy: "admin",
      };

      console.log(userValues);

      await axios.patch(`${BaseURL}User`, userValues, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("User updated successfully");
      handleClose();
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const columns = [
    { field: "username", headerName: "Username", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    { field: "isActive", headerName: "Active", width: 120, type: "boolean" },
    { field: "createdOn", headerName: "Created On", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpen(params.row)}
        >
          Update
        </Button>
      ),
    },
  ];

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
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>
        </div>
        <div>
          <Typography variant="h4" style={{ textAlign: "center" }}>
            User List
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

      <DataGrid
        rows={users}
        columns={columns}
        pageSize={5}
        loading={loading}
        disableSelectionOnClick
        localeText={{
          noRowsLabel: "Unauthorized Access",
        }}
      />

      {/* Update Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6">Update User</Typography>

          {selectedUser && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Username"
                value={selectedUser.username}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, username: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="Role"
                value={selectedUser.role}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                value={selectedUser.password}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, password: e.target.value })
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedUser.isActive}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        isActive: e.target.checked,
                      })
                    }
                  />
                }
                label="Active"
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button onClick={handleClose} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleUpdate}>
                  Save
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
