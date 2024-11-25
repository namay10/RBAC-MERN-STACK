import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form"; // Importing React Hook Form
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { signUp } from "../features/auth/authActions"; // Redux action

const backendUrl = "http://localhost:8000";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const { userInfo } = useSelector((state) => state.auth); // Access user info from Redux state

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/auth/users`);
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      showAlert("Failed to fetch users.", "error");
    }
  };

  useEffect(() => {
    if (userInfo?.user?.role?.name !== "admin") return; // Prevent fetching users if not admin
    fetchUsers();
  }, [userInfo]);

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const closeAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Add or Edit User
  const onSubmit = async (data) => {
    try {
      data.email = data.email.toLowerCase(); // Normalize email case
      if (editMode) {
        // Update user
        await axios.put(
          `${backendUrl}/api/user/auth/users/${editUserId}`,
          data
        );
        showAlert("User updated successfully!", "success");
      } else {
        // Add new user
        dispatch(signUp(data)); // Use Redux action
        showAlert("User added successfully!", "success");
      }
      fetchUsers();
      reset(); // Clear the form
      setEditMode(false); // Exit edit mode
      setEditUserId(null);
    } catch (error) {
      console.error("Error submitting user data:", error);
      showAlert(
        editMode
          ? "Failed to update user. Try again."
          : "Failed to add user. Try again.",
        "error"
      );
    }
  };

  const enableEditMode = (user) => {
    setEditMode(true);
    setEditUserId(user.id);
    // Populate the form with user data
    setValue("firstName", user.firstName);
    setValue("lastName", user.lastName);
    setValue("email", user.email);
    setValue("role", user.role.name);
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/user/auth/users/${id}`);
      fetchUsers();
      showAlert("User deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting user:", error);
      showAlert("Failed to delete user. Try again.", "error");
    }
  };

  // Check if the user is not admin
  if (!userInfo || userInfo.user.role.name !== "admin") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
          <p className="text-gray-600 mt-2">
            Only admins are allowed to view and make changes to users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Welcome Message */}
      <Typography variant="h6" gutterBottom>
        Welcome, {userInfo.user.firstName} {userInfo.user.lastName} (
        {userInfo.user.role.name})
      </Typography>

      <Typography variant="h4" gutterBottom>
        User Management Dashboard
      </Typography>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="First Name"
            {...register("firstName", { required: "First name is required" })}
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}

          <input
            type="text"
            placeholder="Last Name"
            {...register("lastName", { required: "Last name is required" })}
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: !editMode,
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </div>

        <div style={{ marginTop: "1rem" }}>
          <select
            {...register("role", { required: "Role is required" })}
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
          {errors.role && (
            <span className="text-red-500">{errors.role.message}</span>
          )}
        </div>

        <Button
          type="submit"
          variant="contained"
          color={editMode ? "warning" : "primary"}
          sx={{ mt: 2 }}
        >
          {editMode ? "Update User" : "Add User"}
        </Button>
      </form>

      {/* User Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => enableEditMode(user)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for alerts */}
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={closeAlert}>
        <Alert onClose={closeAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
