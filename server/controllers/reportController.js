import Report from "../models/Report.js";

export const createReport = async (req, res) => {
  try {
    const { issueType, description, location } = req.body;

    const report = await Report.create({
      user: req.user._id,
      issueType,
      description,
      location,
      photo: req.file ? `/uploads/reports/${req.file.filename}` : "",
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({
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
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Pending", "Approved", "Rejected", "Resolved"];

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
    const { issueType, description, location } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to edit this report" });
    }

    if (report.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Only pending reports can be edited" });
    }

    report.issueType = issueType;
    report.description = description;
    report.location = location;

    if (req.file) {
      report.photo = `/uploads/reports/${req.file.filename}`;
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

    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this report" });
    }

    if (report.status !== "Pending") {
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