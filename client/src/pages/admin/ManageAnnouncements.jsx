import { useEffect, useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundFx from "../../components/backgroundfx";
import { barangays } from "../../data/barangays";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../services/announcementService";

const MotionDiv = motion.div;

const ManageAnnouncements = () => {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [announcements, setAnnouncements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    message: "",
    targetBarangay: "All",
  });

  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") return;

    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements(userInfo.token);
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [userInfo]);

  const refreshAnnouncements = async () => {
    const data = await getAnnouncements(userInfo.token);
    setAnnouncements(Array.isArray(data) ? data : []);
  };

  const resetForm = () => {
    setForm({
      title: "",
      message: "",
      targetBarangay: "All",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateAnnouncement(editingId, form, userInfo.token);
        alert("Announcement updated successfully");
      } else {
        await createAnnouncement(form, userInfo.token);
        alert("Announcement created successfully");
      }

      resetForm();
      await refreshAnnouncements();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save announcement");
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setForm({
      title: announcement.title,
      message: announcement.message,
      targetBarangay: announcement.targetBarangay || "All",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this announcement?");
    if (!confirmed) return;

    try {
      await deleteAnnouncement(id, userInfo.token);
      await refreshAnnouncements();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete announcement");
    }
  };

  const sidebarLinks = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/users", label: "Manage Users" },
    { to: "/admin/announcements", label: "Manage Announcements" },
  ];

  if (!userInfo) {
    return <Navigate to="/" />;
  }

  if (userInfo.role !== "admin") {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="app-shell h-screen overflow-hidden">
      <BackgroundFx />

      <div className="relative z-10 flex h-screen gap-4 p-3 lg:p-4">
        <aside className="hidden h-full w-[250px] shrink-0 rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl xl:flex xl:flex-col">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100/50">
              Admin Panel
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-emerald-50">
              Announcement Center
            </h1>
            <p className="mt-2 text-sm leading-6 text-emerald-100/65">
              Publish official notices for all barangays or a selected barangay.
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
                Announcement Management
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-emerald-50">
                Manage Announcements
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
              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                  Form
                </p>
                <h3 className="mt-1 text-xl font-semibold text-emerald-50">
                  {editingId ? "Edit Announcement" : "Create Announcement"}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Announcement title"
                  className="soft-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />

                <textarea
                  placeholder="Announcement message"
                  className="soft-input min-h-[160px]"
                  rows="6"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                />

                <div className="relative">
                  <select
                    className="soft-input appearance-none pr-12 text-emerald-50"
                    value={form.targetBarangay}
                    onChange={(e) =>
                      setForm({ ...form, targetBarangay: e.target.value })
                    }
                  >
                    <option value="All" className="bg-[#0b1d17] text-emerald-50">
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

                <div className="flex gap-3">
                  <button className="soft-button soft-button-primary">
                    {editingId ? "Update Announcement" : "Create Announcement"}
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
              className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                    Records
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-emerald-50">
                    Existing announcements
                  </h3>
                </div>

                <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/60">
                  {announcements.length} total
                </div>
              </div>

              {loading ? (
                <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-8 text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-emerald-300/20 border-t-emerald-300" />
                  <p className="text-sm text-emerald-100/70">
                    Loading announcements...
                  </p>
                </div>
              ) : announcements.length === 0 ? (
                <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-8 text-center">
                  <p className="text-lg font-semibold text-emerald-50">
                    No announcements found
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement._id}
                      className="rounded-[22px] border border-white/8 bg-black/20 p-4"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="text-lg font-semibold text-emerald-50">
                              {announcement.title}
                            </h4>
                            <span className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                              {announcement.targetBarangay || "All"}
                            </span>
                          </div>

                          <div className="mt-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/45">
                              Message
                            </p>
                            <p className="mt-1 text-sm leading-6 text-emerald-100/70">
                              {announcement.message}
                            </p>
                          </div>

                          <p className="mt-3 text-xs text-emerald-100/50">
                            Posted:{" "}
                            {announcement.createdAt
                              ? new Date(announcement.createdAt).toLocaleString()
                              : "No date"}
                          </p>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => handleEdit(announcement)}
                            className="soft-button soft-button-secondary px-4 py-2"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(announcement._id)}
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
            </MotionDiv>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageAnnouncements;