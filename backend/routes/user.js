const express = require("express");

const UserController = require("../controllers/user")

const router = express.Router();

router.post("/signup", UserController.createUser);

router.get("/users", UserController.getUsers);

router.post("/login", UserController.userLogin);

router.post("/chngpwd", UserController.chngpwd);

router.post("/resetpwd", UserController.resetpwd);


module.exports = router;
