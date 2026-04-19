import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import BackgroundFx from "../../components/backgroundfx";
import { getAnnouncements } from "../../services/announcementService";
import { getAllReports } from "../../services/reportService";
import { getSchedules } from "../../services/scheduleService";
import { getAllUsers } from "../../services/userService";

const MotionDiv = motion.div;

const panelClassName =
  "rounded-[20px] border border-white/10 bg-white/[0.06] shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-2xl";

const SectionHeading = ({ eyebrow, title, action }) => (
  <div className="flex items-start justify-between gap-3">
    <div className="min-w-0">
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45 sm:text-[10px]">
        {eyebrow}
      </p>
      <h3 className="mt-1 text-sm font-semibold tracking-tight text-emerald-50 sm:text-base">
        {title}
      </h3>
    </div>
    {action}
  </div>
);

const StatCard = ({ label, value, helper }) => (
  <div
    className={`${panelClassName} flex min-h-[88px] flex-col justify-between p-3 sm:min-h-[96px] sm:p-3.5`}
  >
    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45 sm:text-[10px]">
      {label}
    </p>
    <div className="mt-2">
      <p className="text-[1.45rem] font-bold tracking-tight text-emerald-50 sm:text-[1.7rem]">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-emerald-100/58">{helper}</p>
    </div>
  </div>
);

const OverviewCard = ({ label, value }) => (
  <div className="rounded-[14px] border border-white/8 bg-black/20 px-3 py-2.5">
    <p className="text-[9px] uppercase tracking-[0.16em] text-emerald-100/45 sm:text-[10px]">
      {label}
    </p>
    <p className="mt-1 text-lg font-semibold tracking-tight text-emerald-50 sm:text-xl">
      {value}
    </p>
  </div>
);

const ItemCard = ({ title, meta, body }) => (
  <div className="rounded-[15px] border border-white/8 bg-black/20 px-3 py-3">
    <p className="text-[13px] font-semibold text-emerald-50">{title}</p>
    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-emerald-100/45">
      {meta}
    </p>
    <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-emerald-100/62">
      {body}
    </p>
  </div>
);

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
          { label: "Total Users", value: users.length, helper: "Registered" },
          { label: "Active", value: activeUsers, helper: "Allowed" },
          { label: "Suspended", value: suspendedUsers, helper: "Temporary" },
          { label: "Banned", value: bannedUsers, helper: "Restricted" },
        ]
      : [
          { label: "Reports", value: reports.length, helper: "Submitted" },
          { label: "Pending", value: pendingReports, helper: "For review" },
          { label: "Schedules", value: schedules.length, helper: "Records" },
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
          { name: "Notices", value: announcements.length },
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
          { name: "Announcements", value: announcements.length, fill: "#2dd4bf" },
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

  const summaryCards =
    userInfo?.role === "admin"
      ? [
          { label: "Registered accounts", value: users.length },
          { label: "Published announcements", value: announcements.length },
        ]
      : [
          { label: "Approved reports", value: approvedReports },
          { label: "Resolved reports", value: resolvedReports },
        ];

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
    <div className="app-shell min-h-screen xl:h-screen xl:overflow-hidden">
      <BackgroundFx />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1480px] gap-3 px-3 py-3 sm:px-4 sm:py-4 xl:h-screen xl:min-h-0 xl:gap-4 xl:overflow-hidden">
        <aside
          className={`hidden w-[208px] shrink-0 ${panelClassName} xl:flex xl:h-[calc(100vh-2rem)] xl:flex-col xl:p-3`}
        >
          <div className="rounded-[16px] border border-white/8 bg-black/15 p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-emerald-100/50">
              {userInfo.role === "admin" ? "Admin Panel" : "Operator Panel"}
            </p>
            <h1 className="mt-1.5 text-base font-bold tracking-tight text-emerald-50">
              Control Center
            </h1>
            <p className="mt-1.5 text-[11px] leading-5 text-emerald-100/60">
              {userInfo.role === "admin"
                ? "Moderation, users, and announcements."
                : "Reports, schedules, and updates."}
            </p>
          </div>

          <div className="mt-3 space-y-1.5">
            {sidebarLinks.map((item) => {
              const active = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block rounded-[14px] border px-3 py-2.5 transition duration-300 ${
                    active
                      ? "border-emerald-300/20 bg-emerald-400/10 text-white shadow-[0_0_0_1px_rgba(52,211,153,0.08)]"
                      : "border-white/10 bg-black/20 text-emerald-100/75 hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <p className="text-[13px] font-semibold">{item.label}</p>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto pt-3">
            <Link
              to="/home"
              className="flex items-center justify-center rounded-[14px] border border-white/10 bg-black/20 px-3 py-2.5 text-[13px] font-semibold text-emerald-50 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-white/[0.05]"
            >
              Back to Home
            </Link>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-3 xl:min-h-0 xl:overflow-hidden">
          <div className={`${panelClassName} px-4 py-3 xl:shrink-0`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-100/50 sm:text-[10px]">
                  {userInfo.role === "admin"
                    ? "Administrative Dashboard"
                    : "Operator Dashboard"}
                </p>
                <h2 className="mt-1 text-lg font-bold tracking-tight text-emerald-50 sm:text-xl">
                  System Overview
                </h2>
                <p className="mt-1.5 max-w-2xl text-xs text-emerald-100/58 sm:text-sm">
                  Compact visibility into core records, recent activity, and key
                  management sections.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 xl:hidden">
                {sidebarLinks.map((item) => {
                  const active = location.pathname === item.to;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`rounded-[13px] border px-3 py-2 text-sm font-semibold transition duration-300 ${
                        active
                          ? "border-emerald-300/20 bg-emerald-400/10 text-white"
                          : "border-white/10 bg-black/20 text-emerald-100/72 hover:border-emerald-300/20 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <Link
                  to="/home"
                  className="rounded-[13px] border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-emerald-50 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.05]"
                >
                  Home
                </Link>
              </div>
            </div>
          </div>

          {loading ? (
            <div
              className={`${panelClassName} flex min-h-[320px] flex-1 items-center justify-center xl:min-h-0`}
            >
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-emerald-300/20 border-t-emerald-300" />
                <p className="text-sm font-medium text-emerald-100/75">
                  Loading dashboard data...
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(0,1.62fr)_minmax(300px,0.88fr)] xl:overflow-hidden">
              <MotionDiv
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex min-w-0 flex-col gap-3 xl:min-h-0"
              >
                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:shrink-0">
                  {statCards.map((card, index) => (
                    <MotionDiv
                      key={card.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.03 + index * 0.03 }}
                    >
                      <StatCard {...card} />
                    </MotionDiv>
                  ))}
                </section>

                <section className="grid gap-3 xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(0,1.34fr)_minmax(250px,0.82fr)] xl:grid-rows-[minmax(0,1fr)_auto]">
                  <div className={`${panelClassName} p-3.5 xl:min-h-0`}>
                    <SectionHeading eyebrow="Main Chart" title="Core records" />

                    <div className="mt-3 h-[220px] rounded-[16px] border border-white/8 bg-black/20 p-2.5 sm:h-[250px] xl:h-[calc(100%-48px)]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barCategoryGap={12}>
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
                            width={24}
                          />
                          <Tooltip content={<CustomTooltip />} cursor={false} />
                          <Bar
                            dataKey="value"
                            radius={[10, 10, 0, 0]}
                            fill="#10b981"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className={`${panelClassName} p-3.5 xl:min-h-0 xl:overflow-hidden`}>
                    <SectionHeading
                      eyebrow="Snapshot"
                      title="Composition"
                      action={
                        <div className="rounded-[12px] border border-white/8 bg-black/20 px-2.5 py-1.5 text-right">
                          <p className="text-[9px] uppercase tracking-[0.16em] text-emerald-100/42">
                            Total
                          </p>
                          <p className="text-base font-bold text-emerald-50">
                            {compositionTotal}
                          </p>
                        </div>
                      }
                    />

                    <div className="mt-3 grid gap-3 sm:grid-cols-[84px_minmax(0,1fr)] xl:grid-cols-1 xl:grid-rows-[84px_minmax(0,1fr)] 2xl:grid-cols-[84px_minmax(0,1fr)] 2xl:grid-rows-1">
                      <div className="mx-auto h-[84px] w-[84px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={compositionData}
                              dataKey="value"
                              nameKey="name"
                              innerRadius={20}
                              outerRadius={34}
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

                      <div className="space-y-2 xl:min-h-0 xl:overflow-y-auto xl:pr-1">
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

                  <div className={`${panelClassName} p-3.5 xl:col-span-2 xl:shrink-0`}>
                    <SectionHeading
                      eyebrow={
                        userInfo.role === "admin"
                          ? "Admin Summary"
                          : "Workflow Summary"
                      }
                      title={
                        userInfo.role === "admin"
                          ? "Moderation overview"
                          : "Operational overview"
                      }
                    />

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {summaryCards.map((item) => (
                        <OverviewCard
                          key={item.label}
                          label={item.label}
                          value={item.value}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.04 }}
                className={`flex min-w-0 flex-col gap-3 xl:min-h-0 ${
                  userInfo.role === "operator"
                    ? "xl:grid xl:grid-rows-[auto_minmax(0,1fr)_minmax(0,1fr)]"
                    : ""
                }`}
              >
                <section className={`${panelClassName} p-3.5 xl:shrink-0`}>
                  <SectionHeading eyebrow="Quick Access" title="Sections" />

                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
                    {sidebarLinks
                      .filter((item) => item.to !== "/admin")
                      .map((item, index) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="group rounded-[14px] border border-white/8 bg-black/20 px-3 py-2.5 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-white/[0.05]"
                        >
                          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-100/42 sm:text-[10px]">
                            Section 0{index + 1}
                          </p>
                          <h4 className="mt-1 text-[13px] font-semibold text-emerald-50">
                            {item.label}
                          </h4>
                          <p className="mt-1.5 text-[11px] text-emerald-100/52 transition duration-300 group-hover:text-emerald-100/72">
                            Open and manage this area.
                          </p>
                        </Link>
                      ))}
                  </div>
                </section>

                <section className={`${panelClassName} p-3.5 xl:min-h-0 xl:overflow-hidden`}>
                  <SectionHeading
                    eyebrow="Recent Announcements"
                    title="Latest notice activity"
                    action={
                      <Link
                        to="/admin/announcements"
                        className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100/60 transition duration-300 hover:border-emerald-300/20 hover:text-emerald-50"
                      >
                        Open
                      </Link>
                    }
                  />

                  <div className="mt-3 space-y-2.5 xl:max-h-full xl:overflow-y-auto xl:pr-1">
                    {recentAnnouncements.length > 0 ? (
                      recentAnnouncements.map((announcement) => (
                        <ItemCard
                          key={announcement._id}
                          title={announcement.title}
                          meta={announcement.targetBarangay || "All"}
                          body={announcement.message}
                        />
                      ))
                    ) : (
                      <div className="rounded-[15px] border border-white/8 bg-black/20 px-3 py-3">
                        <p className="text-sm text-emerald-100/65">
                          No recent announcement data available.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {userInfo.role === "operator" && (
                  <section className={`${panelClassName} p-3.5 xl:min-h-0 xl:overflow-hidden`}>
                    <SectionHeading
                      eyebrow="Recent Reports"
                      title="Latest report activity"
                      action={
                        <Link
                          to="/operator/reports"
                          className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100/60 transition duration-300 hover:border-emerald-300/20 hover:text-emerald-50"
                        >
                          Open
                        </Link>
                      }
                    />

                    <div className="mt-3 space-y-2.5 xl:max-h-full xl:overflow-y-auto xl:pr-1">
                      {recentReports.length > 0 ? (
                        recentReports.map((report) => (
                          <ItemCard
                            key={report._id}
                            title={report.issueType || "Unspecified Issue"}
                            meta={report.status || "Unknown"}
                            body={report.description || "No description"}
                          />
                        ))
                      ) : (
                        <div className="rounded-[15px] border border-white/8 bg-black/20 px-3 py-3">
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
