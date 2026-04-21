import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import BackgroundFx from "../../components/backgroundfx";
import { getAllUsers } from "../../services/userService";
import { getUserReports } from "../../services/reportService";

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
    className={`${panelClassName} flex min-h-[88px] flex-col justify-between p-3`}
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
  <div className="rounded-[15px] border border-white/6 bg-black/10 px-3 py-3">
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
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [usersData, userReportsData] = await Promise.all([
          getAllUsers(userInfo.token),
          getUserReports(userInfo.token),
        ]);

        setUsers(Array.isArray(usersData) ? usersData : []);
        setUserReports(Array.isArray(userReportsData) ? userReportsData : []);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo.role === "admin") {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
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

  const reportedUsersCount = useMemo(() => userReports.length, [userReports]);

  const totalSubmittedReports = useMemo(
    () =>
      userReports.reduce(
        (sum, group) => sum + (Array.isArray(group.reports) ? group.reports.length : 0),
        0
      ),
    [userReports]
  );

  const criticalCasesCount = useMemo(
    () =>
      userReports.filter(
        (group) => Array.isArray(group.reports) && group.reports.length >= 3
      ).length,
    [userReports]
  );

  const recentUserReports = useMemo(
    () => [...userReports].slice(0, 3),
    [userReports]
  );

  const sidebarLinks = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/users", label: "Manage Users" },
    { to: "/admin/user-reports", label: "User Reports" },
  ];

  const statCards = [
    { label: "Total Users", value: users.length, helper: "Registered" },
    { label: "Active", value: activeUsers, helper: "Allowed" },
    { label: "Suspended", value: suspendedUsers, helper: "Restricted" },
    { label: "Banned", value: bannedUsers, helper: "Blocked" },
  ];

  const chartData = [
    { name: "Users", value: users.length },
    { name: "Active", value: activeUsers },
    { name: "Suspended", value: suspendedUsers },
    { name: "Banned", value: bannedUsers },
    { name: "Reported Users", value: reportedUsersCount },
  ];

  const summaryCards = [
    { label: "Reported users", value: reportedUsersCount },
    { label: "Total submitted reports", value: totalSubmittedReports },
    { label: "Critical cases", value: criticalCasesCount },
    { label: "Active users", value: activeUsers },
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

  if (userInfo.role !== "admin") {
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
              Admin Panel
            </p>
            <h1 className="mt-1.5 text-base font-bold tracking-tight text-emerald-50">
              Control Center
            </h1>
            <p className="mt-1.5 text-[11px] leading-5 text-emerald-100/60">
              User moderation and operator-submitted user reports.
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
                  Administrative Dashboard
                </p>
                <h2 className="mt-1 text-lg font-bold tracking-tight text-emerald-50 sm:text-xl">
                  System Overview
                </h2>
                <p className="mt-1.5 max-w-2xl text-xs text-emerald-100/58 sm:text-sm">
                  Review user account status and operator-submitted user reports.
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

                <section className="flex flex-col gap-4 xl:min-h-0 xl:flex-1">
                  <div className={`${panelClassName} p-4 w-full`}>
                    <SectionHeading
                      eyebrow="Moderation Insight"
                      title="Admin activity overview"
                    />

                      <div className="mt-4 h-[240px] w-full rounded-[20px] border border-white/10 bg-black/25 p-3 sm:h-[280px] shadow-[0_10px_30px_rgba(0,0,0,0.25)]">                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barCategoryGap={18}>
                          <CartesianGrid
                            stroke="rgba(255,255,255,0.05)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="name"
                            tick={{
                              fill: "rgba(236,253,245,0.58)",
                              fontSize: 11,
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
                            width={28}
                          />
                          <Tooltip content={<CustomTooltip />} cursor={false} />
                          <Bar
                            dataKey="value"
                            radius={[12, 12, 0, 0]}
                            fill="#10b981"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className={`${panelClassName} p-4`}>
                    <SectionHeading
                      eyebrow="Admin Summary"
                      title="Moderation overview"
                    />

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
                className="flex min-w-0 flex-col gap-3 xl:min-h-0"
              >
                <section className={`${panelClassName} p-4 xl:shrink-0`}>
                  <SectionHeading eyebrow="Quick Access" title="Sections" />

                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
                    {sidebarLinks
                      .filter((item) => item.to !== "/admin")
                      .map((item, index) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="group rounded-[14px] border border-white/6 bg-black/10 px-3 py-2.5 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-white/[0.05]"
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

                <section className={`${panelClassName} p-4 xl:min-h-0 xl:overflow-hidden`}>
                  <SectionHeading
                    eyebrow="Recent User Reports"
                    title="Latest operator submissions"
                    action={
                      <Link
                        to="/admin/user-reports"
                        className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100/60 transition duration-300 hover:border-emerald-300/20 hover:text-emerald-50"
                      >
                        Open
                      </Link>
                    }
                  />

                  <div className="mt-3 space-y-2.5 xl:max-h-full xl:overflow-y-auto xl:pr-1">
                    {recentUserReports.length > 0 ? (
                      recentUserReports.map((group) => (
                        <ItemCard
                          key={group.user?._id}
                          title={group.user?.name || "Reported User"}
                          meta={`${group.reports?.length || 0} report${
                            (group.reports?.length || 0) > 1 ? "s" : ""
                          }`}
                          body={
                            group.reports?.[0]?.reason || "No reason provided"
                          }
                        />
                      ))
                    ) : (
                      <div className="rounded-[15px] border border-white/6 bg-black/10 px-3 py-3">
                        <p className="text-sm text-emerald-100/65">
                          No recent user report data available.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </MotionDiv>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;