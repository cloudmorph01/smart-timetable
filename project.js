// Users Database
const users = {
    'kumarambar12@gmail.com': { password: 'kumarambar', name: 'Kumar Ambar', role: 'student' },
    'raviydv01@gmail.com': { password: 'raviyadav', name: 'Ravi Yadav', role: 'teacher' },
    'shivamdubey61@gmail.com': { password: 'shivamdupey', name: 'Shivam Dubey', role: 'student' }
};

// Timetable Data
let timetable = [
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ['9-10', 'Maths', 'Physics', 'Chemistry', 'Maths', 'English'],
    ['10-11', 'English', 'Maths', 'Physics', 'Chemistry', 'Sports'],
    ['11-12', 'Physics', 'Chemistry', 'English', 'Physics', 'Project'],
    ['1-2', 'Chemistry', 'English', 'Maths', 'English', 'Seminar'],
    ['2-3', 'Sports', 'Project', 'Sports', 'Project', 'Maths']
];

let isEditing = false;
let currentUser = null;
let originalTimetable = JSON.parse(JSON.stringify(timetable));

// Clock Functions
function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();
    
    const secondDeg = (seconds * 6) + 90;
    const minuteDeg = (minutes * 6) + (seconds * 0.1) + 90;
    const hourDeg = (hours * 30) + (minutes * 0.5) + 90;
    
    document.getElementById('second-hand').style.transform = `rotate(${secondDeg}deg)`;
    document.getElementById('minute-hand').style.transform = `rotate(${minuteDeg}deg)`;
    document.getElementById('hour-hand').style.transform = `rotate(${hourDeg}deg)`;
    
    // Digital time
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: 'numeric', 
        minute: '2-digit' 
    });
    document.getElementById('digitalTime').textContent = timeString;
}

// Notification System
function showNotification(message) {
    const notification = document.getElementById('notification');
    document.getElementById('notificationText').textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

function closeNotification() {
    document.getElementById('notification').classList.remove('show');
}
// Login System
document.getElementById('studentLogin').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;
    loginUser(email, password, 'student');
});

document.getElementById('teacherLogin').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('teacherEmail').value;
    const password = document.getElementById('teacherPassword').value;
    loginUser(email, password, 'teacher');
});

function loginUser(email, password, role) {
    if (users[email] && users[email].password === password && users[email].role === role) {
        currentUser = users[email];
        updateUIAfterLogin();
        closeLogin();
        showNotification(`Welcome back ${currentUser.name}! 🎉`);
    } else {
        alert('❌ Invalid Email or Password!');
    }
}

function updateUIAfterLogin() {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userName').style.display = 'inline-block';
    document.getElementById('timetableLink').style.display = 'inline-block';
    document.getElementById('timetable').style.display = 'block';
    loadTimetable();
}

function logout() {
    currentUser = null;
    document.getElementById('loginBtn').style.display = 'inline-block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('userName').style.display = 'none';
    document.getElementById('timetableLink').style.display = 'none';
    document.getElementById('timetable').style.display = 'none';
    showNotification('Logged out successfully 👋');
}
// Smooth Scrolling
function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
}
// Timetable Functions
function loadTimetable() {
    const grid = document.getElementById('timetableGrid');
    grid.innerHTML = '';
    
    // Days row
    const daysRow = document.createElement('div');
    daysRow.className = 'timetable-row';
    ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(day => {
        const cell = document.createElement('div');
        cell.className = 'timetable-cell timetable-days';
        cell.textContent = day;
        daysRow.appendChild(cell);
    });
    grid.appendChild(daysRow);
    
    // Time slots
    timetable.forEach((row, rowIndex) => {
        if (rowIndex === 0) return;
        const rowDiv = document.createElement('div');
        rowDiv.className = 'timetable-row';
        
        row.forEach((cellData, colIndex) => {
            const cell = document.createElement('div');
            cell.className = 'timetable-cell';
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;
            
            if (colIndex === 0) {
                cell.classList.add('timetable-times');
                cell.textContent = cellData;
            } else {
                cell.textContent = cellData;
                cell.onclick = () => editCell(cell);
            }
            
            rowDiv.appendChild(cell);
        });
        grid.appendChild(rowDiv);
    });
}

function toggleEditMode() {
    isEditing = !isEditing;
    const cells = document.querySelectorAll('.timetable-cell:not(.timetable-days):not(.timetable-times)');
    cells.forEach(cell => {
        if (isEditing) {
            cell.classList.add('editing');
        } else {
            cell.classList.remove('editing');
            cell.contentEditable = false;
        }
    });
}

function editCell(cell) {
    if (!isEditing || cell.classList.contains('timetable-times')) return;
    
    const input = document.createElement('input');
    input.value = cell.textContent;
    input.onblur = function() {
        cell.textContent = this.value;
        cell.appendChild(input);
        updateTimetableData();
    };
    input.onkeypress = function(e) {
        if (e.key === 'Enter') {
            this.blur();
        }
    };
    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();
}

function updateTimetableData() {
    const cells = document.querySelectorAll('.timetable-cell:not(.timetable-days):not(.timetable-times)');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (col > 0) {
            timetable[row][col] = cell.textContent;
        }
    });
}

function saveTimetable() {
    originalTimetable = JSON.parse(JSON.stringify(timetable));
    showNotification('✅ Timetable saved successfully! All users notified.');
    // Simulate notifying other users
    setTimeout(() => {
        showNotification('📱 SMS/Email sent to all students & teachers');
    }, 1000);
}

function resetTimetable() {
    timetable = JSON.parse(JSON.stringify(originalTimetable));
    loadTimetable();
    showNotification('🔄 Timetable reset to original');
}

// Modal Functions
function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLogin() {
    document.getElementById('loginModal').style.display = 'none';
}

function showGetStarted() {
    document.getElementById('demoModal').style.display = 'block';
}

function closeDemo() {
    document.getElementById('demoModal').style.display = 'none';
}

function showStudentLogin() {
    document.getElementById('studentLogin').style.display = 'block';
    document.getElementById('teacherLogin').style.display = 'none';
}

function showTeacherLogin() {
    document.getElementById('studentLogin').style.display = 'none';
    document.getElementById('teacherLogin').style.display = 'block';
}
// Navigation
function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateClock();
    setInterval(updateClock, 1000);
    
    // Close modals
    window.onclick = function(event) {
        const loginModal = document.getElementById('loginModal');
        const demoModal = document.getElementById('demoModal');
        if (event.target == loginModal) closeLogin();
        if (event.target == demoModal) closeDemo();
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255,255,255,0.98)';
            navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.15)';
        } else {
            navbar.style.background = 'rgba(255,255,255,0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        }
    });
});
// Tab Switching
function showStudentLogin() {
    document.getElementById('studentLogin').style.display = 'block';
    document.getElementById('teacherLogin').style.display = 'none';
    document.querySelector('.tab-btn:nth-child(1)').classList.add('active');
    document.querySelector('.tab-btn:nth-child(2)').classList.remove('active');
}

function showTeacherLogin() {
    document.getElementById('studentLogin').style.display = 'none';
    document.getElementById('teacherLogin').style.display = 'block';
    document.querySelector('.tab-btn:nth-child(1)').classList.remove('active');
    document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
}

// Form Submissions
document.getElementById('studentLogin').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Student Login Successful! Redirecting to Dashboard...');
    closeLogin();
});

document.getElementById('teacherLogin').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Teacher Login Successful! Redirecting to Dashboard...');
    closeLogin();
});

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255,255,255,0.98)';
        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.15)';
    } else {
        navbar.style.background = 'rgba(255,255,255,0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .step, .review-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateClock();
    setInterval(updateClock, 1000);
    
    // Close modals when clicking outside
    window.onclick = function(event) {
        const loginModal = document.getElementById('loginModal');
        const demoModal = document.getElementById('demoModal');
        
        if (event.target == loginModal) {
            closeLogin();
        }
        if (event.target == demoModal) {
            closeDemo();
        }
    }
});

// Navbar Links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});
