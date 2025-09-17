import db from "../db.js";

export const createArtist = async (req, res) => {
  try {
    const { artist_name, artist_description } = req.body;

    const artist_image = req.files ? req.files.map((m) => m.path) : null;

    console.log(req.files);

    if (!artist_name) {
      return res
        .status(400)
        .json({ status: 400, message: "Artist name is required" });
    }

    const insert_query =
      "INSERT INTO artist(artist_name, artist_image, artist_description) VALUES ($1,$2, $3) RETURNING *";

    const result = await db.query(insert_query, [
      artist_name,
      artist_image,
      artist_description,
    ]);

    return res.status(200).json({
      status: 200,
      message: "Artist added successfully",
      artist: result.rows[0],
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

export const getArtist = async (req, res) => {
  try {
    const get_query = "SELECT * FROM artist";

    const result = await db.query(get_query);

    return res
      .status(200)
      .json({ message: "Artist fetched successfully", artists: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getArtistById = async (req, res) => {
  try {
    const { artist_id } = req.body;

    if (!artist_id) {
      return res.status(400).json({ message: "Artist id is required" });
    }

    const get_artist_By_id = "SELECT * FROM artist WHERE artist_id = $1";

    const result = await db.query(get_artist_By_id, [artist_id]);

    if (result?.rows?.length === 0) {
      return res
        .status(200)
        .json({ message: "No artist found with the given id" });
    }

    return res
      .status(200)
      .json({ message: "Artist fetched successfully", artist: result.rows[0] });
  } catch (error) {
    console.log(error);
    if (error.code === "22P02") {
      return res.status(500).json({ message: "Incorrect id format" });
    }
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateArtist = async (req, res) => {
  try {
    const { artist_id, artist_name } = req.body;

    const artist_image = req.files ? req.files.map((m) => m.path) : null;

    if (!artist_id) {
      return res.status(400).json({ message: "Artist id is must" });
    }

    const update_query =
      "UPDATE artist SET artist_name = $1, artist_image = $2 WHERE artist_id =$3 RETURNING *";

    const result = await db.query(update_query, [
      artist_name,
      artist_image,
      artist_id,
    ]);

    return res
      .status(200)
      .json({ message: "Artist updated successfully", artist: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
