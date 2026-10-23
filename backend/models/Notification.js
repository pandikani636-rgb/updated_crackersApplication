
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
