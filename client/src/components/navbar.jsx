import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/useAuth";

const MotionNav = motion.nav;
const MotionLink = motion(Link);
const MotionButton = motion.button;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/schedule", label: "Schedule" },
    { to: "/report", label: "Report" },
    { to: "/my-reports", label: "My Reports" },
    { to: "/profile", label: "Profile" },
  ];

const dashboardLink =
  user?.role === "admin"
    ? { to: "/admin", label: "Admin" }
    : null;

  const allLinks = dashboardLink ? [...navLinks, dashboardLink] : navLinks;

  return (
    <MotionNav
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass-card fixed left-1/2 top-4 z-50 w-[min(96%,1320px)] -translate-x-1/2 rounded-[30px] border border-white/10 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.28)] lg:px-6"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-emerald-50 sm:text-xl xl:text-2xl">
              Waste Collection System
            </h1>
            <p className="mt-1 text-xs text-emerald-100/60 sm:text-sm">
              Aurora local waste collection and reporting
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 xl:hidden">
            <div className="hidden text-right sm:block">
              <p className="max-w-[120px] truncate text-sm font-semibold text-emerald-50">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-100/55">
                {user?.role || "account"}
              </p>
            </div>

            <MotionButton
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="soft-button soft-button-secondary px-4 py-2.5"
            >
              Logout
            </MotionButton>
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-end">
          <div className="flex flex-wrap items-center gap-2">
            {allLinks.map((link) => {
              const active = location.pathname === link.to;

              return (
                <MotionLink
                  key={link.to}
                  to={link.to}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={[
                    "relative inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                    active
                      ? "border border-emerald-300/20 bg-white/14 text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
                      : "border border-transparent text-emerald-50/78 hover:border-white/10 hover:bg-white/8 hover:text-white",
                  ].join(" ")}
                >
                  <span className="relative z-10">{link.label}</span>
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/10 via-white/6 to-emerald-300/10" />
                  )}
                </MotionLink>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 xl:flex">
            <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-2 text-right backdrop-blur-md">
              <p className="max-w-[170px] truncate text-sm font-semibold text-emerald-50">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-100/55">
                {user?.role || "account"}
              </p>
            </div>

            <MotionButton
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="soft-button soft-button-secondary px-5 py-3"
            >
              Logout
            </MotionButton>
          </div>
        </div>
      </div>
    </MotionNav>
  );
};

export default Navbar;