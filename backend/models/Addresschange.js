import mongoose from "mongoose";

const AddressChangeRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address: { type: String, required: true },
  newAddress: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
});

const AddressChangeRequest = mongoose.model("AddressChangeRequest", AddressChangeRequestSchema);

export default AddressChangeRequest;
