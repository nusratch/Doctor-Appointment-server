import express from "express";

import {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentsController.js";

const router = express.Router();

router.post(
  "/appointments",
  createAppointment
);

router.get(
  "/appointments",
  getAppointments
);

router.patch(
  "/appointments/:id",
  updateAppointment
);

router.delete(
  "/appointments/:id",
  deleteAppointment
);

export default router;