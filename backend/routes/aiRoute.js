import express from "express";
import {
  predictDiseaseController,
  recommendDoctorsController,
} from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/predict-disease", predictDiseaseController);
aiRouter.post("/recommend-doctors", recommendDoctorsController);

export default aiRouter;
