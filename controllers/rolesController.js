import db from "../db.js";

export const createRole = async (req, res) => {
  try {
    const { role_name } = req.body;

    if (!role_name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const insert_query = "INSERT INTO roles(role_name) VALUES ($1) RETURNING *";

    const result = await db.query(insert_query, [role_name]);

    res.status(200).json({
      message: "Role created successfully",
      role: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "500 internal server error", error });
  }
};

export const getRole = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }

    const get_by_id_query = "SELECT * FROM roles WHERE role_id = $1 ";

    const result = await db.query(get_by_id_query, [id]);

    res
      .status(200)
      .json({ message: "Role fetched successfully", role: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "500 internal server error", error });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const get_all_roles = "SELECT * FROM roles";

    const result = await db.query(get_all_roles);

    res
      .status(200)
      .json({ message: "Roles fetched successfully", roles: result.rows });
  } catch (error) {
    res.status(500).json({ message: "500 internal server errro", error });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { role_id, role_name } = req.body;

    const update_query =
      "UPDATE roles SET role_name = $1 WHERE role_id = $2 RETURNING *";

    const result = await db.query(update_query, [role_name, role_id]);

    res
      .status(200)
      .json({ message: "Role updated successfully", role: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "500 internal server error", error });
  }
};
