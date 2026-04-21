import { useEffect, useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundFx from "../../components/backgroundfx";
import { reportUser } from "../../services/reportService";
import { getAllUsers } from "../../services/userService";

const MotionDiv = motion.div;

const ReportUser = () => {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [form, setForm] = useState({
    userId: "",
    reason: "",
  });

  useEffect(() => {
    if (!userInfo || userInfo.role !== "operator") {
      setLoadingUsers(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(userInfo.token);

        const filteredUsers = Array.isArray(data)
          ? data.filter(
              (user) => String(user.role || "").toLowerCase() === "user"
            )
          : [];

        setUsers(filteredUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await reportUser(
        {
          userId: form.userId,
          reason: form.reason,
        },
        userInfo.token
      );

      alert("User reported to admin successfully");

      setForm({
        userId: "",
        reason: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to report user");
    }
  };

  const selectedUser = users.find((user) => user._id === form.userId);

  const sidebarLinks = [
    { to: "/operator/reports", label: "Manage Reports" },
    { to: "/operator/schedules", label: "Manage Schedules" },
    { to: "/operator/announcements", label: "Manage Announcements" },
    { to: "/operator/report-user", label: "Report User" },
  ];

  if (!userInfo) return <Navigate to="/" />;
  if (userInfo.role !== "operator") return <Navigate to="/home" />;

  return (
    <div className="app-shell min-h-screen">
      <BackgroundFx />

      <div className="relative z-10 flex min-h-screen gap-4 p-3 lg:p-4">
        <aside className="hidden w-[250px] shrink-0 rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl xl:flex xl:flex-col">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100/50">
              Operator Panel
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-emerald-50">
              User Report Center
            </h1>
            <p className="mt-2 text-sm leading-6 text-emerald-100/65">
              Submit a report to admin about a user account concern.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {sidebarLinks.map((item) => {
              const active = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block rounded-[20px] border px-4 py-3 transition duration-300 ${
                    active
                      ? "border-emerald-300/20 bg-emerald-400/10 text-white shadow-[0_0_0_1px_rgba(52,211,153,0.08)]"
                      : "border-white/10 bg-black/20 text-emerald-100/78 hover:border-emerald-300/20 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto">
            <Link
              to="/home"
              className="flex items-center justify-center rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold text-emerald-50 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05]"
            >
              Back to Home
            </Link>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.06] px-5 py-4 shadow-[0_14px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100/50">
              User Account Reporting
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-emerald-50">
              Report User
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-emerald-100/65">
              Select a user, describe the concern clearly, and send the report
              to the admin for review.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
            <MotionDiv
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
            >
              <div className="mb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                  Form
                </p>
                <h3 className="mt-1 text-xl font-semibold text-emerald-50">
                  Submit user report
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <select
                    className="soft-input appearance-none pr-12 text-emerald-50"
                    value={form.userId}
                    onChange={(e) =>
                      setForm({ ...form, userId: e.target.value })
                    }
                    required
                  >
                    <option value="" className="bg-[#0b1d17] text-emerald-50">
                      Select User
                    </option>
                    {users.map((user) => (
                      <option
                        key={user._id}
                        value={user._id}
                        className="bg-[#0b1d17] text-emerald-50"
                      >
                        {user.name} - {user.email}
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

                <textarea
                  placeholder="Enter the reason for reporting this user"
                  className="soft-input min-h-[180px]"
                  rows="7"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  required
                />

                <button className="soft-button soft-button-primary px-6 py-3">
                  Submit Report
                </button>
              </form>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
            >
              <div className="mb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                  Preview
                </p>
                <h3 className="mt-1 text-xl font-semibold text-emerald-50">
                  Selected user
                </h3>
              </div>

              {loadingUsers ? (
                <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-8 text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-emerald-300/20 border-t-emerald-300" />
                  <p className="text-sm text-emerald-100/70">
                    Loading users...
                  </p>
                </div>
              ) : selectedUser ? (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                      Full Name
                    </p>
                    <p className="mt-1 text-sm font-medium text-emerald-50">
                      {selectedUser.name}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                      Email
                    </p>
                    <p className="mt-1 break-all text-sm font-medium text-emerald-50">
                      {selectedUser.email}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                      Barangay
                    </p>
                    <p className="mt-1 text-sm font-medium text-emerald-50">
                      {selectedUser.barangay || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-medium capitalize text-emerald-50">
                      {selectedUser.status || "active"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-8 text-center">
                  <p className="text-lg font-semibold text-emerald-50">
                    No user selected
                  </p>
                  <p className="mt-2 text-sm text-emerald-100/65">
                    Select a user from the dropdown to preview their account
                    details here.
                  </p>
                </div>
              )}
            </MotionDiv>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportUser;