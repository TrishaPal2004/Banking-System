import { BrowserRouter , Routes, Route, Navigate } from "react-router-dom";
import React,{ useState } from "react";
import Admin from "./components/admin";
import User from "./components/userDashboard"
import Login from "./components/Login";
import Home from "./components/Home";
import ServiceDetail from "./components/ServiceDetail";
import LoadingScreen from "./components/load";
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Handle loading completion
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // If still loading, show loading screen
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/services/:serviceId" element={<ServiceDetail />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes> 
    </BrowserRouter>
  );
};

export default App;
