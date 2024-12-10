/** @type {import('tailwindcss').Config} */
// module.exports = {
//     content: [
//         "./views/**/*.hbs",
//         "./public/**/*.js",
//         "./public/**/*.html",
//         "./views/*.hbs",
//     ],
//     theme: {
//         extend: {
//             maxWidth: {
//                 "8xl": "88rem",
//             },
//         },
//     },
//     plugins: [],
// };
module.exports = {
    content: ["./**/*.html", "./**/*.js", "./**/*.hbs"], // Đảm bảo các file sidebar của bạn nằm trong danh sách này
    theme: {
      extend: {},
    },
    plugins: [],
  };
  