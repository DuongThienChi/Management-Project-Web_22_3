let currentSort = {
    field: null,
    direction: 1,
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
    document.querySelectorAll('span[id^="sort-icon"]').forEach((icon) => {
        icon.innerHTML = ""; // Xóa nội dung biểu tượng
    });

    // Cập nhật biểu tượng cho cột hiện tại
    const icon = document.getElementById(`sort-icon-${currentSort.field}`);
    if (icon) {
        icon.innerHTML = currentSort.direction === 1 ? "⬆️" : "⬇️";
    }
}

function sortTableData(field, direction) {
    xhr = new XMLHttpRequest();
    xhr.open("GET", `/orders/api/payments?sort=${field}&order=${direction}`);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const { payments } = JSON.parse(xhr.responseText);
            generatePaymentRow(payments);
        }
    };

    xhr.send();
}

function openFilter() {
    const filter = document.getElementById("filterDialog");
    filter.classList.toggle("hidden");
}

function closeFilter() {
    const filter = document.getElementById("filterDialog");
    document.getElementById("from").value = "";
    document.getElementById("to").value = "";
    document.getElementById("status").selectedIndex = 0;
    filter.classList.add("hidden");
}

function applyFilter() {
    const startDate = document.getElementById("from").value;
    const endDate = document.getElementById("to").value;
    const status = document.getElementById("status").value;

    if ((startDate && !endDate) || (!startDate && endDate)) {
        alert("Please enter both start and end date");
        return;
    }

    if (startDate > endDate) {
        alert("Start date must be before end date");
        return;
    }
    // set params
    const query = new URLSearchParams();
    query.append("startDate", startDate);
    query.append("endDate", endDate);
    query.append("status", status);
    query.delete("page");

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/orders/api/payments?${query.toString()}`);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const { payments } = JSON.parse(xhr.responseText);
            generatePaymentRow(payments);
        }
    };

    xhr.send();

    closeFilter();
}

function generatePaymentRow(payments)
{
    if(payments.length === 0)
    {
        const tbody = document.getElementById("tableBody");
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">No orders</td>
            </tr>
        `;
        return;
    }

    const tbody = document.getElementById("tableBody");
    let index = 0;
    tbody.innerHTML = payments
        .map((payment) => {
            index++;
            const date = new Date(payment.createdAt);
            createdDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            const textColor =
                payment.status === "pending"? "text-red-500": "text-green-500";
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
                    <a href="javascript:void(0)" class="text-blue-500 hover:underline" onclick="showDetails('${payment._id}')">Details</a>
                </td>
            </tr>
        `;
            return html;
        })
        .join("");
}

function hideDetails() {
    const detailPane = document.getElementById('detailPane');
    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = '';
    detailPane.classList.add('hidden');
}

function showDetails(orderId) {
    const detailPane = document.getElementById('detailPane');
    const detailContent = document.getElementById('detailContent');

    // Load data dynamically (mocking fetch here for demonstration)
    fetch(`api/payments/${orderId}`)
        .then((response) => response.json())
        .then((data) => {
            detailContent.innerHTML = `
                <p><strong>ID:</strong> ${data._id}</p>
                <p><strong>Date:</strong> ${formatDateTime(data.createdAt)}</p> 
                <p><strong>Total:</strong> $${data.total}</p>
                <p><strong>User:</strong> ${data.userId.username}</p>
                <p><strong>Items:</strong></p>
                <ul>
                    ${data.items
                        .map((item) => `<li>+ ${item.Title} - $${item.Price}</li>`)
                        .join('')}
                </ul>
                <div class="flex flex-col mb-4">
                    <label for="order-detail-status" class="text-lg font-bold mb-2">Status:</label>
                    <select id="order-detail-status" name="status" class="border border-gray-300 rounded-lg p-2"
                        onchange="updateStatus('${data._id}', this.value)">
                        <option value="pending" ${data.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${data.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="paid" ${data.status === 'paid' ? 'selected' : ''}>Paid</option>
                    </select>
                </div>
            `;
        })
        .catch((error) => {
            console.error('Error fetching order details:', error);
            detailContent.innerHTML = '<p>Error loading details.</p>';
        });
    // Show the details pane
    detailPane.classList.remove('hidden');
    detailPane.classList.add('visible');
}

function updateStatus(orderId, status) {
    fetch(`api/order/${orderId}/update`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    })
        .then((response) => response.json())
        .then((data) => {
            applyFilter();
        })
        .catch((error) => {
            console.error('Error updating status:', error);
        });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours24 = date.getHours();
    const hours12 = hours24 % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    return `${day}/${month}/${year} ${hours12}:${minutes}:${seconds} ${ampm}`;
}