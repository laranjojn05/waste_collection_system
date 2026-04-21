import { useEffect, useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundFx from "../../components/backgroundfx";
import { getUserReports } from "../../services/reportService";
import { updateUserStatus } from "../../services/userService";

const MotionDiv = motion.div;

const ManageUserReports = () => {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") return;

    const fetchReports = async () => {
      try {
        const data = await getUserReports(userInfo.token);
        setReports(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch user reports:", error);
        setReports([]);
      }
    };

    fetchReports();
  }, [userInfo]);

  const handleAction = async (userId, status) => {
    try {
      await updateUserStatus(userId, status, userInfo.token);

      setReports((prev) => prev.filter((group) => group.user._id !== userId));

      alert(`User has been ${status} successfully`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user");
    }
  };

  const sidebarLinks = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/users", label: "Manage Users" },
    { to: "/admin/user-reports", label: "User Reports" },
  ];

  const getWarningLevel = (count) => {
    if (count >= 3) {
      return {
        label: "Critical",
        className: "border-red-400/30 bg-red-500/10 text-red-200",
        cardClass:
          "border-red-400/25 bg-gradient-to-br from-red-500/10 to-white/[0.04]",
      };
    }

    if (count === 2) {
      return {
        label: "Warning 2",
        className:
          "border-yellow-400/30 bg-yellow-500/10 text-yellow-200",
        cardClass:
          "border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 to-white/[0.04]",
      };
    }

    return {
      label: "Warning 1",
      className: "border-cyan-400/30 bg-cyan-500/10 text-cyan-200",
      cardClass:
        "border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02]",
    };
  };

  const totalGroups = reports.length;
  const criticalCount = reports.filter((group) => group.reports.length >= 3).length;
  const totalReportCount = reports.reduce(
    (sum, group) => sum + group.reports.length,
    0
  );

  if (!userInfo) return <Navigate to="/" />;
  if (userInfo.role !== "admin") return <Navigate to="/home" />;

  return (
    <div className="app-shell min-h-screen">
      <BackgroundFx />

      <div className="relative z-10 flex min-h-screen gap-4 p-3 lg:p-4">
        <aside className="hidden w-[250px] shrink-0 rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl xl:flex xl:flex-col">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100/50">
              Admin Panel
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-emerald-50">
              User Reports Center
            </h1>
            <p className="mt-2 text-sm leading-6 text-emerald-100/65">
              Review repeated user reports and take action when needed.
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

        <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden pr-1">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.06] px-5 py-4 shadow-[0_14px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100/50">
              User Report Management
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-emerald-50">
              Manage User Reports
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-emerald-100/65">
              Users with three or more reports can be suspended or banned by the admin.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                Reported Users
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-50">
                {totalGroups}
              </p>
              <p className="mt-2 text-sm text-emerald-100/65">
                Users with submitted reports
              </p>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                Total Reports
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-50">
                {totalReportCount}
              </p>
              <p className="mt-2 text-sm text-emerald-100/65">
                Operator-submitted user reports
              </p>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-[24px] border border-red-400/20 bg-red-500/10 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200/80">
                Critical Cases
              </p>
              <p className="mt-2 text-3xl font-bold text-red-200">
                {criticalCount}
              </p>
              <p className="mt-2 text-sm text-red-100/70">
                Eligible for suspend or ban
              </p>
            </MotionDiv>
          </div>

          {reports.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.06] px-5 py-10 text-center shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
              <p className="text-xl font-semibold text-emerald-50">
                No user reports found
              </p>
              <p className="mt-2 text-sm text-emerald-100/65">
                Reports submitted by operators will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((group, index) => {
                const user = group.user;
                const count = group.reports.length;
                const warning = getWarningLevel(count);

                return (
                  <MotionDiv
                    key={user._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`rounded-[28px] border p-5 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl ${warning.cardClass}`}
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold tracking-tight text-emerald-50">
                            {user.name}
                          </h3>

                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${warning.className}`}
                          >
                            {warning.label}
                          </span>

                          <span className="inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-100/70">
                            {count} report{count > 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                              Email
                            </p>
                            <p className="mt-1 break-all text-sm font-medium text-emerald-50">
                              {user.email}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                              Current Status
                            </p>
                            <p className="mt-1 text-sm font-medium capitalize text-emerald-50">
                              {user.status || "active"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {count >= 3 && (
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => handleAction(user._id, "suspended")}
                            className="rounded-[16px] border border-yellow-300/20 bg-yellow-500/15 px-4 py-2 text-sm font-semibold text-yellow-100 transition duration-300 hover:bg-yellow-500/25"
                          >
                            Suspend
                          </button>

                          <button
                            onClick={() => handleAction(user._id, "banned")}
                            className="rounded-[16px] border border-red-300/20 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-100 transition duration-300 hover:bg-red-500/25"
                          >
                            Ban
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 space-y-3">
                      {group.reports.map((report, idx) => (
                        <div
                          key={report._id}
                          className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/45">
                              Report #{idx + 1}
                            </p>
                            <p className="text-xs text-emerald-100/50">
                              By: {report.createdBy?.name || "Unknown"}
                            </p>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-emerald-100/72">
                            {report.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </MotionDiv>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageUserReports;