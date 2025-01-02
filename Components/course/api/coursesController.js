const CourseService = require("../domain/courseService");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const Course = require("../data-access/CourseModel");
const mongoose = require("mongoose");

// Function to fetch and display courses with pagination
const CourseController = {
    getCourses: async (req, res) => {
        
        try {
            const { search, sort, page, format } = req.query;  
            const CoursesData = await CourseService.getCourseListInfo(search, sort, page);
            res.render("pages/course", {
                courses: CoursesData.courses,
                currentPage: CoursesData.currentPage,
                totalItem: CoursesData.totalItem,
                startItem: CoursesData.startItem,
                endItem: CoursesData.endItem,
                topics: CoursesData.topics,
                skills: CoursesData.skills,
                showSidebar: true,
                showTopbar: true,
            });
        } catch (error) {
            console.error("Error fetching courses:", error);
            res.status(500).send("An error occurred while fetching courses.");
        }
    },
    GetCourseListData: async (req, res) => {
        try {
            const { search, sort, page } = req.query;

            const coursesData = await CourseService.getCourseListInfo(
                search,
                sort,
                page
            );
            res.json(coursesData);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("An error occurred while fetching users.");
        }
    },
    GetCourseDetail: async (req, res) => {
        try {
            const CourseId = req.params.id;  // Ensure this is correct
            
            // Validate the courseId
            if (!mongoose.Types.ObjectId.isValid(CourseId)) {
                return res.status(400).json({
                    message: "Invalid course ID",
                });
            }

            req.session.courseId = CourseId; // Store the courseId in the session

            const { title, Course, relevantCourses } = await CourseService.getCourseDetail(CourseId);
            
            return res.status(StatusCodes.OK).render("pages/courseedit", {
                title: title,
                Course: Course,
                RelevantCourses: relevantCourses,
                showSidebar: true,
                showTopbar: true,
            });

        } catch (error) {
            console.error("Error fetching course detail:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            });
        }
    },

    UpdateCourse: async (req, res) => {
        const courseId = req.session.courseId;

        if (!courseId) {
            return res
                .status(400)
                .json({ success: false, message: "Course ID is required" });
        }

        const { Title, Duration, Level, Description, Price, Sale, Rate, Lecturer } = req.body;

        try {
            const updatedCourse = await CourseService.updateCourse(
                courseId,
                {
                    Title,
                    Duration,
                    Level,
                    Description,
                    Price,
                    Sale,
                    Rate,
                    Lecturer 
                }
            );

            if (updatedCourse.modifiedCount === 0) {
                return res
                    .status(400)
                    .json({ success: false, message: "No course was updated" });
            }

            res.json({
                success: true,
                message: "Course updated successfully!",
            });
        } catch (error) {
            console.error("Error updating course:", error);
            res.status(500).json({
                success: false,
                message: "An error occurred while updating the course",
            });
        }
    },

    ShowAddCoursePage: async (req, res) => {
        const { topics, skills } = await CourseService.getTopicAndSkill();
        res.render("pages/AddCoursePage", {
            title: "Add Course",
            topics,
            skills,
            showSidebar: true,
            showTopbar: true,
        });
    },

    AddNewSkill: async (req, res) => {
        try {
            const { newSkill } = req.body;
            const result = await CourseService.addNewSkill(newSkill);
            res.status(StatusCodes.OK).json({ success: true, result });
        } catch (error) {
            console.error("Error adding new skill:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            });
        }
    },

    AddNewTopic: async (req, res) => {
        try {
            const { newTopic } = req.body;
            const result = await CourseService.addNewTopic(newTopic);
            res.status(StatusCodes.OK).json({ success: true, result });
        } catch (error) {
            console.error("Error adding new topic:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            });
        }
    },

    AddCourse: async (req, res) => {
        try {
            // get data from form
            const {
                title,
                duration,
                level,
                description,
                price,
                topic,
                skillGain,
                lecturer,
                modules,
            } = req.body;

            const Modules = JSON.parse(modules);

            const files = req.files;

            const result = await CourseService.addNewCourse({
                Title: title,
                Duration: duration,
                Level: level,
                Description: description,
                Price: price,
                Topic: topic,
                SkillGain: skillGain,
                Lecturer: lecturer,
                Img: files,
            });

            if (Modules && Modules.length > 0) {
                for (const module of Modules) {
                    await CourseService.addNewModule(result._id, module);
                }
            }
            res.status(StatusCodes.OK).json({ success: true, result });
        } catch (error) {
            console.error("Error adding new course:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            });
        }
    },
};

module.exports = CourseController;
