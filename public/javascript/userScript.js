function changePage(page) {
    // Get the current page from the URL
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    // Get the current page number from the query parameters or set to 1 if not provided
    let currentPage = parseInt(params.get("page")) || 1;
    if (page === "prev") {
        currentPage -= 1;
    } else if (page === "next") {
        currentPage += 1;
    }
    // page transitions
    currentPage = Math.max(currentPage, 1);
    params.set("page", currentPage);
    window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`
    );
    // Fetch the new data
    fetchUsersData(params);
}
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            searchUsers();
        }
    });
    const sortSelect = document.getElementById("sort");

    sortSelect.addEventListener("change", (event) => {
        const selectedValue = event.target.value;
        let sortField, sortOrder;

        switch (selectedValue) {
            case "name_asc":
                sortField = "Name";
                sortOrder = "asc";
                break;
            case "name_desc":
                sortField = "Name";
                sortOrder = "desc";
                break;
            case "created_asc":
                sortField = "Time";
                sortOrder = "asc";
                break;
            case "created_desc":
                sortField = "Time";
                sortOrder = "desc";
                break;
            default:
                sortField = "Name";
                sortOrder = "asc";
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
    fetchUsersData(params);
}
function searchUsers() {
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
    fetchUsersData(params);
}
function fetchUsersData(params) {
    const xhr = new XMLHttpRequest();
    const endpoint = `/users/user-list-data?${params.toString()}`;
    xhr.open("GET", endpoint, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.users.length === 0) {
                    const userContainer = document.querySelector(
                        ".user-container tbody"
                    );
                    userContainer.innerHTML = `<tr><td colspan="8" class="text-center">No users found</td></tr>`;
                    const prev = document.querySelector(".prev");
                    const next = document.querySelector(".next");
                    //prev.classList.add("hidden");
                    next.classList.add("hidden");
                    updatePaging(0, 0, 0);
                    return;
                }
                updateUsersContainer(
                    response.users,
                    response.startItem,
                    response.endItem,
                    response.totalItem
                );
            } else {
                console.error(`Error: ${xhr.status} - ${xhr.statusText}`);
            }
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}
function updateUsersContainer(users, startItem, endItem, totalItem) {
    const userContainer = document.querySelector(".user-container tbody");
    userContainer.innerHTML = ""; // Clear existing content

    users.forEach((user) => {
        const row = document.createElement("tr");
        row.classList.add("hover:bg-gray-100", "border-t");

        row.innerHTML = `
            <td class="py-3 px-4">${user.username}</td>
            <td class="py-3 px-4">${user.email}</td>
            <td class="py-3 px-4">${user.contact}</td>
            <td class="py-3 px-4">${user.address}</td>
            <td class="py-3 px-4">${user.verify ? "Yes" : "No"}</td>
            <td class="py-3 px-4">${user.ban ? "Yes" : "No"}</td>
            <td class="py-3 px-4">${formatDate(user.createdAt)}</td>
            <td class="py-3 px-4">
                <div class="flex space-x-2 border rounded">
                    <a href="/users/view/${
                        user._id
                    }" class="text-blue-600 hover:text-blue-800">👁️</a>
                    <span class="text-gray-400 h-full">|</span>
                    <a href="/users/ban/${
                        user._id
                    }" class="text-red-600 hover:text-red-800">🚫</a>
                </div>
            </td>
        `;

        userContainer.appendChild(row);
    });
    updatePaging(startItem, endItem, totalItem);
}
function formatDate(date) {
    const dateString = new Date(date).toString();
    const gmtIndex = dateString.indexOf("GMT");
    return dateString.substring(0, gmtIndex);
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
