const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000 
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('imageUrl');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb('Error: Images Only!');
  }
}


function checkFileSize(req, res, next) {
  const file = req.file;
  const minSize = 50000; // 50 KB
  const maxSize = 1000000; // 1 MB

  if (file && file.size >= minSize && file.size <= maxSize) {
    next();
  } else {
    if (file) {
      fs.unlink(file.path, (err) => {
        if (err) console.error(err);
      });
    }
    res.status(400).send('Error: File size must be between 50 KB and 1 MB!');
  }
}

module.exports = { upload, checkFileSize };
