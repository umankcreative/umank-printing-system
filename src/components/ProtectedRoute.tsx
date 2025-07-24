import React from 'react';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { Button } from "./ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { LogOut, User, Mail, Settings, Building, Phone, MapPin } from "lucide-react";
// import { toast } from "sonner";
// import { useAuth } from "/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // const handleLogout = () => {
  //   logout();
  //   toast.success("Logged out successfully!");
  //   navigate("/login");
  // };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>};

export default ProtectedRoute; 