import { dbConnect } from "@/service/mongo";
import Category from "@/model/category-model";
import slugify from "slugify";
import ImageKit from "imagekit";
import { Types } from "mongoose";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function createCategoryQuary(data, userId, shopId) {
  await dbConnect();

  try {
    const {
      name,
      description,
      status,
      image,
      seoTitle,
      seoDescription,
      isFeatured,
    } = data;
    console.log("Data received in query:", image);
    // 🔹 Upload image to ImageKit if provided
    let imageUrl = "";
    if (image) {
      const uploadResponse = await imagekit.upload({
        file: image, // Base64, URL, or file path
        fileName: `${slugify(name, { lower: true })}-${Date.now()}.jpg`,
        folder: "/categories", // optional folder in ImageKit
      });
      imageUrl = uploadResponse.url;
    }

    // 🔹 Generate slug
    const slug = slugify(name, { lower: true, strict: true });

    // 🔹 Create new category
    const newCategory = new Category({
      name,
      slug,
      description,
      status,
      image: imageUrl,
      userId,
      shopId,
      seoTitle: seoTitle || "",
      seoDescription: seoDescription || "",
      isFeatured: isFeatured || false,
    });

    await newCategory.save();

    return {
      status: true,
      message: "Category created successfully",
      data: JSON.parse(JSON.stringify(newCategory)),
    };
  } catch (error) {
    throw new Error(error.message || "Failed to create category");
  }
}

const mongoose = require("mongoose");

async function getAllCategoriesQuary({ shopId, userId }) {
  await dbConnect();
  try {
    const categories = await Category.find({ shopId, userId }).sort({
      createdAt: -1,
    });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    throw new Error(error.message || "Failed to fetch categories");
  }
}

async function getAllCategoriesUserQuary({ shopId, userId }) {
  await dbConnect();
  try {
    const categories = await Category.find({ shopId, userId })
      .sort({ createdAt: -1 })
      .select("name _id") 
      .lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    throw new Error(error.message || "Failed to fetch categories");
  }
}

export {
  getAllCategoriesQuary,
  createCategoryQuary,
  getAllCategoriesUserQuary,
};
