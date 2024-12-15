let currentSort = {
    field: null,
    direction: 'asc' // Mặc định sắp xếp tăng dần
};

function applySort(field) {
    // Nếu nhấp lại vào cùng một cột, đổi hướng sắp xếp
    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.direction = 'asc'; // Mặc định tăng dần khi chọn cột mới
    }

    // Gửi yêu cầu tới server hoặc xử lý dữ liệu ở phía client
    sortTableData(currentSort.field, currentSort.direction);

    // Cập nhật biểu tượng sắp xếp
    updateSortIcons();
}

function updateSortIcons() {
    // Xóa biểu tượng sắp xếp khỏi tất cả các cột
    document.querySelectorAll('span[id^="sort-icon"]').forEach(icon => {
        icon.innerHTML = ''; // Xóa nội dung biểu tượng
    });

    // Cập nhật biểu tượng cho cột hiện tại
    const icon = document.getElementById(`sort-icon-${currentSort.field}`);
    if (icon) {
        icon.innerHTML = currentSort.direction === 'asc' ? '⬆️' : '⬇️';
    }
}

function sortTableData(field, direction) {
    xhr = new XMLHttpRequest();
    
}
