const API_URL = 'http://localhost:5001';

let chores = [];

document.getElementById('add-chore').addEventListener('click', async () => {
  const choreName = document.getElementById('new-chore').value.trim();
  if (choreName) {
    const newChore = { name: choreName, counts: { Jenny: 0, Qifan: 0 } };
    const response = await fetch(`${API_URL}/chores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newChore),
    });
    const chore = await response.json();
    chores.push(chore);
    renderChores();
    document.getElementById('new-chore').value = '';
  }
});

async function fetchChores() {
  const response = await fetch(`${API_URL}/chores`);
  chores = await response.json();
  renderChores();
}

function renderChores() {
  const list = document.getElementById('chores-list');
  list.innerHTML = '';

  chores.forEach((chore) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      ${chore.name}
      <div>
        <button onclick="incrementChore('${chore._id}', 'Jenny')">Jenny: ${chore.counts.Jenny}</button>
        <button onclick="incrementChore('${chore._id}', 'Qifan')">Qifan: ${chore.counts.Qifan}</button>
        <button onclick="deleteChore('${chore._id}')">Delete</button>
      </div>
    `;
    list.appendChild(listItem);
  });

  updateSummary();
}

async function deleteChore(id) {
  console.log('Deleting chore with ID:', id); // Add this line to check the ID
  const confirmDelete = confirm('Are you sure you want to delete this chore?');
  if (confirmDelete) {
    const response = await fetch(`${API_URL}/chores/${id}`, {
      method: 'DELETE',
    });
    console.log('Response from delete:', response); // Check response status
    chores = chores.filter((chore) => chore._id !== id); // Remove the deleted chore from the local list
    renderChores();
  }
}

async function incrementChore(id, person) {
  const response = await fetch(`${API_URL}/chores/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ person }),
  });
  const updatedChore = await response.json();
  const index = chores.findIndex((chore) => chore._id === id);
  chores[index] = updatedChore;
  renderChores();
}

function updateSummary() {
  const summary = document.getElementById('summary');
  let jennyTotal = 0;
  let QifanTotal = 0;

  chores.forEach((chore) => {
    jennyTotal += chore.counts.Jenny;
    QifanTotal += chore.counts.Qifan;
  });

  summary.innerText = `Jenny: ${jennyTotal} chores | Qifan: ${QifanTotal} chores`;
}

// Function to calculate the week range
function getWeekRange() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
  const startOfWeek = new Date(today);
  const endOfWeek = new Date(today);

  // Calculate the start of the week (Sunday)
  startOfWeek.setDate(today.getDate() - dayOfWeek);

  // Calculate the end of the week (Saturday)
  endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));

  // Format the dates
  const options = { month: '2-digit', day: '2-digit' };
  const start = startOfWeek.toLocaleDateString('en-US', options);
  const end = endOfWeek.toLocaleDateString('en-US', options);

  return `Week of ${start} - ${end}`;
}

// Display the week range
document.getElementById('week-range').textContent = getWeekRange();

// Initialize the app
fetchChores();
