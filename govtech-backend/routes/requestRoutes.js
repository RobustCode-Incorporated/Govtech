const express = require('express');
const router = express.Router();
const { getRequests } = require('../controllers/requestController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/requests', authMiddleware, getRequests);

module.exports = router;