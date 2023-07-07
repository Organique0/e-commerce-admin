import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Admin } from "@/models/Admin";

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === "POST") {
    const { email } = req.body;
    try {
      const admin = await Admin.create({ email });
      res.json(admin);
    } catch (error) {
      if (
        error.code === 11000 &&
        error.keyPattern &&
        error.keyPattern.email === 1
      ) {
        // Duplicate key error for the 'email' field
        res.status(400).json({ error: "Admin with this email already exists" });
      } else {
        // Other error occurred
        res.status(500).json({ error: "Failed to create admin" });
      }
    }
  }

  if (req.method === "GET") {
    res.json(await Admin.find());
  }

  if (req.method === "DELETE") {
    const { _id } = req.query;
    await Admin.findByIdAndDelete(_id);
    res.json("removed admin");
  }
}
