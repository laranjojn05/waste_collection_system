import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import BackgroundFx from "../components/backgroundfx";
import { createReport } from "../services/reportService";
import { barangays } from "../data/barangays";

const MotionDiv = motion.div;
const MotionButton = motion.button;

const Report = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [form, setForm] = useState({
    issueType: "",
    description: "",
    location: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("issueType", form.issueType);
      formData.append("description", form.description);
      formData.append("location", form.location);

      if (photo) {
        formData.append("photo", photo);
      }

      await createReport(formData, userInfo.token);

      alert("Report submitted successfully!");

      setForm({
        issueType: "",
        description: "",
        location: "",
      });
      setPhoto(null);
      setPreview(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit report");
    }
  };

  return (
    <div className="app-shell">
      <BackgroundFx />
      <Navbar />

      <div className="page-wrap">
        <div className="page-container">
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-8"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_32%)]" />

              <div className="relative z-10">
                <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-emerald-300/15 bg-white/8 px-4 py-2 backdrop-blur-xl">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.75)]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/75">
                    Report Submission
                  </span>
                </div>

                <h1 className="text-4xl font-bold leading-[0.98] tracking-[-0.05em] text-emerald-50 sm:text-5xl">
                  Submit a waste-related report clearly and quickly.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-100/68 sm:text-base">
                  Report missed collection, illegal dumping, overflowing bins,
                  and other barangay waste concerns using the form. Keep your
                  details clear so the issue can be reviewed faster.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-4">
                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                      Issue Type
                    </p>
                    <p className="mt-2 text-sm font-semibold text-emerald-50">
                      Structured category
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                      Description
                    </p>
                    <p className="mt-2 text-sm font-semibold text-emerald-50">
                      Clear problem details
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                      Barangay
                    </p>
                    <p className="mt-2 text-sm font-semibold text-emerald-50">
                      Localized location
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/45">
                      Photo
                    </p>
                    <p className="mt-2 text-sm font-semibold text-emerald-50">
                      Optional evidence
                    </p>
                  </div>
                </div>
              </div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="glass-card rounded-[32px] p-6 sm:p-8"
            >
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/50">
                  Form
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-emerald-50">
                  Create Report
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-100/65">
                  Fill in the issue details and submit your report.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    <option
                      value="Other"
                      className="bg-[#0b1d17] text-emerald-50"
                    >
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
                  placeholder="Describe the issue clearly"
                  className="soft-input min-h-[150px]"
                  rows="5"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
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

                <div>
                  <label className="mb-2 block text-sm font-medium text-emerald-100/82">
                    Upload Photo (optional)
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setPhoto(file || null);

                      if (file) {
                        setPreview(URL.createObjectURL(file));
                      } else {
                        setPreview(null);
                      }
                    }}
                    className="block w-full text-sm text-emerald-100/70 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-900 hover:file:bg-emerald-300"
                  />

                  {preview && (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-2">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-48 w-full rounded-xl object-cover"
                      />
                    </div>
                  )}
                </div>

                <MotionButton
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  className="relative w-full overflow-hidden rounded-[18px] bg-gradient-to-r from-emerald-400 to-green-500 px-4 py-3.5 font-semibold text-slate-950 shadow-[0_14px_34px_rgba(34,197,94,0.24)] transition duration-300 hover:shadow-[0_18px_42px_rgba(34,197,94,0.3)]"
                >
                  <span className="relative z-10">Submit Report</span>

                  <motion.span
                    className="absolute inset-y-0 left-[-35%] w-1/3 skew-x-[-18deg] bg-white/35"
                    animate={{ left: ["-35%", "135%"] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </MotionButton>
              </form>
            </MotionDiv>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;