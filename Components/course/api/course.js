const express = require("express");
const router = express.Router();
const CourseController = require("./coursesController");
const upload = require("../middlewares/multer");

router
    .get("/", CourseController.getCourses)
    .get("/Add", CourseController.ShowAddCoursePage)
    .get("/:id", CourseController.GetCourseDetail)
    .post("/Add/newSkill", CourseController.AddNewSkill)
    .post("/Add/newTopic", CourseController.AddNewTopic)
    .post("/Add/newCourse", upload.single("image"), CourseController.AddCourse)
    .post("/edit/update", CourseController.UpdateCourse);

module.exports = router;
