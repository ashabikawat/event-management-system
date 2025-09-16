import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const { user_name, password, name, email, mob, role_id } = req.body;

    if (!user_name || !password || !name || !role_id) {
      return res.status(400).json({
        status: 400,
        message: "Username, password, name and role is required",
      });
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

    res.status(200).json({
      status: 200,
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    if (error.code === "23505") {
      if (error.constraint === "users_user_name_key") {
        return res
          .status(400)
          .json({ status: 400, message: "Username already exists" });
      } else if (error.constraint === "users_email_key") {
        return res
          .status(400)
          .json({ status: 400, message: "Email id already exists" });
      }
    }

    if (error.code === "23514") {
      if (error.constraint === "users_mob_no_check") {
        return res.status(400).json({
          status: 400,
          message: "Phone number must be 10 digits",
        });
      }
    }
    res.status(500).json({ status: 500, message: "Something went wrong" });
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
    const get_query =
      "SELECT user_id, user_name, name, email, mob_no,created_date,role_name FROM users u left join roles r on u.role_id = r.role_id";

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

export const login = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
      return res
        .status(400)
        .json({ message: "Username and password is required" });
    }

    const get_user_query = `select u.user_name,u.password_hash,r.role_name, 
    json_agg(  json_build_object('name', m.menu_name, 'icon',m.menu_icon , 'path',m.menu_path)) as menus
from users u
join roles r on r.role_id = u.role_id
join role_menus rm on rm.role_id = r.role_id
join menus m on m.menu_id = rm.menu_id
where u.user_name = $1 
group by u.user_name,u.password_hash,r.role_name`;
    const result = await db.query(get_user_query, [user_name]);

    if (result?.rows?.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      result?.rows?.[0]?.password_hash
    );

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ status: 400, message: "Invalid credentials" });
    }

    const user = result?.rows[0];

    const payload = {
      user_name: user.user_name,
      role: user.role_name,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const menus = result?.rows[0]?.menus;

    res.status(200).json({
      status: 200,
      userDetails: {
        user_name: user.user_name,
        role: user.role_name,
      },
      menus,
      token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 400, message: "500 internal server error", error });
  }
};
