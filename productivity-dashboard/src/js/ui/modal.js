const filterTask = document.getElementById('filter-task');
const menu = document.getElementById("options-menu");
const edit = document.getElementById("task-info");
const overlay = document.getElementById('overlay');
const openBtn = document.getElementById('add-task');

openBtn.addEventListener('click', () => {
  overlay.style.display = 'block';
  form.style.display = 'flex';
});

document.addEventListener('click', (e) => {
  const clickedOutside = !form.contains(e.target) && !openBtn.contains(e.target) && form.style.display === "flex";

  if (clickedOutside) {
    overlay.style.display = 'none';
    form.style.display = 'none';
  }
});

document.addEventListener("click", (e) => {
  if (e.target.closest("#filter-task")) return;
  const li = e.target.closest("li");

  if (li) {
    const rect = li.getBoundingClientRect();
    const clickX = e.clientX;
    const areaDerecha = rect.right - 30;

    if (clickX >= areaDerecha) {
      overlay.style.display = "block";
      edit.style.display = "flex";

      edit.dataset.targetId = li.dataset.id;
      return;
    }
  }

  if (edit.style.display === "flex" && !edit.contains(e.target)) {
    overlay.style.display = 'none';
    edit.style.display = "none";
  }
});

document.addEventListener("click", (e) => {
  const rect = filterTask.getBoundingClientRect();

  const inside =
    e.clientX >= rect.left && e.clientX <= rect.right &&
    e.clientY >= rect.top && e.clientY <= rect.bottom;

  if (inside) {
    menu.style.left = `${rect.right}px`;
    menu.style.top = `${rect.bottom - 20}px`;
    menu.style.display = "block";
    return;
  }

  if (!menu.contains(e.target)) {
    menu.style.display = "none";
  }
});