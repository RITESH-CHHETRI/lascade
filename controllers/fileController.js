const multer = require('multer');
const path = require('path');
const fileQueue = require('../queues/fileQueue');

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== '.csv') {
      return cb(new Error('Only CSV files are allowed'), false);
    }
    cb(null, true);
  },
});

exports.uploadFile = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    fileQueue.push({ filePath: req.file.path, userId: req.user.id }, (err) => {
      if (err){
        process.stdout.write(err.message + '\n');
        return res.status(500).send({ error: 'File processing failed' });
      }
      res.send({ message: 'File uploaded successfully, processing will begin shortly' });
    });
    console.log(`File uploaded by user ${req.user.id}`);
  });
};
