import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Dashboard
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Role-Based Access Control Dashboard in MERN Stack.
        </p>
        <div className="flex flex-col gap-4">
          <Link to={"/login"}>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-semibold shadow-md transition duration-300">
              Login
            </button>
          </Link>
          <Link to={"/sign-up"}>
            <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-semibold shadow-md transition duration-300">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
