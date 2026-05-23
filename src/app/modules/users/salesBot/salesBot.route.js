import express from "express";
import validateRequest from "../../../middleware/validateRequest.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";
import { createMulterUpload } from "../../../config/multer.config.js";
import { Role } from "../../../utils/role.js";
import { SalesBotValidation } from "./salesBot.validation.js";
import { SalesBotController } from "./salesBot.controller.js";

const upload = createMulterUpload({ folder: "" });
const router = express.Router();

router.post(
  "/",
  checkAuthMiddleware(...Object.values(Role)),
  upload.single("document"),
  validateRequest(SalesBotValidation.createSalesBotSchema),
  SalesBotController.createSalesBot
);

router.get(
  "/",
  checkAuthMiddleware(...Object.values(Role)),
  SalesBotController.getSalesBots
);

router.get(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  SalesBotController.getSalesBotById
);

router.patch(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  upload.single("document"),
  validateRequest(SalesBotValidation.updateSalesBotSchema),
  SalesBotController.updateSalesBot
);

router.delete(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  SalesBotController.deleteSalesBot
);

export const SalesBotRoutes = router;
