import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";

// Create category
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.fields;
    const { photo } = req.files;

    // Validation
    if (!name) {
      return res.status(500).send({ error: "Name is required" });
    }

    if (photo && photo.size > 1000000) {
      return res.status(500).send({ error: "Photo should be less than 1MB" });
    }

    // Check if category already exists
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category already exists",
      });
    }

    // Create new category
    const category = new categoryModel({ name, slug: slugify(name) });

    if (photo) {
      category.photo.data = fs.readFileSync(photo.path);
      category.photo.contentType = photo.type;
    }

    await category.save();

    res.status(201).send({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);
    res.status(500).send({
      success: false,
      message: "Error creating category",
      error: error.message || error, // Ensure the error message is logged
    });
  }
};

//get photos from category
export const categoryPhotoController = async (req, res) => {
  try {
    const category = await categoryModel
      .findById(req.params.id)
      .select("photo");
    if (category.photo.data) {
      res.set("Content-type", category.photo.contentType);
      return res.status(200).send(category.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting category photo",
      error: error.message,
    });
  }
};

//update category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.fields; // Using formidable middleware
    const { photo } = req.files;
    const { id } = req.params;

    // Validation
    if (!name) {
      return res.status(400).send({ error: "Name is required" });
    }

    // Find and update category
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }

    category.name = name;
    category.slug = slugify(name);

    // Update photo if provided
    if (photo) {
      if (photo.size > 1000000) {
        return res.status(400).send({ error: "Photo should be less than 1MB" });
      }
      category.photo.data = fs.readFileSync(photo.path);
      category.photo.contentType = photo.type;
    }

    await category.save();

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while updating category",
      error: error.message,
    });
  }
};

// get all categories
export const categoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All categories list",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting all category",
      error,
    });
  }
};

// get single category
export const singleCategoryController = async (req, res) => {
  console.log(req.params.slug);
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get single category successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single category",
      error,
    });
  }
};

//delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error,
    });
  }
};
