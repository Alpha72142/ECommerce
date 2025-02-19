import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

//create category
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    console.log(existingCategory);
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category already exists",
      });
    }
    const category = await categoryModel({ name, slug: slugify(name) }).save();
    res.status(201).send({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create category",
      error,
    });
  }
};

//update category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(500).send({
      success: false,
      message: "Error while updating category",
      error,
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
    try{
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
          success: true,
          message: "Category deleted successfully",
        });
    }catch(error){
        res.status(500).send({
          success: false,
          message: "Error while deleting category",
          error,
        });
    }
};
