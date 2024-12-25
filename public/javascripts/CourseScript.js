function changePage(page) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    let currentPage = parseInt(params.get("page")) || 1;

    if (page === "prev") {
        currentPage -= 1;
    } else if (page === "next") {
        currentPage += 1;
    }

    currentPage = Math.max(currentPage, 1);
    params.set("page", currentPage);
    window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`
    );

    // Fetch new data based on updated page number
    fetchCoursesData(params);
}

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            searchCourses();
        }
    });
    const sortSelect = document.getElementById("sort");

    sortSelect.addEventListener("change", (event) => {
        const selectedValue = event.target.value;
        let sortField, sortOrder;

        switch (selectedValue) {
            case "Title":
            sortText =
                direction === "asc" ? "By Name ( A - Z )" : "By Name ( Z - A )";
            break;
        case "Price":
            sortText =
                direction === "asc"
                    ? "By Price ( Low - High )"
                    : "By Price ( High - Low )";
            break;
        case "Duration":
            sortText =
                direction === "asc"
                    ? "By Duration ( Short - Long )"
                    : "By Duration ( Long - Short )";
            break;
        default:
            sortText = "None";
            break;
        }

        appliedSort(sortField, sortOrder);
    });
});
function appliedSort(filter, order) {
    console.log(filter, order);
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set("sort", `${filter}_${order}`);
    params.set("page", 1);
    window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`
    );
    fetchCoursesData(params);
}
function searchCourses() {
    const searchInput = document.getElementById("search");
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set("search", searchInput.value);
    params.set("page", 1);
    window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`
    );
    fetchCoursesData(params);
}
function fetchCoursesData(params) {
    const endpoint = `/courses/course-list-data/?${params.toString()}`;
    console.log("Fetching data from:", endpoint); // Log URL endpoint

    fetch(endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => {
            console.log("Response received:", response); // Log toàn bộ response
            if (!response.ok) {
                // Nếu không phải trạng thái HTTP 200
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Kiểm tra Content-Type để đảm bảo JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Invalid content-type. Expected application/json.");
            }

            return response.json(); // Parse JSON nếu phản hồi hợp lệ
        })
        .then((data) => {
            console.log("Data received:", data); // Log dữ liệu nhận được
            if (!data.courses || data.courses.length === 0) {
                console.log("No courses found.");
                document.querySelector(".course-container tbody").innerHTML =
                    `<tr><td colspan="8" class="text-center">No courses found</td></tr>`;
                document.querySelector(".prev").classList.add("hidden");
                document.querySelector(".next").classList.add("hidden");
                updatePaging(0, 0, 0);
                return;
            }
            updateCoursesContainer(data.courses, data.startItem, data.endItem, data.totalItem);
        })
        .catch((error) => console.error("Fetch error:", error)); // Bắt lỗi
}


function updateCoursesContainer(courses, startItem, endItem, totalItem) {
    const coursesContainer = document.querySelector(".course-container tbody");
    coursesContainer.innerHTML = ""; // Clear existing content

    courses.forEach((course) => {
        const row = document.createElement("tr");
        row.classList.add("hover:bg-gray-100", "border-t");

        row.innerHTML = `
            <td class="py-3 px-4">${course.Title}</td>
            <td class="py-3 px-4">${course.Duration} hours</td>
            <td class="py-3 px-4">${course.Level}</td>
            <td class="py-3 px-4">${course.Lecturer}</td>
            <td class="py-3 px-4">${course.Price}</td>
            <td class="py-3 px-4">${course.Rate}/5</td>
            <td class="py-3 px-4">${course.Sale}%</td>
            <td class="py-3 px-4">
                <div class="flex space-x-2 border rounded">
                    <a href="/courses/${course._id}" class="text-blue-600 hover:text-blue-800">
                        👁️
                    </a>
                    <span class="text-gray-400 h-full">|</span>
                    <button class="text-red-600 hover:text-red-800" onclick="deleteCourse('${course._id}')">
                        🚫
                    </button> 
                </div>
            </td>
        `;

        coursesContainer.appendChild(row);
    });
    updatePaging(startItem, endItem, totalItem);
}
function updatePaging(startItem, endItem, totalItem) {
    const pagingContainer = document.querySelector(".paging");
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");
    if (prev.classList.contains("hidden") & (totalItem > 0)) {
        prev.classList.remove("hidden");
    }
    if (next.classList.contains("hidden") & (totalItem > 0)) {
        next.classList.remove("hidden");
    }
    pagingContainer.innerHTML = `Showing ${startItem}-${endItem} of ${totalItem}`;
}