import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
// create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);


//get all product
router.get("/get-product", getProductController);

//get single product
router.get("/get-single-product/:slug", getSingleProductController);

//get Photo
router.get("/product-photo/:pid", productPhotoController);

// delete product
router.delete("/delete-product/:pid", deleteProductController);

export default router;
