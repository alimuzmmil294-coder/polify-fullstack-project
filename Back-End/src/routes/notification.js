import { Router } from "express";
import { getNotification, markRead } from "../controllers/notification.js";
import { protect } from "../middlewares/authMiddleware.js";

const route = Router();

route.use(protect);

route.patch("/", getNotification);
route.patch("/read", markRead);

export default route;
