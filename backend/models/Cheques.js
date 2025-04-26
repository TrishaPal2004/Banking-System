import mongoose from "mongoose";

const ChequeSchema = new mongoose.Schema({
    fromuserID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    touserID:{ type: mongoose.Schema.Types.ObjectId,ref: "User", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

const Cheque = mongoose.model("Cheque", ChequeSchema);
export default Cheque;
