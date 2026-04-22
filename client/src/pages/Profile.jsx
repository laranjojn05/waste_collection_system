import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import BackgroundFx from "../components/backgroundfx";
import { useAuth } from "../context/useAuth";
import { barangays } from "../data/barangays";

const MotionDiv = motion.div;
const MotionButton = motion.button;

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    barangay: user?.barangay || "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateUser(form);
      alert("Profile updated successfully");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="app-shell relative h-screen overflow-hidden bg-slate-950">
      <BackgroundFx />
      <div className="pointer-events-none absolute inset-0 bg-slate-950/75" />
      <div className="pointer-events-none absolute left-[-140px] top-[90px] h-[340px] w-[340px] rounded-full bg-emerald-400/7 blur-[100px]" />
      <div className="pointer-events-none absolute right-[-120px] top-[140px] h-[420px] w-[420px] rounded-full bg-green-400/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-160px] left-[28%] h-[420px] w-[420px] rounded-full bg-teal-300/5 blur-[130px]" />

      <div className="relative z-10">
        <Navbar />

        <div className="flex h-[calc(100vh-64px)] items-start justify-center px-4 pt-5 sm:px-6">
            <div className="flex h-full max-w-xl items-center justify-center">
              <MotionDiv
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.06 }}
                className="glass-card w-full rounded-[32px] bg-white/5 px-5 py-4 shadow-md backdrop-blur-xl sm:px-6 sm:py-5"
              >
                <div className="mb-5 text-center">
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-emerald-50">
                    Edit Profile
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                    Save changes to your profile information and account settings.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-emerald-100/82">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="soft-input"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-emerald-100/82">
                        Email
                      </label>
                      <input
                        type="email"
                        className="soft-input"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-emerald-100/82">
                        Barangay
                      </label>

                      <div className="relative">
                        <select
                          className="soft-input appearance-none pr-12 text-slate-900"
                          value={form.barangay}
                          onChange={(e) =>
                            setForm({ ...form, barangay: e.target.value })
                          }
                          required
                        >
                          <option value="">Select Barangay</option>
                          {barangays.map((b) => (
                            <option key={b} value={b}>
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

                    <div>
                      <label className="mb-2 block text-sm font-medium text-emerald-100/82">
                        Role
                      </label>
                      <input
                        type="text"
                        className="soft-input cursor-not-allowed bg-white/4 capitalize opacity-80"
                        value={user?.role || ""}
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-emerald-100/82">
                      New Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="soft-input pr-12"
                        placeholder="Leave blank if unchanged"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
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

                  <MotionButton
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full rounded-[18px] bg-emerald-400 px-4 py-3.5 font-semibold text-slate-950 shadow-md transition duration-300 hover:bg-emerald-300"
                  >
                    Save Changes
                  </MotionButton>
                </form>
              </MotionDiv>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;