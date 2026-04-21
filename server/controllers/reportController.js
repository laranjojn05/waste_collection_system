import Report from "../models/Report.js";

export const createWasteReport = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can submit waste reports" });
    }

    const report = new Report({
      type: "waste",
      description: req.body.description,
      location: req.body.location,
      createdBy: req.user.id,
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const reportUser = async (req, res) => {
  try {
    if (req.user.role !== "operator") {
      return res.status(403).json({ message: "Only operators can report users" });
    }

    const report = new Report({
      type: "user",
      reportedUser: req.body.userId,
      reason: req.body.reason,
      createdBy: req.user.id,
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const getWasteReports = async (req, res) => {
  try {
    if (req.user.role !== "operator") {
      return res.status(403).json({ message: "Only operators" });
    }

    const reports = await Report.find({ type: "waste" }).populate("createdBy");
    res.json(reports);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const getUserReports = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin" });
    }

    const reports = await Report.find({ type: "user" })
      .populate("reportedUser")
      .populate("createdBy");

    res.json(reports);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ createdBy: req.user.id, type: "waste" }).sort({
      createdAt: -1,
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("createdBy", "name email")
      .populate("reportedUser", "name email")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["pending", "in-progress", "resolved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid report status" });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    await report.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMyReport = async (req, res) => {
  try {
    const { description, location } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (report.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to edit this report" });
    }

    if (report.type !== "waste") {
      return res.status(400).json({ message: "Only waste reports can be edited here" });
    }

    if (report.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending reports can be edited" });
    }

    report.description = description;
    report.location = location;

    if (req.file) {
      report.image = `/uploads/reports/${req.file.filename}`;
    }

    const updatedReport = await report.save();
    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMyReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (report.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this report" });
    }

    if (report.type !== "waste") {
      return res.status(400).json({ message: "Only waste reports can be deleted here" });
    }

    if (report.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending reports can be deleted" });
    }

    await report.deleteOne();
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAnyReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await report.deleteOne();
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};