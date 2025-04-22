// API Base URL
const API_URL = 'http://localhost:3000/api';

// DOM Elements
const createForm = document.getElementById('createForm');
const updateForm = document.getElementById('updateForm');
const deleteForm = document.getElementById('deleteForm');
const getStudentsBtn = document.getElementById('getStudents');
const studentsList = document.getElementById('studentsList');

// Event Listeners
createForm.addEventListener('submit', handleCreate);
updateForm.addEventListener('submit', handleUpdate);
deleteForm.addEventListener('submit', handleDelete);
getStudentsBtn.addEventListener('click', fetchStudents);

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

// Create Student
async function handleCreate(e) {
    e.preventDefault();
    const studentData = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        grade: document.getElementById('grade').value,
        subjects: document.getElementById('subjects').value.split(',').map(subject => subject.trim())
    };

    try {
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        if (!response.ok) throw new Error('Failed to create student');
        
        const student = await response.json();
        showToast('Student created successfully!');
        createForm.reset();
        fetchStudents();
        
        // Animate the new student entry
        const studentElement = document.querySelector(`[data-id="${student._id}"]`);
        if (studentElement) {
            studentElement.classList.add('highlight');
            setTimeout(() => studentElement.classList.remove('highlight'), 2000);
        }
    } catch (error) {
        showToast('Error creating student: ' + error.message, 'danger');
    }
}

// Update Student
async function handleUpdate(e) {
    e.preventDefault();
    const id = document.getElementById('updateId').value;
    const updateData = {};

    const name = document.getElementById('updateName').value;
    const age = document.getElementById('updateAge').value;

    if (name) updateData.name = name;
    if (age) updateData.age = parseInt(age);

    if (Object.keys(updateData).length === 0) {
        showToast('Please provide at least one field to update', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) throw new Error('Failed to update student');
        
        showToast('Student updated successfully!');
        updateForm.reset();
        fetchStudents();
    } catch (error) {
        showToast('Error updating student: ' + error.message, 'danger');
    }
}

// Delete Student
async function handleDelete(e) {
    e.preventDefault();
    const id = document.getElementById('deleteId').value;

    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete student');
        
        showToast('Student deleted successfully!');
        deleteForm.reset();
        fetchStudents();
    } catch (error) {
        showToast('Error deleting student: ' + error.message, 'danger');
    }
}

// Fetch All Students
async function fetchStudents() {
    try {
        getStudentsBtn.disabled = true;
        getStudentsBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
        
        const response = await fetch(`${API_URL}/students`);
        if (!response.ok) throw new Error('Failed to fetch students');
        
        const students = await response.json();
        displayStudents(students);
        
        getStudentsBtn.innerHTML = '<i class="fas fa-list me-2"></i>Get All Students';
        getStudentsBtn.disabled = false;
    } catch (error) {
        showToast('Error fetching students: ' + error.message, 'danger');
        getStudentsBtn.innerHTML = '<i class="fas fa-list me-2"></i>Get All Students';
        getStudentsBtn.disabled = false;
    }
}

// Display Students
function displayStudents(students) {
    studentsList.innerHTML = '';
    
    if (students.length === 0) {
        studentsList.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>No students found in the database.
            </div>
        `;
        return;
    }

    students.forEach(student => {
        const studentElement = document.createElement('div');
        studentElement.className = 'student-item';
        studentElement.setAttribute('data-id', student._id);
        studentElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h5 class="mb-2">${student.name}</h5>
                    <p class="mb-1"><strong>ID:</strong> ${student._id}</p>
                    <p class="mb-1"><strong>Age:</strong> ${student.age}</p>
                    <p class="mb-1"><strong>Grade:</strong> ${student.grade}</p>
                    <p class="mb-0"><strong>Subjects:</strong> ${student.subjects.join(', ')}</p>
                </div>
                <div class="text-muted">
                    <small>Created: ${new Date(student.createdAt || Date.now()).toLocaleDateString()}</small>
                </div>
            </div>
        `;
        studentsList.appendChild(studentElement);
    });
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