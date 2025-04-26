import express from "express";
import authMiddleware from "../middlewares/authMiddlewares.js"; // Include .js extension
import User from "../models/User.js"; // Include .js extension
import AddressChangeRequest from "../models/Addresschange.js";
import Statement from "../models/Statements.js";
import Cheque from "../models/Cheques.js"
const router = express.Router();

// Get User Balance
router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// Fund Transfer
router.post("/transfer", authMiddleware, async (req, res) => {
  const { recipientEmail, amount } = req.body;

  try {
    const sender = await User.findById(req.user.id);
    const recipient = await User.findOne({ email: recipientEmail });

    if (!recipient) return res.status(400).json({ msg: "Recipient not found" });
    if (sender.balance < amount) return res.status(400).json({ msg: "Insufficient balance" });

    sender.balance -= amount;
    recipient.balance += amount;

    await sender.save();
    await recipient.save();

    await Transaction.create([
      { userId: sender._id, type: "debit", amount, description: "Fund transfer" },
      { userId: recipient._id, type: "credit", amount, description: "Received transfer" }
    ]);

    res.json({ msg: "Transfer successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// View Transactions
router.post("/transactions1", async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(`Yohohooho:${userId}`);
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Return transactions (If transactions field doesn't exist, return an empty array)
    return res.json({ transactions: user.transactions || [] });

  } catch (error) {
    console.error("Error fetching transactions:", error); // ✅ Log actual error
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/balanceenquiry1", async (req,res)=>{
  try{
  const {userId}=req.body;
  if(!userId)
    {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log({Balance: `${user.balance}`});
    return res.json({message: `${user.balance}`});
  }catch(error)
  {
    console.error("Error fetching transactions:", error); 
    return res.status(500).json({ message: "Internal Server Error" });
  }
})

//Transfer money
router.post("/transfer1", async (req, res) => {
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

router.post("/request-address-change", async (req, res) => {
  try {
    const { userId, address, newAddress } = req.body;

    if (!userId || !address || !newAddress) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Store the request in the database
    const request = new AddressChangeRequest({
      userId,
      address,
      newAddress,
      status: "Pending",
    });
    //console.log(request);
    await request.save();

    res.json({ message: "Address change request sent for admin approval." });

  } catch (error) {
    console.error("Error requesting address change:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/statements", async (req, res) => {
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
//cheque store

router.post("/cheques", async (req, res) => {
  try {
      const { fromuserID,touserID, amount } = req.body;

      // Validate input
      if (!fromuserID || !touserID || amount === undefined) {
          return res.status(400).json({ message: "User ID and balance are required" });
      }

      // Create a new cheque entry (default status: pending)
      const newCheque = new Cheque({
          fromuserID,
          touserID,
          amount,
          status: "pending", // Waiting for admin approval
      });

      await newCheque.save();

      res.status(201).json({ message: "Cheque submitted for approval", cheque: newCheque });

  } catch (error) {
      console.error("Error handling cheque:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});
export default router;
