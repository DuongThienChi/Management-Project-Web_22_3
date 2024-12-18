let modules = [];

function closeDialog(id) {
    const dialog = document.getElementById(id);
    if (id === "addModuleDialog") {
        document.getElementById("moduleName").value = "";
        document.getElementById("lessonList").innerHTML = "";
    }
    dialog.close();
}

function applySkills() {
    const checkboxes = document.querySelectorAll(
        '#skillGainDialog input[name="SkillGain"]:checked'
    );
    const selectedSkills = Array.from(checkboxes)
        .map((cb) => `[${cb.value}]`) // Bọc giá trị trong [ ]
        .join(", "); // Nối các giá trị bằng khoảng trắng

    document.getElementById("skillGain").value =
        selectedSkills || "Add Skill Gain";

    closeDialog("skillGainDialog");
}

function uncheckAllSkills() {
    const checkboxes = document.querySelectorAll(
        'input[name="SkillGain"]:checked'
    );
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove("hidden");
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);

    if (modalId === "ModuleModal") {
        // set module list like before
        const moduleNameInput = document.getElementById(
            "editSectionModuleName"
        ); // Get the input element
        const oldModuleName = moduleNameInput
            ? moduleNameInput.defaultValue
            : null; // Retrieve default value
        moduleNameInput.value = oldModuleName;

        const lessonList = document.getElementById("Module-lessonList");
        // set lesson list like before
        lessonList.innerHTML = modules
            .find(
                (m) =>
                    m.moduleName ===
                    document.getElementById("editSectionModuleName")
                        .defaultValue
            )
            .lessons.map(
                (lesson, index) => `
                <div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" id="LessonName" name="LessonName" value="${lesson.lessonName}" class="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-[#4f75ff] focus:border-[#4f75ff]">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Duration(Minutes)</label>
                        <input type="number" id="LessonDuration" name="LessonDuration" value="${lesson.lessonDuration}" class="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-[#4f75ff] focus:border-[#4f75ff]">
                    </div>
                </div>`
            )
            .join("");
    }
    // remove the modal from the DOM
    modal.remove();
}

function saveNewSkill() {
    const newSkill = document.getElementById("newSkill").value.trim();
    if (newSkill) {
        document.getElementById("newSkill").value = ""; // Xóa giá trị trong input

        xhr = new XMLHttpRequest();
        xhr.open("POST", "/courses/Add/newSkill", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    // Create the new skill div directly
                    const newSkill = response.result;
                    const newDiv = `
                                    <div class="flex items-center">
                                        <input type="checkbox" id="${newSkill._id}" name="SkillGain" value="${newSkill.Name}" class="mr-2 w-6 h-6">
                                        <label for="${newSkill._id}">${newSkill.Name}</label>
                                    </div>`;

                    // Append the new div to the skill list
                    const skillList = document.getElementById("skillList");
                    skillList.insertAdjacentHTML("beforeend", newDiv);
                } else {
                    alert("Failed to add new skill!");
                }
            }
        };
        xhr.send(JSON.stringify({ newSkill }));

        closeModal("addSkillModal");
    } else {
        alert("Please enter a skill name!");
    }
}

function handleTopicChange() {
    const topicSelect = document.getElementById("topic");
    const selectedValue = topicSelect.value;

    if (selectedValue === "Add Topic") {
        topicSelect.selectedIndex = 0;
        openModal("addTopicModal");
    }
}

function saveNewTopic() {
    const newTopic = document.getElementById("newTopic").value.trim();
    if (newTopic) {
        document.getElementById("newTopic").value = "";

        xhr = new XMLHttpRequest();
        xhr.open("POST", "/courses/Add/newTopic", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    // Create the new topic option as a DOM node
                    const newTopic = response.result;
                    const newOption = document.createElement("option");
                    newOption.value = newTopic._id;
                    newOption.textContent = newTopic.Name;

                    // Get the 'Add Topic' option element
                    const topicSelect = document.getElementById("topic");
                    const addTopicOption = topicSelect.querySelector(
                        'option[value="Add Topic"]'
                    );

                    // Insert the new option before 'Add Topic'
                    topicSelect.insertBefore(newOption, addTopicOption);
                } else {
                    alert("Failed to add new topic!");
                }
            }
        };
        xhr.send(JSON.stringify({ newTopic }));

        closeModal("addTopicModal");
    } else {
        alert("Please enter a topic name!");
    }
}

function AddLesson() {
    // Get the lessonList container
    const lessonList = document.getElementById("lessonList");
    // Create a new lesson div
    const newLessonInput = `
        <div class="grid grid-cols-1 md:grid-cols-3 md:gap-4">
            <!-- Title -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="LessonName" name="LessonName" class="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-[#4f75ff] focus:border-[#4f75ff]">
            </div>

            <!-- Lecturer -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Duration(Minutes)</label>
                <input type="number" id="LessonDuration" name="LessonDuration" class="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-[#4f75ff] focus:border-[#4f75ff]">
            </div>

            <div class="mb-4 flex items-end">
                <button type="button" class="px-4 py-2 border hover:bg-red-500 rounded-md text-white bg-red-400"
                        onclick="removeThisLesson()">                    
                    <i class="fa-solid fa-x"></i>
                </button>
            </div>
        </div>`;

    // Append the new lesson div to the lesson list
    lessonList.insertAdjacentHTML("beforeend", newLessonInput);
}

function cancelAdd() {
    window.location.href = "/courses";
}

function removeThisLesson() {
    const lesson = event.target.closest(".grid");
    lesson.remove();
}

function saveModule() {
    const moduleName = document.getElementById("moduleName").value.trim();
    const lessonInputs = document.querySelectorAll("#lessonList > div");

    if (moduleName && lessonInputs.length > 0) {
        const lessons = Array.from(lessonInputs).map((lesson) => {
            const lessonName = lesson.querySelector("#LessonName").value.trim();
            if (!lessonName) {
                alert("Please enter a lesson name!");
                return null;
            }
            // if duration of one lesson is empty, alert
            // just get lesson duration
            const lessonDuration = lesson
                .querySelector("#LessonDuration")
                .value.trim();
            if (!lessonDuration) {
                alert("Please enter a lesson duration!");
                return null;
            }
            return { lessonName, lessonDuration };
        });

        if (lessons.includes(null)) return;
        const module = { moduleName, lessons };
        modules.push(module);

        // Clear the input fields
        document.getElementById("moduleName").value = "";
        document.getElementById("lessonList").innerHTML = "";
        const newModule = `
                <div class="text-md mb-4 px-4 py-2 border rounded-lg inline-block hover:cursor-pointer">
                    <div class="inline-block"  onclick="SeeModuleInfo('${module.moduleName}')" id=${module.moduleName}>
                        <span>${module.moduleName}: </span>
                        <span>has ${lessons.length} lesson(s)</span>
                    </div>

                    <button type="button" onclick="removeModule()"
                            class="ml-2 px-2 py-1 border hover:bg-red-500 rounded text-white bg-red-400 text-xs text-center">
                        <i class="fa-solid fa-x"></i>
                    </button>
                </div>`;
        const moduleList = document.getElementById("modules-container");
        moduleList.insertAdjacentHTML("beforeend", newModule);

        // Close the dialog
        closeDialog("addModuleDialog");
    } else {
        alert("Please enter a module name and at least one lesson!");
    }
}

function SeeModuleInfo(name) {
    const module = document.getElementById(name);
    const moduleName = module.textContent.split(":")[0].trim();
    const lessons = modules.find((m) => m.moduleName === moduleName).lessons;
    // how to make modal can scroll
    const ModuleInfo = `<div id="ModuleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
                <div class="bg-white p-6 rounded-lg w-1/3 max-h-[80vh] overflow-y-auto">
                    <label class="block text-lg font-medium text-gray-700">Module Name</label>
                    <input type="text" value="${moduleName}" class="w-full mt-1 p-2 border border-gray-300 rounded-lg 
                                focus:ring-[#4f75ff] focus:border-[#4f75ff] text-md"
                                id="editSectionModuleName">
                    <div class="text-lg font-medium text-gray-700 mt-4">Lessons:</div>
                    <div id="Module-lessonList" class="mb-4">
                        ${lessons
                            .map(
                                (lesson, index) =>
                                    `<div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" id="LessonName" name="LessonName" value="${lesson.lessonName}" class="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-[#4f75ff] focus:border-[#4f75ff]">
                                </div>
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700">Duration(Minutes)</label>
                                    <input type="number" id="LessonDuration" name="LessonDuration" value="${lesson.lessonDuration}" class="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-[#4f75ff] focus:border-[#4f75ff]">
                                </div>
                            </div>`
                            )
                            .join("")}
                    </div>
                    <div class="flex justify-end">
                        <button onclick="updateModule()" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg mr-2">
                            Save
                        </button>
                        <button onclick="closeModal('ModuleModal')" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg ">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>`;
    document.body.insertAdjacentHTML("beforeend", ModuleInfo);
    openModal("ModuleModal");
}

function removeModule() {
    const module = event.target.closest("div");
    module.remove();
    modules = modules.filter(
        (m) =>
            m.moduleName !==
            module.querySelector("div").textContent.split(":")[0].trim()
    );
}

function updateModule() {
    //update module name
    const moduleNameInput = document.getElementById("editSectionModuleName"); // Get the input element
    const oldModuleName = moduleNameInput ? moduleNameInput.defaultValue : null; // Retrieve default value
    const newModuleName = moduleNameInput ? moduleNameInput.value : null; // Retrieve current value

    if (oldModuleName !== newModuleName) {
        const module = modules.find((m) => m.moduleName === oldModuleName);
        module.moduleName = newModuleName;
        moduleNameInput.defaultValue = newModuleName;
        const tag = document.getElementById(oldModuleName);
        tag.id = newModuleName;
        tag.setAttribute("onclick", `SeeModuleInfo('${newModuleName}')`);
        tag.textContent = `${newModuleName}: has ${module.lessons.length} lesson(s)`;
    }

    //update lessons
    const lessonInputs = document.querySelectorAll("#Module-lessonList > div");
    const lessons = Array.from(lessonInputs).map((lesson) => {
        const lessonName = lesson.querySelector("#LessonName").value.trim();
        if (!lessonName) {
            alert("Please enter a lesson name!");
            return null;
        }
        const lessonDuration = lesson
            .querySelector("#LessonDuration")
            .value.trim();
        return { lessonName, lessonDuration };
    });

    const module = modules.find((m) => m.moduleName === newModuleName);
    module.lessons = lessons;

    closeModal("ModuleModal");
}

function addCourse() {
    const title = document.getElementById("title").value.trim();
    const duration = document.getElementById("duration").value.trim();
    const level = document.getElementById("level").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = document.getElementById("price").value.trim();
    const topic = document.getElementById("topic").value.trim();
    const skillGainDialog = document.getElementById("skillGainDialog");
    const img = document.getElementById("image");
    const file = img.files[0];
    // get id of the selected skills
    const skillGain = Array.from(
        skillGainDialog.querySelectorAll('input[name="SkillGain"]:checked')
    ).map((cb) => cb.id);
    const lecturer = document.getElementById("lecturer").value.trim();
    const missingFields = [];

    if (!title) missingFields.push("Title");
    if (!duration) missingFields.push("Duration");
    if (!level) missingFields.push("Level");
    if (!description) missingFields.push("Description");
    if (!price) missingFields.push("Price");
    if (!topic) missingFields.push("Topic");
    if (!skillGain) missingFields.push("Skill Gain");
    if (!lecturer) missingFields.push("Lecturer");
    if (modules.length === 0) missingFields.push("Modules");

    if (missingFields.length > 0) {
        alert(
            `Please fill in the following fields: ${missingFields.join(", ")}`
        );
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("duration", duration);
    formData.append("level", level);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("topic", topic);
    formData.append("skillGain", skillGain);
    formData.append("lecturer", lecturer);
    formData.append("modules", JSON.stringify(modules));
    formData.append("image", file);


    xhr = new XMLHttpRequest();
    xhr.open("POST", "/courses/Add/newCourse", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
                alert("Course added successfully!");
                window.location.href = "/courses";
            } else {
                alert("Failed to add course!");
            }
        }
    };
    xhr.send(formData);
}