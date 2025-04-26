import React, { useState, useEffect } from "react";
import "./style.css";

const UserDashboard = () => {
  // Active section state
  const [activeSection, setActiveSection] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [statementType, setStatementType] = useState("monthly");
  // User data state
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    fromAccount: "",
    toAccount: "",
    amount: "",
    address: "",
    newAddress: "",
    chequeNumber: "",
  });
  //load logged in user data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser)); // Restore user data
    }
  }, []);

  //input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Fetch Transactions
  const handleFetchTransactions = async (e) => {
    e.preventDefault();
    console.log(`${userData._id}`);

    try {
      console.log("Requesting transactions for:", `${userData._id}`);

      const response = await fetch(
        "http://localhost:5000/api/auth/transactions1",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: `${userData._id}` }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received transactions:", data);

      if (data.transactions) {
        setTransactions(data.transactions);
      } else {
        alert("No transactions found for this user.");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
      alert(`Failed to fetch transactions: ${error.message}`);
    }
  };

  const handleBalanceEnquiry = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/balanceenquiry1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: `${userData._id}` }),
        }
      );
      console.log(userData._id);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      if (data !== undefined) {
        alert(`Balance: Rs ${data.message}`);
      } else {
        alert("User not found");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      alert("Failed to fetch balance. Please try again.");
    }
  };

  const handleFundTransfer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/transfer1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromId: userData._id,
          toId: userData.toAccount,
          amount: parseFloat(userData.amount),
        }),
      });
      console.log(userData.amount);

      // Update local state if transfer was successful
      if (response.ok) {
        const amount = parseFloat(userData.amount);
        const updatedUsers = users.map((user) => {
          if (user.id === userData.fromAccount) {
            return {
              ...user,
              balance: user.balance - amount,
              transactions: [
                ...user.transactions,
                { type: "debit", amount, timestamp: new Date().toISOString() },
              ],
            };
          } else if (user.id === userData.toAccount) {
            return {
              ...user,
              balance: user.balance + amount,
              transactions: [
                ...user.transactions,
                { type: "credit", amount, timestamp: new Date().toISOString() },
              ],
            };
          }
          return user;
        });
        const data = await response.json();
        alert(data.message);

        setUsers(updatedUsers);
        setUserData({
          ...userData,
          fromAccount: "",
          toAccount: "",
          amount: "",
        });
      }
    } catch (error) {
      console.error("Error transferring funds:", error);
      alert("Failed to transfer funds. Please try again.");
    }
  };
  //handle address change
  const handleAddressChange = async (e) => {
    e.preventDefault();

    if (!userData.newAddress) {
      alert("Please fill in both old and new addresses.");
      return;
    }

    try {
      console.log("Requesting address change for:", `${userData._id}`);

      const response = await fetch(
        "http://localhost:5000/api/auth/request-address-change",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userData._id,
            address: userData.address,
            newAddress: userData.newAddress,
          }),
        }
      );
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Request failed: ${errorMessage}`);
      }

      const data = await response.json();
      alert(data.message);

      // ✅ Reset input fields after request
      setUserData({ ...userData, newAddress: "" });
    } catch (error) {
      console.error("Error requesting address change:", error);
      alert("Failed to request address change. Please try again.");
    }
  };

  ///handle statements
  const handleStatements = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/statements",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userData._id, type: "monthly" }),
        }
      );
      console.log(userData._id);
      if (!response.ok) {
        alert("User not found or no statements available");
        return;
      }

      const data = await response.json();

      const user = users.find((u) => u.id === userData.userId);
      // console.log("User Found:", userData.userId); // 🛠 Debugging Log
      console.log("hi");
      console.log({
        id: userData.userId,
        username: data.username,
        balance: data.balance,
        address: data.address,
        statements: data.statements || { monthly: [], annual: [] },
      });
      setLogs({
        id: userData._id,
        username: data.username,
        balance: data.balance,
        address: data.address,
        statements: {
          monthly: data.statements || [], // Put all statements under monthly by default
          annual: [], // Keep annual empty for now
        },
      });

      //console.log(selectedUser.username);
    } catch (error) {
      console.error("Error fetching statements:", error);
      alert("Failed to fetch statements.");
    }
  };

  //handling cheques
  const handleCheques = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:5000/api/auth/cheques", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fromuserID:userData._id,touserID: userData.userId, amount: parseFloat(userData.amount) }), // Send userID and balance
        });

        console.log(userData._id); // Debugging log

        if (!response.ok) {
            alert("Failed to submit cheque");
            return;
        }

        const data = await response.json();
        alert(data.message);
        console.log("Cheque Submitted:", {
            fromid: userData._id,
            toId:userData.userId,
            amount: parseFloat(userData.amount),
            status: data.status || "pending", // Default to pending
        });

    } catch (error) {
        console.error("Error submitting cheque:", error);
        alert("Failed to submit cheque.");
    }
};


  // Logout function
  const handleLogout = () => {
    setActiveSection("");
    setUserData({
      username: "",
      password: "",
      userId: "",
      fromAccount: "",
      toAccount: "",
      amount: "",
      address: "",
      chequeNumber: "",
    });
  };

  // Render the active section
  const renderActiveSection = () => {
    switch (activeSection) {
      case "viewTransactions":
        return (
          <div>
            <h2>View Transactions</h2>
            <div className="card">
              <form onSubmit={handleFetchTransactions}>
                <button type="submit" className="btn btn-primary">
                  View Transactions
                </button>
              </form>
            </div>

            {transactions.length > 0 ? (
              <div className="card">
                <h3>Transactions for User ID: {userData.userId}</h3>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <tr key={index}>
                          <td
                            className={
                              transaction.type === "credit"
                                ? "credit-text"
                                : "debit-text"
                            }
                          >
                            {transaction.type === "credit" ? "Credit" : "Debit"}
                          </td>
                          <td>Rs {transaction.amount.toLocaleString()}</td>
                          <td>
                            {new Date(transaction.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="no-data">No transactions available</p>
            )}
          </div>
        );
      case "balanceEnquiry":
        return (
          <div>
            <h2>Balance Enquiry</h2>
            <div className="card">
              <form onSubmit={handleBalanceEnquiry}>
                <button type="submit" className="btn btn-primary">
                  Check Balance
                </button>
              </form>
            </div>
          </div>
        );
      case "fundTransfer":
        return (
          <div>
            <h2>Fund Transfer</h2>
            <div className="card">
              <form onSubmit={handleFundTransfer}>
                <div className="form-group">
                  <label>To Account (ID)</label>
                  <input
                    type="text"
                    name="toAccount"
                    value={userData.toAccount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={userData.amount}
                    onChange={handleInputChange}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Transfer Funds
                </button>
              </form>
            </div>
          </div>
        );
      case "addresschange":
        return (
          <div>
            <h2>Address Change</h2>
            <div className="card">
              <form onSubmit={handleAddressChange}>
                <div className="form-group">
                  <label>Old Address</label>
                  <input
                    type="text"
                    name="oldAddress"
                    value={userData.address || "Loading..."} // ✅ Show "Loading..." until fetched
                    disabled // ✅ Prevent user edits
                    required
                  />
                  <label>New Address</label>
                  <input
                    type="text"
                    name="newAddress"
                    value={userData.newAddress || ""} // ✅ Prevents undefined
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Send Request
                </button>
              </form>
            </div>
          </div>
        );
      case "poochka":
        return (
          <div>
            <h2>View Statements</h2>
            <div className="card">
              <form onSubmit={handleStatements}>
                <div className="form-group">
                  <label>User ID</label>
                </div>
                <div className="form-group">
                  <button
                    type="button" // Changed to type="button" since these just change state
                    onClick={() => setStatementType("monthly")}
                    className={`btn ${
                      statementType === "monthly" ? "btn-primary" : ""
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatementType("annual")}
                    className={`btn ${
                      statementType === "annual" ? "btn-primary" : ""
                    }`}
                  >
                    Annual
                  </button>
                </div>
                <button type="submit" className="btn btn-primary">
                  View Statements
                </button>
              </form>
            </div>

            {logs && (
              <div className="card">
                <h3>Statements for: {logs.username}</h3>

                <div className="statement-section">
                  <h4>
                    {statementType === "monthly"
                      ? "Monthly Statements"
                      : "Annual Statements"}
                  </h4>
                  {logs &&
                    logs.statements &&
                    (logs.statements[statementType]?.length > 0 ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {logs.statements[statementType].map(
                            (statement, index) => (
                              <tr key={index}>
                                <td>
                                  {new Date(
                                    statement.date
                                  ).toLocaleDateString()}
                                </td>
                                <td>{statement.description}</td>
                                <td
                                  className={
                                    statement.amount < 0
                                      ? "debit-text"
                                      : "credit-text"
                                  }
                                >
                                  Rs{" "}
                                  {Math.abs(statement.amount).toLocaleString()}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <p className="no-data">No statements available</p>
                    ))}
                </div>
              </div>
            )}
          </div>
        );
      case "cheques":
        return (
          <div>
            <h2>Cheque Payment</h2>
            <div className="card">
              <form onSubmit={handleCheques}>
                <button type="submit" className="btn btn-primary">
                  Cheque Payment
                </button>
                <div className="form-group">
                  <label>To UserId(ID)</label>
                  <input
                    type="text"
                    name="userId"
                    value={userData.userId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={userData.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </form>
            </div>
          </div>
        );
      default:
        return <div>Select an option from the menu</div>;
    }
  };

  // Main Dashboard Layout
  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-content">
          <h1>Online Banking User</h1>
          <div className="user-actions">
            <span>Welcome, {userData.username}</span>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <nav>
            <ul className="nav-menu">
              <li>
                <button
                  onClick={() => setActiveSection("viewTransactions")}
                  className={
                    activeSection === "viewTransactions" ? "active" : ""
                  }
                >
                  View Transactions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("balanceEnquiry")}
                  className={activeSection === "balanceEnquiry" ? "active" : ""}
                >
                  Balance Enquiry
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("fundTransfer")}
                  className={activeSection === "fundTransfer" ? "active" : ""}
                >
                  Fund Transfer
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("addresschange")}
                  className={activeSection === "addresschange" ? "active" : ""}
                >
                  Address Change
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("poochka")}
                  className={activeSection === "poochka" ? "active" : ""}
                >
                  Statements
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("cheques")}
                  className={activeSection === "cheques" ? "active" : ""}
                >
                  Cheque Payment
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="content-area">{renderActiveSection()}</main>
      </div>
    </div>
  );
};

export default UserDashboard;
