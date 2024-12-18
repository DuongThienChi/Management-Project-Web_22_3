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
    getCourses: async (
        search,
        topic,
        skill,
        level,
        price,
        sort,
        order,
        page
    ) => {
        const coursesQuery = await CourseModel.GetCoursesByFilter(
            search,
            topic,
            skill,
            level,
            price,
            sort,
            order,
            page
        );

        const topics = await TopicModel.GetAllTopics();
        const skills = await SkillModel.GetAllSkills();

        return {
            courses: coursesQuery.courses,
            currentPage: page || 1,
            totalPages: coursesQuery.totalPages,
            isFirstPage: page == 1 || !page,
            isLastPage: page == coursesQuery.totalPages,
            topics,
            skills,
        };
    },

    getCourseDetail: async (courseId) => {
        const Course = await CourseModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(courseId) } },
            {
                $lookup: {
                    from: "Skills",
                    localField: "SkillGain",
                    foreignField: "_id",
                    as: "SkillGain",
                },
            },
            {
                $lookup: {
                    from: "Modules",
                    localField: "_id", // `_id` của Course
                    foreignField: "CourseId", // `CourseId` của Module
                    as: "Modules", // Gắn Modules vào kết quả
                },
            },

            {
                $unwind: {
                    path: "$Modules", // Tách các modules ra từng tài liệu
                    preserveNullAndEmptyArrays: true, // Giữ lại Course nếu không có Module
                },
            },

            {
                $lookup: {
                    from: "Lessons",
                    localField: "Modules._id", // `_id` của Module
                    foreignField: "ModuleId", // `ModuleId` của Lessons
                    as: "Modules.Lessons", // Gắn Lessons vào từng Module
                },
            },

            {
                $group: {
                    _id: "$_id", // Group lại theo `_id` của course
                    Title: { $first: "$Title" },
                    SkillGain: { $first: "$SkillGain" },
                    Topic: { $first: "$Topic" },
                    Modules: { $push: "$Modules" }, // Gom tất cả các module vào mảng Modules
                    Duration: { $first: "$Duration" },
                    Level: { $first: "$Level" },
                    Description: { $first: "$Description" },
                    Img: { $first: "$Img" },
                    Price: { $first: "$Price" },
                    Rate: { $first: "$Rate" },
                    Lecturer: { $first: "$Lecturer" },
                },
            },
        ]);

        console.log(Course[0]);

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
            // get today
            const date = new Date();
            const sanitizedTitle = course.Title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filePath = `CourseImage/${date.getTime()}_${sanitizedTitle}`;
            await uploadImage(course.Img, filePath);
    
            const { data } = supabase.storage
                .from("SkillBoost")
                .getPublicUrl(filePath);
    
            course.Img = data.publicUrl;
            const skills = course.SkillGain.split(",");
            course.SkillGain = [];
            course.SkillGain = skills.map((skill) => new mongoose.Types.ObjectId(skill));
            course.Topic = new mongoose.Types.ObjectId(course.Topic);
    
            const newCourse = await CourseModel.create(course);
            return newCourse;
        } catch (error) {
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
};

module.exports = CourseService;
