import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import CircularProgress from "@mui/material/CircularProgress";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import axios from "axios";

const timeAgo = (date) => {
  if (!date) return "Never";
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/users`
      );
      if (data.success) {
        setUsers(data.users);
      } else {
        console.error("Failed to fetch users:", data.message);
      }
      console.log(data.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Layout title="Dashboard - Users">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4 w-full">
            <AdminMenu />
          </div>

          {/* Users Table */}
          <div className="md:w-3/4 w-full">
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <Typography
                variant="h4"
                className="mb-4 text-gray-800 !font-semibold"
              >
                All Users
              </Typography>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <CircularProgress />
                </div>
              ) : (
                <TableContainer
                  component={Paper}
                  className="!shadow-none mt-4 border border-gray-200"
                >
                  <Table>
                    <TableHead>
                      <TableRow className="bg-gray-100">
                        <TableCell className="!font-semibold">User</TableCell>
                        <TableCell className="!font-semibold !text-right">
                          Date Added
                        </TableCell>
                        <TableCell className="!font-semibold !text-right">
                          Last Active
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <Box className="flex items-center gap-3">
                              <Avatar
                                src={`${
                                  import.meta.env.VITE_API_URL
                                }/api/v1/auth/user-photo/${user._id}`}
                                alt={user.name}
                              />

                              <Box>
                                <Typography className="!font-medium">
                                  {user.name}
                                </Typography>
                                <Typography className="text-gray-500 !text-sm">
                                  {user.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell className="!text-right">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )
                              : "Unknown"}
                          </TableCell>
                          <TableCell className="!text-right">
                            {timeAgo(user.lastActiveAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
