const express = require("express");
const router = express.Router();
const partnerController = require("../controllers/partner.controller");
const upload = require("../middlewares/upload");

router.post("/register",upload.single("licenseFile"), partnerController.registerPartner);
router.get("/", partnerController.getPartners);

router.patch("/approve/:id", partnerController.approvePartner);

router.patch("/reject/:id", partnerController.rejectPartner);

router.patch("/de-activate/:id", partnerController.deactivatePartner);

router.get("/:id", partnerController.getPartnerById);

module.exports = router;
