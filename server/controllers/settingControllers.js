const asyncHandler = require("express-async-handler");
const Setting = require("../models/settingModel");

const getDarkModeSetting = asyncHandler(async (req, res) => {
  const setting = await Setting.findOne({ user: req.user._id });
  if (setting) {
    res.status(200).json(setting);
  } else {
    res.status(404);
    throw new Error("Setting not found");
  }
});

const setDarkModeSetting = asyncHandler(async (req, res) => {
  const { settingId, newDarkModeSetting } = req.body;

  const updatedSetting = await Setting.findByIdAndUpdate(
    settingId,
    { darkMode: newDarkModeSetting },
    { new: true }
  );

  if (updatedSetting) {
    res.status(200).json(updatedSetting);
  } else {
    res.status(404);
    throw new Error("Setting not found");
  }
});

module.exports = { getDarkModeSetting, setDarkModeSetting };
