import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundFx from "../components/backgroundfx";
import { barangays } from "../data/barangays";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../services/scheduleService";

const MotionDiv = motion.div;

const ManageSchedules = () => {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [schedules, setSchedules] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    barangay: "",
    collectionDate: "",
    wasteType: "Biodegradable",
    status: "Upcoming",
    note: "",
  });

  useEffect(() => {
    if (!userInfo || userInfo.role !== "operator") return;

    const fetchSchedules = async () => {
      try {
        const data = await getSchedules(userInfo.token);
        setSchedules(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [userInfo]);

  const resetForm = () => {
    setForm({
      barangay: "",
      collectionDate: "",
      wasteType: "Biodegradable",
      status: "Upcoming",
      note: "",
    });
    setEditingId(null);
  };

  const refreshSchedules = async () => {
    const data = await getSchedules(userInfo.token);
    setSchedules(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        collectionDate: new Date(form.collectionDate).toISOString(),
      };

      if (editingId) {
        await updateSchedule(editingId, payload, userInfo.token);
        alert("Schedule updated successfully");
      } else {
        await createSchedule(payload, userInfo.token);
        alert("Schedule created successfully");
      }

      resetForm();
      await refreshSchedules();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save schedule");
    }
  };

  const handleEdit = (schedule) => {
    setEditingId(schedule._id);
    setForm({
      barangay: schedule.barangay,
      collectionDate: schedule.collectionDate
        ? new Date(schedule.collectionDate).toISOString().split("T")[0]
        : "",
      wasteType: schedule.wasteType,
      status: schedule.status,
      note: schedule.note || "",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this schedule?");
    if (!confirmed) return;

    try {
      await deleteSchedule(id, userInfo.token);
      await refreshSchedules();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete schedule");
    }
  };

  const sidebarLinks = [
    { to: "/operator/reports", label: "Manage Reports" },
    { to: "/operator/schedules", label: "Manage Schedules" },
  ];

  const upcomingCount = useMemo(
    () =>
      schedules.filter(
        (item) => String(item.status || "").toLowerCase() === "upcoming"
      ).length,
    [schedules]
  );

  const completedCount = useMemo(
    () =>
      schedules.filter(
        (item) => String(item.status || "").toLowerCase() === "completed"
      ).length,
    [schedules]
  );

  const cancelledCount = useMemo(
    () =>
      schedules.filter(
        (item) => String(item.status || "").toLowerCase() === "cancelled"
      ).length,
    [schedules]
  );

  const formatDate = (value) => {
    if (!value) return "No date";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "Invalid date";

    return parsed.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusClasses = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "upcoming") {
      return "border-emerald-300/20 bg-emerald-400/10 text-emerald-200";
    }

    if (normalized === "completed") {
      return "border-cyan-300/20 bg-cyan-400/10 text-cyan-200";
    }

    if (normalized === "cancelled") {
      return "border-red-300/20 bg-red-400/10 text-red-200";
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
              Schedule Center
            </h1>
            <p className="mt-2 text-sm leading-6 text-emerald-100/65">
              Create, edit, and manage barangay collection schedules.
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
                Schedule Management
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-emerald-50">
                Manage Schedules
              </h2>
            </div>

            <Link
              to="/home"
              className="rounded-[14px] border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-emerald-50 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05] xl:hidden"
            >
              Home
            </Link>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr] xl:items-start">
            <MotionDiv
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                    Form
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-emerald-50">
                    {editingId ? "Edit Schedule" : "Create Schedule"}
                  </h3>
                </div>

                {editingId && (
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
                    Editing
                  </span>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <select
                    className="soft-input appearance-none pr-12 text-emerald-50"
                    value={form.barangay}
                    onChange={(e) => setForm({ ...form, barangay: e.target.value })}
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

                <input
                  type="date"
                  className="soft-input"
                  value={form.collectionDate}
                  onChange={(e) =>
                    setForm({ ...form, collectionDate: e.target.value })
                  }
                  required
                />

                <div className="relative">
                  <select
                    className="soft-input appearance-none pr-12 text-emerald-50"
                    value={form.wasteType}
                    onChange={(e) => setForm({ ...form, wasteType: e.target.value })}
                  >
                    <option
                      value="Biodegradable"
                      className="bg-[#0b1d17] text-emerald-50"
                    >
                      Biodegradable
                    </option>
                    <option
                      value="Non-Biodegradable"
                      className="bg-[#0b1d17] text-emerald-50"
                    >
                      Non-Biodegradable
                    </option>
                    <option
                      value="Recyclable"
                      className="bg-[#0b1d17] text-emerald-50"
                    >
                      Recyclable
                    </option>
                    <option
                      value="Special Waste"
                      className="bg-[#0b1d17] text-emerald-50"
                    >
                      Special Waste
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

                <div className="relative">
                  <select
                    className="soft-input appearance-none pr-12 text-emerald-50"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Upcoming" className="bg-[#0b1d17] text-emerald-50">
                      Upcoming
                    </option>
                    <option value="Completed" className="bg-[#0b1d17] text-emerald-50">
                      Completed
                    </option>
                    <option value="Cancelled" className="bg-[#0b1d17] text-emerald-50">
                      Cancelled
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
                  placeholder="Add a note for this schedule"
                  className="soft-input min-h-[120px]"
                  rows="4"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />

                <div className="flex gap-3">
                  <button className="soft-button soft-button-primary">
                    {editingId ? "Update Schedule" : "Create Schedule"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="soft-button soft-button-secondary"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                    Total
                  </p>
                  <p className="mt-2 text-3xl font-bold text-emerald-50">
                    {schedules.length}
                  </p>
                  <p className="mt-2 text-sm text-emerald-100/65">
                    Schedule records
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                    Upcoming
                  </p>
                  <p className="mt-2 text-3xl font-bold text-emerald-300">
                    {upcomingCount}
                  </p>
                  <p className="mt-2 text-sm text-emerald-100/65">
                    Active upcoming entries
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                    Completed
                  </p>
                  <p className="mt-2 text-3xl font-bold text-cyan-200">
                    {completedCount}
                  </p>
                  <p className="mt-2 text-sm text-emerald-100/65">
                    Finished schedules
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                      Records
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-emerald-50">
                      Existing schedules
                    </h3>
                  </div>

                  <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/60">
                    Cancelled: {cancelledCount}
                  </div>
                </div>

                {loading ? (
                  <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-8 text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-emerald-300/20 border-t-emerald-300" />
                    <p className="text-sm text-emerald-100/70">
                      Loading schedules...
                    </p>
                  </div>
                ) : schedules.length === 0 ? (
                  <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-8 text-center">
                    <p className="text-lg font-semibold text-emerald-50">
                      No schedules found
                    </p>
                    <p className="mt-2 text-sm text-emerald-100/65">
                      Create your first schedule using the form on the left.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {schedules.map((schedule) => (
                      <div
                        key={schedule._id}
                        className="rounded-[22px] border border-white/8 bg-black/20 p-4"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h4 className="text-lg font-semibold text-emerald-50">
                                {schedule.barangay}
                              </h4>
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getStatusClasses(
                                  schedule.status
                                )}`}
                              >
                                {schedule.status}
                              </span>
                            </div>

                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                                <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                                  Collection Date
                                </p>
                                <p className="mt-1 text-sm font-medium text-emerald-50">
                                  {formatDate(schedule.collectionDate)}
                                </p>
                              </div>

                              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                                <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                                  Waste Type
                                </p>
                                <p className="mt-1 text-sm font-medium text-emerald-50">
                                  {schedule.wasteType}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                              <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                                Note
                              </p>
                              <p className="mt-1 text-sm leading-6 text-emerald-100/70">
                                {schedule.note || "No note"}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 gap-2">
                            <button
                              onClick={() => handleEdit(schedule)}
                              className="soft-button soft-button-secondary px-4 py-2"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(schedule._id)}
                              className="rounded-[16px] border border-red-300/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition duration-300 hover:bg-red-500/15"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </MotionDiv>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageSchedules;