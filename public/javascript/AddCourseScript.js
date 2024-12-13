function closeSkillDialog() {
    const dialog = document.getElementById('skillGainDialog');
    dialog.close();
}

function applySkills() {
    const checkboxes = document.querySelectorAll('#skillGainDialog input[name="SkillGain"]:checked');
    const selectedSkills = Array.from(checkboxes).map(cb => cb.value).join(', ');
    document.getElementById('skillGain').value = selectedSkills || 'Add Skill Gain';
    closeSkillDialog();
}