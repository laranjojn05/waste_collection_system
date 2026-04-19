import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import BackgroundFx from "../../components/backgroundfx";
import { getAllUsers } from "../../services/userService";
import { getAllReports } from "../../services/reportService";
import { getSchedules } from "../../services/scheduleService";
import { getAnnouncements } from "../../services/announcementService";

const MotionDiv = motion.div;

const AdminDashboard = () => {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        if (userInfo.role === "admin") {
          const [usersData, announcementsData] = await Promise.all([
            getAllUsers(userInfo.token),
            getAnnouncements(userInfo.token),
          ]);

          setUsers(Array.isArray(usersData) ? usersData : []);
          setAnnouncements(
            Array.isArray(announcementsData) ? announcementsData : []
          );
          setReports([]);
          setSchedules([]);
        } else if (userInfo.role === "operator") {
          const [reportsData, schedulesData, announcementsData] =
            await Promise.all([
              getAllReports(userInfo.token),
              getSchedules(userInfo.token),
              getAnnouncements(userInfo.token),
            ]);

          setUsers([]);
          setReports(Array.isArray(reportsData) ? reportsData : []);
          setSchedules(Array.isArray(schedulesData) ? schedulesData : []);
          setAnnouncements(
            Array.isArray(announcementsData) ? announcementsData : []
          );
        } else {
          setUsers([]);
          setReports([]);
          setSchedules([]);
          setAnnouncements([]);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userInfo]);

  const activeUsers = useMemo(
    () =>
      users.filter(
        (user) => String(user.status || "").toLowerCase() === "active"
      ).length,
    [users]
  );

  const suspendedUsers = useMemo(
    () =>
      users.filter(
        (user) => String(user.status || "").toLowerCase() === "suspended"
      ).length,
    [users]
  );

  const bannedUsers = useMemo(
    () =>
      users.filter(
        (user) => String(user.status || "").toLowerCase() === "banned"
      ).length,
    [users]
  );

  const pendingReports = useMemo(
    () =>
      reports.filter(
        (report) => String(report.status || "").toLowerCase() === "pending"
      ).length,
    [reports]
  );

  const approvedReports = useMemo(
    () =>
      reports.filter(
        (report) => String(report.status || "").toLowerCase() === "approved"
      ).length,
    [reports]
  );

  const rejectedReports = useMemo(
    () =>
      reports.filter(
        (report) => String(report.status || "").toLowerCase() === "rejected"
      ).length,
    [reports]
  );

  const resolvedReports = useMemo(
    () =>
      reports.filter(
        (report) => String(report.status || "").toLowerCase() === "resolved"
      ).length,
    [reports]
  );

  const recentReports = useMemo(() => [...reports].slice(0, 2), [reports]);
  const recentAnnouncements = useMemo(
    () => [...announcements].slice(0, 2),
    [announcements]
  );

  const sidebarLinks =
    userInfo?.role === "admin"
      ? [
          { to: "/admin", label: "Dashboard" },
          { to: "/admin/users", label: "Manage Users" },
          { to: "/admin/announcements", label: "Manage Announcements" },
        ]
      : [
          { to: "/operator/reports", label: "Manage Reports" },
          { to: "/operator/schedules", label: "Manage Schedules" },
        ];

  const statCards =
    userInfo?.role === "admin"
      ? [
          {
            label: "Total Users",
            value: users.length,
            helper: "Registered",
          },
          {
            label: "Active",
            value: activeUsers,
            helper: "Allowed",
          },
          {
            label: "Suspended",
            value: suspendedUsers,
            helper: "Temporary",
          },
          {
            label: "Banned",
            value: bannedUsers,
            helper: "Restricted",
          },
        ]
      : [
          {
            label: "Reports",
            value: reports.length,
            helper: "Submitted",
          },
          {
            label: "Pending",
            value: pendingReports,
            helper: "For review",
          },
          {
            label: "Schedules",
            value: schedules.length,
            helper: "Records",
          },
          {
            label: "Announcements",
            value: announcements.length,
            helper: "Published",
          },
        ];

  const chartData =
    userInfo?.role === "admin"
      ? [
          { name: "Users", value: users.length },
          { name: "Active", value: activeUsers },
          { name: "Suspended", value: suspendedUsers },
          { name: "Banned", value: bannedUsers },
          { name: "Announcements", value: announcements.length },
        ]
      : [
          { name: "Reports", value: reports.length },
          { name: "Pending", value: pendingReports },
          { name: "Approved", value: approvedReports },
          { name: "Resolved", value: resolvedReports },
          { name: "Schedules", value: schedules.length },
        ];

  const compositionData =
    userInfo?.role === "admin"
      ? [
          { name: "Active", value: activeUsers, fill: "#6ee7b7" },
          { name: "Suspended", value: suspendedUsers, fill: "#fcd34d" },
          { name: "Banned", value: bannedUsers, fill: "#f87171" },
          {
            name: "Announcements",
            value: announcements.length,
            fill: "#2dd4bf",
          },
        ]
      : [
          { name: "Pending", value: pendingReports, fill: "#fcd34d" },
          { name: "Approved", value: approvedReports, fill: "#67e8f9" },
          { name: "Rejected", value: rejectedReports, fill: "#f87171" },
          { name: "Resolved", value: resolvedReports, fill: "#6ee7b7" },
        ];

  const compositionTotal = compositionData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="rounded-xl border border-white/10 bg-[#071710]/95 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-100/55">
          {label || payload[0]?.name}
        </p>
        <p className="mt-1 text-sm font-semibold text-emerald-50">
          {payload[0].value}
        </p>
      </div>
    );
  };

  if (!userInfo) {
    return <Navigate to="/" />;
  }

  if (userInfo.role !== "admin" && userInfo.role !== "operator") {
    return <Navigate to="/home" />;
  }

  return (
    <div className="app-shell h-screen overflow-hidden">
      <BackgroundFx />

      <div className="relative z-10 flex h-screen gap-3 p-3">
        <aside className="hidden h-full w-[220px] shrink-0 rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-2xl xl:flex xl:flex-col">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-100/50">
              {userInfo.role === "admin" ? "Admin Panel" : "Operator Panel"}
            </p>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-emerald-50">
              Control Center
            </h1>
            <p className="mt-2 text-xs leading-5 text-emerald-100/62">
              {userInfo.role === "admin"
                ? "Moderation, users, and announcements."
                : "Reports, schedules, and updates."}
            </p>
          </div>

          <div className="mt-5 space-y-2.5">
            {sidebarLinks.map((item) => {
              const active = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block rounded-[18px] border px-4 py-3 transition duration-300 ${
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
              className="flex items-center justify-center rounded-[16px] border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold text-emerald-50 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05]"
            >
              Back to Home
            </Link>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden">
          <div className="flex shrink-0 items-center justify-between rounded-[20px] border border-white/10 bg-white/[0.06] px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100/50">
                {userInfo.role === "admin"
                  ? "Administrative Dashboard"
                  : "Operator Dashboard"}
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-emerald-50">
                System Overview
              </h2>
            </div>

            <Link
              to="/home"
              className="rounded-[14px] border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-emerald-50 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05] xl:hidden"
            >
              Home
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-1 items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.05] shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-emerald-300/20 border-t-emerald-300" />
                <p className="text-sm font-medium text-emerald-100/75">
                  Loading dashboard data...
                </p>
              </div>
            </div>
          ) : (
            <div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[1.2fr_0.8fr]">
              <MotionDiv
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex min-h-0 flex-col gap-3"
              >
                <section className="grid shrink-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {statCards.map((card, index) => (
                    <MotionDiv
                      key={card.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.03 + index * 0.03 }}
                      className="rounded-[20px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                        {card.label}
                      </p>
                      <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-50">
                        {card.value}
                      </p>
                      <p className="mt-1 text-xs text-emerald-100/62">
                        {card.helper}
                      </p>
                    </MotionDiv>
                  ))}
                </section>

                <section className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.45fr_0.55fr]">
                  <div className="flex min-h-0 flex-col gap-3">
                    <div className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                            Main Chart
                          </p>
                          <h3 className="mt-1 text-lg font-semibold text-emerald-50">
                            Core records
                          </h3>
                        </div>
                      </div>

                      <div className="mt-3 h-[210px] rounded-[18px] border border-white/8 bg-black/20 p-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} barCategoryGap={20}>
                            <CartesianGrid
                              stroke="rgba(255,255,255,0.05)"
                              vertical={false}
                            />
                            <XAxis
                              dataKey="name"
                              tick={{
                                fill: "rgba(236,253,245,0.5)",
                                fontSize: 10,
                              }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              allowDecimals={false}
                              tick={{
                                fill: "rgba(236,253,245,0.42)",
                                fontSize: 10,
                              }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip
                              content={<CustomTooltip />}
                              cursor={false}
                            />
                            <Bar
                              dataKey="value"
                              radius={[10, 10, 0, 0]}
                              fill="#10b981"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {userInfo.role === "admin" && (
                      <div className="rounded-[20px] border border-white/10 bg-white/[0.06] p-3 shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                            Admin Summary
                          </p>
                          <h3 className="mt-1 text-lg font-semibold text-emerald-50">
                            Moderation overview
                          </h3>
                        </div>

                       <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          <div className="rounded-[16px] border border-white/8 bg-black/20 px-4 py-2.5">
                            <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-100/45">
                              Registered accounts
                            </p>
                            <p className="mt-1 text-lg font-semibold text-emerald-50">
                              {users.length}
                            </p>
                          </div>

                          <div className="rounded-[16px] border border-white/8 bg-black/20 px-4 py-3">
                            <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-100/45">
                              Published announcements
                            </p>
                            <p className="mt-1 text-lg font-semibold text-emerald-50">
                              {announcements.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid min-h-0 content-start gap-3">
                    <div className="rounded-[20px] border border-white/10 bg-white/[0.06] p-3 shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                            Snapshot
                          </p>
                          <h3 className="mt-1 text-base font-semibold text-emerald-50">
                            Composition
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-100/42">
                            Total
                          </p>
                          <p className="text-xl font-bold text-emerald-50">
                            {compositionTotal}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-[72px] w-[72px] shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={compositionData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={16}
                                outerRadius={26}
                                paddingAngle={3}
                                stroke="transparent"
                              >
                                {compositionData.map((entry) => (
                                  <Cell key={entry.name} fill={entry.fill} />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="min-w-0 flex-1 space-y-2">
                          {compositionData.map((item) => (
                            <div
                              key={item.name}
                              className="flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-3 py-2"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <span
                                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                                  style={{ backgroundColor: item.fill }}
                                />
                                <span className="truncate text-[12px] font-semibold text-emerald-50">
                                  {item.name}
                                </span>
                              </div>

                              <span className="ml-2 text-sm font-bold text-emerald-300">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.04 }}
                className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-1"
              >
               <section className="rounded-[20px] border border-white/10 bg-white/[0.06] p-2.5 shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                        Quick Access
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-emerald-50">
                        Sections
                      </h3>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2">
                    {sidebarLinks
                      .filter((item) => item.to !== "/admin")
                      .map((item, index) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="block rounded-[14px] border border-white/8 bg-black/20 px-3 py-2.5 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05]"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-100/42">
                            Section 0{index + 1}
                          </p>
                          <h4 className="mt-1 text-[13px] font-semibold text-emerald-50">
                            {item.label}
                          </h4>
                        </Link>
                      ))}
                  </div>
                </section>

                <section className="rounded-[20px] border border-white/10 bg-white/[0.06] p-3 shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                        Recent Announcements
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-emerald-50">
                        Latest notice activity
                      </h3>
                    </div>

                    <Link
                      to="/admin/announcements"
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100/60 transition duration-300 hover:border-emerald-300/20 hover:text-emerald-50"
                    >
                      Open
                    </Link>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {recentAnnouncements.length > 0 ? (
                      recentAnnouncements.map((announcement) => (
                        <div
                          key={announcement._id}
                          className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-3"
                        >
                          <p className="text-sm font-semibold text-emerald-50">
                            {announcement.title}
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-emerald-100/45">
                            {announcement.targetBarangay || "All"}
                          </p>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-emerald-100/65">
                            {announcement.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-4">
                        <p className="text-sm text-emerald-100/65">
                          No recent announcement data available.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {userInfo.role === "operator" && (
                  <section className="rounded-[20px] border border-white/10 bg-white/[0.06] p-3 shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                          Recent Reports
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-emerald-50">
                          Latest report activity
                        </h3>
                      </div>

                      <Link
                        to="/operator/reports"
                        className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100/60 transition duration-300 hover:border-emerald-300/20 hover:text-emerald-50"
                      >
                        Open
                      </Link>
                    </div>

                    <div className="mt-3 space-y-2.5">
                      {recentReports.length > 0 ? (
                        recentReports.map((report) => (
                          <div
                            key={report._id}
                            className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-3"
                          >
                            <p className="text-sm font-semibold text-emerald-50">
                              {report.issueType || "Unspecified Issue"}
                            </p>
                            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-emerald-100/45">
                              {report.status || "Unknown"}
                            </p>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-emerald-100/65">
                              {report.description || "No description"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-4">
                          <p className="text-sm text-emerald-100/65">
                            No recent report data available.
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </MotionDiv>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;