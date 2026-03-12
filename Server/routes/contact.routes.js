import { Router } from "express";
import { contactUs } from "../controllers/contact.controller.js";

const router = Router();

router.post("/contact", contactUs);

export default router;
