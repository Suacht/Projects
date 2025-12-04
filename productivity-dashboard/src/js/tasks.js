const form = document.getElementById('task-form');

form.addEventListener('submit', (event) => {
  console.log("click");
  event.preventDefault();

  const formData = { id: `task_${Date.now().toString()}`,
      title: document.getElementById('task-name').value,
      minutes: document.getElementById('task-minutes').value,
      status: 'pending',
      createAt: new Date().toISOString().split('T')[0],
      completedAt: null,
      description: document.getElementById('task-description').value,
      tags: document.getElementById('task-tags').value.split(',').map(tag => tag.trim()),
      pomodoroStats: { minutesFocused: 0, cyclesCompleted: 0}
  };

  console.log(formData);
  //localStorage.setItem(formData.id, JSON.stringify(formData));
});