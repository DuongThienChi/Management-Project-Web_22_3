const express = require("express");
const router = express.Router();
const CourseController = require("./coursesController");
const { ensureAuthenticated } = require("../../../middlewares/authencation");
const upload = require("../../../middlewares/multer");

router
    .get("/", CourseController.getCourses)

    .get(
        "/course-list-data",
        ensureAuthenticated,
        CourseController.GetCourseListData
    )
    .get("/Add", CourseController.ShowAddCoursePage)
    .get("/:id", CourseController.GetCourseDetail)
    .post("/Add/newSkill", CourseController.AddNewSkill)
    .post("/Add/newTopic", CourseController.AddNewTopic)
    .post(
        "/Add/newCourse",
        upload.array("images", 10),
        CourseController.AddCourse
    )
    .post(
        "/edit/update",
        ensureAuthenticated,
         upload.single('Image'),
        CourseController.UpdateCourse
    );

module.exports = router;
