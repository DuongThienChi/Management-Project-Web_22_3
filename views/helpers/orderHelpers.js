const hbs = require('hbs');

hbs.registerHelper('createdDate', function (date) {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    return `${day}/${month}/${year}`;
});

hbs.registerHelper('index', function (index) {
    return index + 1;
});

hbs.registerHelper('statusClass', function (status) {
    if (status === 'pending') {
        return 'text-red-500'; // Màu đỏ
    } else if (status === 'paid') {
        return 'text-green-500'; // Màu xanh
    } else {
        return ''; // Mặc định
    }
});
