// Social Media App Functionality
document.addEventListener('DOMContentLoaded', function() {
// Simulate logged in state for testing
const testUser = {
    email: "test@xin1ster.com",
    username: "testuser",
    avatar: 'https://images.pexels.com/photos/20787/pexels-photo.jpg'
};
localStorage.setItem('xin1ster_user', JSON.stringify(testUser));

// Redirect to dashboard if already logged in
if (localStorage.getItem('xin1ster_user') && window.location.pathname.endsWith('index.html')) {
    window.location.href = 'dashboard.html';
}
    
    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            
            // Simple validation
            if (email && password) {
                // Simulate login
                localStorage.setItem('xin1ster_user', JSON.stringify({
                    email: email,
                    username: email.split('@')[0],
                    avatar: 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600'
                }));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert('Please enter both email and password');
            }
        });
    }
    
    // Signup Form Handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            
            if (username && email && password) {
                // Simulate account creation
                localStorage.setItem('xin1ster_user', JSON.stringify({
                    email: email,
                    username: username,
                    avatar: 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600'
                }));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert('Please fill all fields');
            }
        });
    }
    
    // Like Button Functionality
    document.querySelectorAll('.fa-heart').forEach(heart => {
        heart.addEventListener('click', function() {
            this.classList.toggle('text-pink-500');
            this.classList.toggle('text-gray-400');
            
            // Update like count
            const countElement = this.nextElementSibling;
            if (countElement) {
                let count = parseInt(countElement.textContent);
                count = this.classList.contains('text-pink-500') ? count + 1 : count - 1;
                countElement.textContent = count;
            }
        });
    });
    
    // Load user data in profile
    if (window.location.pathname.endsWith('profile.html')) {
        const user = JSON.parse(localStorage.getItem('xin1ster_user'));
        if (user) {
            document.querySelector('.profile-header img').src = user.avatar;
            document.querySelector('.profile-header h1').textContent = user.username;
        }
    }
});