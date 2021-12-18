const express = require("express");
const router = express.Router();

const { Project } = require("../models/Project/Project");
const { auth } = require("../middleware/auth");

// Read project
router.get("/:id");

module.exports = router;
