const mongoose = require("mongoose");

const settingSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    darkMode: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);
module.exports = Setting;
