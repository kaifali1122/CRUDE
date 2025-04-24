// API endpoints
const API_URL = 'http://localhost:3000/api';

// Create Record
const createForm = document.getElementById('createForm');
if (createForm) {
    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            age: parseInt(document.getElementById('age').value),
            grade: document.getElementById('grade').value,
            subjects: document.getElementById('subjects').value.split(',').map(s => s.trim())
        };

        try {
            const response = await fetch(`${API_URL}/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                showMessage('Record created successfully!', 'success');
                createForm.reset();
            } else {
                showMessage(data.message || 'Error creating record', 'error');
            }
        } catch (error) {
            showMessage('Error connecting to server', 'error');
        }
    });
}

// Read Records
const getAllRecordsBtn = document.getElementById('getAllRecords');
if (getAllRecordsBtn) {
    getAllRecordsBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`${API_URL}/students`);
            const data = await response.json();
            if (response.ok) {
                displayRecords(data);
            } else {
                showMessage(data.message || 'Error fetching records', 'error');
            }
        } catch (error) {
            showMessage('Error connecting to server', 'error');
        }
    });
}

// Update Record
const updateForm = document.getElementById('updateForm');
if (updateForm) {
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('id').value;
        const formData = {};
        
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const grade = document.getElementById('grade').value;
        const subjects = document.getElementById('subjects').value;

        if (name) formData.name = name;
        if (age) formData.age = parseInt(age);
        if (grade) formData.grade = grade;
        if (subjects) formData.subjects = subjects.split(',').map(s => s.trim());

        try {
            const response = await fetch(`${API_URL}/students/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                showMessage('Record updated successfully!', 'success');
                updateForm.reset();
            } else {
                showMessage(data.message || 'Error updating record', 'error');
            }
        } catch (error) {
            showMessage('Error connecting to server', 'error');
        }
    });
}

// Delete Record
const deleteForm = document.getElementById('deleteForm');
if (deleteForm) {
    deleteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('id').value;

        try {
            const response = await fetch(`${API_URL}/students/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            if (response.ok) {
                showMessage('Record deleted successfully!', 'success');
                deleteForm.reset();
            } else {
                showMessage(data.message || 'Error deleting record', 'error');
            }
        } catch (error) {
            showMessage('Error connecting to server', 'error');
        }
    });
}

// Helper Functions
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = type;
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = '';
        }, 3000);
    }
}

function displayRecords(records) {
    const recordsList = document.getElementById('recordsList');
    if (recordsList) {
        if (records.length === 0) {
            recordsList.innerHTML = '<p>No records found</p>';
            return;
        }

        recordsList.innerHTML = records.map(record => `
            <div class="record-item">
                <h3>${record.name}</h3>
                <p><strong>ID:</strong> ${record._id}</p>
                <p><strong>Age:</strong> ${record.age}</p>
                <p><strong>Grade:</strong> ${record.grade}</p>
                <p><strong>Subjects:</strong> ${record.subjects.join(', ')}</p>
            </div>
        `).join('');
    }
}

// Show Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Fetch All Students
async function fetchStudents() {
    try {
        getAllRecordsBtn.disabled = true;
        getAllRecordsBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
        
        const response = await fetch(`${API_URL}/students`);
        if (!response.ok) throw new Error('Failed to fetch students');
        
        const students = await response.json();
        displayStudents(students);
        
        getAllRecordsBtn.innerHTML = '<i class="fas fa-list me-2"></i>Get All Students';
        getAllRecordsBtn.disabled = false;
    } catch (error) {
        showToast('Error fetching students: ' + error.message, 'danger');
        getAllRecordsBtn.innerHTML = '<i class="fas fa-list me-2"></i>Get All Students';
        getAllRecordsBtn.disabled = false;
    }
}

// Display Students
function displayStudents(students) {
    const recordsList = document.getElementById('recordsList');
    if (recordsList) {
        if (students.length === 0) {
            recordsList.innerHTML = '<p>No records found</p>';
            return;
        }

        recordsList.innerHTML = students.map(student => `
            <div class="record-item">
                <h3>${student.name}</h3>
                <p><strong>ID:</strong> ${student._id}</p>
                <p><strong>Age:</strong> ${student.age}</p>
                <p><strong>Grade:</strong> ${student.grade}</p>
                <p><strong>Subjects:</strong> ${student.subjects.join(', ')}</p>
            </div>
        `).join('');
    }
}

// Add highlight animation to CSS
const style = document.createElement('style');
style.textContent = `
    .highlight {
        animation: highlight 2s ease;
    }
    
    @keyframes highlight {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); background-color: #e3f2fd; }
        100% { transform: scale(1); }
    }
    
    .student-item {
        transition: all 0.3s ease;
    }
    
    .student-item:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style); 