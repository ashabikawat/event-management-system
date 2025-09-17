import db from "../db.js";

export const createRole = async (req, res) => {
  const client = await db.connect();

  try {
    const { role_name, menus } = req.body;

    if (!role_name || !Array.isArray(menus)) {
      return res
        .status(400)
        .json({ message: "Role name and menus is required" });
    }

    await client.query("BEGIN");

    const insert_query = "INSERT INTO roles(role_name) VALUES ($1) RETURNING *";

    const result = await client.query(insert_query, [role_name]);

    const roleId = result.rows[0].role_id;

    for (const menusId of menus) {
      await client.query(
        "INSERT INTO role_menus(role_id,menu_id) values ($1,$2)",
        [roleId, menusId]
      );
    }

    await client.query("COMMIT");
    res.status(200).json({
      status: 200,
      message: "Role created successfully",
      role: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      if (error.constraint === "roles_role_name_key") {
        res
          .status(400)
          .json({ status: 400, message: "Role name already exists" });
      }
    }
    res.status(500).json({ status: 500, message: "Something went wrong" });
  } finally {
    client.release();
  }
};

export const getRole = async (req, res) => {
  try {
    const { role_id } = req.body;

    if (!role_id) {
      return res.status(400).json({ message: "Role id is required" });
    }

    const get_by_id_query =
      "select r.role_id, role_name, array_agg(menu_name)  as menus,  array_agg(m.menu_id) as menu_ids from roles r left join role_menus rm on rm.role_id = r.role_id left join menus m on m.menu_id = rm.menu_id where r.role_id = $1 group by r.role_id  ";
    const result = await db.query(get_by_id_query, [role_id]);

    res
      .status(200)
      .json({ message: "Role fetched successfully", role: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "500 internal server error", error });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const get_all_roles =
      "select r.role_id, role_name, array_agg(menu_name)  as menus from roles r left join role_menus rm on rm.role_id = r.role_id left join menus m on m.menu_id = rm.menu_id group by r.role_id order by r.role_id asc ";

    const result = await db.query(get_all_roles);

    res
      .status(200)
      .json({ message: "Roles fetched successfully", roles: result.rows });
  } catch (error) {
    res.status(500).json({ message: "500 internal server errro", error });
  }
};

export const updateRole = async (req, res) => {
  const { role_id, role_name, menus } = req.body;

  if (!role_id) {
    return res
      .status(400)
      .json({ status: 400, message: "Role id is required" });
  }

  try {
    await db.query("BEGIN");

    if (role_name) {
      await db.query(`UPDATE roles SET role_name = $1 WHERE role_id = $2`, [
        role_name,
        role_id,
      ]);
    }

    if (Array.isArray(menus)) {
      const cleanedMenus = menus.filter((m) => m);

      await db.query(`DELETE FROM role_menus WHERE role_id = $1`, [role_id]);

      for (const menuId of cleanedMenus) {
        await db.query(
          `INSERT INTO role_menus(role_id, menu_id) VALUES ($1, $2)`,
          [role_id, menuId]
        );
      }
    }

    await db.query("COMMIT");

    res.status(200).json({
      status: 200,
      message: "Role updated successfully",
    });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

export const getMenus = async (req, res) => {
  try {
    const getMenus = "SELECT * FROM menus";

    const result = await db.query(getMenus);

    res
      .status(200)
      .json({ message: "Menus fetched successfully", menus: result.rows });
  } catch (error) {
    res.status(500).json({ message: "500 internal server error", error });
  }
};
