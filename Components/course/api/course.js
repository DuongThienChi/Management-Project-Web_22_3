const express = require("express");
const router = express.Router();
const CourseController = require("./coursesController");
const { ensureAuthenticated } = require("../../../middlewares/authencation");
router
    .get("/", ensureAuthenticated, CourseController.getCourses)
    .get("/:id", ensureAuthenticated, CourseController.GetCourseDetail)
    .post("/edit/update", ensureAuthenticated, CourseController.UpdateCourse);

module.exports = router;
