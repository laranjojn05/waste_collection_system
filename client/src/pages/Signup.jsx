import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { barangays } from "../data/barangays";

const MotionDiv = motion.div;
const MotionButton = motion.button;

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    barangay: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signup(form);
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="app-shell relative h-screen overflow-hidden">
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute left-[-140px] top-[90px] h-[340px] w-[340px] rounded-full bg-emerald-400/8 blur-[100px]" />
        <div className="absolute right-[-120px] top-[140px] h-[420px] w-[420px] rounded-full bg-green-400/6 blur-[120px]" />
        <div className="absolute bottom-[-160px] left-[28%] h-[420px] w-[420px] rounded-full bg-teal-300/6 blur-[130px]" />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-4 py-4 sm:px-6">
        <MotionDiv
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="relative w-full max-w-[460px]"
        >
          <div className="absolute inset-0 -z-10 rounded-full bg-emerald-400/8 blur-3xl" />

          <MotionDiv className="glass-card rounded-[28px] px-5 py-5 shadow-md sm:px-6 sm:py-6">
            <div className="mb-5 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-emerald-50 sm:text-3xl">
                Sign Up
              </h2>
              <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                Register to continue to the waste collection and reporting
                system.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-emerald-100/82"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="soft-input py-3"
                  required
                />
              </div>

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
                  className="soft-input py-3"
                  required
                />
              </div>

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
                    className="soft-input py-3 pr-12"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/8 bg-white/6 text-emerald-100/70 transition duration-300 hover:bg-white/10 hover:text-white"
                  >
                    {showPassword ? (
                      <svg
                        className="h-4 w-4"
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
                        className="h-4 w-4"
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

              <div>
                <label
                  htmlFor="barangay"
                  className="mb-2 block text-sm font-medium text-emerald-100/82"
                >
                  Barangay
                </label>

                <div className="relative">
                  <select
                    id="barangay"
                    name="barangay"
                    value={form.barangay}
                    onChange={handleChange}
                    className="soft-input appearance-none py-3 pr-12 text-emerald-50"
                    required
                  >
                    <option value="" className="bg-[#0b1d17] text-emerald-50">
                      Select Barangay
                    </option>
                    {barangays.map((b) => (
                      <option
                        key={b}
                        value={b}
                        className="bg-[#0b1d17] text-emerald-50"
                      >
                        {b}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-emerald-200/70">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <MotionButton
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full rounded-[16px] bg-emerald-400 px-4 py-3 font-semibold text-slate-950 shadow-md transition duration-300 hover:bg-emerald-300"
              >
                Create Account
              </MotionButton>
            </form>

            <p className="mt-5 text-center text-sm text-emerald-100/68">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-semibold text-emerald-300 transition duration-300 hover:text-emerald-200"
              >
                Login
              </Link>
            </p>
          </MotionDiv>
        </MotionDiv>
      </div>
    </div>
  );
};

export default Signup;