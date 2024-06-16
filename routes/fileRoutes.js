const express = require('express');
const { uploadFile } = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/upload', authMiddleware, uploadFile);

module.exports = router;
