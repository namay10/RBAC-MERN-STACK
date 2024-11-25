import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth); // Access userInfo from Redux state

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    ); // Fallback if userInfo is not yet loaded
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 space-y-6 p-6">
      {/* Profile Details Card */}
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-indigo-600 p-4">
          <h2 className="text-2xl font-semibold text-white">
            Welcome, {userInfo.user.firstName} {userInfo.user.lastName}
          </h2>
          <p className="text-white mt-1">Your Profile Details</p>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5.121 17.804A4.979 4.979 0 011 13.987V5.978A1 1 0 012.117 5h19.765a1 1 0 011.116.978v8.009a4.979 4.979 0 01-4.121 3.817M10 14a4 4 0 100-8 4 4 0 000 8zm6 4a6 6 0 00-12 0"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-lg font-medium text-gray-700">
                {userInfo.user.email}
              </p>
              <p className="text-sm text-gray-500">Email Address</p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c2.5 0 4.5-2 4.5-4.5S14.5 2 12 2 7.5 4 7.5 6.5 9.5 11 12 11zm0 2c-3.5 0-10 1.75-10 5.25V20h20v-1.75C22 14.75 15.5 13 12 13z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-lg font-medium text-gray-700">
                {userInfo.user.role.name}
              </p>
              <p className="text-sm text-gray-500">Role</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Access Card */}
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-indigo-600 p-4">
          <h2 className="text-xl font-semibold text-white">Dashboard</h2>
          <p className="text-white mt-1">
            Access user management and administrative features here.
          </p>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Manage user roles, permissions, and other administrative tasks.
          </p>
          <Link to="/dashboard">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-md transition duration-300">
              View the Dashboard Here
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
