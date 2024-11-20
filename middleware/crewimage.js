const multer = require('multer');
const path = require('path');
const fs = require('fs');

//=========================================Multer=------------------------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve(__dirname, '../crewImage');

        // Create the uploads directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath); // Save files in the 'uploads/' folder
    },
    filename: function (req, file, cb) {
        // Rename the file to avoid conflicts: timestamp + original extension
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } 
});

module.exports = { upload };
