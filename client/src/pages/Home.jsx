import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import BackgroundFx from "../components/backgroundfx";
import { useAuth } from "../context/useAuth";
import { getAnnouncements } from "../services/announcementService";

const MotionDiv = motion.div;

const Home = () => {
  const { user } = useAuth();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements(userInfo.token);
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    if (userInfo?.token) {
      fetchAnnouncements();
    } else {
      setLoadingAnnouncements(false);
    }
  }, [userInfo?.token]);

  const visibleAnnouncements = useMemo(() => {
    const normalize = (value) => String(value || "").trim().toLowerCase();

    if (!user?.barangay) return announcements;

    return announcements.filter((item) => {
      const target = normalize(item.targetBarangay);
      const userBarangay = normalize(user.barangay);

      return target === "all" || target === userBarangay;
    });
  }, [announcements, user?.barangay]);

  const latestAnnouncement = visibleAnnouncements[0] || null;

  const quickLinks = [
    {
      title: "Collection Schedule",
      description:
        "Review active and upcoming pickup schedules in your barangay.",
      to: "/schedule",
      tag: "Public Access",
    },
    {
      title: "Submit Report",
      description:
        "Create a waste-related concern report with clear issue details.",
      to: "/report",
      tag: "Citizen Action",
    },
    {
      title: "My Reports",
      description:
        "Track the status of your submitted reports and updates.",
      to: "/my-reports",
      tag: "Tracking",
    },
    ...(userInfo?.role?.toLowerCase() === "operator"
      ? [
          {
            title: "Manage Reports",
            description:
              "Review, approve, reject, and resolve submitted reports.",
            to: "/operator/reports",
            tag: "Operator",
          },
          {
            title: "Manage Schedules",
            description:
              "Create, update, and delete waste collection schedules.",
            to: "/operator/schedules",
            tag: "Operator",
          },
        ]
      : []),
  ];

  const stats = [
    {
      label: "Barangay",
      value: user?.barangay || "N/A",
      helper: "Assigned area",
    },
    {
      label: "Role",
      value: user?.role || "User",
      helper: "Current access",
    },
    {
      label: "Visible Notices",
      value: visibleAnnouncements.length,
      helper: "Matching updates",
    },
  ];

  const highlights = [
    {
      title: "Barangay-centered operations",
      text: "Schedules and announcements stay relevant to your assigned community.",
    },
    {
      title: "Faster issue reporting",
      text: "Reports are submitted, reviewed, and monitored in one place.",
    },
    {
      title: "Cleaner communication flow",
      text: "Residents and operators can work from the same system without confusion.",
    },
  ];

  return (
    <div className="app-shell min-h-screen">
      <BackgroundFx />
      <Navbar />

      <div className="page-wrap">
        <div className="page-container space-y-6">
          <MotionDiv
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-6 xl:p-7"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.20),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.03),transparent_40%)]" />
            <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full border border-emerald-300/10" />
            <div className="absolute -right-20 top-0 h-72 w-72 rounded-full border border-emerald-300/10" />

            <div className="relative z-10 grid gap-5 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
              <div className="flex flex-col justify-between">
                <div>
                  <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-emerald-300/15 bg-white/8 px-4 py-2 backdrop-blur-xl">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.7)]" />
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/75">
                      Waste Collection and Reporting
                    </span>
                  </div>

                  <h1 className="max-w-3xl text-3xl font-bold leading-[1] tracking-[-0.04em] text-emerald-50 sm:text-4xl xl:text-5xl">
                    Cleaner local service,
                    <br />
                    better reporting,
                    <br />
                    stronger coordination.
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-6 text-emerald-100/68 sm:text-[15px]">
                    Welcome back, {user?.name || "User"}. This system helps you
                    review schedules, report waste-related concerns, and stay
                    updated with official barangay announcements through one
                    organized platform.
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {stats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[24px] border border-white/10 bg-black/20 px-5 py-5 shadow-[0_12px_30px_rgba(0,0,0,0.16)]"
                    >
                      <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-100/45">
                        {item.label}
                      </p>
                      <p className="mt-3 text-xl font-semibold capitalize text-emerald-50">
                        {item.value}
                      </p>
                      <p className="mt-2 text-sm text-emerald-100/58">
                        {item.helper}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[26px] border border-white/10 bg-black/20 p-4 shadow-[0_14px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-100/45">
                        Latest Notice
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-emerald-50">
                        Community alert
                      </h2>
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-emerald-100/50">
                      {visibleAnnouncements.length} visible
                    </div>
                  </div>

                  {loadingAnnouncements ? (
                    <div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-8 text-center">
                      <p className="text-sm text-emerald-100/65">
                        Loading latest announcement...
                      </p>
                    </div>
                  ) : latestAnnouncement ? (
                    <div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-semibold text-emerald-50">
                          {latestAnnouncement.title}
                        </h3>
                        <span className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                          {latestAnnouncement.targetBarangay || "All"}
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-emerald-100/72">
                        {latestAnnouncement.message}
                      </p>

                      <p className="mt-5 text-xs text-emerald-100/50">
                        Posted:{" "}
                        {new Date(latestAnnouncement.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-8 text-center">
                      <p className="text-sm text-emerald-100/65">
                        No announcements available right now.
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid gap-3">
                  {highlights.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[22px] border border-white/8 bg-white/[0.04] px-5 py-4"
                    >
                      <p className="text-sm font-semibold text-emerald-50">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-emerald-100/68">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"
          >
            <div className="rounded-[34px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_20px_52px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/50">
                  Account Overview
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-emerald-50">
                  Your current profile
                </h2>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[24px] border border-white/8 bg-black/20 p-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-100/45">
                    Full Name
                  </p>
                  <p className="mt-3 text-xl font-semibold text-emerald-50">
                    {user?.name || "User"}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/8 bg-black/20 p-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-100/45">
                    Email
                  </p>
                  <p className="mt-3 break-all text-lg font-semibold text-emerald-50">
                    {user?.email || "No email available"}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-white/8 bg-black/20 p-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-100/45">
                      Barangay
                    </p>
                    <p className="mt-3 text-lg font-semibold text-emerald-50">
                      {user?.barangay || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-white/8 bg-black/20 p-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-100/45">
                      Role
                    </p>
                    <p className="mt-3 text-lg font-semibold capitalize text-emerald-50">
                      {user?.role || "User"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[34px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_20px_52px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/50">
                    Main Actions
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-emerald-50">
                    Quick access hub
                  </h2>
                </div>

                <p className="max-w-xl text-sm leading-6 text-emerald-100/65">
                  Open the sections you use most, from reporting and tracking to
                  operator tools for schedules and approvals.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {quickLinks.map((item, index) => (
                  <Link
                    key={item.title}
                    to={item.to}
                    className="group rounded-[28px] border border-white/10 bg-black/20 p-6 shadow-[0_16px_44px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-100/45">
                        {item.tag}
                      </p>
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-emerald-100/50">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="mt-5 text-2xl font-semibold tracking-tight text-emerald-50">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-emerald-100/68">
                      {item.description}
                    </p>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition duration-300 group-hover:text-emerald-200">
                      Open Section
                      <span className="translate-y-[1px] transition duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="rounded-[34px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_20px_52px_rgba(0,0,0,0.24)] backdrop-blur-xl"
          >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/50">
                  Announcements
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-emerald-50">
                  Community updates board
                </h2>
              </div>

              <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-emerald-100/55">
                {visibleAnnouncements.length} visible
              </div>
            </div>

            {loadingAnnouncements ? (
              <div className="rounded-[24px] border border-white/8 bg-black/20 px-4 py-8 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-emerald-300/20 border-t-emerald-300" />
                <p className="text-sm text-emerald-100/70">
                  Loading announcements...
                </p>
              </div>
            ) : visibleAnnouncements.length === 0 ? (
              <div className="rounded-[24px] border border-white/8 bg-black/20 px-4 py-8 text-center">
                <p className="text-lg font-semibold text-emerald-50">
                  No announcements yet
                </p>
                <p className="mt-2 text-sm text-emerald-100/65">
                  Official updates will appear here when posted.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {visibleAnnouncements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className="rounded-[26px] border border-white/8 bg-black/20 p-5 transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.04]"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold text-emerald-50">
                        {announcement.title}
                      </h3>
                      <span className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                        {announcement.targetBarangay || "All"}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-emerald-100/72">
                      {announcement.message}
                    </p>

                    <div className="mt-5 space-y-1 text-xs text-emerald-100/50">
                      <p>
                        Posted:{" "}
                        {new Date(announcement.createdAt).toLocaleString()}
                      </p>
                      <p>
                        By: {announcement.createdBy?.name || "Administrator"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </MotionDiv>
        </div>
      </div>
    </div>
  );
};

export default Home;