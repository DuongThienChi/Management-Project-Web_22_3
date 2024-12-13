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

function openAddSkillModal() {
    const modal = document.getElementById("addSkillModal");
    modal.classList.remove("hidden"); // Hiển thị modal
}

function closeAddSkillModal() {
    const modal = document.getElementById("addSkillModal");
    modal.classList.add("hidden"); // Ẩn modal
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

        closeAddSkillModal();
    } else {
        alert("Please enter a skill name!");
    }
}
