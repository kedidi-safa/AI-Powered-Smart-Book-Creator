import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { BookOpen, Lock, Mail } from "lucide-react";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);
      const { token } = response.data;

      const userResponse = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = userResponse.data;
      login(userData, token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed: ", error);
      localStorage.clear();
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-6 text-slate-900">
            Welcome Back
          </h1>
          <p className="text-slate-600 mt-2">Please login to your account</p>
        </div>
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" isLoading={isLoading} className="w-full">
              Login
            </Button>
          </form>
          <p className="text-center text-sm text-slate-600 mt-8">
            {" "}
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-yellow-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
