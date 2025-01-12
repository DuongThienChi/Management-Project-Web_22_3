const hbs = require("hbs");

hbs.registerHelper("formatBooleanToText", (value) => {
    return value ? "Yes" : "No";
});

hbs.registerHelper("formatDate", (date) => {
    const dateString = new Date(date).toString();
    const gmtIndex = dateString.indexOf("GMT");
    return dateString.substring(0, gmtIndex);
});

hbs.registerHelper("getThumbnail", function (imgs) {
    return imgs[0];
});