const User = require("../data-access/UserModel");

const UserService = {
    getUserListInfo: async (search, sort, page) => {
        const limit = 5;
        const currentPage = parseInt(page) || 1;
        const startIndex = (currentPage - 1) * limit;
        const endIndex = currentPage * limit;

        const sortOptions = {
            Name_asc: { username: 1 },
            Name_desc: { username: -1 },
            Time_asc: { createdAt: 1 },
            Time_desc: { createdAt: -1 },
        };

        const sortQuery = sortOptions[sort];
        // const totalPage = Math.ceil((await User.countDocuments()) / limit);

        const users = await User.find({
            username: { $regex: search || "", $options: "i" },
        })

            .limit(limit)
            .skip(startIndex)
            .sort(sortQuery);
        const totalItem = users.length;
        return {
            users,
            currentPage,
            totalItem,
            startItem: startIndex + 1,
            endItem: endIndex > users.length ? users.length : endIndex,
        };
    },
};

module.exports = UserService;
