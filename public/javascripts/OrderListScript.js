let currentSort = {
    field: null,
    direction: 1
};

function applySort(field) {
    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 1 ? -1 : 1;
    } else {
        currentSort.field = field;
        currentSort.direction = 1;
    }

    updateSortIcons();

    sortTableData(currentSort.field, currentSort.direction);

}

function updateSortIcons() {
    // Xóa biểu tượng sắp xếp khỏi tất cả các cột
    document.querySelectorAll('span[id^="sort-icon"]').forEach(icon => {
        icon.innerHTML = ''; // Xóa nội dung biểu tượng
    });

    // Cập nhật biểu tượng cho cột hiện tại
    const icon = document.getElementById(`sort-icon-${currentSort.field}`);
    if (icon) {
        icon.innerHTML = currentSort.direction === 1 ? '⬆️' : '⬇️';
    }
}

function sortTableData(field, direction) {
    xhr = new XMLHttpRequest();
    xhr.open('GET', `/orders/api/payments?sort=${field}&order=${direction}`);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const { payments } = JSON.parse(xhr.responseText);
            const tbody = document.getElementById('tableBody');
            let index = 0;
            tbody.innerHTML = payments.map(payment => {
                index++;
                const date = new Date(payment.createdAt);
                createdDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                const textColor = payment.status === 'pending' ? 'text-red-500' : 'text-green-500';
                const html = `
                    <tr class="hover:bg-gray-100">
                        <td class="border border-gray-300 px-4 py-2">${index}</td>
                        <td class="border border-gray-300 px-4 py-2">${payment._id}</td>
                        <td class="border border-gray-300 px-4 py-2">${createdDate}</td>
                        <td class="border border-gray-300 px-4 py-2">$${payment.total}</td>
                        <td class="border border-gray-300 px-4 py-2">${payment.items.length}</td>
                        <td class="border border-gray-300 px-4 py-2">
                            <span class="${textColor}">
                                ${payment.status}
                            </span>
                        </td>

                        <td class="border border-gray-300 px-4 py-2">${payment.userId.username}</td>
                        <td class="border border-gray-300 px-4 py-2">
                            <a href="/order/details/${payment._id}" class="text-blue-500 hover:underline">Details</a>
                        </td>
                    </tr>
                `;
                return html;
            }).join('');
        }
    };

    xhr.send();
}
