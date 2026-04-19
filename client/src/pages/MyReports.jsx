import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import BackgroundFx from "../components/backgroundfx";
import { barangays } from "../data/barangays";
import {
  getMyReports,
  updateMyReport,
  deleteMyReport,
} from "../services/reportService";

const MotionDiv = motion.div;
const MotionButton = motion.button;

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [form, setForm] = useState({
    issueType: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getMyReports(userInfo.token);
        setReports(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userInfo.token]);

  const resetForm = () => {
    setForm({
      issueType: "",
      description: "",
      location: "",
    });
    setEditingId(null);
  };

  const handleEdit = (report) => {
    if (report.status !== "Pending") {
      alert("Only pending reports can be edited.");
      return;
    }

    setEditingId(report._id);
    setForm({
      issueType: report.issueType,
      description: report.description,
      location: report.location,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateMyReport(editingId, form, userInfo.token);
      const data = await getMyReports(userInfo.token);
      setReports(Array.isArray(data) ? data : []);
      resetForm();
      alert("Report updated successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update report");
    }
  };

  const handleDelete = async (id, status) => {
    if (status !== "Pending") {
      alert("Only pending reports can be deleted.");
      return;
    }

    const confirmed = window.confirm("Delete this report?");
    if (!confirmed) return;

    try {
      await deleteMyReport(id, userInfo.token);
      const data = await getMyReports(userInfo.token);
      setReports(Array.isArray(data) ? data : []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete report");
    }
  };

  const pendingCount = useMemo(
    () =>
      reports.filter(
        (report) => String(report.status || "").toLowerCase() === "pending"
      ).length,
    [reports]
  );

  const inProgressCount = useMemo(
    () =>
      reports.filter(
        (report) => String(report.status || "").toLowerCase() === "in progress"
      ).length,
    [reports]
  );

  const resolvedCount = useMemo(
    () =>
      reports.filter(
        (report) => String(report.status || "").toLowerCase() === "resolved"
      ).length,
    [reports]
  );

  const getStatusStyle = (status) => {
    const s = String(status || "").toLowerCase();

    if (s === "pending") {
      return "border-amber-300/20 bg-amber-400/10 text-amber-200";
    }

    if (s === "in progress") {
      return "border-cyan-300/20 bg-cyan-400/10 text-cyan-200";
    }

    if (s === "resolved") {
      return "border-emerald-300/20 bg-emerald-400/10 text-emerald-200";
    }

    return "border-white/10 bg-white/10 text-white";
  };

  const formatDateTime = (value) => {
    if (!value) return "No date";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "Invalid date";

    return parsed.toLocaleString();
  };

  return (
    <div className="app-shell">
      <BackgroundFx />
      <Navbar />

      <div className="page-wrap">
        <div className="page-container">
          <MotionDiv
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-emerald-300/15 bg-white/8 px-4 py-2 backdrop-blur-xl">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.75)]" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/75">
                Report Tracking
              </span>
            </div>

            <h1 className="section-title">My Reports</h1>
            <p className="section-subtitle mt-3 max-w-2xl">
              Review your submitted reports, check status updates, and edit or
              delete reports that are still pending.
            </p>
          </MotionDiv>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                Total Reports
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-50">
                {reports.length}
              </p>
              <p className="mt-2 text-sm text-emerald-100/65">
                All your submissions
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                Pending
              </p>
              <p className="mt-2 text-3xl font-bold text-amber-200">
                {pendingCount}
              </p>
              <p className="mt-2 text-sm text-emerald-100/65">
                Editable reports
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                In Progress
              </p>
              <p className="mt-2 text-3xl font-bold text-cyan-200">
                {inProgressCount}
              </p>
              <p className="mt-2 text-sm text-emerald-100/65">
                Currently under review
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                Resolved
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-300">
                {resolvedCount}
              </p>
              <p className="mt-2 text-sm text-emerald-100/65">
                Completed reports
              </p>
            </div>
          </div>

          {editingId && (
            <MotionDiv
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card mb-6 rounded-[28px] p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                    Edit Mode
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-emerald-50">
                    Update Report
                  </h2>
                </div>

                <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-200">
                  Pending Only
                </span>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="relative">
                  <select
                    className="soft-input appearance-none pr-12 text-emerald-50"
                    value={form.issueType}
                    onChange={(e) =>
                      setForm({ ...form, issueType: e.target.value })
                    }
                    required
                  >
                    <option value="" className="bg-[#0b1d17] text-emerald-50">
                      Select issue type
                    </option>
                    <option
                      value="Missed Collection"
                      className="bg-[#0b1d17] text-emerald-50"
                    >
                      Missed Collection
                    </option>
                    <option
                      value="Illegal Dumping"
                      className="bg-[#0b1d17] text-emerald-50"
                    >
                      Illegal Dumping
                    </option>
                    <option
                      value="Overflowing Bin"
                      className="bg-[#0b1d17] text-emerald-50"
                    >
                      Overflowing Bin
                    </option>
                    <option
                      value="Uncollected Waste"
                      className="bg-[#0b1d17] text-emerald-50"
                    >
                      Uncollected Waste
                    </option>
                    <option value="Other" className="bg-[#0b1d17] text-emerald-50">
                      Other
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

                <textarea
                  className="soft-input min-h-[130px]"
                  rows="4"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Update the issue details"
                  required
                />

                <div className="relative">
                  <select
                    className="soft-input appearance-none pr-12 text-emerald-50"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
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

                <div className="flex gap-3">
                  <MotionButton
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    className="soft-button soft-button-primary"
                  >
                    Update Report
                  </MotionButton>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="soft-button soft-button-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </MotionDiv>
          )}

          {loading ? (
            <div className="glass-card rounded-[24px] p-8 text-center">
              <p className="text-emerald-100/70">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="glass-card rounded-[24px] p-8 text-center">
              <p className="text-lg font-semibold text-emerald-50">
                No reports submitted yet
              </p>
              <p className="mt-2 text-emerald-100/60">
                Your submitted reports will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {reports.map((report) => (
                <MotionDiv
                  key={report._id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                        Issue Type
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-emerald-50">
                        {report.issueType}
                      </h2>
                    </div>

                    <span
                      className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getStatusStyle(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                        Barangay
                      </p>
                      <p className="mt-2 text-sm font-medium text-emerald-50">
                        {report.location || "No barangay"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                        Submitted
                      </p>
                      <p className="mt-2 text-sm font-medium text-emerald-50">
                        {formatDateTime(report.createdAt)}
                      </p>
                    </div>
                  </div>

               <div className="mt-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
  <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
    Description
  </p>

  <p className="mt-2 text-sm leading-7 text-emerald-100/72">
    {report.description}
  </p>

  {report.photo && (
    <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
      <img
        src={`http://localhost:5002${report.photo}`}
        alt="Report"
        className="h-44 w-full object-cover"
      />
    </div>
  )}
</div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleEdit(report)}
                      className="soft-button soft-button-secondary"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(report._id, report.status)}
                      className="rounded-[16px] border border-red-300/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition duration-300 hover:bg-red-500/15"
                    >
                      Delete
                    </button>
                  </div>
                </MotionDiv>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReports;