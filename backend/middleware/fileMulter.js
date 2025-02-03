const multer = require('multer');
const path = require('path');
const fs = require('fs');


const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'));
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const subfolder = req.params.type; // Extract type from the URL
        const uploadPath = path.join(__dirname, '../uploads', subfolder);

        // Ensure folder exists
        try {
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (err) {
            cb(new Error('Failed to create upload directory.'));
        }
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `${timestamp}${ext}`); 
    },
});

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = upload;