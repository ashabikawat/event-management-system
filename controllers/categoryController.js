import db from "../db.js";

export const createCatgeory = async (req, res) => {
  try {
    // console.log(req);
    const { category_name } = req.body;

    const category_image = req.file ? req.file.path : null;

    if (!category_name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const insert_query =
      "INSERT INTO category(category_name, category_image) VALUES ($1, $2) RETURNING *";

    const result = await db.query(insert_query, [
      category_name,
      category_image,
    ]);

    res.status(200).json({
      message: "Category created successfully",
      category: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "500 internal server error", error });
  }
};

export const getCategory = async (req, res) => {
  try {
    const get_query = "SELECT * FROM CATEGORY";

    const result = await db.query(get_query);
    return res.status(200).json({
      message: "Categories fetched successfully",
      categrory: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error", error });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { category_id } = req.body;

    if (!category_id) {
      return res.status(400).json({ message: "Category id is required" });
    }

    const get_query = "SELECT * FROM category WHERE category_id = $1";

    const result = await db.query(get_query, [category_id]);
    return res.status(200).json({
      message: "Category fetched successfully",
      category: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "500 internal server error", error });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { category_id, category_name } = req.body;

    if (!category_id || !category_name) {
      return res
        .status(400)
        .json({ message: "Category id and name is required" });
    }

    const update_query =
      "UPDATE category SET category_name = $1 WHERE category_id =$2 RETURNING *";

    const result = await db.query(update_query, [category_name, category_id]);
    return res.status(200).json({
      message: "Category updated successfully",
      category: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
