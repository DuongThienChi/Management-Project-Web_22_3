const curDate = new Date();
const filterSelect = document.getElementById("filter-select");
const dynamicInput = document.getElementById("dynamic-input");
const ctx = document.getElementById("revenueChart").getContext("2d");
function updateSelectedOptions() {
    const filterValue = filterSelect.value;
    dynamicInput.innerHTML = ""; // Clear existing input

    if (filterValue === "daypicker") {
        const input = document.createElement("input");
        input.type = "date";
        input.addEventListener("change", () => fetchData({ day: input.value }));
        dynamicInput.appendChild(input);
    } else if (filterValue === "weekpicker") {
        const select = document.createElement("select");
        const weeks = ["Week01", "Week02", "Week03", "Week04"];
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        months.forEach((month) => {
            weeks.forEach((week) => {
                const option = document.createElement("option");
                option.value = `${week}/${month}`;
                option.text = `${week}/${month}`;
                select.appendChild(option);
            });
        });

        select.addEventListener("change", () =>
            fetchData({ weekPerMonth: select.value })
        );
        dynamicInput.appendChild(select);
    } else if (filterValue === "monthpicker") {
        const select = document.createElement("select");
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        months.forEach((month) => {
            const option = document.createElement("option");
            option.value = month;
            option.text = month;
            select.appendChild(option);
        });
        select.addEventListener("change", () =>
            fetchData({ month: select.value })
        );
        dynamicInput.appendChild(select);
    }
}
let dataReport = [];
let labels = [];
let chartInstance = null;
async function fetchData(data) {
    try {
        const response = await fetch("/report/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((res) => res.json());
        if (response.success) {
            const filterValue = filterSelect.value;
            dataReport = response.report.map((item) => item.total);
            labels = response.report.map((item) => {
                const date = new Date(item.createdAt);
                if (filterValue === "daypicker") {
                    return date.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                    });
                } else {
                    return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    });
                }
            });
            console.log(dataReport);
            if (chartInstance) {
                console.log("Destroying existing chart instance");
                chartInstance.destroy();
            }
            chartInstance = new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Sales",
                            data: dataReport,
                            borderColor: "rgba(147, 51, 234, 1)", // Tailwind "purple-500"
                            backgroundColor: "rgba(147, 51, 234, 0.2)", // Tailwind "purple-500 with opacity"
                            fill: true,
                        },
                        /*  {
         label: 'Profit',
         data: [30, 60, 20, 50, 30, 60, 80, 50, 30, 70, 40, 60],
         borderColor: 'rgba(239, 68, 68, 1)', // Tailwind "red-500"
         backgroundColor: 'rgba(239, 68, 68, 0.2)', // Tailwind "red-500 with opacity"
         fill: true
         }
         */
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: "bottom",
                        },
                        zoom: {
                            zoom: {
                                wheel: {
                                    enabled: true, // Kích hoạt zoom bằng con lăn chuột
                                },
                                pinch: {
                                    enabled: true, // Kích hoạt zoom bằng thao tác chụm trên màn hình cảm ứng
                                },
                                mode: "x", // Zoom theo trục x
                            },
                            pan: {
                                enabled: true, // Kích hoạt pan (kéo biểu đồ)
                                mode: "x", // Kéo theo trục x
                                threshold: 10, // Ngưỡng kéo
                            },
                        },
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                        },
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        } else {
            console.log("Error fetching data:", response.message);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
filterSelect.addEventListener("change", updateSelectedOptions);
// Initialize options on page load
updateSelectedOptions();
window.onload = () => fetchData({ day: curDate.toISOString().split("T")[0] });
