const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const db = require("./app/models");
const userRouter = require("./app/routes/user.routes");
const testRouter = require("./app/routes/test.routes");
const postRouter = require("./app/routes/post.routes");

const app = express();

// ________________________________________________________________________________________________
// Middleware Configuration:

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
app.use(logger("dev"));

// Enable CORS with multiple allowed origins
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:8000"],
  credentials: true, // Allow cookies from the front-end
};
app.use(cors(corsOptions));

// ________________________________________________________________________________________________
// Database Connection:

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully.");
    initializeRoles(); // Initialize default roles in the database
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit the application if database connection fails
  });

// ________________________________________________________________________________________________
// Routes:

// Test endpoint to confirm the server is running
app.get("/test", (req, res) => {
  res.json({ message: "Test from server!" });
});

// Main API routes

app.use("/api/user/auth", userRouter); // User authentication routes
app.use("/api/user/test", testRouter); // Test routes for role-based access
app.use("/api/posts", postRouter); // Post-related routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error." });
});

// ________________________________________________________________________________________________
// Server Configuration:

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});

// ________________________________________________________________________________________________
// Helper Functions:

/**
 * Initialize default roles in the `roles` collection if it is empty.
 */
const Role = db.role;

function initializeRoles() {
  Role.estimatedDocumentCount()
    .then((count) => {
      if (count > 0) return; // Roles already initialized

      const roles = ["user", "admin", "moderator"];
      roles.forEach((roleName) => {
        new Role({ name: roleName })
          .save()
          .then(() => console.log(`Added '${roleName}' to roles collection.`))
          .catch((err) =>
            console.error(
              `Error adding '${roleName}' to roles collection:`,
              err
            )
          );
      });
    })
    .catch((err) =>
      console.error("Error checking count in roles collection:", err)
    );
}
