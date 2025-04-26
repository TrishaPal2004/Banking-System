import mongoose from "mongoose";

const StatementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["monthly", "annual"] }, // Either "monthly" or "annual"
  entries: [
    {
      date: String,
      description: String,
      amount: Number,
    },
  ],
});

const Statement = mongoose.model("Statement", StatementSchema);
export default Statement;
