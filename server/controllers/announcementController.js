import Announcement from "../models/Announcement.js";

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, message, targetBarangay } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      targetBarangay,
      createdBy: req.user._id,
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { title, message, targetBarangay } = req.body;

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    announcement.title = title;
    announcement.message = message;
    announcement.targetBarangay = targetBarangay;

    const updatedAnnouncement = await announcement.save();
    res.json(updatedAnnouncement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    await announcement.deleteOne();
    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};