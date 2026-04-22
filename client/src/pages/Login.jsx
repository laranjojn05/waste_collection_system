import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const MotionDiv = motion.div;
const MotionButton = motion.button;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(form);
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="app-shell relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute left-[-140px] top-[90px] h-[340px] w-[340px] rounded-full bg-emerald-400/8 blur-[100px]" />
        <div className="absolute right-[-120px] top-[140px] h-[420px] w-[420px] rounded-full bg-green-400/6 blur-[120px]" />
        <div className="absolute bottom-[-160px] left-[28%] h-[420px] w-[420px] rounded-full bg-teal-300/6 blur-[130px]" />
      </div>

      {/* Centered Layout */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-6">
        
        <MotionDiv
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="relative w-full max-w-md"
        >
          <div className="absolute inset-0 -z-10 rounded-full bg-emerald-400/8 blur-3xl" />

          <MotionDiv className="glass-card rounded-[32px] p-6 sm:p-8 shadow-md">
            
            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-emerald-50">
                Welcome!
              </h2>
              <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                Login to continue to the waste collection and reporting system.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-emerald-100/82"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="soft-input"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-emerald-100/82"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="soft-input pr-12"
                    required
                  />

                  {/* Show/Hide Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/8 bg-white/6 text-emerald-100/70 transition duration-300 hover:bg-white/10 hover:text-white"
                  >
                    {showPassword ? (
                      <svg
                        className="h-4.5 w-4.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4.5 w-4.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Button */}
              <MotionButton
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full rounded-[18px] bg-emerald-400 px-4 py-3.5 font-semibold text-slate-950 shadow-md transition duration-300 hover:bg-emerald-300"
              >
                Login
              </MotionButton>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-emerald-100/68">
              Do not have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-emerald-300 transition duration-300 hover:text-emerald-200"
              >
                Create one
              </Link>
            </p>

          </MotionDiv>
        </MotionDiv>
      </div>
    </div>
  );
};

export default Login;