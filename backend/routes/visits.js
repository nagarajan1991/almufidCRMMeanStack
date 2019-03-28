const express = require("express");

const VisitController = require("../controllers/visits")

const router = express.Router();

const checkAuth = require('../middleware/check-auth');

router.post("", checkAuth, VisitController.CreateVisit);

router.put("/:id", checkAuth, VisitController.updateVisit);

router.get("", VisitController.getVisits);

router.get("/download", VisitController.getVisits);

router.get("/:id", VisitController.getVisit);

router.delete("/:id", checkAuth, VisitController.deleteVisit);

module.exports = router;
