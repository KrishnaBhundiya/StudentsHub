// Shared Data Storage System for Student Career Hub
// This file manages data synchronization across all pages
// 
// IMPORTANT: All data is stored in localStorage, which means:
// - Data persists across page refreshes
// - Data persists when user logs out and logs back in
// - Data is stored locally in the browser (no external database needed)
// - All changes are automatically saved and synchronized across all dashboards

class SharedDataManager {
    constructor() {
        this.storageKey = 'studentCareerHubData';
        this.init();
    }

    init() {
        // Initialize data structure if it doesn't exist
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                appointments: [],
                events: [],
                eventRegistrations: [],
                jobApplications: [],
                scholarshipApplications: [],
                jobs: [],
                users: [],
                notifications: [],
                councillors: [
                    { id: 1, name: "Dr. Sarah Smith", role: "Career Coach", rating: 4.8, reviews: 120, price: 500, free: false, fav: false, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
                    { id: 2, name: "Prof. John Doe", role: "Academic Advisor", rating: 4.9, reviews: 85, price: 0, free: true, fav: true, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" },
                    { id: 3, name: "Emily White", role: "Resume Expert", rating: 4.7, reviews: 200, price: 300, free: false, fav: false, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" },
                    { id: 4, name: "Michael Brown", role: "Interview Prep", rating: 4.6, reviews: 95, price: 450, free: false, fav: false, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },
                    { id: 5, name: "Lisa Ray", role: "Study Abroad", rating: 4.9, reviews: 150, price: 0, free: true, fav: false, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" },
                ],
                internships: [
                    { id: 1, role: "Frontend Intern", company: "StartUpX", loc: "Remote", stipend: "₹25k/mo", dur: "3m", tags: ["React"] },
                    { id: 2, role: "Data Intern", company: "DataLabs", loc: "Bengaluru", stipend: "₹30k/mo", dur: "6m", tags: ["Python"] },
                    { id: 3, role: "UX Designer", company: "DesignCo", loc: "Mumbai", stipend: "₹15k/mo", dur: "3m", tags: ["Figma"] },
                    { id: 4, role: "Backend Intern", company: "CloudWorks", loc: "Hyderabad", stipend: "₹20k/mo", dur: "4m", tags: ["Node"] },
                ],
                scholarships: [
                    { id: 1, name: "Tech Excellence", provider: "ABC Foundation", amt: "₹75,000", due: "28 Feb" },
                    { id: 2, name: "Women in STEM", provider: "STEM Council", amt: "₹50,000", due: "10 Mar" },
                ],
                campusEvents: [
                    { id: 1, title: "Full-stack Bootcamp", date: "18 Dec", type: "Workshop", loc: "Lab 3", hosterId: 1, registrations: [] },
                    { id: 2, title: "AI Hackathon", date: "22 Dec", type: "Hackathon", loc: "Innovation Center", hosterId: 1, registrations: [] },
                ]
            };
            this.save(initialData);
        }
    }

    get() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    save(data) {
        // Save to localStorage - this persists data across page refreshes
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        // Dispatch custom event for data updates
        window.dispatchEvent(new CustomEvent('dataUpdated'));
    }

    // Verify database is working
    verifyDatabase() {
        const data = this.get();
        if (!data) {
            console.error('Database not initialized!');
            return false;
        }
        return true;
    }

    // Get database size (for debugging)
    getDatabaseSize() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            return new Blob([data]).size; // Size in bytes
        }
        return 0;
    }

    // Appointment methods
    addAppointment(appointment) {
        const data = this.get();
        appointment.id = Date.now();
        appointment.createdAt = new Date().toISOString();
        appointment.status = 'pending';
        data.appointments.push(appointment);
        this.save(data);
        return appointment;
    }

    getAppointments(councillorId = null) {
        const data = this.get();
        if (councillorId) {
            return data.appointments.filter(apt => apt.councillorId === councillorId);
        }
        return data.appointments || [];
    }

    updateAppointmentStatus(appointmentId, status) {
        const data = this.get();
        const appointment = data.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            appointment.status = status;
            this.save(data);
        }
    }

    // Event registration methods
    registerForEvent(eventId, studentInfo) {
        const data = this.get();
        const event = data.campusEvents.find(e => e.id === eventId);
        if (!event) return null;
        
        // Check if already registered - prevent duplicates
        const existingReg = data.eventRegistrations.find(
            reg => reg.eventId === eventId && reg.studentEmail === studentInfo.email
        );
        if (existingReg) {
            return { duplicate: true, registration: existingReg };
        }
        
        const registration = {
            id: Date.now(),
            eventId: eventId,
            studentName: studentInfo.name || 'Student',
            studentEmail: studentInfo.email || 'student@example.com',
            registeredAt: new Date().toISOString()
        };
        event.registrations.push(registration);
        data.eventRegistrations.push(registration);
        this.save(data);
        return registration;
    }

    getEventRegistrations(eventId = null) {
        const data = this.get();
        if (eventId) {
            return data.eventRegistrations.filter(reg => reg.eventId === eventId);
        }
        return data.eventRegistrations || [];
    }

    // Job application methods
    applyForJob(jobId, studentInfo) {
        const data = this.get();
        
        // Check if already applied - prevent duplicates (check by jobId, jobTitle+jobCompany, or email match)
        const existingApp = data.jobApplications.find(app => {
            if (app.studentEmail !== studentInfo.email) return false;
            
            // Match by jobId
            if (app.jobId === jobId) return true;
            
            // Match by jobTitle + jobCompany if available
            if (studentInfo.jobTitle && studentInfo.jobCompany && 
                app.jobTitle === studentInfo.jobTitle && 
                app.jobCompany === studentInfo.jobCompany) return true;
            
            // Match by jobId string comparison
            const appKey = typeof app.jobId === 'string' ? app.jobId : `${app.jobId}`;
            const newKey = typeof jobId === 'string' ? jobId : `${jobId}`;
            if (appKey === newKey) return true;
            
            return false;
        });
        
        if (existingApp) {
            return { duplicate: true, application: existingApp };
        }
        
        const application = {
            id: Date.now(),
            jobId: jobId,
            jobTitle: studentInfo.jobTitle || null,
            jobCompany: studentInfo.jobCompany || null,
            studentName: studentInfo.name || 'Student',
            studentEmail: studentInfo.email || 'student@example.com',
            appliedAt: new Date().toISOString(),
            status: 'pending'
        };
        data.jobApplications.push(application);
        this.save(data);
        return application;
    }

    getJobApplications(jobId = null) {
        const data = this.get();
        if (jobId) {
            return data.jobApplications.filter(app => app.jobId === jobId);
        }
        return data.jobApplications || [];
    }

    // User management
    createUser(userData) {
        const data = this.get();
        
        // Check if user already exists
        if (data.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            throw new Error('User with this email already exists');
        }
        
        const user = {
            id: Date.now(),
            ...userData,
            email: userData.email.toLowerCase(), // Store email in lowercase for consistency
            createdAt: new Date().toISOString()
        };
        data.users.push(user);
        this.save(data);
        return user;
    }

    getUserByEmail(email) {
        const data = this.get();
        if (!data || !data.users) return null;
        // Case-insensitive email search
        return data.users.find(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Verify user credentials
    verifyCredentials(email, password) {
        const user = this.getUserByEmail(email);
        if (!user) {
            return { valid: false, error: 'User not found' };
        }
        if (user.password !== password) {
            return { valid: false, error: 'Incorrect password' };
        }
        return { valid: true, user: user };
    }

    // Event management (for hosters)
    createEvent(eventData) {
        const data = this.get();
        const event = {
            id: Date.now(),
            ...eventData,
            registrations: [],
            createdAt: new Date().toISOString()
        };
        data.campusEvents.push(event);
        this.save(data);
        return event;
    }

    getEventsByHoster(hosterId) {
        const data = this.get();
        return data.campusEvents.filter(e => e.hosterId === hosterId);
    }

    // Job management (for posters)
    createJob(jobData) {
        const data = this.get();
        const job = {
            id: Date.now(),
            ...jobData,
            createdAt: new Date().toISOString()
        };
        data.jobs.push(job);
        // Also add to internships if it's an internship
        if (jobData.type === 'internship') {
            data.internships.push({
                id: job.id,
                role: jobData.role,
                company: jobData.company,
                loc: jobData.loc,
                stipend: jobData.stipend,
                dur: jobData.dur || '3m',
                tags: jobData.tags || []
            });
        }
        this.save(data);
        return job;
    }

    getJobsByPoster(posterId) {
        const data = this.get();
        return data.jobs.filter(job => job.posterId === posterId);
    }

    // Student-specific methods
    getStudentAppointments(studentEmail) {
        const data = this.get();
        return data.appointments.filter(apt => apt.studentEmail === studentEmail);
    }

    getStudentEventRegistrations(studentEmail) {
        const data = this.get();
        return data.eventRegistrations.filter(reg => reg.studentEmail === studentEmail);
    }

    getStudentJobApplications(studentEmail) {
        const data = this.get();
        return data.jobApplications.filter(app => app.studentEmail === studentEmail);
    }

    getStudentScholarshipApplications(studentEmail) {
        const data = this.get();
        return (data.scholarshipApplications || []).filter(app => app.studentEmail === studentEmail);
    }

    // Scholarship application methods
    applyForScholarship(scholarshipId, studentInfo) {
        const data = this.get();
        if (!data.scholarshipApplications) {
            data.scholarshipApplications = [];
        }
        
        // Check if already applied - prevent duplicates
        const existingApp = data.scholarshipApplications.find(
            app => app.scholarshipId === scholarshipId && app.studentEmail === studentInfo.email
        );
        if (existingApp) {
            return { duplicate: true, application: existingApp };
        }
        
        const application = {
            id: Date.now(),
            scholarshipId: scholarshipId,
            studentName: studentInfo.name || 'Student',
            studentEmail: studentInfo.email || 'student@example.com',
            appliedAt: new Date().toISOString(),
            status: 'pending'
        };
        data.scholarshipApplications.push(application);
        this.save(data);
        this.addNotification({
            type: 'success',
            title: 'Scholarship Application Submitted',
            message: `Your application has been submitted successfully.`,
            userId: studentInfo.email
        });
        return application;
    }

    // Notification methods
    addNotification(notification) {
        const data = this.get();
        if (!data.notifications) {
            data.notifications = [];
        }
        const notif = {
            id: Date.now(),
            ...notification,
            read: false,
            createdAt: new Date().toISOString()
        };
        data.notifications.push(notif);
        this.save(data);
        return notif;
    }

    getNotifications(userEmail = null) {
        const data = this.get();
        if (!data.notifications) {
            return [];
        }
        if (userEmail) {
            return data.notifications.filter(n => !n.userId || n.userId === userEmail).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return data.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    markNotificationRead(notificationId) {
        const data = this.get();
        const notif = data.notifications.find(n => n.id === notificationId);
        if (notif) {
            notif.read = true;
            this.save(data);
        }
    }

    markAllNotificationsRead(userEmail = null) {
        const data = this.get();
        if (userEmail) {
            data.notifications.forEach(n => {
                if (!n.userId || n.userId === userEmail) {
                    n.read = true;
                }
            });
        } else {
            data.notifications.forEach(n => n.read = true);
        }
        this.save(data);
    }

    // Enhanced appointment with notifications
    addAppointment(appointment) {
        const data = this.get();
        appointment.id = Date.now();
        appointment.createdAt = new Date().toISOString();
        appointment.status = 'pending';
        data.appointments.push(appointment);
        this.save(data);
        
        // Add notification for councillor
        this.addNotification({
            type: 'info',
            title: 'New Appointment Request',
            message: `${appointment.studentName} has requested an appointment on ${appointment.date} at ${appointment.time}`,
            userId: `councillor_${appointment.councillorId}`
        });
        
        // Add notification for student
        this.addNotification({
            type: 'success',
            title: 'Appointment Booked',
            message: `Your appointment with ${appointment.councillorName} is scheduled for ${appointment.date} at ${appointment.time}`,
            userId: appointment.studentEmail
        });
        
        return appointment;
    }

    // Enhanced event registration with notifications
    registerForEvent(eventId, studentInfo) {
        const data = this.get();
        const event = data.campusEvents.find(e => e.id === eventId);
        if (event) {
            const registration = {
                id: Date.now(),
                eventId: eventId,
                studentName: studentInfo.name || 'Student',
                studentEmail: studentInfo.email || 'student@example.com',
                registeredAt: new Date().toISOString()
            };
            event.registrations.push(registration);
            data.eventRegistrations.push(registration);
            this.save(data);
            
            // Add notification for hoster
            this.addNotification({
                type: 'info',
                title: 'New Event Registration',
                message: `${studentInfo.name} has registered for "${event.title}"`,
                userId: `hoster_${event.hosterId}`
            });
            
            // Add notification for student
            this.addNotification({
                type: 'success',
                title: 'Event Registration Successful',
                message: `You have successfully registered for "${event.title}"`,
                userId: studentInfo.email
            });
            
            return registration;
        }
        return null;
    }

    // Enhanced job application with notifications
    applyForJob(jobId, studentInfo) {
        const data = this.get();
        const job = data.internships.find(j => j.id === jobId) || data.jobs.find(j => j.id === jobId);
        const application = {
            id: Date.now(),
            jobId: jobId,
            studentName: studentInfo.name || 'Student',
            studentEmail: studentInfo.email || 'student@example.com',
            appliedAt: new Date().toISOString(),
            status: 'pending'
        };
        data.jobApplications.push(application);
        this.save(data);
        
        // Add notification for poster
        if (job) {
            const posterId = job.posterId || 1;
            this.addNotification({
                type: 'info',
                title: 'New Job Application',
                message: `${studentInfo.name} has applied for "${job.role || job.title}"`,
                userId: `poster_${posterId}`
            });
        }
        
        // Add notification for student
        this.addNotification({
            type: 'success',
            title: 'Application Submitted',
            message: `Your application for "${job ? (job.role || job.title) : 'the position'}" has been submitted`,
            userId: studentInfo.email
        });
        
        return application;
    }

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }

    // Update user profile
    updateUserProfile(userId, profileData) {
        const data = this.get();
        const user = data.users.find(u => u.id === userId);
        if (user) {
            Object.assign(user, profileData);
            this.save(data);
            return user;
        }
        return null;
    }

    // Search functionality
    search(query, type = 'all') {
        const data = this.get();
        const results = {
            internships: [],
            scholarships: [],
            events: [],
            councillors: []
        };
        
        const lowerQuery = query.toLowerCase();
        
        if (type === 'all' || type === 'internships') {
            results.internships = data.internships.filter(job => 
                job.role.toLowerCase().includes(lowerQuery) ||
                job.company.toLowerCase().includes(lowerQuery) ||
                job.loc.toLowerCase().includes(lowerQuery) ||
                (job.tags && job.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
            );
        }
        
        if (type === 'all' || type === 'scholarships') {
            results.scholarships = (data.scholarships || []).filter(sch => 
                sch.name.toLowerCase().includes(lowerQuery) ||
                sch.provider.toLowerCase().includes(lowerQuery)
            );
        }
        
        if (type === 'all' || type === 'events') {
            results.events = data.campusEvents.filter(event => 
                event.title.toLowerCase().includes(lowerQuery) ||
                event.loc.toLowerCase().includes(lowerQuery) ||
                event.type.toLowerCase().includes(lowerQuery)
            );
        }
        
        if (type === 'all' || type === 'councillors') {
            results.councillors = data.councillors.filter(coun => 
                coun.name.toLowerCase().includes(lowerQuery) ||
                coun.role.toLowerCase().includes(lowerQuery)
            );
        }
        
        return results;
    }
}

// Create global instance
window.sharedData = new SharedDataManager();

