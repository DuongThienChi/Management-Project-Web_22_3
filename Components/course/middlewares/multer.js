const multer = require("multer");

// Cấu hình lưu file tạm trong bộ nhớ
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;
