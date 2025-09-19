import db from "../db.js";

export const createVenues = async (req, res) => {
  try {
    const { venue_name, venue_city, venue_state, venue_address } = req.body;

    console.log(req.files);
    const venue_image = req.files?.map((f) => f.path);

    const requiredFields = [
      "venue_name",
      "venue_state",
      "venue_city",
      "venue_address",
    ];
    const missing = requiredFields.filter((f) => !req.body[f]);

    if (!venue_name || !venue_state || !venue_city || !venue_address) {
      return res
        .status(400)
        .json({ status: 400, message: `${missing} is required` });
    }

    const insert_query =
      "INSERT INTO venues(venue_name, venue_address,venue_city,venue_state, venue_image) VALUES ($1, $2, $3, $4,$5) returning *";

    const result = await db.query(insert_query, [
      venue_name,
      venue_address,
      venue_city,
      venue_state,
      venue_image,
    ]);

    res.status(200).json({
      status: 200,
      message: "Venue inserted sucessfully",
      venue: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Something went wrong" });
  }
};

export const updateVenue = async (req, res) => {
  try {
    const { venue_name, venue_city, venue_state, venue_address, venue_id } =
      req.body;

    const venue_image = req.files?.map((f) => f.path);

    if (!venue_id) {
      return res
        .status(400)
        .json({ status: 400, message: "venue_id is required" });
    }

    const update_query =
      "update venues set venue_name =$1, venue_city = $2, venue_address=$3,venue_state=$4,venue_image=$5 where venue_id = $6 returning *";

    const result = await db.query(update_query, [
      venue_name,
      venue_city,
      venue_address,
      venue_state,
      venue_image,
      venue_id,
    ]);

    res.status(200).json({
      status: 200,
      message: "Venue updated successfully",
      venue: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Something went wrong" });
  }
};
