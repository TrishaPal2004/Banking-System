import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { sendMail } from "./nodemailer.js"; 

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String, // Will be hashed
  balance: { type: Number, default: 0 },
  address: String,
  statements: { monthly: Array, annual: Array },
  transactions: Array
});
const AddressChangeRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address: { type: String, required: true },
  newAddress: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
});

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


const ChequeSchema = new mongoose.Schema({
    fromuserID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    touserID:{ type: mongoose.Schema.Types.ObjectId,ref: "User", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

const Cheque = mongoose.model("Cheque", ChequeSchema);
const Statement = mongoose.model("Statement", StatementSchema);
const AddressChangeRequest = mongoose.model("AddressChangeRequest", AddressChangeRequestSchema);
const User = mongoose.model("User", userSchema);

// ✅ Admin creates a user (sets username & password)
app.post("/createUser", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required!" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists!" });
    }

    // Hash password before saving
   
 
    const newUser = new User({ 
        username,
        password,
        balance: 0,
        address: "Default",
        statements: { monthly: [], annual: [] },
        transactions: []
    });

    await newUser.save();
    res.json({ message: "User created successfully!" });
});

// ✅ User login (validates username & password)
app.post("/adlogin", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: "User not found!" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(400).json({ message: "Incorrect password!" });
    }

    res.json({ message: "Login successful!", user });
});



app.post("/balanceenquiry", async (req, res) => {
    try {
        const { _id } = req.body;
        console.log({_id});
        if (!_id ) {
            return res.status(400).json({ message: "Invalid UserId format" });
        }


        const user = await User.findOne({ _id});

        if (!user) {
            return res.status(404).json({ message: "User not found ?" });
        }
        console.log(user.balance);
        console.log(user.username);
        return res.json({
          message:`Balance: ${user.balance}`,
        _id:user._id,
        username:user.username,
        balance:user.balance,
        address:user.address,
    
    });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
//Transfer of money
app.post("/transfer", async (req, res) => {
    try {
      const { fromId, toId, amount } = req.body;
      
      if (!fromId || !toId || amount <= 0) {
        return res.status(400).json({ message: "Invalid transfer details" });
      }
  
      const sender = await User.findOne({_id: fromId });
      const receiver = await User.findOne({_id: toId });
      console.log({sender});
      if (!sender || !receiver) {
        return res.status(404).json({ message: "Account not found" });
      }
  
      if (sender.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      console.log(sender.balance);
      // Perform the transfer
      sender.balance = Number(sender.balance) - Number(amount);
receiver.balance = Number(receiver.balance) + Number(amount);
      
      await sender.save();
      await receiver.save();
  
      res.json({ message: `Transfer successful! New Balance: ${sender.balance}` });
      console.log(`${receiver.balance}`);

      const timestamp = new Date().toISOString();
    
      // Update sender's balance and add transaction
      await User.updateOne(
        { _id: fromId },
        { 
         
          $push: { 
            transactions: { 
              type: "debit", 
              amount: amount, 
              timestamp: timestamp,
              description: `Transfer to ${receiver.username || toId}`
            } 
          }
        }
      );
      
      // Update recipient's balance and add transaction
      await User.updateOne(
        { _id: toId },
        { 
          
          $push: { 
            transactions: { 
              type: "credit", 
              amount: amount, 
              timestamp: timestamp,
              description: `Transfer from ${sender.username || fromId}`
            } 
          }
        },
        await Statement.updateOne(
          { userId: fromId, type: "monthly" },
          {
            $push: {
              entries: {
                date: timestamp,
                description: `Transferred Rs ${amount} to ${receiver.username}`,
                amount: -amount,
              },
            },
          },
          { upsert: true }
        ),
    
        await Statement.updateOne(
          { userId: toId, type: "monthly" },
          {
            $push: {
              entries: {
                date: timestamp,
                description: `Received Rs ${amount} from ${sender.username}`,
                amount: amount,
              },
            },
          },
          { upsert: true }
        )
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post("/address", async (req, res) => {
    try {
        const { _id, address } = req.body;  // ✅ Extract both _id and address
        console.log({ _id, address });

        if (!_id || !address) {
            return res.status(400).json({ message: "User ID and new address are required" });
        }

        const user = await User.findOne({ _id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Update the user's address
        user.address = address;
        await user.save();

        res.json({ message: "Address updated successfully" });

    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
app.post("/transactions", async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    // Find the user by ID
    const user = await User.findOne({ _id: userId });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if transactions exist and are an array
    if (!user.transactions || !Array.isArray(user.transactions)) {
      return res.json({ transactions: [] });
    }
    
    // Get last 5 transactions (or fewer if there aren't 5)
    const lastTransactions = user.transactions.slice(-5);
    
    res.json({ 
      transactions: lastTransactions,
      userId: user._id,
      balance:user.balance,
      username: user.username
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    
    // If error is related to invalid ObjectId, return a more specific message
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Admin Approves or Rejects Address Change Request
app.post("/admin/address-change/:requestId", async (req, res) => {
  try {
      const { status } = req.body; // "Approved" or "Rejected"
      const { requestId } = req.params;

      if (!["Approved", "Rejected"].includes(status)) {
          return res.status(400).json({ message: "Invalid status" });
      }

      // Find the request in the database
      const request = await AddressChangeRequest.findById(requestId);
      if (!request) {
          return res.status(404).json({ message: "Request not found" });
      }

      // If approved, update user's address
      if (status === "Approved") {
          const user = await User.findById(request.userId);
          if (!user) {
              return res.status(404).json({ message: "User not found" });
          }

          user.address = request.newAddress; // ✅ Update address
          await user.save();
      }

      // Update request status
      request.status = status;
      await request.save();

      res.json({ message: `Address change ${status.toLowerCase()} successfully` });

  } catch (error) {
      console.error("Error updating address request:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch all pending address change requests
app.get("/get-pending-address-requests", async (req, res) => {
  try {
    const requests = await AddressChangeRequest.find({ status: "Pending" });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching address requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/statements", async (req, res) => {
  try {
    const { userId, type } = req.body;

    if (!userId || !type || !["monthly", "annual"].includes(type)) {
      return res.status(400).json({ message: "Invalid request parameters" });
    }

    // ✅ Find statements based on userId and type (monthly or annual)
    const statement = await Statement.findOne({ userId, type });

    if (!statement || !statement.entries.length) {
      return res.status(404).json({ message: `No ${type} statements found.` });
    }
    const user = await User.findOne({ _id: userId });
    res.json({
      userId,
      username:user.username,
      balance:user.balance,
      address:user.address,
      type,
      statements: statement.entries,
    });
  } catch (error) {
    console.error("Error fetching statements:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from MongoDB
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});


//fetch all requests for aproving or rejecting cheques
app.get("/get-pending-cheque-requests", async (req, res) => {
  try {
    // Changed from "Pending" to "pending" to match the schema default value
    const requests = await Cheque.find({ status: "pending" });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching cheque requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/admin/approvecheque/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params; // Get ID from URL
    const { approved } = req.body;    // Get approval status from body
    const {fromuserID,touserID} =req.body;
    console.log("Cheque ID:", requestId, "Approved:", approved); // Debugging log

    if (!requestId || approved === undefined) {
      return res.status(400).json({ message: "Cheque ID and approval status are required" });
    }

    const cheque = await Cheque.findOne({_id:requestId});
    if (!cheque) {
      return res.status(404).json({ message: "Cheque not found" });
    }

    if (cheque.status !== "pending") {
      return res.status(400).json({ message: "Cheque has already been processed" });
    }

    if (approved) {
      // Find user and update balance
      const user = await User.findById(cheque.fromuserID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const user2 = await User.findById(cheque.touserID);
      if (!user2) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log("prev fromuser balance: ",user.balance);
      console.log("prev touser balance: ",user2.balance);
      user.balance -= cheque.amount;
      user2.balance += cheque.amount;
      await user.save();
      await user2.save();
      console.log(user.balance);
      console.log(user2.balance);
      cheque.status = "approved";
      const timestamp = new Date();
      // Update sender's balance and add transaction
      await User.updateOne(
        { _id: fromuserID },
        { 
         
          $push: { 
            transactions: { 
              type: "debit", 
              amount:cheque.amount, 
              timestamp: timestamp,
              description: `Transfer to ${user2.username || touserID} by Cheque`
            } 
          }
        }
      );
      
      // Update recipient's balance and add transaction
      await User.updateOne(
        { _id: touserID },
        { 
          
          $push: { 
            transactions: { 
              type: "credit", 
              amount: cheque.amount, 
              timestamp: timestamp,
              description: `Transfer from ${user.username || fromuserID} by Cheque`
            } 
          }
        },
        await Statement.updateOne(
          { userId: fromuserID, type: "monthly" },
          {
            $push: {
              entries: {
                date: timestamp,
                description: `Transferred Rs ${cheque.amount} to ${user2.username} by Cheque`,
                amount: -cheque.amount,
              },
            },
          },
          { upsert: true }
        ),
    
        await Statement.updateOne(
          { userId: touserID, type: "monthly" },
          {
            $push: {
              entries: {
                date: timestamp,
                description: `Received Rs ${cheque.amount} from ${user.username} by Cheque`,
                amount: cheque.amount,
              },
            },
          },
          { upsert: true }
        )
      );
    } else {
      cheque.status = "rejected";
    }

    await cheque.save();
    res.json({ message: `Cheque ${approved ? "approved" : "rejected"} successfully` });

  } catch (error) {
    console.error("Error approving cheque:", error);
    res.status(500).json({ message: "Failed to update cheque status" });
  }
});
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));