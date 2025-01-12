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
let courses = [];
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
            courses = response.courses;
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
            renderFeatureProduct(courses);
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
function renderFeatureProduct(products) {
    const productSlider = document.getElementById("productSlider");

    if (products.length > 0) {
        productSlider.innerHTML = `
        <div class="relative overflow-hidden">
            <!-- Nút trái -->
            <button
                id="prevButton"
                class="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-600 p-2 rounded-full shadow focus:outline-none z-10"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </button>

            <!-- Slider -->
            <div id="slider" class="flex transition-transform duration-500">
                ${products
                    .map(
                        (product) => `
                        <div class="w-full flex-shrink-0 text-center">
                            <img src="${product.Img[0]}" alt="${product.Title}" class="w-full h-48 object-cover rounded-lg mb-4">
                            <h3 class="text-lg font-semibold">${product.Title}</h3>
                            <p class="text-blue-600 font-bold mt-2">$${product.Price}</p>
                        </div>
                    `
                    )
                    .join("")}
            </div>

            <!-- Nút phải -->
            <button
                id="nextButton"
                class="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-600 p-2 rounded-full shadow focus:outline-none z-10"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>
        </div>
        `;

        const slider = document.getElementById("slider");
        const slides = slider.children;
        const totalSlides = slides.length;
        const prevButton = document.getElementById("prevButton");
        const nextButton = document.getElementById("nextButton");

        let currentSlide = 0;
        const autoSlideInterval = 2000; // Thời gian tự động chuyển slide (ms)
        let autoSlideTimer;

        function updateSlider() {
            const translateX = -(currentSlide * 100);
            slider.style.transform = `translateX(${translateX}%)`;
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides; // Quay lại slide đầu nếu hết
            updateSlider();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; // Quay lại slide cuối nếu lùi quá
            updateSlider();
        }

        // Bắt sự kiện cho các nút
        nextButton.addEventListener("click", function () {
            nextSlide();
            restartAutoSlide(); // Reset lại thời gian tự động chuyển slide khi người dùng bấm
        });

        prevButton.addEventListener("click", function () {
            prevSlide();
            restartAutoSlide(); // Reset lại thời gian tự động chuyển slide khi người dùng bấm
        });

        // Hàm tự động chuyển slide
        function startAutoSlide() {
            autoSlideTimer = setInterval(nextSlide, autoSlideInterval);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideTimer);
        }

        function restartAutoSlide() {
            stopAutoSlide();
            startAutoSlide();
        }

        // Khởi chạy tự động chuyển slide
        startAutoSlide();

        // Dừng tự động chuyển slide khi người dùng di chuột vào slider
        slider.addEventListener("mouseenter", stopAutoSlide);

        // Tiếp tục tự động chuyển slide khi người dùng rời chuột khỏi slider
        slider.addEventListener("mouseleave", startAutoSlide);
    } else {
        productSlider.innerHTML = `<p class="text-center text-gray-600">No products found</p>`;
    }
}

window.onload = () => fetchData({ day: curDate.toISOString().split("T")[0] });
