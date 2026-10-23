
const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
} = require('../controllers/notificationController');

router.route('/').get(getNotifications).post(createNotification);
router.route('/:id').get(getNotificationById).put(updateNotification).delete(deleteNotification);

module.exports = router;
