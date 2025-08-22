// Calendar JavaScript - تقویم جلالی
let currentView = 'month';
let currentDate;
let selectedDate;
let tasks = [];

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking moment availability...');
    console.log('typeof moment:', typeof moment);
    
    if (typeof moment !== 'undefined') {
        console.log('Moment is available, testing jYear function...');
        try {
            const testMoment = moment();
            console.log('typeof testMoment.jYear:', typeof testMoment.jYear);
            
            if (typeof testMoment.jYear === 'function') {
                console.log('✅ Moment Jalaali is working!');
                currentDate = moment();
                selectedDate = moment();
                console.log('Current Jalaali date:', currentDate.jYear(), currentDate.jMonth() + 1, currentDate.jDate());
                
                initializeTheme();
                initializeCalendar();
                loadTasks();
            } else {
                console.error('❌ jYear function not available');
                retryInitialization();
            }
        } catch (error) {
            console.error('❌ Error testing moment:', error);
            retryInitialization();
        }
    } else {
        console.error('❌ Moment not loaded');
        retryInitialization();
    }
});

function retryInitialization() {
    console.log('Retrying initialization in 1 second...');
    setTimeout(() => {
        if (typeof moment !== 'undefined') {
            try {
                const testMoment = moment();
                if (typeof testMoment.jYear === 'function') {
                    console.log('✅ Retry successful - Moment Jalaali is working!');
                    currentDate = moment();
                    selectedDate = moment();
                    console.log('Current Jalaali date:', currentDate.jYear(), currentDate.jMonth() + 1, currentDate.jDate());
                    initializeTheme();
                    initializeCalendar();
                    loadTasks();
                } else {
                    console.error('❌ Retry failed - jYear function still not available');
                }
            } catch (error) {
                console.error('❌ Retry failed with error:', error);
            }
        } else {
            console.error('❌ Retry failed - Moment still not loaded');
        }
    }, 1000);
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeToggle = document.getElementById('themeToggle');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }
    
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Calendar Initialization
function initializeCalendar() {
    updateCalendarTitle();
    renderCalendar();
    updateSelectedDateTasks();
}

// Update calendar title
function updateCalendarTitle() {
    const titleElement = document.getElementById('calendarTitle');
    const selectedDateElement = document.getElementById('selectedDateTitle');
    
    // Persian month names
    const persianMonths = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
    
    if (currentView === 'month') {
        const jYear = currentDate.jYear();
        const jMonth = currentDate.jMonth();
        titleElement.textContent = `${persianMonths[jMonth]} ${jYear}`;
    } else if (currentView === 'week') {
        const weekStart = currentDate.clone();
        while (weekStart.day() !== 6) { // Saturday is day 6
            weekStart.subtract(1, 'day');
        }
        const weekEnd = weekStart.clone().add(6, 'days');
        const startMonth = persianMonths[weekStart.jMonth()];
        const endMonth = persianMonths[weekEnd.jMonth()];
        const startDay = weekStart.jDate();
        const endDay = weekEnd.jDate();
        const year = weekEnd.jYear();
        
        if (weekStart.jMonth() === weekEnd.jMonth()) {
            titleElement.textContent = `${startDay} - ${endDay} ${endMonth} ${year}`;
        } else {
            titleElement.textContent = `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
        }
    } else {
        const jYear = currentDate.jYear();
        const jMonth = currentDate.jMonth();
        const jDay = currentDate.jDate();
        const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
        const dayName = dayNames[currentDate.day()];
        titleElement.textContent = `${dayName}، ${jDay} ${persianMonths[jMonth]} ${jYear}`;
    }
    
    const selYear = selectedDate.jYear();
    const selMonth = selectedDate.jMonth();
    const selDay = selectedDate.jDate();
    selectedDateElement.textContent = `${selDay} ${persianMonths[selMonth]} ${selYear}`;
}

// Render calendar based on current view
function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    calendarGrid.className = `calendar-grid ${currentView}-view`;
    
    console.log('Rendering calendar view:', currentView);
    console.log('Current date:', currentDate.jYear(), currentDate.jMonth() + 1, currentDate.jDate());
    
    if (currentView === 'month') {
        renderMonthView();
    } else if (currentView === 'week') {
        renderWeekView();
    } else {
        renderDayView();
    }
}

// Render month view
function renderMonthView() {
    const calendarGrid = document.getElementById('calendarGrid');
    
    // Add day headers
    const dayNames = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
    dayNames.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Get month start and end
    const monthStart = currentDate.clone().startOf('jMonth');
    const monthEnd = currentDate.clone().endOf('jMonth');
    
    // Get calendar start (start of week containing month start)
    // In Persian calendar, week starts on Saturday (day 6)
    const calendarStart = monthStart.clone();
    while (calendarStart.day() !== 6) { // Saturday is day 6
        calendarStart.subtract(1, 'day');
    }
    const calendarEnd = monthEnd.clone();
    while (calendarEnd.day() !== 5) { // Friday is day 5
        calendarEnd.add(1, 'day');
    }
    
    // Generate calendar days
    const current = calendarStart.clone();
    let dayCount = 0;
    console.log('Calendar range:', calendarStart.format('YYYY-MM-DD'), 'to', calendarEnd.format('YYYY-MM-DD'));
    
    while (current.isSameOrBefore(calendarEnd) && dayCount < 42) { // Limit to 6 weeks max
        const dayElement = createDayElement(current.clone());
        calendarGrid.appendChild(dayElement);
        current.add(1, 'day');
        dayCount++;
    }
    
    console.log('Generated', dayCount, 'days');
}

// Render week view
function renderWeekView() {
    const calendarGrid = document.getElementById('calendarGrid');
    
    // Add day headers
    const weekStart = currentDate.clone();
    while (weekStart.day() !== 6) { // Saturday is day 6
        weekStart.subtract(1, 'day');
    }
    const dayNames = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
    
    dayNames.forEach((day, index) => {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        const date = weekStart.clone().add(index, 'day');
        header.textContent = `${day} ${date.jDate()}`;
        calendarGrid.appendChild(header);
    });
    
    // Generate week days
    for (let i = 0; i < 7; i++) {
        const date = weekStart.clone().add(i, 'day');
        const dayElement = createDayElement(date, true);
        calendarGrid.appendChild(dayElement);
    }
}

// Render day view
function renderDayView() {
    const calendarGrid = document.getElementById('calendarGrid');
    
    // Add day header
    const header = document.createElement('div');
    header.className = 'calendar-header';
    const persianMonths = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
    const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    const dayName = dayNames[currentDate.day()];
    const jDay = currentDate.jDate();
    const jMonth = persianMonths[currentDate.jMonth()];
    const jYear = currentDate.jYear();
    header.textContent = `${dayName}، ${jDay} ${jMonth} ${jYear}`;
    calendarGrid.appendChild(header);
    
    // Add day content
    const dayElement = createDayElement(currentDate.clone(), true);
    dayElement.style.minHeight = '400px';
    calendarGrid.appendChild(dayElement);
}

// Create day element
function createDayElement(date, isLargeView = false) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    const jYear = date.jYear();
    const jMonth = (date.jMonth() + 1).toString().padStart(2, '0');
    const jDay = date.jDate().toString().padStart(2, '0');
    dayElement.setAttribute('data-date', `${jYear}/${jMonth}/${jDay}`);
    
    // Add classes
    if (currentView === 'month' && date.jMonth() !== currentDate.jMonth()) {
        dayElement.classList.add('other-month');
    }
    
    const today = moment();
    if (date.jYear() === today.jYear() && date.jMonth() === today.jMonth() && date.jDate() === today.jDate()) {
        dayElement.classList.add('today');
    }
    
    if (date.jYear() === selectedDate.jYear() && date.jMonth() === selectedDate.jMonth() && date.jDate() === selectedDate.jDate()) {
        dayElement.classList.add('selected');
    }
    
    // Day number
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.jDate();
    dayElement.appendChild(dayNumber);
    
    // Tasks for this day
    const dayTasks = tasks.filter(task => {
        const taskDate = moment(task.date);
        return taskDate.jYear() === date.jYear() && 
               taskDate.jMonth() === date.jMonth() && 
               taskDate.jDate() === date.jDate();
    });
    
    if (dayTasks.length > 0) {
        const tasksContainer = document.createElement('div');
        tasksContainer.className = 'day-tasks';
        
        if (isLargeView) {
            // Show task titles in large views
            dayTasks.slice(0, 3).forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `task-preview priority-${task.priority.toLowerCase()}`;
                taskElement.textContent = task.title;
                tasksContainer.appendChild(taskElement);
            });
            
            if (dayTasks.length > 3) {
                const moreElement = document.createElement('div');
                moreElement.className = 'more-tasks';
                moreElement.textContent = `+${dayTasks.length - 3} بیشتر`;
                tasksContainer.appendChild(moreElement);
            }
        } else {
            // Show task indicators in month view
            dayTasks.slice(0, 3).forEach(task => {
                const indicator = document.createElement('span');
                indicator.className = `task-indicator priority-${task.priority.toLowerCase()}`;
                indicator.title = task.title;
                tasksContainer.appendChild(indicator);
            });
            
            if (dayTasks.length > 3) {
                const more = document.createElement('span');
                more.textContent = `+${dayTasks.length - 3}`;
                more.style.fontSize = '0.7rem';
                more.style.marginRight = '0.25rem';
                tasksContainer.appendChild(more);
            }
        }
        
        dayElement.appendChild(tasksContainer);
    }
    
    // Click handler
    dayElement.addEventListener('click', function() {
        selectDate(date);
    });
    
    return dayElement;
}

// Select date
function selectDate(date) {
    selectedDate = date.clone();
    
    // Update selected day styling
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });
    
    const jYear = date.jYear();
    const jMonth = (date.jMonth() + 1).toString().padStart(2, '0');
    const jDay = date.jDate().toString().padStart(2, '0');
    const selectedDayElement = document.querySelector(`[data-date="${jYear}/${jMonth}/${jDay}"]`);
    if (selectedDayElement) {
        selectedDayElement.classList.add('selected');
    }
    
    // Update task panel
    updateSelectedDateTasks();
    
    // Update task form date
    const taskDateInput = document.getElementById('taskDate');
    if (taskDateInput) {
        const jYear = date.jYear();
        const jMonth = (date.jMonth() + 1).toString().padStart(2, '0');
        const jDay = date.jDate().toString().padStart(2, '0');
        taskDateInput.value = `${jYear}/${jMonth}/${jDay}`;
    }
}

// Navigation functions
function previousPeriod() {
    if (currentView === 'month') {
        currentDate.subtract(1, 'jMonth');
    } else if (currentView === 'week') {
        currentDate.subtract(1, 'week');
    } else {
        currentDate.subtract(1, 'day');
    }
    
    updateCalendarTitle();
    renderCalendar();
}

function nextPeriod() {
    if (currentView === 'month') {
        currentDate.add(1, 'jMonth');
    } else if (currentView === 'week') {
        currentDate.add(1, 'week');
    } else {
        currentDate.add(1, 'day');
    }
    
    updateCalendarTitle();
    renderCalendar();
}

function goToToday() {
    currentDate = moment();
    selectedDate = moment();
    updateCalendarTitle();
    renderCalendar();
    updateSelectedDateTasks();
}

// Change view
function changeView(view) {
    currentView = view;
    
    // Update view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    updateCalendarTitle();
    renderCalendar();
}

// Load tasks from API
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        const result = await response.json();
        
        if (result.success) {
            tasks = result.tasks;
            renderCalendar();
            updateSelectedDateTasks();
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Update selected date tasks
function updateSelectedDateTasks() {
    const taskList = document.getElementById('taskList');
    const selectedDateTitle = document.getElementById('selectedDateTitle');
    
    const persianMonths = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
    const selYear = selectedDate.jYear();
    const selMonth = selectedDate.jMonth();
    const selDay = selectedDate.jDate();
    selectedDateTitle.textContent = `${selDay} ${persianMonths[selMonth]} ${selYear}`;
    
    const dayTasks = tasks.filter(task => {
        const taskDate = moment(task.date);
        return taskDate.jYear() === selectedDate.jYear() && 
               taskDate.jMonth() === selectedDate.jMonth() && 
               taskDate.jDate() === selectedDate.jDate();
    });
    
    if (dayTasks.length === 0) {
        taskList.innerHTML = `
            <div class="no-tasks">
                <i class="fas fa-tasks"></i>
                <p>هیچ تسکی برای این روز وجود ندارد</p>
            </div>
        `;
        return;
    }
    
    // Sort tasks by priority and time
    dayTasks.sort((a, b) => {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        if (a.startTime && b.startTime) {
            return a.startTime.localeCompare(b.startTime);
        }
        return 0;
    });
    
    taskList.innerHTML = dayTasks.map(task => createTaskElement(task)).join('');
}

// Create task element
function createTaskElement(task) {
    const timeDisplay = task.startTime 
        ? task.endTime 
            ? `${task.startTime} - ${task.endTime}`
            : task.startTime
        : '';
    
    const priorityText = {
        LOW: 'کم',
        MEDIUM: 'متوسط',
        HIGH: 'زیاد'
    };
    
    return `
        <div class="task-item priority-${task.priority.toLowerCase()} ${task.isCompleted ? 'completed' : ''}" data-task-id="${task.id}">
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <div class="task-actions">
                    <button class="task-action-btn" onclick="toggleTaskComplete(${task.id})" title="${task.isCompleted ? 'علامت‌گذاری به عنوان انجام نشده' : 'علامت‌گذاری به عنوان انجام شده'}">
                        <i class="fas ${task.isCompleted ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="task-action-btn" onclick="editTask(${task.id})" title="ویرایش">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-action-btn" onclick="deleteTask(${task.id})" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="task-meta">
                ${timeDisplay ? `<span><i class="fas fa-clock"></i> ${timeDisplay}</span>` : ''}
                <span><i class="fas fa-flag"></i> ${priorityText[task.priority]}</span>
            </div>
            
            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
        </div>
    `;
}

// Modal functions
function showAddTaskModal() {
    const modal = document.getElementById('addTaskModal');
    const taskDateInput = document.getElementById('taskDate');
    
    // Set default date to selected date
    const jYear = selectedDate.jYear();
    const jMonth = (selectedDate.jMonth() + 1).toString().padStart(2, '0');
    const jDay = selectedDate.jDate().toString().padStart(2, '0');
    taskDateInput.value = `${jYear}/${jMonth}/${jDay}`;
    
    modal.classList.add('active');
    document.getElementById('taskTitle').focus();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Add task form handler
document.getElementById('addTaskForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        priority: formData.get('priority')
    };
    
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            await Swal.fire({
                icon: 'success',
                title: 'موفق!',
                text: result.message,
                timer: 2000,
                timerProgressBar: true
            });
            
            closeModal('addTaskModal');
            this.reset();
            await loadTasks();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'خطا!',
                text: result.message
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'خطا!',
            text: 'خطای شبکه در ایجاد تسک'
        });
    }
});

// Edit task
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Populate edit form
    document.getElementById('editTaskId').value = task.id;
    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskDescription').value = task.description || '';
    document.getElementById('editTaskDate').value = task.persianDate;
    document.getElementById('editTaskStartTime').value = task.startTime || '';
    document.getElementById('editTaskEndTime').value = task.endTime || '';
    document.getElementById('editTaskPriority').value = task.priority;
    
    document.getElementById('editTaskModal').classList.add('active');
}

// Edit task form handler
document.getElementById('editTaskForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const taskId = formData.get('id');
    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        priority: formData.get('priority')
    };
    
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            await Swal.fire({
                icon: 'success',
                title: 'موفق!',
                text: result.message,
                timer: 2000,
                timerProgressBar: true
            });
            
            closeModal('editTaskModal');
            await loadTasks();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'خطا!',
                text: result.message
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'خطا!',
            text: 'خطای شبکه در ویرایش تسک'
        });
    }
});

// Toggle task completion
async function toggleTaskComplete(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}/toggle`, {
            method: 'PATCH'
        });
        
        const result = await response.json();
        
        if (result.success) {
            await loadTasks();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'خطا!',
                text: result.message
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'خطا!',
            text: 'خطای شبکه در تغییر وضعیت تسک'
        });
    }
}

// Delete task
async function deleteTask(taskId) {
    const result = await Swal.fire({
        title: 'حذف تسک',
        text: 'آیا مطمئن هستید که می‌خواهید این تسک را حذف کنید؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله، حذف کن',
        cancelButtonText: 'انصراف',
        confirmButtonColor: '#dc2626'
    });
    
    if (result.isConfirmed) {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE'
            });
            
            const deleteResult = await response.json();
            
            if (deleteResult.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'حذف شد!',
                    text: deleteResult.message,
                    timer: 2000,
                    timerProgressBar: true
                });
                
                await loadTasks();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'خطا!',
                    text: deleteResult.message
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'خطا!',
                text: 'خطای شبکه در حذف تسک'
            });
        }
    }
}

// User menu functions
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('userDropdown');
    const userMenu = document.querySelector('.user-menu');
    
    if (!userMenu.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

function showProfile() {
    // TODO: Implement profile modal
    Swal.fire({
        title: 'پروفایل کاربری',
        text: 'این قابلیت به زودی اضافه خواهد شد',
        icon: 'info'
    });
}

async function logout() {
    const result = await Swal.fire({
        title: 'خروج از حساب',
        text: 'آیا مطمئن هستید که می‌خواهید خارج شوید؟',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'بله، خروج',
        cancelButtonText: 'انصراف'
    });
    
    if (result.isConfirmed) {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST'
            });
            
            if (response.ok) {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/login';
        }
    }
}

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
    }
});

// Close modals when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});
