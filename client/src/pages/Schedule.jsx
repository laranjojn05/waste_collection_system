import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import BackgroundFx from "../components/backgroundfx";
import { getSchedules } from "../services/scheduleService";
import { barangays } from "../data/barangays";

const MotionDiv = motion.div;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarangay, setSelectedBarangay] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
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
  }, [userInfo.token]);

  const filteredSchedules = useMemo(() => {
    if (!selectedBarangay) return schedules;
    return schedules.filter(
      (schedule) => schedule.barangay === selectedBarangay
    );
  }, [schedules, selectedBarangay]);

  const upcomingCount = useMemo(
    () =>
      filteredSchedules.filter(
        (schedule) => String(schedule.status || "").toLowerCase() === "upcoming"
      ).length,
    [filteredSchedules]
  );

  const completedCount = useMemo(
    () =>
      filteredSchedules.filter(
        (schedule) => String(schedule.status || "").toLowerCase() === "completed"
      ).length,
    [filteredSchedules]
  );

  const cancelledCount = useMemo(
    () =>
      filteredSchedules.filter(
        (schedule) => String(schedule.status || "").toLowerCase() === "cancelled"
      ).length,
    [filteredSchedules]
  );

  const formatDate = (dateValue) => {
    if (!dateValue) return "No date available";

    const parsed = new Date(dateValue);
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

    return "border-white/10 bg-white/8 text-emerald-100/75";
  };

  const getWasteTypeClasses = (wasteType) => {
    const normalized = String(wasteType || "").toLowerCase();

    if (normalized.includes("biodegradable")) {
      return "border-emerald-300/20 bg-emerald-400/10 text-emerald-200";
    }

    if (normalized.includes("non-biodegradable")) {
      return "border-amber-300/20 bg-amber-400/10 text-amber-200";
    }

    if (normalized.includes("recyclable")) {
      return "border-cyan-300/20 bg-cyan-400/10 text-cyan-200";
    }

    if (normalized.includes("special")) {
      return "border-violet-300/20 bg-violet-400/10 text-violet-200";
    }

    return "border-white/10 bg-white/8 text-emerald-100/75";
  };

  return (
    <div className="app-shell relative min-h-screen bg-slate-950">
      <BackgroundFx />
      <div className="pointer-events-none absolute inset-0 bg-slate-950/75" />
      <div className="pointer-events-none absolute left-[-140px] top-[90px] h-[340px] w-[340px] rounded-full bg-emerald-400/7 blur-[100px]" />
      <div className="pointer-events-none absolute right-[-120px] top-[140px] h-[420px] w-[420px] rounded-full bg-green-400/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-160px] left-[28%] h-[420px] w-[420px] rounded-full bg-teal-300/5 blur-[130px]" />

      <div className="relative z-10">
        <Navbar />

        <div className="px-4 pt-6 sm:px-6">
          <div className="mx-auto max-w-7xl">

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MotionDiv
                {...fadeUp(0.04)}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-md backdrop-blur-xl"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                  Filtered Total
                </p>
                <p className="mt-2 text-3xl font-bold text-emerald-50">
                  {filteredSchedules.length}
                </p>
                <p className="mt-2 text-sm text-emerald-100/65">
                  Visible schedule records
                </p>
              </MotionDiv>

              <MotionDiv
                {...fadeUp(0.08)}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-md backdrop-blur-xl"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                  Upcoming
                </p>
                <p className="mt-2 text-3xl font-bold text-emerald-300">
                  {upcomingCount}
                </p>
                <p className="mt-2 text-sm text-emerald-100/65">
                  Active upcoming pickups
                </p>
              </MotionDiv>

              <MotionDiv
                {...fadeUp(0.12)}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-md backdrop-blur-xl"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                  Completed
                </p>
                <p className="mt-2 text-3xl font-bold text-cyan-200">
                  {completedCount}
                </p>
                <p className="mt-2 text-sm text-emerald-100/65">
                  Finished schedules
                </p>
              </MotionDiv>

              <MotionDiv
                {...fadeUp(0.16)}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-md backdrop-blur-xl"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                  Cancelled
                </p>
                <p className="mt-2 text-3xl font-bold text-red-200">
                  {cancelledCount}
                </p>
                <p className="mt-2 text-sm text-emerald-100/65">
                  Cancelled entries
                </p>
              </MotionDiv>
            </div>

            <MotionDiv
              {...fadeUp(0.2)}
              className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-md backdrop-blur-xl sm:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-lg">
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-emerald-50">
                    Select your location
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                    Choose a barangay to narrow the schedule list, or keep it on
                    all barangays to view the complete collection schedule.
                  </p>
                </div>

                <div className="w-full max-w-md">
                  <label className="mb-2 block text-sm font-medium text-emerald-100/82">
                    Barangay
                  </label>
                  <div className="relative">
                    <select
                      className="soft-input appearance-none pr-12 text-emerald-50"
                      value={selectedBarangay}
                      onChange={(e) => setSelectedBarangay(e.target.value)}
                    >
                      <option value="" className="bg-[#0b1d17] text-emerald-50">
                        All Barangays
                      </option>
                      {barangays.map((barangay) => (
                        <option
                          key={barangay}
                          value={barangay}
                          className="bg-[#0b1d17] text-emerald-50"
                        >
                          {barangay}
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
              </div>
            </MotionDiv>

            <div className="mt-8">
              {loading ? (
                <MotionDiv
                  {...fadeUp(0.24)}
                  className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-center shadow-md backdrop-blur-xl"
                >
                  <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-emerald-300/20 border-t-emerald-300" />
                  <p className="text-sm font-medium text-emerald-100/75">
                    Loading schedules...
                  </p>
                </MotionDiv>
              ) : filteredSchedules.length === 0 ? (
                <MotionDiv
                  {...fadeUp(0.24)}
                  className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-center shadow-md backdrop-blur-xl"
                >
                  <p className="text-xl font-semibold text-emerald-50">
                    No schedules found
                  </p>
                  <p className="mt-3 text-sm leading-6 text-emerald-100/65">
                    There are no collection schedules matching the selected
                    barangay right now.
                  </p>
                </MotionDiv>
              ) : (
                <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                  {filteredSchedules.map((schedule, index) => (
                    <MotionDiv
                      key={schedule._id}
                      {...fadeUp(0.08 + index * 0.04)}
                      className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-md backdrop-blur-xl transition duration-300 hover:border-emerald-300/20"
                    >
                      <div className="relative z-10">
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/45">
                              Barangay
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-emerald-50">
                              {schedule.barangay}
                            </h2>
                          </div>

                          <span
                            className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${getStatusClasses(
                              schedule.status
                            )}`}
                          >
                            {schedule.status || "Unknown"}
                          </span>
                        </div>

                        <div className="mb-5 flex flex-wrap gap-2">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getWasteTypeClasses(
                              schedule.wasteType
                            )}`}
                          >
                            {schedule.wasteType || "No waste type"}
                          </span>
                        </div>

                        <div className="glow-line mb-5" />

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                              Collection Date
                            </p>
                            <p className="mt-2 text-sm font-medium text-emerald-50">
                              {formatDate(schedule.collectionDate)}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                              Schedule Status
                            </p>
                            <p className="mt-2 text-sm font-medium text-emerald-50">
                              {schedule.status || "Unknown"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                            Note
                          </p>
                          <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                            {schedule.note || "No note"}
                          </p>
                        </div>
                      </div>
                    </MotionDiv>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;