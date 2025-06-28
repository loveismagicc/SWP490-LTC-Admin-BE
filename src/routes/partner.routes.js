const express = require("express");
const router = express.Router();
const partnerController = require("../controllers/partner.controller");
const upload = require("../middlewares/upload");
const {protectAdmin} = require("../middlewares/authMiddleware");

router.post("/register",upload.single("licenseFile"), partnerController.registerPartner);
router.get("/", protectAdmin, partnerController.getPartners);

router.patch("/approve/:id", protectAdmin, partnerController.approvePartner);

router.patch("/reject/:id", protectAdmin, partnerController.rejectPartner);

router.patch("/de-activate/:id", protectAdmin, partnerController.deactivatePartner);

router.get("/:id", protectAdmin, partnerController.getPartnerById);

router.post("/", protectAdmin, partnerController.createPartnerByAdmin);

module.exports = router;
