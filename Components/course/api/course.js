const express = require("express");
const router = express.Router();
const CourseController = require("./coursesController");

router
    .get("/", CourseController.getCourses) 
    .get("/Add", CourseController.ShowAddCoursePage)
    .get("/:id", CourseController.GetCourseDetail) 
    .post("/edit/update", CourseController.UpdateCourse); 

module.exports = router;
