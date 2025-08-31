import db from "../db.js";

export const createArtist = async (req, res) => {
  try {
    const { artist_name } = req.body;

    const artist_image = req.files ? req.files.map((m) => m.path) : null;

    console.log(req.files);

    if (!artist_name) {
      return res.status(400).json({ message: "Artist name is required" });
    }

    const insert_query =
      "INSERT INTO artist(artist_name, artist_image) VALUES ($1,$2) RETURNING *";

    const result = await db.query(insert_query, [artist_name, artist_image]);

    return res
      .status(200)
      .json({ message: "Artist added successfully", artist: result.rows[0] });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
