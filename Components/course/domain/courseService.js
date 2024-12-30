const CourseModel = require("../data-access/CourseModel");
const LessonModel = require("../data-access/LessonModel");
const ModuleModel = require("../data-access/ModuleModel");
const SkillModel = require("../data-access/SkillModel");
const TopicModel = require("../data-access/TopicModel");
const supabase = require("../../../config/supabase");
const mongoose = require("mongoose");

async function uploadImage(file, filePath) {
    try {
        const { data, error } = await supabase.storage
            .from('SkillBoost')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
                public: true,
            });

        if (error) {
            console.error('Detailed Supabase Error:', {
                message: error.message,
                details: error.details,
                code: error.code
            });
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Full Error Object:', err);
        throw err;
    }
}

const CourseService = {

    getCourseListInfo: async (search, sort, page) => {
        const limit = 5;  // số bản ghi mỗi trang
        const currentPage = parseInt(page) || 1;
        const startIndex = (currentPage - 1) * limit;  // số bản ghi đã bỏ qua
        const endIndex = currentPage * limit;  // giới hạn số bản ghi

        const sortOptions = {
            Title_asc: { Title: 1 },
            Title_desc: { Title: -1 },
            Price_asc: { Price: 1 },
            Price_desc: { Price: -1 },
            Duration_asc: { Duration: 1 },
            Duration_desc: { Duration: -1 },
        };

        const sortQuery = sortOptions[sort];

        const courses = await CourseModel.find({
            Title: { $regex: search || "", $options: "i" },
        })
            .limit(limit)
            .skip(startIndex)
            .sort(sortQuery);

        const totalItem = await CourseModel.countDocuments({
            Title: { $regex: search || "", $options: "i" },
        });

        return {
            courses,
            currentPage,
            totalItem,
            startItem: startIndex + 1,
            endItem: endIndex > totalItem ? totalItem : endIndex,
        };

    },
    getCourseDetail: async (courseId) => {
        // Validate if courseId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new Error("Invalid course ID");
        }

        const Course = await CourseModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(courseId) } },
            // ... rest of your aggregation pipeline
        ]);

        const relevantCourses = await CourseModel.GetAllRelevantCourses(
            Course[0]._id
        );
        return {
            title: Course[0].Title,
            Course: Course[0],
            relevantCourses,
        };
    },

    getTopicAndSkill: async () => {
        const topics = await TopicModel.GetAllTopics();
        const skills = await SkillModel.GetAllSkills();
        return { topics, skills };
    },

    addNewSkill: async (skillName) => {
        const newSkill = await SkillModel.create({ Name: skillName });
        return newSkill;
    },

    addNewTopic: async (topicName) => {
        const newTopic = await TopicModel.create({ Name: topicName });
        return newTopic;
    },

    addNewCourse: async (course) => {
        try {
            const date = new Date();
            const sanitizedTitle = course.Title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filePath = `CourseImage/${date.getTime()}_${sanitizedTitle}`;
            
            // Kiểm tra file và log
            console.log("Uploading image to Supabase...");
            await uploadImage(course.Img, filePath);
    
            const { data } = supabase.storage
                .from("SkillBoost")
                .getPublicUrl(filePath);
                console.log("Image URL:", data.publicUrl);
    
            if (!data || !data.publicUrl) {
                console.error("No URL returned for the image.");
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload image"
                });
            }
    
            course.Img = data.publicUrl;
            const skills = course.SkillGain.split(",");
            course.SkillGain = skills.map((skill) => new mongoose.Types.ObjectId(skill));
            course.Topic = new mongoose.Types.ObjectId(course.Topic);
    
            const newCourse = await CourseModel.create(course);
            return newCourse;
        } catch (error) {
            console.error("Error during course creation:", error);
            throw error;
        }
    },
    

    addNewModule: async (courseId, module) => {
        const newModule = await ModuleModel.create({
            CourseId: courseId,
            ModuleName: module.moduleName,
        });
        for (const lesson of module.lessons) {
            const duration = parseInt(lesson.lessonDuration);
            await LessonModel.create({
                ModuleId: newModule._id,
                LessonName: lesson.lessonName,
                Duration: duration,
            });
        }
        return newModule;
    },
    updateCourseProfile: async (req, res) => {
        try {
            // Retrieve courseId from session
            const courseId = req.session.courseId;
            if (!courseId) {
                return res.status(400).json({
                    success: false,
                    message: "Course ID is required",
                });
            }
    
            // Extract fields from the request body
            const { Title, Duration, Level, Description, Price, Sale, Rate, Lecturer } = req.body;
            const Img = req.file;
    
            // Prepare the updated data object
            const updatedData = {
                ...(Title && { Title }),
                ...(Duration && { Duration }),
                ...(Level && { Level }),
                ...(Description && { Description }),
                ...(Price && { Price }),
                ...(Sale && { Sale }),
                ...(Rate && { Rate }),
                ...(Lecturer && { Lecturer }),
            };
    
            // If an image file is provided, upload it to Supabase
            if (Img) {
                const date = new Date();
                const sanitizedTitle = Title?.replace(/[^a-z0-9]/gi, "_").toLowerCase();
                const filePath = `CourseImage/${date.getTime()}_${sanitizedTitle}`;
                await uploadImage(Img, filePath);
    
                const { data } = supabase.storage
                    .from("SkillBoost")
                    .getPublicUrl(filePath);
                    
    
                if (!data.publicUrl) {
                    return res.status(500).json({
                        success: false,
                        message: "Failed to upload image",
                    });
                }
    
                updatedData.Img = data.publicUrl;
            }
    
            // Update the course document in the database
            const updatedCourse = await CourseModel.updateOne(
                { _id: courseId },
                updatedData
            );
    
            if (updatedCourse.modifiedCount === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No changes were made to the course",
                });
            }
    
            // Send success response
            return res.json({
                success: true,
                message: "Course updated successfully!",
            });
        } catch (error) {
            console.error("Error updating course:", error);
            return res.status(500).json({
                success: false,
                message: "An error occurred while updating the course",
            });
        }
    },
    
};

module.exports = CourseService;
