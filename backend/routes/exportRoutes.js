const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  exportAsPDF,
  exportAsDocument,
} = require("../controller/exportController");

const router = express.Router();

router.use(protect);

router.get("/:id/pdf", exportAsPDF);
router.get("/:id/doc", exportAsDocument);

module.exports = router;
