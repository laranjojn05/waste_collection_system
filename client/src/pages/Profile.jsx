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
    <div className="app-shell">
      <BackgroundFx />
      <Navbar />

      <div className="page-wrap">
        <div className="page-container">
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-start">
            <MotionDiv
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-8"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_32%)]" />

              <div className="relative z-10">
                <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-emerald-300/15 bg-white/8 px-4 py-2 backdrop-blur-xl">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.75)]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/75">
                    Account Profile
                  </span>
                </div>

                <h1 className="text-4xl font-bold leading-[0.98] tracking-[-0.05em] text-emerald-50 sm:text-5xl">
                  Manage your account details with a cleaner profile workspace.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-100/68 sm:text-base">
                  Update your personal details, assigned barangay, and password
                  from one polished page while keeping your account information
                  organized and secure.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                      Full Name
                    </p>
                    <p className="mt-2 text-sm font-semibold text-emerald-50">
                      {user?.name || "No name"}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                      Barangay
                    </p>
                    <p className="mt-2 text-sm font-semibold text-emerald-50">
                      {user?.barangay || "No barangay"}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                      Role
                    </p>
                    <p className="mt-2 text-sm font-semibold capitalize text-emerald-50">
                      {user?.role || "user"}
                    </p>
                  </div>
                </div>
              </div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="glass-card rounded-[32px] p-6 sm:p-8"
            >
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/50">
                  Profile Form
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-emerald-50">
                  Edit Profile
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                  Save changes to your profile information and account settings.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div>
                  <label className="mb-2 block text-sm font-medium text-emerald-100/82">
                    Barangay
                  </label>

                  <div className="relative">
                    <select
                      className="soft-input appearance-none pr-12 text-emerald-50"
                      value={form.barangay}
                      onChange={(e) =>
                        setForm({ ...form, barangay: e.target.value })
                      }
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

                <div>
                  <label className="mb-2 block text-sm font-medium text-emerald-100/82">
                    Role
                  </label>
                  <input
                    type="text"
                    className="soft-input cursor-not-allowed bg-white/[0.03] capitalize opacity-80"
                    value={user?.role || ""}
                    disabled
                  />
                </div>

                <MotionButton
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  className="relative w-full overflow-hidden rounded-[18px] bg-gradient-to-r from-emerald-400 to-green-500 px-4 py-3.5 font-semibold text-slate-950 shadow-[0_14px_34px_rgba(34,197,94,0.24)] transition duration-300 hover:shadow-[0_18px_42px_rgba(34,197,94,0.3)]"
                >
                  <span className="relative z-10">Save Changes</span>

                  <motion.span
                    className="absolute inset-y-0 left-[-35%] w-1/3 skew-x-[-18deg] bg-white/35"
                    animate={{ left: ["-35%", "135%"] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                  />
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