function closeSkillDialog() {
    const dialog = document.getElementById("skillGainDialog");
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
    closeSkillDialog();
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
    modal.classList.add("hidden");
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

function cancelAdd() {
    window.location.href = "/courses";
}
