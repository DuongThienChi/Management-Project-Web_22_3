const CourseService = require("../domain/courseService");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

// Function to fetch and display courses with pagination
const CourseController = {
    getCourses: async (req, res) => {
        try {
            const { search, topic, skill, level, price, sort, order, page } =
                req.query;

            const CoursesData = await CourseService.getCourses(
                search,
                topic,
                skill,
                level,
                price,
                sort,
                order,
                page
            );

            // Render the Handlebars template with pagination and courses data
            res.render("pages/course", {
                courses: CoursesData.courses,
                currentPage: CoursesData.currentPage,
                totalPages: CoursesData.totalPages,
                prevPage: CoursesData.prevPage,
                nextPage: CoursesData.nextPage,
                isFirstPage: CoursesData.isFirstPage,
                isLastPage: CoursesData.isLastPage,
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

    GetCourseDetail: async (req, res) => {
        try {
            const CourseId = req.params.id;
            const isLoggedIn = false;
            const { title, Course, relevantCourses } =
                await CourseService.getCourseDetail(CourseId);
            return res.status(StatusCodes.OK).render("pages/courseedit", {
                title: title,
                Course: Course,
                RelevantCourses: relevantCourses,
                showSidebar: true,
                showTopbar: true,
            });
        } catch (error) {
            console.error("Error fetching course detail:", error); // Log error
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            });
        }
    },

    UpdateCourse: async (req, res) => {
        const courseId = req.params.id; // Lấy ID từ URL ("/courses/:id/update")
        const { Title, Duration, Level, Description, Price } = req.body;

        if (!courseId) {
            return res
                .status(400)
                .json({ success: false, message: "Course ID is required" });
        }

        try {
            const updatedCourse = await Course.updateOne(
                { _id: courseId },
                {
                    Title,
                    Duration,
                    Level,
                    Description,
                    Price,
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

            // skill gain: '[skill1], [skill2], ...' => ['skill1', 'skill2', ...]
            // remove [] and split by ','

            const result = await CourseService.addNewCourse({
                Title: title,
                Duration: duration,
                Level: level,
                Description: description,
                Price: price,
                Topic: topic,
                SkillGain: skillGain,
                Lecturer: lecturer,
            });
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
