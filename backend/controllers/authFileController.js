const multer = require("multer");
const upload = require("../middleware/fileMulter");

exports.uploadFile = (req, res) => {
    upload.single("profile_photo")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Multer-specific errors
            return res.status(400).json({ error: err.message });
        } else if (err) {
            // Other errors
            return res.status(400).json({ error: err.message });
        }
        res.status(200).json({ 
            message: "File uploaded successfully!", 
            fileName: req.file.filename 
        });
    });
};
