import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundFx from "../components/backgroundfx";
import {
  getAllReports,
  updateReportStatus,
  deleteAnyReport,
} from "../services/reportService";

const MotionDiv = motion.div;

const ManageReports = () => {
  const location = useLocation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!userInfo || userInfo.role !== "operator") return;

    const fetchReports = async () => {
      try {
        const data = await getAllReports(userInfo.token);
        setReports(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userInfo]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateReportStatus(id, status, userInfo.token);

      setReports((prev) =>
        prev.map((report) =>
          report._id === id ? { ...report, status } : report
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this report?");
    if (!confirmed) return;

    try {
      await deleteAnyReport(id, userInfo.token);
      setReports((prev) => prev.filter((report) => report._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete report");
    }
  };

  const sidebarLinks = [
    { to: "/operator/reports", label: "Manage Reports" },
    { to: "/operator/schedules", label: "Manage Schedules" },
  ];

  const pendingCount = useMemo(
    () =>
      reports.filter(
        (item) => String(item.status || "").toLowerCase() === "pending"
      ).length,
    [reports]
  );

  const approvedCount = useMemo(
    () =>
      reports.filter(
        (item) => String(item.status || "").toLowerCase() === "approved"
      ).length,
    [reports]
  );

  const rejectedCount = useMemo(
    () =>
      reports.filter(
        (item) => String(item.status || "").toLowerCase() === "rejected"
      ).length,
    [reports]
  );

  const resolvedCount = useMemo(
    () =>
      reports.filter(
        (item) => String(item.status || "").toLowerCase() === "resolved"
      ).length,
    [reports]
  );

  const getStatusClasses = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "pending") {
      return "border-amber-300/20 bg-amber-400/10 text-amber-200";
    }

    if (normalized === "approved") {
      return "border-cyan-300/20 bg-cyan-400/10 text-cyan-200";
    }

    if (normalized === "rejected") {
      return "border-red-300/20 bg-red-400/10 text-red-200";
    }

    if (normalized === "resolved") {
      return "border-emerald-300/20 bg-emerald-400/10 text-emerald-200";
    }

    return "border-white/10 bg-white/10 text-emerald-100/70";
  };

  if (!userInfo) {
    return <Navigate to="/" />;
  }

  if (userInfo.role !== "operator") {
    return <Navigate to="/home" />;
  }

  return (
    <div className="app-shell h-screen overflow-hidden">
      <BackgroundFx />

      <div className="relative z-10 flex h-screen gap-4 p-3 lg:p-4">
        <aside className="hidden h-full w-[250px] shrink-0 rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl xl:flex xl:flex-col">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100/50">
              Operator Panel
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-emerald-50">
              Reports Center
            </h1>
            <p className="mt-2 text-sm leading-6 text-emerald-100/65">
              Review submitted reports, update status, and maintain issue records.
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
          <div className="flex shrink-0 items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-3 shadow-[0_14px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100/50">
                Report Management
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-emerald-50">
                Manage Reports
              </h2>
            </div>

            <Link
              to="/home"
              className="rounded-[14px] border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-emerald-50 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05] xl:hidden"
            >
              Home
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                Total
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-50">
                {reports.length}
              </p>
              <p className="mt-2 text-sm text-emerald-100/65">
                All submitted reports
              </p>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.04 }}
              className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                Pending
              </p>
              <p className="mt-2 text-3xl font-bold text-amber-200">
                {pendingCount}
              </p>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                Approved
              </p>
              <p className="mt-2 text-3xl font-bold text-cyan-200">
                {approvedCount}
              </p>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.12 }}
              className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                Resolved
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-300">
                {resolvedCount}
              </p>
            </MotionDiv>
          </div>

          <MotionDiv
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                  Records
                </p>
                <h3 className="mt-1 text-xl font-semibold text-emerald-50">
                  Submitted reports
                </h3>
              </div>

              <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/60">
                Rejected: {rejectedCount}
              </div>
            </div>

            {loading ? (
              <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-8 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-emerald-300/20 border-t-emerald-300" />
                <p className="text-sm text-emerald-100/70">
                  Loading reports...
                </p>
              </div>
            ) : reports.length === 0 ? (
              <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-8 text-center">
                <p className="text-lg font-semibold text-emerald-50">
                  No reports found
                </p>
                <p className="mt-2 text-sm text-emerald-100/65">
                  Submitted reports will appear here once users create them.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report._id}
                    className="rounded-[22px] border border-white/8 bg-black/20 p-4"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-lg font-semibold text-emerald-50">
                            {report.issueType || "Unspecified Issue"}
                          </h4>
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getStatusClasses(
                              report.status
                            )}`}
                          >
                            {report.status || "Unknown"}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                              User
                            </p>
                            <p className="mt-1 text-sm font-medium text-emerald-50">
                              {report.user?.name || "Unknown user"}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                              Location
                            </p>
                            <p className="mt-1 text-sm font-medium text-emerald-50">
                              {report.location || report.barangay || "No location"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                          <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                            Description
                          </p>
                          <p className="mt-1 text-sm leading-6 text-emerald-100/70">
                            {report.description || "No description provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-3 xl:w-[220px]">
                        <div className="relative">
                          <select
                            className="soft-input appearance-none pr-12 text-emerald-50"
                            value={report.status}
                            onChange={(e) =>
                              handleStatusChange(report._id, e.target.value)
                            }
                          >
                            <option value="Pending" className="bg-[#0b1d17] text-emerald-50">
                              Pending
                            </option>
                            <option value="Approved" className="bg-[#0b1d17] text-emerald-50">
                              Approved
                            </option>
                            <option value="Rejected" className="bg-[#0b1d17] text-emerald-50">
                              Rejected
                            </option>
                            <option value="Resolved" className="bg-[#0b1d17] text-emerald-50">
                              Resolved
                            </option>
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

                        <button
                          onClick={() => handleDelete(report._id)}
                          className="rounded-[16px] border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition duration-300 hover:bg-red-500/15"
                        >
                          Delete Report
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </MotionDiv>
        </main>
      </div>
    </div>
  );
};

export default ManageReports;