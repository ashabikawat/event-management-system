import db from "../db.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { user_name, password, name, email, mob, role_id } = req.body;

    if (!user_name || !password || !name || !role_id) {
      return res
        .status(400)
        .json({ message: "Username, password, name and role is required" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insert_query =
      "INSERT INTO users(user_name,password_hash,name,email,mob_no,role_id) VALUES($1, $2,$3, $4, $5,$6) RETURNING *";

    const result = await db.query(insert_query, [
      user_name,
      hashedPassword,
      name,
      email,
      mob,
      role_id,
    ]);

    res
      .status(200)
      .json({ message: "User created successfully", user: result.rows[0] });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Username already exists" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user id is required" });
    }

    const get_query = "SELECT * FROM users WHERE user_id = $1";

    const result = await db.query(get_query, [user_id]);
    res
      .status(200)
      .json({ message: "User fetched successfully", user: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "500 internal server error", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const get_query = "SELECT * FROM users";

    const result = await db.query(get_query);

    res
      .status(200)
      .json({ message: "Users fetched successfully", users: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "500 internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    let updates = [];
    let values = [];

    let idx = 1;

    if (req.body.name) {
      updates.push(`name = $${idx++}`);
      values.push(req.body.name);
    }
    if (req.body.email) {
      updates.push(`email = $${idx++}`);
      values.push(req.body.email);
    }
    if (req.body.mob) {
      updates.push(`mob_no = $${idx++}`);
      values.push(req.body.mob);
    }
    if (req.body.role_id) {
      updates.push(`role_id = $${idx++}`);
      values.push(req.body.role_id);
    }

    if (req.body.user_name) {
      return res.status(400).json({ message: "User name cannot edited" });
    }

    values.push(req.body.user_id);

    if (updates?.length === 0) {
      return res.status(500).json({ message: "Nothing to update" });
    }

    const update_query = `UPDATE users
     SET ${updates.join(", ")} 
      WHERE user_id = $${idx}
      RETURNING *`;

    const result = await db.query(update_query, values);

    res
      .status(200)
      .json({ message: "User updated successfully", user: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "500 internal server error" });
  }
};
