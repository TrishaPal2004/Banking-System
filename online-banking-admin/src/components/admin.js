import React, { useState, useEffect } from "react";
import "./style.css";

const OnlineBankingAdmin = () => {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [addressRequests, setAddressRequests] = useState([]);
  const [chequeRequests, setChequeRequests] = useState([]);
  const [statementType, setStatementType] = useState("monthly");

  // Current active section
  const [activeSection, setActiveSection] = useState("");

  // Form data for different operations
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    userId: "",
    fromAccount: "",
    toAccount: "",
    amount: "",
    address: "",
    chequeNumber: "",
  });

  // Add a state for transactions
  const [transactions, setTransactions] = useState([]);

  // Mock data
  const [users, setUsers] = useState([]);

  // Selected user data
  const [selectedUser, setSelectedUser] = useState(null);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    // Mock authentication - in a real app this would verify against a backend
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true);
      setActiveSection("dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setActiveSection("");
  };

  // Handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Handler for creating user credentials
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
        }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create user.");
    }
  };

  const handleBalanceEnquiry = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5001/balanceenquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: userData.userId }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      if (data) {
        alert(`${data.message}`);
  
        setSelectedUser((prevState) => ({
          ...prevState,
          id: userData.userId,
          username: data.username || "N/A",
          balance: data.balance || 0,
          address: data.address || "Address not available",
        }));
  
        console.log("Updated selectedUser:", selectedUser);
      } else {
        alert("User not found");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      alert("Failed to fetch balance. Please try again.");
    }
  };
  
  const fetchUsers = async () => {  // ✅ Now a global function (reusable)
    try {
      const response = await fetch("http://localhost:5001/getUsers");
      if (!response.ok) throw new Error("Failed to fetch users");
  
      const data = await response.json();
      console.log("Fetched Users:", data);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  useEffect(() => {
    fetchUsers(); // ✅ Runs when component mounts
  }, []);

  //fund transfer
  const handleFundTransfer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromId: userData.fromAccount,
          toId: userData.toAccount,
          amount: parseFloat(userData.amount),
        }),
      });

      const data = await response.json();
      alert(data.message);

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
        fetchUsers();
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

  
  //ADDRESS CHANGE REQUESTS
  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/get-pending-address-requests"
      );
      const data = await response.json();
      setAddressRequests(data);
    } catch (error) {
      console.error("Error fetching address requests:", error);
    }
  };

  // ✅ Approve or Reject address change
  const handleAdminDecision = async (requestId, decision) => {
    try {
      const response = await fetch(
        `http://localhost:5001/admin/address-change/${requestId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: decision === "approve" ? "Approved" : "Rejected",
          }),
        }
      );

      const data = await response.json();
      alert(data.message);
      fetchPendingRequests(); // Refresh requests after action
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Failed to update request. Try again.");
    }
  };
  useEffect(() => {
    fetchPendingRequests();
  }, []);


//calling fetchPendingRequests2() when the component mounts or when the cheques section is activated.
  useEffect(() => {
    if (activeSection === "cheques") {
      fetchPendingRequests2();
    }
  }, [activeSection]);
  //check if any request iis there for address change
  const fetchPendingRequests2 = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/get-pending-cheque-requests"
      );
      const data = await response.json();
      console.log(data);
      setChequeRequests(data);
    } catch (error) {
      console.error("Error fetching address requests:", error);
    }
  }; 
  // Handler for stopping a cheque payment
  const handleStopCheque = async (requestId,fromuserID,touserID, decision) => {
    try {
      const response = await fetch(
        `http://localhost:5001/admin/approvecheque/${requestId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromuserID,
            touserID,
            approved: decision,
          }),
        }
      );

      const data = await response.json();
      alert(data.message);
      fetchPendingRequests2(); // Refresh requests after action
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Failed to update request. Try again.");
    }
  };


  // Fixed: Show transactions function
  const handleFetchTransactions = async (e) => {
    e.preventDefault();

    try {
      // First try to get user from backend
      const response = await fetch("http://localhost:5001/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userData.userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);

        // Find user and set as selected
        const user = users.find((u) => u.id === userData.userId);
        if (user) {
          setSelectedUser({ ...user, transactions: data.transactions || [] });
        } else {
          // If user not found in local state but exists in backend
          setSelectedUser({
            id: userData.userId,
            username: data.username,
            balance:data.balance,
            transactions: data.transactions || [],
          });
        }
      } else {
        // If backend request fails, try to use local data
        const user = users.find((u) => u.id === userData.userId);
        if (user) {
          setSelectedUser(user);
          setTransactions(user.transactions || []);
        } else {
          alert("User not found");
        }
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);

      // Fallback to local data if backend fails
      const user = users.find((u) => u.id === userData.userId);
      if (user) {
        setSelectedUser(user);
        setTransactions(user.transactions || []);
      } else {
        alert("Failed to fetch transactions and user not found locally");
      }
    }
  };

  //Statements part
  const handleViewStatements = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/statements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userData.userId, type: "monthly" }),
      });

      if (!response.ok) {
        alert("User not found or no statements available");
        return;
      }

      const data = await response.json();
    
      const user = users.find((u) => u.id === userData.userId);
      // console.log("User Found:", userData.userId); // 🛠 Debugging Log
      console.log(data);
      setSelectedUser({
        id: userData.userId,
        username: data.username ,
        balance:data.balance,
        address:data.address,
        statements: data.statements || { monthly: [], annual: [] },
      });
      console.log(selectedUser.username);
    } catch (error) {
      console.error("Error fetching statements:", error);
      alert("Failed to fetch statements.");
    }
  };

  //approve cheques
  


  // Render login form
  const renderLoginForm = () => (
    <div className="login-form">
      <h2>Administrator Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      <div className="login-hint">(Use "admin" / "admin123" to login)</div>
    </div>
  );

  // Render dashboard with navigation
  const renderDashboard = () => (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-content">
          <h1>Online Banking Admin</h1>
          <div className="user-actions">
            <span>Welcome, Admin</span>
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
                  onClick={() => setActiveSection("dashboard")}
                  className={activeSection === "dashboard" ? "active" : ""}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("createUser")}
                  className={activeSection === "createUser" ? "active" : ""}
                >
                  Create User
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
                  onClick={() => setActiveSection("addressChange")}
                  className={activeSection === "addressChange" ? "active" : ""}
                >
                  Address Change
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("cheques")}
                  className={activeSection === "cheques" ? "active" : ""}
                >
                  Stop Cheque
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("viewStatements")}
                  className={activeSection === "viewStatements" ? "active" : ""}
                >
                  View Statements
                </button>
              </li>
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
            </ul>
          </nav>
        </aside>

        <main className="content-area">{renderActiveSection()}</main>
      </div>
    </div>
  );

 
  
  // Render active section content
  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div>
            <h2>Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-value">{users.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Balance</h3>
                <p className="stat-value">
                  Rs{" "}
                  {users
                    .reduce((sum, user) => sum + (user.balance || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
      
            <h3>User List</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Balance</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user._id}</td>
                        <td>{user.username}</td>
                        <td>{user.password}</td>
                        <td>Rs {user.balance?.toLocaleString() || "0"}</td>
                        <td>{user.address || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No users available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "createUser":
        return (
          <div>
            <h2>Create User</h2>
            <div className="card">
              <form onSubmit={handleCreateUser}>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </form>
            </div>
          </div>
        );

      case "balanceEnquiry":
        return (
          <div>
            <h2>Balance Enquiry</h2>
            <div className="card">
              <form onSubmit={handleBalanceEnquiry}>
                <div className="form-group">
                  <label>User ID</label>
                  <input
                    type="text"
                    name="userId"
                    value={userData.userId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Check Balance
                </button>
              </form>
            </div>

            {selectedUser && (
              <div className="card user-info">
                <h3>User Information</h3>
                <p>
                  <strong>ID:</strong> {selectedUser.id}
                </p>
                <p>
                  <strong>Username:</strong> {selectedUser.username}
                </p>
                <p>
                  <strong>Balance:</strong> Rs{" "}
                  {selectedUser.balance?.toLocaleString() || "N/A"}
                </p>
                
              </div>
            )}
          </div>
        );

      case "fundTransfer":
        return (
          <div>
            <h2>Fund Transfer</h2>
            <div className="card">
              <form onSubmit={handleFundTransfer}>
                <div className="form-group">
                  <label>From Account (ID)</label>
                  <input
                    type="text"
                    name="fromAccount"
                    value={userData.fromAccount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
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

      case "addressChange":
        return (
          <div>
            <h2>Address Change Requests</h2>
            {addressRequests.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Old Address</th>
                    <th>New Address</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {addressRequests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.userId}</td>
                      <td>{request.address}</td>
                      <td>{request.newAddress}</td>
                      <td>{request.status}</td>
                      <td>
                        {request.status === "Pending" ? (
                          <>
                            <button
                              onClick={() =>
                                handleAdminDecision(request._id, "approve")
                              }
                              className="btn btn-success"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleAdminDecision(request._id, "reject")
                              }
                              className="btn btn-danger"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span>{request.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No pending address change requests.</p>
            )}
          </div>
        );

      case "stopCheque":
        return (
          <div>
            <h2>Stop Cheque Payment</h2>
            <div className="card">
              <form onSubmit={handleStopCheque}>
                <div className="form-group">
                  <label>User ID</label>
                  <input
                    type="text"
                    name="userId"
                    value={userData.userId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cheque Number</label>
                  <input
                    type="text"
                    name="chequeNumber"
                    value={userData.chequeNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Stop Cheque
                </button>
              </form>
            </div>
          </div>
        );

      case "viewStatements":
        return (
          <div>
            <h2>View Statements</h2>
            <div className="card">
              <form onSubmit={handleViewStatements}>
                <div className="form-group">
                  <label>User ID</label>
                  <input
                    type="text"
                    name="userId"
                    value={userData.userId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  View Statements
                </button>
              </form>
            </div>

            {selectedUser && (
              <div className="card">
                <h3>Statements for: {selectedUser.username}</h3>

                <div>
                  <button
                    onClick={() => setStatementType("monthly")}
                    className="btn"
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setStatementType("annual")}
                    className="btn"
                  >
                    Annual
                  </button>
                </div>

                <div className="statement-section">
                  <h4>
                    {statementType === "monthly"
                      ? "Monthly Statements"
                      : "Annual Statements"}
                  </h4>
                  {selectedUser.statements && Array.isArray(selectedUser.statements) && selectedUser.statements.length > 0 ? (

                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUser.statements.map((statement, index) => (
                            <tr key={index}>
                              <td>{statement.date}</td>
                              <td>{statement.description}</td>
                              <td>Rs {statement.amount.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="no-data">No statements available</p>
                    )}
                </div>
              </div>
            )}
          </div>
        );

      case "viewTransactions":
        return (
          <div>
            <h2>View Transactions</h2>
            <div className="card">
              <form onSubmit={handleFetchTransactions}>
                <div className="form-group">
                  <label>User ID</label>
                  <input
                    type="text"
                    name="userId"
                    value={userData.userId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  View Transactions
                </button>
              </form>
            </div>

            {selectedUser && (
              <div className="card">
                <h3>Transactions for User: {selectedUser.username}</h3>
                {selectedUser.transactions &&
                selectedUser.transactions.length > 0 ? (
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
                        {selectedUser.transactions.map((transaction, index) => (
                          <tr key={index}>
                            <td
                              className={
                                transaction.type === "credit"
                                  ? "credit-text"
                                  : "debit-text"
                              }
                            >
                              {transaction.type === "credit"
                                ? "Credit"
                                : "Debit"}
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
                ) : (
                  <p className="no-data">No transactions available</p>
                )}
              </div>
            )}
          </div>
        );

        case "cheques":
          return (
            <div>
              <h2>Cheque Requests</h2>
              {chequeRequests.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Time</th>
                      <th>Descision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chequeRequests.map((request) => (
                      <tr key={request._id}>
                        <td>{request.touserID}</td>
                        <td>{request.amount}</td>
                        <td>{request.status}</td>
                        <td>{request.createdAt}</td>
                        <td>
                          {request.status === "pending" ? (
                            <>
                              <button
                                onClick={() =>
                                  handleStopCheque(request._id,request.fromuserID,request.touserID, true)
                                }
                                className="btn btn-success"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleStopCheque(request._id,request.fromuserID,request.touserID,false)
                                }
                                className="btn btn-danger"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span>{request.status}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No pending address change requests.</p>
              )}
            </div>
          );
      default:
        return <div>Select an option from the menu</div>;
    }
  };

  // Main render function
  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <div className="login-container">{renderLoginForm()}</div>
      ) : (
        renderDashboard()
      )}
    </div>
  );
};

export default OnlineBankingAdmin;
