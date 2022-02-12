const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const router = express.Router();

const loginRouter = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser );

// loginRouter.get("/", (req, res) => {
//   res.send("Login page");
// });
// loginRouter.post("/register_user", (req, res) => {
//   // TODO: Register Users
// });

// loginRouter.post("/authenticate_user", (req, res) => {
//   // TODO: Authenticate Users
// });

module.exports = router;
