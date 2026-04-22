import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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

  return (
    <div className="app-shell relative h-screen overflow-hidden bg-slate-950">
      <BackgroundFx />
      <div className="pointer-events-none absolute inset-0 bg-slate-950/75" />
      <div className="pointer-events-none absolute left-[-140px] top-[90px] h-[340px] w-[340px] rounded-full bg-emerald-400/7 blur-[100px]" />
      <div className="pointer-events-none absolute right-[-120px] top-[140px] h-[420px] w-[420px] rounded-full bg-green-400/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-160px] left-[28%] h-[420px] w-[420px] rounded-full bg-teal-300/5 blur-[130px]" />

      <div className="relative z-10">
        <Navbar />

        <div className="px-4 pt-6 sm:px-6">
          <div className="mx-auto h-[calc(100vh-64px)] max-w-7xl">
            <MotionDiv
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="grid h-full gap-4 xl:grid-cols-[1.15fr_0.85fr]"
            >
              <div className="grid h-full grid-rows-[auto_auto_1fr] gap-4">
                <div className="rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-md backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-100/45">
                        Latest Notice
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-emerald-50">
                        Community alert
                      </h2>
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-emerald-100/50">
                      {visibleAnnouncements.length} visible
                    </div>
                  </div>

                  {loadingAnnouncements ? (
                    <div className="mt-6 rounded-[24px] border border-white/8 bg-white/4 px-4 py-8 text-center backdrop-blur-xl">
                      <p className="text-sm text-emerald-100/65">
                        Loading latest announcement...
                      </p>
                    </div>
                  ) : latestAnnouncement ? (
                    <div className="mt-6 rounded-[24px] border border-white/8 bg-white/4 p-5 backdrop-blur-xl">
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
                    <div className="mt-6 rounded-[24px] border border-white/8 bg-white/4 px-4 py-8 text-center backdrop-blur-xl">
                      <p className="text-sm text-emerald-100/65">
                        No announcements available right now.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-full rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-md backdrop-blur-xl">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/55">
                    Account Overview
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-emerald-50">
                    Your current profile
                  </h2>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[24px] border border-white/8 bg-white/4 p-5 backdrop-blur-xl">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-100/45">
                      Full Name
                    </p>
                    <p className="mt-3 text-xl font-semibold text-emerald-50">
                      {user?.name || "User"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-white/8 bg-white/4 p-5 backdrop-blur-xl">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-100/45">
                      Email
                    </p>
                    <p className="mt-3 break-all text-lg font-semibold text-emerald-50">
                      {user?.email || "No email available"}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-white/8 bg-white/4 p-5 backdrop-blur-xl">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-100/45">
                        Barangay
                      </p>
                      <p className="mt-3 text-lg font-semibold text-emerald-50">
                        {user?.barangay || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-[24px] border border-white/8 bg-white/4 p-5 backdrop-blur-xl">
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
            </MotionDiv>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;