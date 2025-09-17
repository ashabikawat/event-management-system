import db from "../db.js";

export const createCatgeory = async (req, res) => {
  try {
    // console.log(req);
    const { category_name, category_description } = req.body;

    const category_image = req.file ? req.file.path : null;

    if (!category_name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const insert_query =
      "INSERT INTO category(category_name, category_image, category_description) VALUES ($1, $2,$3) RETURNING *";

    const result = await db.query(insert_query, [
      category_name,
      category_image,
      category_description,
    ]);

    res.status(200).json({
      status: 200,
      message: "Category created successfully",
      category: result.rows,
    });
  } catch (error) {
    console.log(error);
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ status: 400, message: "Only unique categories allowed" });
    } else {
      res
        .status(500)
        .json({ status: 500, message: "500 internal server error", error });
    }
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
    // console.log(req);

    const { category_id, category_name } = req.body;

    const category_image = req.file ? req.file.path : null;

    if (!category_id) {
      return res.status(400).json({ message: "Category id is required" });
    }
    if (!category_name) {
      return res
        .status(400)
        .json({ message: "Category name or image is required" });
    }

    const update_query =
      "UPDATE category SET category_name = $1, category_image =  $3 WHERE category_id =$2 RETURNING *";

    const result = await db.query(update_query, [
      category_name,
      category_id,
      category_image,
    ]);
    return res.status(200).json({
      message: "Category updated successfully",
      category: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
