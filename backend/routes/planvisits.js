const express = require("express");

const PlanVisitController = require("../controllers/planvisits")

const router = express.Router();

const checkAuth = require('../middleware/check-auth');

router.post("", checkAuth, PlanVisitController.CreatePlanVisit);

router.put("/:id", checkAuth, PlanVisitController.updatePlanVisit);

router.get("", PlanVisitController.getPlanVisits);

router.get("/download", PlanVisitController.getPlanVisits);

router.get("/:id", PlanVisitController.getPlanVisit);

router.delete("/:id", checkAuth, PlanVisitController.deletePlanVisit);

module.exports = router;
