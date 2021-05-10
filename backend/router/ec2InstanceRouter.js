const express = require("express");
const { protect } = require("../controller/authController");
const { getInstances, getInstanceDetail, startInstance, stopInstance, testRedis } = require("../controller/ec2InstanceController");
const router = express.Router();

router.get("/", protect, getInstances)
router.get("/:id/:region", protect, getInstanceDetail)
router.patch("/start/:id/:region", protect, startInstance)
router.patch("/stop/:id/:region", protect, stopInstance)

module.exports = router