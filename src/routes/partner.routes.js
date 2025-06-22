const express = require("express");
const router = express.Router();
const partnerController = require("../controllers/partner.controller");
const upload = require("../middlewares/upload");

router.post("/register",upload.single("licenseFile"), partnerController.registerPartner);
router.get('/confirm/:id', partnerController.confirmPartner);

module.exports = router;
