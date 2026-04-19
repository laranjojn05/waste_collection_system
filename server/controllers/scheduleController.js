import Schedule from "../models/Schedule.js";

export const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ collectionDate: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const { barangay, collectionDate, wasteType, note } = req.body;

    const schedule = await Schedule.create({
      barangay,
      collectionDate,
      wasteType,
      note,
    });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { barangay, collectionDate, wasteType, note, status } = req.body;

    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    schedule.barangay = barangay;
    schedule.collectionDate = collectionDate;
    schedule.wasteType = wasteType;
    schedule.note = note;
    schedule.status = status;

    const updatedSchedule = await schedule.save();
    res.json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    await schedule.deleteOne();
    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};