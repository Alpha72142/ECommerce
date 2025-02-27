import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  categoryController,
  categoryPhotoController,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";
import formidable from "express-formidable";
const router = express.Router();

//routes
// Create category
router.post(
  "/create-category",
  requireSignIn,
  formidable(),
  isAdmin,
  createCategoryController
);

//get photos
router.get("/category-photo/:id", categoryPhotoController);

//update category
router.put(
  "/update-category/:id",
  requireSignIn,
  formidable(),
  isAdmin,
  updateCategoryController
);

//get all categories
router.get("/get-category", categoryController);

//single category
router.get("/single-category/:slug", singleCategoryController);

//delete category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
