const multer = require("multer");

const storageNavigation = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploadedFiles/posts");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now()+"_post_"+file.originalname);
    }
});

// Filter - only accepting valid file - png, jpeg, mp4, mkv
const filter = function(req, file, cb) {
    if(file.mimetype == "image/png" || file.mimetype=="image/jpeg" || file.mimetype == "video/mp4" || file.mimetype=="video/x-matroska") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storageNavigation,
    fileFilter: filter
});

module.exports = upload;