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
      <div className="absolute inset-0">
        <MotionDiv
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 18% 18%, rgba(16,185,129,0.22), transparent 24%), radial-gradient(circle at 82% 22%, rgba(34,197,94,0.12), transparent 22%), radial-gradient(circle at 50% 100%, rgba(45,212,191,0.10), transparent 28%), linear-gradient(135deg, #020617 0%, #03110d 26%, #052e25 60%, #03110d 100%)",
              "radial-gradient(circle at 26% 24%, rgba(16,185,129,0.26), transparent 26%), radial-gradient(circle at 74% 30%, rgba(34,197,94,0.14), transparent 24%), radial-gradient(circle at 50% 100%, rgba(45,212,191,0.12), transparent 30%), linear-gradient(135deg, #020617 0%, #04160f 30%, #06382d 64%, #02110c 100%)",
              "radial-gradient(circle at 18% 18%, rgba(16,185,129,0.22), transparent 24%), radial-gradient(circle at 82% 22%, rgba(34,197,94,0.12), transparent 22%), radial-gradient(circle at 50% 100%, rgba(45,212,191,0.10), transparent 28%), linear-gradient(135deg, #020617 0%, #03110d 26%, #052e25 60%, #03110d 100%)",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="bg-mesh opacity-60" />

        <MotionDiv
          className="absolute left-[-140px] top-[90px] h-[340px] w-[340px] rounded-full bg-emerald-400/12 blur-[100px]"
          animate={{
            x: [0, 60, -20, 0],
            y: [0, -20, 18, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <MotionDiv
          className="absolute right-[-120px] top-[140px] h-[420px] w-[420px] rounded-full bg-green-400/10 blur-[120px]"
          animate={{
            x: [0, -45, 20, 0],
            y: [0, 20, -20, 0],
            scale: [1, 0.95, 1.08, 1],
          }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        />

        <MotionDiv
          className="absolute bottom-[-160px] left-[28%] h-[420px] w-[420px] rounded-full bg-teal-300/10 blur-[130px]"
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 10, 0],
            scale: [1, 1.05, 0.94, 1],
          }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        />

        <MotionDiv
          className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/8 to-transparent blur-2xl"
          animate={{ x: ["-40%", "140%"] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-6">
        <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <MotionDiv
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-emerald-300/15 bg-white/8 px-4 py-2 backdrop-blur-xl">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.75)]" />
              <span className="text-sm font-medium text-emerald-50/85">
                Aurora Waste Collection and Reporting
              </span>
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-emerald-50 xl:text-6xl">
              Cleaner reporting, organized schedules, and a premium local service dashboard.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-emerald-100/70 xl:text-lg">
              Sign in to access collection schedules, submit waste reports, and
              manage your account through a polished barangay-based system built
              for local operations.
            </p>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-4">
              <MotionDiv
                whileHover={{ y: -4, scale: 1.01 }}
                className="rounded-[24px] border border-white/10 bg-white/8 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl"
              >
                <p className="text-2xl font-bold text-emerald-300">Schedules</p>
                <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                  View collection timing with barangay-based filtering.
                </p>
              </MotionDiv>

              <MotionDiv
                whileHover={{ y: -4, scale: 1.01 }}
                className="rounded-[24px] border border-white/10 bg-white/8 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl"
              >
                <p className="text-2xl font-bold text-emerald-300">Reports</p>
                <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                  Submit and manage pending reports in one secure workspace.
                </p>
              </MotionDiv>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute inset-0 -z-10 rounded-full bg-emerald-400/10 blur-3xl" />

            <MotionDiv
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="glass-card rounded-[32px] p-6 sm:p-8"
            >
              <div className="mb-8 text-center">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200/55">
                  Secure Access
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-emerald-50">
                  Welcome Back
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                  Login to continue to the waste collection and reporting system.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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

                <div className="flex items-center justify-between gap-3 text-sm">
                  <p className="text-emerald-100/50">Protected login access</p>
                  <p className="text-emerald-300/80">Secure session</p>
                </div>

                <MotionButton
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  className="relative w-full overflow-hidden rounded-[18px] bg-gradient-to-r from-emerald-400 to-green-500 px-4 py-3.5 font-semibold text-slate-950 shadow-[0_14px_34px_rgba(34,197,94,0.24)] transition duration-300 hover:shadow-[0_18px_42px_rgba(34,197,94,0.3)]"
                >
                  <span className="relative z-10">Login</span>

                  <motion.span
                    className="absolute inset-y-0 left-[-35%] w-1/3 skew-x-[-18deg] bg-white/35"
                    animate={{ left: ["-35%", "135%"] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                  />
                </MotionButton>
              </form>

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
    </div>
  );
};

export default Login;