import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { BookOpen, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const SignupPage = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData);
        const { token } = response.data;
        
        const userResponse = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = userResponse.data;
        login(userData, token);
        toast.success("Registration successful!");
        navigate("/dashboard");
    } catch (error) {
      console.error("Register failed: ", error);
      toast.error(
        error.response?.data?.message || "Register failed. Please try again.",
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
            Create an account
          </h1>
          <p className="text-slate-600 mt-2">
            Start your journey in creating smart books with us today!
          </p>
        </div>
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Full Name"
              name="name"
              type="name"
              placeholder="Enter your full name"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              required
            />
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
              Register
            </Button>
          </form>
          <p className="text-center text-sm text-slate-600 mt-8">
            {" "}
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-yellow-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
