// Global Variables
let currentUser = null;
let userData = null;
let selectedProfilePicture = null;
let countdownInterval = null;
let countdownSeconds = 15;
let isVideoAd = false;
let referralCodeFromUrl = null;

// DOM Elements
const elements = {
    authContainer: document.getElementById('authContainer'),
    loginPage: document.getElementById('loginPage'),
    signupPage: document.getElementById('signupPage'),
    loginForm: document.getElementById('loginForm'),
    signupForm: document.getElementById('signupForm'),
    loginEmailPhone: document.getElementById('loginEmailPhone'),
    loginPassword: document.getElementById('loginPassword'),
    signupEmail: document.getElementById('signupEmail'),
    signupPassword: document.getElementById('signupPassword'),
    confirmPassword: document.getElementById('confirmPassword'),
    fullName: document.getElementById('fullName'),
    phoneNumber: document.getElementById('phoneNumber'),
    referralCodeInput: document.getElementById('referralCodeInput'),
    profilePicture: document.getElementById('profilePicture'),
    profilePreview: document.getElementById('profilePreview'),
    loginBtn: document.getElementById('loginBtn'),
    signupBtn: document.getElementById('signupBtn'),
    loginSpinner: document.getElementById('loginSpinner'),
    signupSpinner: document.getElementById('signupSpinner'),
    showSignupBtn: document.getElementById('showSignupBtn'),
    backToLogin: document.getElementById('backToLogin'),
    toggleLoginPassword: document.getElementById('toggleLoginPassword'),
    toggleSignupPassword: document.getElementById('toggleSignupPassword'),
    toggleConfirmPassword: document.getElementById('toggleConfirmPassword'),
    
    mainContainer: document.getElementById('mainContainer'),
    bottomNav: document.getElementById('bottomNav'),
    logoutBtn: document.getElementById('logoutBtn'),
    logoutMainBtn: document.getElementById('logoutMainBtn'),
    
    currentBalance: document.getElementById('currentBalance'),
    dailyStreak: document.getElementById('dailyStreak'),
    streakProgress: document.getElementById('streakProgress'),
    referralCount: document.getElementById('referralCount'),
    referralProgress: document.getElementById('referralProgress'),
    referralLink: document.getElementById('referralLink'),
    dailyAdsCounter: document.getElementById('dailyAdsCounter'),
    
    backFromTasks: document.getElementById('backFromTasks'),
    tasksProgress: document.getElementById('tasksProgress'),
    totalEarned: document.getElementById('totalEarned'),
    allTasksList: document.getElementById('allTasksList'),
    
    backFromProfile: document.getElementById('backFromProfile'),
    userProfilePic: document.getElementById('userProfilePic'),
    userFullName: document.getElementById('userFullName'),
    userEmail: document.getElementById('userEmail'),
    userPhone: document.getElementById('userPhone'),
    memberSince: document.getElementById('memberSince'),
    userLevel: document.getElementById('userLevel'),
    userStatus: document.getElementById('userStatus'),
    totalEarnings: document.getElementById('totalEarnings'),
    monthlyTasks: document.getElementById('monthlyTasks'),
    activeReferrals: document.getElementById('activeReferrals'),
    currentStreak: document.getElementById('currentStreak'),
    editProfileBtn: document.getElementById('editProfileBtn'),
    changePasswordBtn: document.getElementById('changePasswordBtn'),
    
    navBtns: document.querySelectorAll('.nav-btn'),
    
    notification: document.getElementById('notification'),
    notificationText: document.getElementById('notificationText'),
    closeNotification: document.getElementById('closeNotification'),
    
    themeToggle: document.getElementById('themeToggle'),
    pageTitle: document.getElementById('pageTitle'),
    
    adsLoadingOverlay: document.getElementById('adsLoadingOverlay'),
    adsProgressFill: document.getElementById('adsProgressFill'),
    adsStep1: document.getElementById('adsStep1'),
    adsStep2: document.getElementById('adsStep2'),
    adsStep3: document.getElementById('adsStep3'),
    
    videoAdLoadingOverlay: document.getElementById('videoAdLoadingOverlay'),
    videoProgressFill: document.getElementById('videoProgressFill'),
    
    countdownOverlay: document.getElementById('countdownOverlay'),
    countdownNumber: document.getElementById('countdownNumber'),
    remainingSeconds: document.getElementById('remainingSeconds'),
    
    celebrationOverlay: document.getElementById('celebrationOverlay'),
    closeCelebrationBtn: document.getElementById('closeCelebrationBtn'),
    
    // Profile Edit Modal Elements
    profileEditModal: document.getElementById('profileEditModal'),
    editProfilePreview: document.getElementById('editProfilePreview'),
    editProfilePicture: document.getElementById('editProfilePicture'),
    editFullName: document.getElementById('editFullName'),
    editEmail: document.getElementById('editEmail'),
    editPhoneNumber: document.getElementById('editPhoneNumber'),
    currentPassword: document.getElementById('currentPassword'),
    newPassword: document.getElementById('newPassword'),
    confirmNewPassword: document.getElementById('confirmNewPassword'),
    toggleCurrentPassword: document.getElementById('toggleCurrentPassword'),
    toggleNewPassword: document.getElementById('toggleNewPassword'),
    toggleConfirmNewPassword: document.getElementById('toggleConfirmNewPassword'),
    profileEditForm: document.getElementById('profileEditForm'),
    saveProfileBtn: document.getElementById('saveProfileBtn'),
    saveProfileSpinner: document.getElementById('saveProfileSpinner'),
    cancelProfileEdit: document.getElementById('cancelProfileEdit'),
    closeProfileEditModal: document.getElementById('closeProfileEditModal')
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    checkForReferralInURL();
    
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            loadUserData();
        } else {
            showAuthPages();
        }
    });
});

function initializeApp() {
    const savedTheme = localStorage.getItem('dailyEarningTheme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark');
        updateThemeIcon(true);
    }
    
    // Initialize deposit/withdraw events
    setupDepositWithdrawEvents();
}

function checkForReferralInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    
    if (referralCode) {
        referralCodeFromUrl = referralCode;
        // Store referral code in localStorage for signup
        localStorage.setItem('pendingReferralCode', referralCode);
        
        // If on login page, show notification
        if (window.location.pathname.includes('login') || window.location.pathname === '/') {
            setTimeout(() => {
                showNotification('You have been referred by a friend! Sign up to get started.', 'info');
            }, 1000);
        }
    }
}

function setupEventListeners() {
    elements.loginForm.addEventListener('submit', handleLogin);
    elements.signupForm.addEventListener('submit', handleSignup);
    elements.showSignupBtn.addEventListener('click', () => navigateToAuthPage('signup'));
    elements.backToLogin.addEventListener('click', () => navigateToAuthPage('login'));
    elements.toggleLoginPassword.addEventListener('click', () => togglePasswordVisibility('loginPassword', elements.toggleLoginPassword));
    elements.toggleSignupPassword.addEventListener('click', () => togglePasswordVisibility('signupPassword', elements.toggleSignupPassword));
    elements.toggleConfirmPassword.addEventListener('click', () => togglePasswordVisibility('confirmPassword', elements.toggleConfirmPassword));
    elements.profilePicture.addEventListener('change', handleProfilePictureChange);
    
    elements.logoutBtn.addEventListener('click', handleLogout);
    elements.logoutMainBtn.addEventListener('click', handleLogout);
    
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    elements.closeNotification.addEventListener('click', () => {
        elements.notification.classList.add('hidden');
    });
    
    elements.navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.dataset.page;
            if (page === 'earn') {
                navigateToPage('home');
            } else {
                navigateToPage(page);
            }
            updateNavActiveState(page === 'earn' ? 'home' : page);
        });
    });
    
    document.querySelectorAll('.quick-action').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            handleQuickAction(action);
        });
    });
    
    document.getElementById('copyLinkBtn').addEventListener('click', copyReferralLink);
    document.getElementById('shareBtn').addEventListener('click', shareReferralLink);
    document.getElementById('startEarningBtn').addEventListener('click', () => navigateToPage('tasks'));
    document.getElementById('backFromTasks').addEventListener('click', () => navigateToPage('home'));
    document.getElementById('backFromProfile').addEventListener('click', () => navigateToPage('home'));
    
    elements.closeCelebrationBtn.addEventListener('click', closeCelebration);
    
    // Profile Edit Modal Event Listeners
    elements.editProfileBtn.addEventListener('click', openProfileEditModal);
    elements.closeProfileEditModal.addEventListener('click', closeProfileEditModal);
    elements.cancelProfileEdit.addEventListener('click', closeProfileEditModal);
    elements.profileEditForm.addEventListener('submit', handleProfileEdit);
    elements.toggleCurrentPassword.addEventListener('click', () => togglePasswordVisibility('currentPassword', elements.toggleCurrentPassword));
    elements.toggleNewPassword.addEventListener('click', () => togglePasswordVisibility('newPassword', elements.toggleNewPassword));
    elements.toggleConfirmNewPassword.addEventListener('click', () => togglePasswordVisibility('confirmNewPassword', elements.toggleConfirmNewPassword));
    elements.editProfilePicture.addEventListener('change', handleEditProfilePictureChange);
    
    // রেফারেল স্ট্যাটস বাটন ইভেন্ট
    const referralStatsBtn = document.getElementById('referralStatsBtn');
    if (referralStatsBtn) {
        referralStatsBtn.addEventListener('click', showReferralStats);
    }
}

function navigateToAuthPage(page) {
    document.querySelectorAll('#authContainer .page').forEach(p => {
        p.classList.remove('active');
    });
    
    const pageElement = document.getElementById(`${page}Page`);
    if (pageElement) {
        pageElement.classList.add('active');
        
        // If going to signup page and there's a pending referral code, auto-fill it
        if (page === 'signup') {
            const pendingReferralCode = localStorage.getItem('pendingReferralCode');
            if (pendingReferralCode && elements.referralCodeInput) {
                elements.referralCodeInput.value = pendingReferralCode;
            }
        }
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const emailPhone = elements.loginEmailPhone.value.trim();
    const password = elements.loginPassword.value;
    
    if (!emailPhone || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    try {
        elements.loginSpinner.classList.remove('hidden');
        elements.loginBtn.disabled = true;
        
        let authResult;
        
        if (emailPhone.includes('@')) {
            authResult = await auth.signInWithEmailAndPassword(emailPhone, password);
        } else {
            showNotification('Phone login is not yet implemented. Please use email.', 'error');
            elements.loginSpinner.classList.add('hidden');
            elements.loginBtn.disabled = false;
            return;
        }
        
        currentUser = authResult.user;
        await loadUserData();
        
        showNotification('Login successful! Welcome back.', 'success');
        
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. Please try again.';
        
        switch(error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email/phone.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled.';
                break;
        }
        
        showNotification(errorMessage, 'error');
    } finally {
        elements.loginSpinner.classList.add('hidden');
        elements.loginBtn.disabled = false;
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const fullName = elements.fullName.value.trim();
    const email = elements.signupEmail.value.trim();
    const phone = elements.phoneNumber.value.trim();
    const password = elements.signupPassword.value;
    const confirmPassword = elements.confirmPassword.value;
    const referralCode = elements.referralCodeInput.value.trim();
    
    if (!fullName || !email || !password || !confirmPassword) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    try {
        elements.signupSpinner.classList.remove('hidden');
        elements.signupBtn.disabled = true;
        
        const authResult = await auth.createUserWithEmailAndPassword(email, password);
        currentUser = authResult.user;
        
        let profilePicUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        
        if (selectedProfilePicture) {
            try {
                profilePicUrl = await uploadProfilePicture(selectedProfilePicture, currentUser.uid);
            } catch (uploadError) {
                console.error('Profile picture upload failed:', uploadError);
            }
        }
        
        // Check for referral code from input field
        let referrerId = null;
        let usedReferralCode = null;
        
        if (referralCode) {
            // Check if referral code is valid (format: ref_userid)
            if (referralCode.startsWith('ref_')) {
                const userId = referralCode.substring(4);
                try {
                    const referrerSnapshot = await database.ref('users/' + userId).once('value');
                    if (referrerSnapshot.exists()) {
                        referrerId = userId;
                        usedReferralCode = referralCode;
                    }
                } catch (error) {
                    console.error('Error checking referral code:', error);
                }
            }
        }
        
        // Check from URL parameter if not from input
        if (!referrerId && referralCodeFromUrl) {
            if (referralCodeFromUrl.startsWith('ref_')) {
                const userId = referralCodeFromUrl.substring(4);
                try {
                    const referrerSnapshot = await database.ref('users/' + userId).once('value');
                    if (referrerSnapshot.exists()) {
                        referrerId = userId;
                        usedReferralCode = referralCodeFromUrl;
                    }
                } catch (error) {
                    console.error('Error checking referral code from URL:', error);
                }
            }
        }
        
        // Check from localStorage if not from input or URL
        if (!referrerId) {
            const pendingReferralCode = localStorage.getItem('pendingReferralCode');
            if (pendingReferralCode && pendingReferralCode.startsWith('ref_')) {
                const userId = pendingReferralCode.substring(4);
                try {
                    const referrerSnapshot = await database.ref('users/' + userId).once('value');
                    if (referrerSnapshot.exists()) {
                        referrerId = userId;
                        usedReferralCode = pendingReferralCode;
                    }
                } catch (error) {
                    console.error('Error checking referral code from localStorage:', error);
                }
            }
        }
        
        // Create user data
        const userData = {
            uid: currentUser.uid,
            fullName: fullName,
            email: email,
            phone: phone || '',
            profilePicture: profilePicUrl,
            balance: 0,
            streak: 0,
            referrals: 0,
            successfulReferrals: 0,
            totalReferralEarnings: 0,
            tasksCompleted: 0,
            totalEarnings: 0,
            monthlyTasks: 0,
            activeReferrals: 0,
            memberSince: new Date().toISOString(),
            level: 'Beginner',
            status: 'Active',
            lastLogin: new Date().toISOString(),
            lastDailyBonus: null,
            dailyAdsWatched: 0,
            lastAdsDate: null,
            videosWatched: 0,
            lastVideoDate: null,
            referrer: referrerId, // Store who referred this user
            referralCode: `ref_${currentUser.uid}`, // This user's referral code (full UID)
            signupTimestamp: new Date().toISOString(),
            isActive: true
        };
        
        await database.ref('users/' + currentUser.uid).set(userData);
        
        // If user was referred, update referrer's data
        if (referrerId) {
            await processReferralReward(referrerId, currentUser.uid, usedReferralCode);
            
            // Clear pending referral code from localStorage and URL
            localStorage.removeItem('pendingReferralCode');
            referralCodeFromUrl = null;
            
            // Also update the referred user's data to show who referred them
            await database.ref('users/' + currentUser.uid).update({
                referredBy: referrerId,
                referralSource: usedReferralCode
            });
        }
        
        await loadUserData();
        
        showNotification('Account created successfully! Welcome to Daily Earning.', 'success');
        
    } catch (error) {
        console.error('Signup error:', error);
        let errorMessage = 'Signup failed. Please try again.';
        
        switch(error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Email already in use. Please use a different email.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak. Please use a stronger password.';
                break;
        }
        
        showNotification(errorMessage, 'error');
    } finally {
        elements.signupSpinner.classList.add('hidden');
        elements.signupBtn.disabled = false;
    }
}

async function processReferralReward(referrerId, referredUserId, referralCode) {
    try {
        const reward = 20; // ৳20 reward for successful referral
        
        // Update referrer's data
        const referrerRef = database.ref('users/' + referrerId);
        const referrerSnapshot = await referrerRef.once('value');
        const referrerData = referrerSnapshot.val();
        
        // First, check if this referral has already been processed
        const existingRefCheck = await database.ref(`referrals/${referrerId}/${referredUserId}`).once('value');
        if (existingRefCheck.exists()) {
            console.log('Referral already processed');
            return;
        }
        
        const updates = {
            balance: (referrerData.balance || 0) + reward,
            totalEarnings: (referrerData.totalEarnings || 0) + reward,
            totalReferralEarnings: (referrerData.totalReferralEarnings || 0) + reward,
            successfulReferrals: (referrerData.successfulReferrals || 0) + 1,
            referrals: (referrerData.referrals || 0) + 1
        };
        
        await referrerRef.update(updates);
        
        // Create referral record with detailed information
        const referralRecord = {
            referrerId: referrerId,
            referredUserId: referredUserId,
            referralCode: referralCode,
            reward: reward,
            timestamp: new Date().toISOString(),
            status: 'completed',
            isActive: true
        };
        
        // Save referral under referrer's referrals
        await database.ref(`referrals/${referrerId}/${referredUserId}`).set(referralRecord);
        
        // Also save under global referrals for tracking
        await database.ref('all_referrals/' + referredUserId).set({
            referrerId: referrerId,
            referralCode: referralCode,
            timestamp: new Date().toISOString()
        });
        
        // Send notification to referrer
        const notificationData = {
            type: 'referral_reward',
            title: '🎉 Referral Reward Earned!',
            message: `You earned ৳${reward} from referral!`,
            amount: reward,
            timestamp: new Date().toISOString(),
            read: false,
            userId: referrerId
        };
        
        await database.ref(`notifications/${referrerId}/${Date.now()}`).set(notificationData);
        
        console.log(`Referral reward processed: ${referrerId} earned ৳${reward} from ${referredUserId}`);
        
    } catch (error) {
        console.error('Error processing referral reward:', error);
    }
}

function handleProfilePictureChange(e) {
    const file = e.target.files[0];
    if (file) {
        if (!file.type.match('image.*')) {
            showNotification('Please select an image file', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Image size should be less than 5MB', 'error');
            return;
        }
        
        selectedProfilePicture = file;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            elements.profilePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function handleEditProfilePictureChange(e) {
    const file = e.target.files[0];
    if (file) {
        if (!file.type.match('image.*')) {
            showNotification('Please select an image file', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Image size should be less than 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            elements.editProfilePreview.src = e.target.result;
            selectedProfilePicture = file;
        };
        reader.readAsDataURL(file);
    }
}

async function uploadProfilePicture(file, userId) {
    return new Promise((resolve, reject) => {
        const storageRef = storage.ref();
        const profilePicRef = storageRef.child(`profile-pictures/${userId}/${Date.now()}_${file.name}`);
        
        const uploadTask = profilePicRef.put(file);
        
        uploadTask.on('state_changed',
            null,
            (error) => {
                reject(error);
            },
            async () => {
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                resolve(downloadURL);
            }
        );
    });
}

async function loadUserData() {
    if (!currentUser) return;
    
    try {
        const snapshot = await database.ref('users/' + currentUser.uid).once('value');
        userData = snapshot.val();
        
        if (!userData) {
            userData = {
                uid: currentUser.uid,
                fullName: currentUser.displayName || 'User',
                email: currentUser.email,
                phone: '',
                profilePicture: currentUser.photoURL || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                balance: 0,
                streak: 0,
                referrals: 0,
                successfulReferrals: 0,
                totalReferralEarnings: 0,
                tasksCompleted: 0,
                totalEarnings: 0,
                monthlyTasks: 0,
                activeReferrals: 0,
                memberSince: new Date().toISOString(),
                level: 'Beginner',
                status: 'Active',
                lastLogin: new Date().toISOString(),
                lastDailyBonus: null,
                dailyAdsWatched: 0,
                lastAdsDate: null,
                videosWatched: 0,
                lastVideoDate: null,
                referralCode: `ref_${currentUser.uid}` // Full UID
            };
            
            await database.ref('users/' + currentUser.uid).set(userData);
        } else {
            await database.ref('users/' + currentUser.uid).update({
                lastLogin: new Date().toISOString()
            });
            
            const today = new Date().toDateString();
            const lastAdsDate = userData.lastAdsDate ? new Date(userData.lastAdsDate).toDateString() : null;
            const lastVideoDate = userData.lastVideoDate ? new Date(userData.lastVideoDate).toDateString() : null;
            
            if (lastAdsDate !== today) {
                await database.ref('users/' + currentUser.uid).update({
                    dailyAdsWatched: 0,
                    lastAdsDate: new Date().toISOString()
                });
                userData.dailyAdsWatched = 0;
                userData.lastAdsDate = new Date().toISOString();
            }
            
            if (lastVideoDate !== today) {
                await database.ref('users/' + currentUser.uid).update({
                    videosWatched: 0,
                    lastVideoDate: new Date().toISOString()
                });
                userData.videosWatched = 0;
                userData.lastVideoDate = new Date().toISOString();
            }
            
            // Get actual referral count from database
            await updateReferralCount();
        }
        
        updateUserInterface();
        showMainApp();
        
        // Check for pending referrals
        await setupReferralTracking();
        
    } catch (error) {
        console.error('Error loading user data:', error);
        showNotification('Error loading user data', 'error');
    }
}

function updateUserInterface() {
    if (!userData) return;
    
    elements.currentBalance.textContent = userData.balance || 0;
    elements.dailyStreak.textContent = `${userData.streak || 0} days`;
    elements.streakProgress.style.width = `${Math.min((userData.streak || 0) * 10, 100)}%`;
    
    // রেফারেল কাউন্ট ডিসপ্লে
    elements.referralCount.textContent = `${userData.successfulReferrals || 0} friends`;
    elements.referralProgress.style.width = `${Math.min((userData.successfulReferrals || 0) * 5, 100)}%`;
    
    if (elements.dailyAdsCounter) {
        elements.dailyAdsCounter.textContent = `(${userData.dailyAdsWatched || 0}/15)`;
    }
    
    elements.tasksProgress.textContent = `${userData.tasksCompleted || 0}/10`;
    elements.totalEarned.textContent = userData.totalEarnings || 0;
    
    elements.userProfilePic.src = userData.profilePicture;
    elements.userFullName.textContent = userData.fullName;
    elements.userEmail.textContent = userData.email;
    elements.userPhone.textContent = userData.phone || 'Not provided';
    
    if (userData.memberSince) {
        const date = new Date(userData.memberSince);
        elements.memberSince.textContent = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    elements.userLevel.textContent = userData.level || 'Beginner';
    elements.userStatus.textContent = userData.status || 'Active';
    elements.totalEarnings.textContent = userData.totalEarnings || 0;
    elements.monthlyTasks.textContent = userData.monthlyTasks || 0;
    elements.activeReferrals.textContent = userData.successfulReferrals || 0;
    elements.currentStreak.textContent = `${userData.streak || 0} days`;
    
    generateUserReferralLink();
}

function generateUserReferralLink() {
    if (!currentUser || !userData) return;
    
    const baseUrl = window.location.origin;
    const referralCode = userData.referralCode || `ref_${currentUser.uid.substring(0, 8)}`;
    const referralLink = `${baseUrl}/?ref=${referralCode}`;
    
    if (elements.referralLink) {
        elements.referralLink.value = referralLink;
    }
}

async function handleLogout() {
    try {
        await auth.signOut();
        currentUser = null;
        userData = null;
        showAuthPages();
        showNotification('Logged out successfully', 'success');
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Logout failed. Please try again.', 'error');
    }
}

function showAuthPages() {
    elements.authContainer.classList.remove('hidden');
    elements.mainContainer.classList.add('hidden');
    elements.bottomNav.classList.add('hidden');
    elements.logoutBtn.classList.add('hidden');
    navigateToAuthPage('login');
}

function showMainApp() {
    elements.authContainer.classList.add('hidden');
    elements.mainContainer.classList.remove('hidden');
    elements.bottomNav.classList.remove('hidden');
    elements.logoutBtn.classList.remove('hidden');
    navigateToPage('home');
    updateNavActiveState('home');
}

function navigateToPage(page) {
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    const pageElement = document.getElementById(`${page}Page`);
    if (pageElement) {
        pageElement.classList.add('active');
        
        const pageTitles = {
            'home': 'Earn money online',
            'tasks': 'All Tasks',
            'profile': 'My Profile'
        };
        
        elements.pageTitle.textContent = pageTitles[page] || 'Daily Earning';
        
        if (page === 'tasks') {
            loadAllTasks();
        }
    }
}

function updateNavActiveState(page) {
    elements.navBtns.forEach(btn => {
        btn.classList.remove('active', 'tab-active');
        btn.classList.add('text-gray-500');
    });
    
    const activeBtn = document.querySelector(`[data-page="${page}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'tab-active', 'text-blue-600');
    }
}

function loadAllTasks() {
    if (!elements.allTasksList) return;
    
    const tasks = [
        { 
            id: 1, 
            title: 'AI Voice Changer App', 
            description: 'Change your voice with AI technology', 
            icon: 'https://cdn-icons-png.flaticon.com/512/3576/3576216.png',
            unlockLinks: ['https://otieu.com/4/9276685'],
            downloadLink: 'https://t.me/LearnerAlom/143',
            reward: 0.5
        },
        { 
            id: 2, 
            title: 'Video Editor Pro', 
            description: 'Professional video editing app', 
            icon: 'https://cdn-icons-png.flaticon.com/512/3249/3249321.png',
            unlockLinks: ['https://link.gigapub.tech/l/afk7dvr3t'],
            downloadLink: 'https://t.me/LearnerAlom/144',
            reward: 0.5
        },
        { 
            id: 3, 
            title: 'Photo Editor Premium', 
            description: 'Edit photos like a pro', 
            icon: 'https://cdn-icons-png.flaticon.com/512/3249/3249347.png',
            unlockLinks: ['https://link.gigapub.tech/l/93ilu7p8k'],
            downloadLink: 'https://t.me/LearnerAlom/145',
            reward: 0.5
        },
        { 
            id: 4, 
            title: 'Music Player Premium', 
            description: 'Premium music player with effects', 
            icon: 'https://cdn-icons-png.flaticon.com/512/727/727221.png',
            unlockLinks: ['https://www.effectivegatecpm.com/c5nz8u6w1h?key=efe12f1a8f2ce2a314d5e8590294675d'],
            downloadLink: 'https://t.me/LearnerAlom/146',
            reward: 0.5
        },
        { 
            id: 5, 
            title: 'VPN Master Pro', 
            description: 'Secure VPN with high speed', 
            icon: 'https://cdn-icons-png.flaticon.com/512/1820/1820240.png',
            unlockLinks: ['https://www.effectivegatecpm.com/sjvt89iz1p?key=d0f976a182a2f8c9819f6100d7b06cfe'],
            downloadLink: 'https://t.me/LearnerAlom/147',
            reward: 0.5
        },
        { 
            id: 6, 
            title: 'PDF Reader Pro', 
            description: 'Read and edit PDF files', 
            icon: 'https://cdn-icons-png.flaticon.com/512/337/337946.png',
            unlockLinks: ['https://otieu.com/4/10412908'],
            downloadLink: 'https://t.me/LearnerAlom/148',
            reward: 0.5
        },
        { 
            id: 7, 
            title: 'Screen Recorder', 
            description: 'Record your screen in HD', 
            icon: 'https://cdn-icons-png.flaticon.com/512/3249/3249359.png',
            unlockLinks: ['https://link.gigapub.tech/l/afk7dvr3t'],
            downloadLink: 'https://t.me/LearnerAlom/149',
            reward: 0.5
        },
        { 
            id: 8, 
            title: 'File Manager Pro', 
            description: 'Manage all your files easily', 
            icon: 'https://cdn-icons-png.flaticon.com/512/2099/2099091.png',
            unlockLinks: ['https://link.gigapub.tech/l/93ilu7p8k'],
            downloadLink: 'https://t.me/LearnerAlom/150',
            reward: 0.5
        }
    ];
    
    elements.allTasksList.innerHTML = '';
    let completedCount = 0;
    
    // Load user's task progress
    const userTaskProgress = JSON.parse(localStorage.getItem(`taskProgress_${currentUser?.uid}`)) || {};
    
    tasks.forEach(task => {
        const taskData = userTaskProgress[task.id] || {
            unlockCount: 0,
            completed: false,
            timerActive: false,
            timeRemaining: 0,
            lastUnlockTime: null
        };
        
        if (taskData.completed) completedCount++;
        
        const isUnlocked = taskData.unlockCount >= 5;
        const showTimer = taskData.timerActive && taskData.timeRemaining > 0;
        
        const taskElement = document.createElement('div');
        taskElement.className = `glass-card rounded-2xl p-4 border border-gray-200 dark:border-gray-700 mb-4 task-card`;
        taskElement.setAttribute('data-task-id', task.id);
        taskElement.innerHTML = `
            <div class="flex items-center mb-3">
                <img src="${task.icon}" alt="${task.title}" class="w-12 h-12 rounded-xl mr-3" onerror="this.src='https://cdn-icons-png.flaticon.com/512/888/888879.png'">
                <div class="flex-1">
                    <h4 class="font-bold text-gray-800 dark:text-white">${task.title}</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-300">${task.description}</p>
                </div>
            </div>
            
            <div class="flex justify-between items-center mb-3">
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-300">Reward</p>
                    <p class="font-bold text-green-600 dark:text-green-400">ফ্রি DOWNLOAD ⬇️</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500 dark:text-gray-300">Unlock Progress</p>
                    <p class="font-bold ${isUnlocked ? 'text-green-600' : 'text-blue-600'}">
                        ${taskData.unlockCount}/5 unlocks
                    </p>
                </div>
            </div>
            
            <div class="mb-3">
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                         style="width: ${Math.min(taskData.unlockCount * 20, 100)}%"></div>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                    ${!isUnlocked ? 
                        `${5 - taskData.unlockCount} more unlocks needed for download` : 
                        '✅ Ready to download!'}
                </p>
            </div>
            
            <div class="space-y-2">
                ${taskData.completed ? `
                    <button class="w-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center" disabled>
                        <i class="fas fa-check-circle mr-2"></i> Completed (+৳${task.reward})
                    </button>
                ` : isUnlocked ? `
                    ${showTimer ? `
                        <button class="w-full bg-gray-400 dark:bg-gray-600 text-white font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center" disabled>
                            <div class="loader mr-2" style="width: 20px; height: 20px;"></div>
                            Wait ${taskData.timeRemaining}s
                        </button>
                    ` : `
                        <button class="task-download-btn w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition flex items-center justify-center" 
                                data-task-id="${task.id}">
                            <i class="fas fa-download mr-2"></i> DOWNLOAD ⬇️
                        </button>
                    `}
                ` : `
                    ${showTimer ? `
                        <button class="w-full bg-gray-400 dark:bg-gray-600 text-white font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center" disabled>
                            <div class="loader mr-2" style="width: 20px; height: 20px;"></div>
                            Wait ${taskData.timeRemaining}s
                        </button>
                    ` : `
                        <button class="task-unlock-btn w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition flex items-center justify-center" 
                                data-task-id="${task.id}">
                            <i class="fas fa-lock mr-2"></i> 🔒UNLOCK (${taskData.unlockCount + 1}/6)
                        </button>
                    `}
                `}
            </div>
        `;
        elements.allTasksList.appendChild(taskElement);
    });
    
    elements.tasksProgress.textContent = `${completedCount}/${tasks.length}`;
    
    // Add event listeners
    attachTaskEventListeners();
}
// টাস্ক ইভেন্ট লিসেনার সংযুক্ত করুন
function attachTaskEventListeners() {
    // UNLOCK বাটনের জন্য
    document.querySelectorAll('.task-unlock-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const taskId = parseInt(this.getAttribute('data-task-id'));
            console.log('UNLOCK clicked for task:', taskId);
            handleTaskUnlock(taskId);
        });
    });
    
    // DOWNLOAD বাটনের জন্য
    document.querySelectorAll('.task-download-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const taskId = parseInt(this.getAttribute('data-task-id'));
            console.log('DOWNLOAD clicked for task:', taskId);
            handleTaskDownload(taskId);
        });
    });
}

// টাস্ক আনলক হ্যান্ডলার
function handleTaskUnlock(taskId) {
    console.log('handleTaskUnlock called for task:', taskId);
    
    if (!currentUser) {
        showNotification('Please login first!', 'error');
        return;
    }
    
    // টাস্ক ডেটা
    const tasks = {
        1: { unlockLinks: ['https://otieu.com/4/9276685'], downloadLink: 'https://t.me/LearnerAlom/143', reward: 0.5 },
        2: { unlockLinks: ['https://link.gigapub.tech/l/afk7dvr3t'], downloadLink: 'https://t.me/LearnerAlom/144', reward: 0.5 },
        3: { unlockLinks: ['https://link.gigapub.tech/l/93ilu7p8k'], downloadLink: 'https://t.me/LearnerAlom/145', reward: 0.5 },
        4: { unlockLinks: ['https://www.effectivegatecpm.com/c5nz8u6w1h?key=efe12f1a8f2ce2a314d5e8590294675d'], downloadLink: 'https://t.me/LearnerAlom/146', reward: 0.5 },
        5: { unlockLinks: ['https://www.effectivegatecpm.com/sjvt89iz1p?key=d0f976a182a2f8c9819f6100d7b06cfe'], downloadLink: 'https://t.me/LearnerAlom/147', reward: 0.5 },
        6: { unlockLinks: ['https://otieu.com/4/10412908'], downloadLink: 'https://t.me/LearnerAlom/148', reward: 0.5 },
        7: { unlockLinks: ['https://link.gigapub.tech/l/afk7dvr3t'], downloadLink: 'https://t.me/LearnerAlom/149', reward: 0.5 },
        8: { unlockLinks: ['https://link.gigapub.tech/l/93ilu7p8k'], downloadLink: 'https://t.me/LearnerAlom/150', reward: 0.5 }
    };
    
    const task = tasks[taskId];
    if (!task) {
        console.error('Task not found:', taskId);
        return;
    }
    
    // ইউজারের টাস্ক প্রোগ্রেস লোড করুন
    const userTaskProgress = JSON.parse(localStorage.getItem(`taskProgress_${currentUser.uid}`)) || {};
    const taskData = userTaskProgress[taskId] || {
        unlockCount: 0,
        completed: false,
        timerActive: false,
        timeRemaining: 0,
        lastUnlockTime: null
    };
    
    console.log('Current task data:', taskData);
    
    // টাইমার চেক করুন
    if (taskData.timerActive) {
        showNotification(`Please wait ${taskData.timeRemaining} seconds!`, 'warning');
        return;
    }
    
    // আনলক লিংক সিলেক্ট করুন
    const linkIndex = taskData.unlockCount % task.unlockLinks.length;
    const unlockLink = task.unlockLinks[linkIndex];
    
    console.log('Opening unlock link:', unlockLink);
    
    // লিংক ওপেন করুন নতুন ট্যাবে
    const newWindow = window.open(unlockLink, '_blank');
    if (!newWindow) {
        showNotification('Please allow popups to open the unlock link!', 'error');
        return;
    }
    
    // টাস্ক ডেটা আপডেট করুন
    taskData.unlockCount++;
    taskData.timerActive = true;
    taskData.timeRemaining = 30;
    taskData.lastUnlockTime = Date.now();
    
    // সেভ করুন
    userTaskProgress[taskId] = taskData;
    localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(userTaskProgress));
    
    // নোটিফিকেশন
    const remainingUnlocks = 5 - taskData.unlockCount;
    if (remainingUnlocks > 0) {
        showNotification(`Unlock ${taskData.unlockCount}/5 completed! ${remainingUnlocks} more to go.`, 'info');
    } else {
        showNotification('🎉 All unlocks completed! Now you can download.', 'success');
    }
    
    // UI রিফ্রেশ করুন
    loadAllTasks();
    
    // টাইমার শুরু করুন
    startTaskTimer(taskId);
}

// টাস্ক টাইমার ফাংশন
function startTaskTimer(taskId) {
    const timerKey = `taskTimer_${taskId}`;
    
    // ক্লিয়ার অ্যানি এক্সিস্টিং টাইমার
    if (window[timerKey]) {
        clearInterval(window[timerKey]);
    }
    
    // নতুন টাইমার শুরু করুন
    window[timerKey] = setInterval(() => {
        const userTaskProgress = JSON.parse(localStorage.getItem(`taskProgress_${currentUser.uid}`)) || {};
        const taskData = userTaskProgress[taskId];
        
        if (!taskData || !taskData.timerActive) {
            clearInterval(window[timerKey]);
            return;
        }
        
        if (taskData.timeRemaining > 1) {
            taskData.timeRemaining--;
            userTaskProgress[taskId] = taskData;
            localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(userTaskProgress));
            
            // UI আপডেট করুন যদি টাস্কস পেজ একটিভ থাকে
            if (document.getElementById('tasksPage').classList.contains('active')) {
                const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
                if (taskElement) {
                    const timerDisplay = taskElement.querySelector('.task-unlock-btn, .task-download-btn');
                    if (timerDisplay) {
                        const parentDiv = timerDisplay.parentElement;
                        parentElement.innerHTML = `
                            <button class="w-full bg-gray-400 dark:bg-gray-600 text-white font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center" disabled>
                                <div class="loader mr-2" style="width: 20px; height: 20px;"></div>
                                Wait ${taskData.timeRemaining}s
                            </button>
                        `;
                    }
                }
            }
        } else {
            // টাইমার শেষ
            taskData.timerActive = false;
            taskData.timeRemaining = 0;
            userTaskProgress[taskId] = taskData;
            localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(userTaskProgress));
            
            clearInterval(window[timerKey]);
            
            // UI রিফ্রেশ
            if (document.getElementById('tasksPage').classList.contains('active')) {
                loadAllTasks();
                showNotification('Timer completed! You can proceed now.', 'info');
            }
        }
    }, 1000);
}

// টাস্ক ডাউনলোড হ্যান্ডলার
async function handleTaskDownload(taskId) {
    console.log('handleTaskDownload called for task:', taskId);
    
    if (!currentUser) {
        showNotification('Please login first!', 'error');
        return;
    }
    
    // টাস্ক ডেটা
    const tasks = {
        1: { unlockLinks: ['https://otieu.com/4/9276685'], downloadLink: 'https://t.me/LearnerAlom/143', reward: 0.5 },
        2: { unlockLinks: ['https://link.gigapub.tech/l/afk7dvr3t'], downloadLink: 'https://t.me/LearnerAlom/144', reward: 0.5 },
        3: { unlockLinks: ['https://link.gigapub.tech/l/93ilu7p8k'], downloadLink: 'https://t.me/LearnerAlom/145', reward: 0.5 },
        4: { unlockLinks: ['https://www.effectivegatecpm.com/c5nz8u6w1h?key=efe12f1a8f2ce2a314d5e8590294675d'], downloadLink: 'https://t.me/LearnerAlom/146', reward: 0.5 },
        5: { unlockLinks: ['https://www.effectivegatecpm.com/sjvt89iz1p?key=d0f976a182a2f8c9819f6100d7b06cfe'], downloadLink: 'https://t.me/LearnerAlom/147', reward: 0.5 },
        6: { unlockLinks: ['https://otieu.com/4/10412908'], downloadLink: 'https://t.me/LearnerAlom/148', reward: 0.5 },
        7: { unlockLinks: ['https://link.gigapub.tech/l/afk7dvr3t'], downloadLink: 'https://t.me/LearnerAlom/149', reward: 0.5 },
        8: { unlockLinks: ['https://link.gigapub.tech/l/93ilu7p8k'], downloadLink: 'https://t.me/LearnerAlom/150', reward: 0.5 }
    };
    
    const task = tasks[taskId];
    if (!task) {
        console.error('Task not found:', taskId);
        return;
    }
    
    // ইউজারের টাস্ক প্রোগ্রেস চেক করুন
    const userTaskProgress = JSON.parse(localStorage.getItem(`taskProgress_${currentUser.uid}`)) || {};
    const taskData = userTaskProgress[taskId] || {
        unlockCount: 0,
        completed: false,
        timerActive: false,
        timeRemaining: 0,
        lastUnlockTime: null
    };
    
    // আনলক কাউন্ট চেক করুন
    if (taskData.unlockCount < 5) {
        showNotification(`Please complete ${5 - taskData.unlockCount} more unlocks first!`, 'error');
        return;
    }
    
    // টাইমার চেক করুন
    if (taskData.timerActive) {
        showNotification(`Please wait ${taskData.timeRemaining} seconds!`, 'warning');
        return;
    }
    
    // ডাউনলোড লিংক ওপেন করুন
    console.log('Opening download link:', task.downloadLink);
    const newWindow = window.open(task.downloadLink, '_blank');
    if (!newWindow) {
        showNotification('Please allow popups to open the download link!', 'error');
        return;
    }
    
    // টাইমার সেট করুন
    taskData.timerActive = true;
    taskData.timeRemaining = 30;
    taskData.lastUnlockTime = Date.now();
    
    userTaskProgress[taskId] = taskData;
    localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(userTaskProgress));
    
    showNotification('Download link opened! Return in 30 seconds to get reward.', 'info');
    
    // UI রিফ্রেশ
    loadAllTasks();
    
    // টাইমার শুরু করুন
    startTaskTimer(taskId);
    
    // 30 সেকেন্ড পর রিওয়ার্ড দিন
    setTimeout(async () => {
        try {
            // টাস্ক কমপ্লিট মার্ক করুন
            taskData.completed = true;
            taskData.timerActive = false;
            taskData.timeRemaining = 0;
            
            userTaskProgress[taskId] = taskData;
            localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(userTaskProgress));
            
            // ব্যালেন্সে টাকা যোগ করুন
            const updates = {
                balance: (userData.balance || 0) + task.reward,
                totalEarnings: (userData.totalEarnings || 0) + task.reward,
                tasksCompleted: (userData.tasksCompleted || 0) + 1,
                monthlyTasks: (userData.monthlyTasks || 0) + 1
            };
            
            await database.ref('users/' + currentUser.uid).update(updates);
            
            // লোকাল ডাটা আপডেট করুন
            userData = { ...userData, ...updates };
            updateUserInterface();
            
            // UI রিফ্রেশ
            loadAllTasks();
            
            showNotification(`🎉 Task completed! +৳${task.reward} added to your balance.`, 'success');
            
        } catch (error) {
            console.error('Error adding reward:', error);
            showNotification('Error processing reward. Please try again.', 'error');
        }
    }, 30000);
}

function navigateToPage(page) {
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    const pageElement = document.getElementById(`${page}Page`);
    if (pageElement) {
        pageElement.classList.add('active');
        
        const pageTitles = {
            'home': 'Earn money online',
            'tasks': 'All Tasks',
            'profile': 'My Profile'
        };
        
        elements.pageTitle.textContent = pageTitles[page] || 'Daily Earning';
        
        if (page === 'tasks') {
            loadAllTasks();
        }
    }
}

// Start timers for active tasks
function startTaskTimers() {
    if (!currentUser) return;
    
    const userTaskProgress = JSON.parse(localStorage.getItem(`taskProgress_${currentUser.uid}`)) || {};
    let needsUpdate = false;
    
    Object.keys(userTaskProgress).forEach(taskId => {
        const taskData = userTaskProgress[taskId];
        
        if (taskData.timerActive && taskData.lastClickTime) {
            const timeElapsed = Math.floor((Date.now() - taskData.lastClickTime) / 1000);
            const timeRemaining = Math.max(0, 30 - timeElapsed);
            
            if (timeRemaining > 0) {
                taskData.timeRemaining = timeRemaining;
                
                // Update timer every second
                const timerInterval = setInterval(() => {
                    const currentData = JSON.parse(localStorage.getItem(`taskProgress_${currentUser.uid}`)) || {};
                    const currentTaskData = currentData[taskId];
                    
                    if (currentTaskData && currentTaskData.timerActive) {
                        if (currentTaskData.timeRemaining > 1) {
                            currentTaskData.timeRemaining--;
                            currentData[taskId] = currentTaskData;
                            localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(currentData));
                            
                            // Update UI if on tasks page
                            const pageElement = document.getElementById('tasksPage');
                            if (pageElement && pageElement.classList.contains('active')) {
                                loadAllTasks();
                            }
                        } else {
                            // Timer completed
                            currentTaskData.timerActive = false;
                            currentTaskData.timeRemaining = 0;
                            currentData[taskId] = currentTaskData;
                            localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(currentData));
                            
                            clearInterval(timerInterval);
                            
                            // Update UI if on tasks page
                            const pageElement = document.getElementById('tasksPage');
                            if (pageElement && pageElement.classList.contains('active')) {
                                loadAllTasks();
                                showNotification('Timer completed! You can proceed now.', 'info');
                            }
                        }
                    } else {
                        clearInterval(timerInterval);
                    }
                }, 1000);
            } else {
                // Timer already completed
                taskData.timerActive = false;
                taskData.timeRemaining = 0;
                needsUpdate = true;
                
                // If it was a download timer, mark as completed
                if (taskData.unlockCount >= 5 && !taskData.completed) {
                    taskData.completed = true;
                    
                    // Add reward
                    const taskReward = 0.5;
                    database.ref('users/' + currentUser.uid).update({
                        balance: (userData.balance || 0) + taskReward,
                        totalEarnings: (userData.totalEarnings || 0) + taskReward,
                        tasksCompleted: (userData.tasksCompleted || 0) + 1,
                        monthlyTasks: (userData.monthlyTasks || 0) + 1
                    }).then(() => {
                        userData.balance += taskReward;
                        userData.totalEarnings += taskReward;
                        userData.tasksCompleted += 1;
                        userData.monthlyTasks += 1;
                        updateUserInterface();
                        showNotification(`Task completed! +৳${taskReward} added.`, 'success');
                    });
                }
            }
        }
    });
    
    if (needsUpdate) {
        localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(userTaskProgress));
    }
}

// Navigate to page function এ আপডেট করুন tasks লোড করার সময়
function navigateToPage(page) {
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    const pageElement = document.getElementById(`${page}Page`);
    if (pageElement) {
        pageElement.classList.add('active');
        
        const pageTitles = {
            'home': 'Earn money online',
            'tasks': 'All Tasks',
            'profile': 'My Profile'
        };
        
        elements.pageTitle.textContent = pageTitles[page] || 'Daily Earning';
        
        if (page === 'tasks') {
            loadAllTasks();
        }
    }
}

// Reset task progress function (optional - for testing)
function resetTaskProgress() {
    if (currentUser && confirm('Are you sure you want to reset all task progress?')) {
        localStorage.removeItem(`taskProgress_${currentUser.uid}`);
        loadAllTasks();
        showNotification('Task progress reset successfully!', 'success');
    }
}

function handleQuickAction(action) {
    if (!currentUser || !userData) {
        showNotification('Please login first!', 'error');
        return;
    }
    
    switch(action) {
        case 'watch-ads':
            triggerAdsSequence(); 
            break;
        case 'watch-videos':
            triggerVideoAd();
            break;
        case 'daily-bonus':
            claimDailyBonus();
            break;
        case 'invite-friends':
            showNotification('Use the referral section below to invite friends!', 'info');
            break;
    }
}

async function triggerAdsSequence() {
    isVideoAd = false;
    
    // ১. ডেইলি লিমিট চেক
    if (userData.dailyAdsWatched >= 15) {
        showNotification('আজকের লিমিট শেষ! আগামীকাল আবার ট্রাই করুন।', 'error');
        return;
    }

    // ২. লোডিং স্ক্রিন শো করা
    elements.adsLoadingOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    try {
        // Ads progress steps
        updateAdsProgress(1, 10);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // ৩. ধাপ ১: Rewarded interstitial Ads
        await show_8954258().then(() => {
            console.log('Rewarded interstitial ad completed successfully');
            updateAdsProgress(1, 100);
            return new Promise(resolve => setTimeout(resolve, 1000));
        }).catch(error => {
            console.error('Rewarded interstitial ad error:', error);
            throw new Error('Failed to show rewarded interstitial ad');
        });

        // ৪. ধাপ ২: Rewarded Popup Ads
        updateAdsProgress(2, 10);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await show_8954258('pop').then(() => {
            console.log('Rewarded popup ad completed successfully');
            updateAdsProgress(2, 100);
            return new Promise(resolve => setTimeout(resolve, 1000));
        }).catch(error => {
            console.error('Rewarded popup ad error:', error);
            throw new Error('Failed to show rewarded popup ad');
        });

        // ৫. ধাপ ৩: In-App Interstitial Ads
        updateAdsProgress(3, 10);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await show_8954258({
            type: 'inApp',
            inAppSettings: {
                frequency: 2,
                capping: 0.1,
                interval: 30,
                timeout: 5,
                everyPage: false
            }
        }).then(() => {
            console.log('In-app interstitial ad completed successfully');
            updateAdsProgress(3, 100);
            return new Promise(resolve => setTimeout(resolve, 1000));
        }).catch(error => {
            console.error('In-app interstitial ad error:', error);
            throw new Error('Failed to show in-app interstitial ad');
        });

        // ৬. লোডিং স্ক্রিন হাইড করা
        elements.adsLoadingOverlay.classList.add('hidden');
        
        // ৭. ১৫ সেকেন্ড কাউন্টডাউন শুরু করা
        startCountdown();

    } catch (error) {
        console.error("Ad Sequence Error:", error);
        showNotification('অ্যাড দেখা সম্পন্ন হয়নি। আবার চেষ্টা করুন।', 'warning');
        
        // লোডিং স্ক্রিন হাইড করা
        elements.adsLoadingOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
        return;
    }
}

async function triggerVideoAd() {
    isVideoAd = true;
    
    // ১. ভিডিও ডেইলি লিমিট চেক
    const today = new Date().toDateString();
    const lastVideoDate = userData.lastVideoDate ? new Date(userData.lastVideoDate).toDateString() : null;
    
    if (lastVideoDate === today && userData.videosWatched >= 10) {
        showNotification('আজকের ভিডিও লিমিট শেষ! আগামীকাল আবার ট্রাই করুন।', 'error');
        return;
    }

    // ২. ভিডিও লোডিং স্ক্রিন শো করা
    elements.videoAdLoadingOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    try {
        // Progress বার আপডেট
        updateVideoProgress(10);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // ৩. Rewarded Popup Ads শো করা
        await show_8954258('pop').then(() => {
            console.log('Video ad completed successfully');
            updateVideoProgress(100);
            return new Promise(resolve => setTimeout(resolve, 1000));
        }).catch(error => {
            console.error('Video ad error:', error);
            throw new Error('Failed to show video ad');
        });

        // ৪. লোডিং স্ক্রিন হাইড করা
        elements.videoAdLoadingOverlay.classList.add('hidden');
        
        // ৫. ১৫ সেকেন্ড কাউন্টডাউন শুরু করা
        startCountdown();

    } catch (error) {
        console.error("Video Ad Error:", error);
        showNotification('ভিডিও অ্যাড দেখা সম্পন্ন হয়নি। আবার চেষ্টা করুন।', 'warning');
        
        // লোডিং স্ক্রিন হাইড করা
        elements.videoAdLoadingOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
        return;
    }
}

function updateAdsProgress(step, progress) {
    // Update step indicators
    elements.adsStep1.classList.remove('active', 'completed');
    elements.adsStep2.classList.remove('active', 'completed');
    elements.adsStep3.classList.remove('active', 'completed');
    
    if (step >= 1) elements.adsStep1.classList.add('completed');
    if (step >= 2) elements.adsStep2.classList.add('completed');
    if (step >= 3) elements.adsStep3.classList.add('completed');
    
    if (step === 1) elements.adsStep1.classList.add('active');
    if (step === 2) elements.adsStep2.classList.add('active');
    if (step === 3) elements.adsStep3.classList.add('active');
    
    // Update progress bar
    const totalProgress = (step - 1) * 33 + progress;
    elements.adsProgressFill.style.width = `${totalProgress}%`;
}

function updateVideoProgress(progress) {
    elements.videoProgressFill.style.width = `${progress}%`;
}

function startCountdown() {
    // রিসেট কাউন্টডাউন
    countdownSeconds = 15;
    elements.countdownNumber.textContent = countdownSeconds;
    elements.remainingSeconds.textContent = countdownSeconds;
    
    // কাউন্টডাউন ওভারলে শো করা
    elements.countdownOverlay.classList.remove('hidden');
    
    // কাউন্টডাউন ইন্টারভেল শুরু
    countdownInterval = setInterval(() => {
        countdownSeconds--;
        elements.countdownNumber.textContent = countdownSeconds;
        elements.remainingSeconds.textContent = countdownSeconds;
        
        if (countdownSeconds <= 0) {
            // কাউন্টডাউন শেষ হলে
            clearInterval(countdownInterval);
            endCountdown();
        }
    }, 1000);
}

function endCountdown() {
    // কাউন্টডাউন ওভারলে হাইড করা
    elements.countdownOverlay.classList.add('hidden');
    
    // রিওয়ার্ড প্রদান
    if (isVideoAd) {
        rewardUserAfterVideoAd();
    } else {
        rewardUserAfterAds();
    }
    
    // উদযাপন স্ক্রিন শো করা
    setTimeout(() => {
        showCelebration();
    }, 500);
}

async function rewardUserAfterAds() {
    const reward = 1; // রিওয়ার্ড ১ টাকা
    try {
        const updates = {};
        updates['balance'] = (userData.balance || 0) + reward;
        updates['totalEarnings'] = (userData.totalEarnings || 0) + reward;
        updates['dailyAdsWatched'] = (userData.dailyAdsWatched || 0) + 1;
        updates['lastAdsDate'] = new Date().toISOString();
        
        await database.ref('users/' + currentUser.uid).update(updates);
        
        // লোকাল ডাটা আপডেট এবং UI রিফ্রেশ
        userData = { ...userData, ...updates };
        updateUserInterface();
        
    } catch (err) {
        console.error('Reward error:', err);
        showNotification('টাকা যোগ করতে সমস্যা হয়েছে। ডেভেলপারকে জানান।', 'error');
    }
}

async function rewardUserAfterVideoAd() {
    const reward = 1; // রিওয়ার্ড ১ টাকা
    try {
        const updates = {};
        updates['balance'] = (userData.balance || 0) + reward;
        updates['totalEarnings'] = (userData.totalEarnings || 0) + reward;
        updates['videosWatched'] = (userData.videosWatched || 0) + 1;
        updates['lastVideoDate'] = new Date().toISOString();
        
        await database.ref('users/' + currentUser.uid).update(updates);
        
        // লোকাল ডাটা আপডেট এবং UI রিফ্রেশ
        userData = { ...userData, ...updates };
        updateUserInterface();
        
    } catch (err) {
        console.error('Video reward error:', err);
        showNotification('টাকা যোগ করতে সমস্যা হয়েছে। ডেভেলপারকে জানান।', 'error');
    }
}

function showCelebration() {
    // কনফেটি এফেক্ট তৈরি করা
    createConfetti();
    
    // উদযাপন ওভারলে শো করা
    elements.celebrationOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function createConfetti() {
    const colors = ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = confetti.style.width;
        
        elements.celebrationOverlay.appendChild(confetti);
        
        // ৩ সেকেন্ড পর কনফেটি রিমুভ করা
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    }
}

function closeCelebration() {
    // উদযাপন ওভারলে হাইড করা
    elements.celebrationOverlay.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // সব কনফেটি রিমুভ করা
    const confettiElements = elements.celebrationOverlay.querySelectorAll('.confetti');
    confettiElements.forEach(confetti => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    });
    
    // সফল হওয়ার নোটিফিকেশন
    if (isVideoAd) {
        showNotification('ভিডিও অ্যাড দেখা সম্পন্ন হয়েছে! ৳১ আপনার ব্যালেন্সে যোগ হয়েছে।', 'success');
    } else {
        showNotification('সব অ্যাড দেখা সম্পন্ন হয়েছে! ৳১ আপনার ব্যালেন্সে যোগ হয়েছে।', 'success');
    }
}

async function claimDailyBonus() {
    if (!currentUser || !userData) return;
    
    const today = new Date().toDateString();
    const lastBonusDate = userData.lastDailyBonus ? new Date(userData.lastDailyBonus).toDateString() : null;
    
    if (lastBonusDate === today) {
        showNotification('আপনি আজকের Daily Bonus ইতিমধ্যে নিয়ে নিয়েছেন! আগামীকাল আবার চেষ্টা করুন।', 'error');
        return;
    }
    
    try {
        const reward = 1;
        
        const updates = {};
        updates['balance'] = (userData.balance || 0) + reward;
        updates['totalEarnings'] = (userData.totalEarnings || 0) + reward;
        updates['lastDailyBonus'] = new Date().toISOString();
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        if (lastBonusDate === yesterdayString) {
            updates['streak'] = (userData.streak || 0) + 1;
        } else if (!lastBonusDate) {
            updates['streak'] = 1;
        } else {
            updates['streak'] = 1;
        }
        
        await database.ref('users/' + currentUser.uid).update(updates);
        userData = { ...userData, ...updates };
        updateUserInterface();
        
        showNotification(`Daily Bonus! ৳${reward} has been added to your balance. Streak: ${updates['streak']} days`, 'success');
        
    } catch (error) {
        console.error('Error claiming daily bonus:', error);
        showNotification('Error claiming daily bonus. Please try again.', 'error');
    }
}

async function copyReferralLink() {
    navigator.clipboard.writeText(elements.referralLink.value)
        .then(() => {
            // শুধু লিংক কপি করা হয়েছে, ব্যালেন্স যোগ করা হবে না
            showNotification('Referral link copied to clipboard! Share with friends to earn ৳20.', 'success');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            showNotification('Failed to copy link. Please try again.', 'error');
        });
}

function shareReferralLink() {
    if (navigator.share) {
        navigator.share({
            title: 'Daily Earning - Earn Money Online',
            text: 'Join Daily Earning and start earning money by completing simple tasks! Use my referral link to get started.',
            url: elements.referralLink.value
        })
        .then(() => {
            showNotification('Thanks for sharing! You will earn ৳20 when friends join using your link.', 'success');
        })
        .catch(err => console.error('Error sharing:', err));
    } else {
        copyReferralLink();
    }
}

// Profile Edit Modal Functions
function openProfileEditModal() {
    if (!currentUser || !userData) return;
    
    // Populate form with current user data
    elements.editProfilePreview.src = userData.profilePicture;
    elements.editFullName.value = userData.fullName || '';
    elements.editEmail.value = userData.email || '';
    elements.editPhoneNumber.value = userData.phone || '';
    
    // Reset password fields
    elements.currentPassword.value = '';
    elements.newPassword.value = '';
    elements.confirmNewPassword.value = '';
    
    // Show modal
    elements.profileEditModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProfileEditModal() {
    elements.profileEditModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    selectedProfilePicture = null;
}

async function handleProfileEdit(e) {
    e.preventDefault();
    
    const fullName = elements.editFullName.value.trim();
    const email = elements.editEmail.value.trim();
    const phone = elements.editPhoneNumber.value.trim();
    const currentPasswordValue = elements.currentPassword.value;
    const newPasswordValue = elements.newPassword.value;
    const confirmNewPasswordValue = elements.confirmNewPassword.value;
    
    if (!fullName || !email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Verify current password
    if (!currentPasswordValue) {
        showNotification('Please enter your current password for verification', 'error');
        return;
    }
    
    try {
        // Verify current password
        const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, currentPasswordValue);
        await currentUser.reauthenticateWithCredential(credential);
        
        elements.saveProfileSpinner.classList.remove('hidden');
        elements.saveProfileBtn.disabled = true;
        
        let profilePicUrl = userData.profilePicture;
        
        // Upload new profile picture if selected
        if (selectedProfilePicture) {
            try {
                profilePicUrl = await uploadProfilePicture(selectedProfilePicture, currentUser.uid);
            } catch (uploadError) {
                console.error('Profile picture upload failed:', uploadError);
            }
        }
        
        const updates = {
            fullName: fullName,
            email: email,
            phone: phone,
            profilePicture: profilePicUrl
        };
        
        // Update Firebase user data
        await database.ref('users/' + currentUser.uid).update(updates);
        
        // Update email if changed
        if (email !== currentUser.email) {
            await currentUser.updateEmail(email);
        }
        
        // Update password if provided
        if (newPasswordValue) {
            if (newPasswordValue.length < 6) {
                showNotification('New password must be at least 6 characters', 'error');
                elements.saveProfileSpinner.classList.add('hidden');
                elements.saveProfileBtn.disabled = false;
                return;
            }
            
            if (newPasswordValue !== confirmNewPasswordValue) {
                showNotification('New passwords do not match', 'error');
                elements.saveProfileSpinner.classList.add('hidden');
                elements.saveProfileBtn.disabled = false;
                return;
            }
            
            await currentUser.updatePassword(newPasswordValue);
        }
        
        // Reload user data
        await loadUserData();
        
        showNotification('Profile updated successfully!', 'success');
        closeProfileEditModal();
        
    } catch (error) {
        console.error('Profile update error:', error);
        let errorMessage = 'Failed to update profile. Please try again.';
        
        switch(error.code) {
            case 'auth/wrong-password':
                errorMessage = 'Current password is incorrect.';
                break;
            case 'auth/email-already-in-use':
                errorMessage = 'Email already in use. Please use a different email.';
                break;
            case 'auth/requires-recent-login':
                errorMessage = 'Please login again to change your email or password.';
                break;
        }
        
        showNotification(errorMessage, 'error');
    } finally {
        elements.saveProfileSpinner.classList.add('hidden');
        elements.saveProfileBtn.disabled = false;
    }
}

function togglePasswordVisibility(passwordFieldId, toggleButton) {
    const passwordField = document.getElementById(passwordFieldId);
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    
    const icon = toggleButton.querySelector('i');
    if (type === 'text') {
        icon.className = 'fas fa-eye-slash';
    } else {
        icon.className = 'fas fa-eye';
    }
}

function updateThemeIcon(isDark) {
    const icon = elements.themeToggle.querySelector('i');
    
    if (isDark) {
        icon.className = 'fas fa-sun text-yellow-400';
        elements.themeToggle.title = 'Switch to light mode';
    } else {
        icon.className = 'fas fa-moon text-gray-600';
        elements.themeToggle.title = 'Switch to dark mode';
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('dailyEarningTheme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
    showNotification(`Switched to ${isDark ? 'dark' : 'light'} mode`, 'info');
}

function showNotification(message, type = 'info') {
    elements.notificationText.innerHTML = message;
    
    const notificationDiv = elements.notification.querySelector('div');
    notificationDiv.className = 'text-white p-4 rounded-xl shadow-lg flex items-center notification-slide';
    
    switch(type) {
        case 'success':
            notificationDiv.classList.add('bg-gradient-to-r', 'from-green-500', 'to-emerald-600');
            break;
        case 'error':
            notificationDiv.classList.add('bg-gradient-to-r', 'from-red-500', 'to-pink-600');
            break;
        case 'warning':
            notificationDiv.classList.add('bg-gradient-to-r', 'from-yellow-500', 'to-orange-600');
            break;
        default:
            notificationDiv.classList.add('bg-gradient-to-r', 'from-blue-500', 'to-indigo-600');
    }
    
    elements.notification.classList.remove('hidden');
    
    setTimeout(() => {
        elements.notification.classList.add('hidden');
    }, 3000);
}


// Deposit and Withdraw Functions
function setupDepositWithdrawEvents() {
    // Deposit Button Event
    document.getElementById('depositBtn').addEventListener('click', openDepositModal);
    document.getElementById('closeDepositModal').addEventListener('click', closeDepositModal);
    document.getElementById('cancelDeposit').addEventListener('click', closeDepositModal);
    document.getElementById('depositForm').addEventListener('submit', handleDeposit);
    
    // Withdraw Button Event
    document.getElementById('withdrawBtn').addEventListener('click', openWithdrawModal);
    document.getElementById('closeWithdrawModal').addEventListener('click', closeWithdrawModal);
    document.getElementById('cancelWithdraw').addEventListener('click', closeWithdrawModal);
    document.getElementById('withdrawForm').addEventListener('submit', handleWithdraw);
    
    // Success Modals Events
    document.getElementById('closeDepositSuccessBtn').addEventListener('click', closeDepositSuccessModal);
    document.getElementById('closeDepositSuccess').addEventListener('click', closeDepositSuccessModal);
    document.getElementById('closeWithdrawSuccessBtn').addEventListener('click', closeWithdrawSuccessModal);
    document.getElementById('closeWithdrawSuccess').addEventListener('click', closeWithdrawSuccessModal);
    
    // Back to Home button
    document.getElementById('goBackBtn').addEventListener('click', closeWithdrawModal);
}

function openDepositModal() {
    if (!currentUser || !userData) {
        showNotification('Please login first!', 'error');
        return;
    }
    
    // Reset form
    document.getElementById('depositForm').reset();
    
    // Show modal
    document.getElementById('depositModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeDepositModal() {
    document.getElementById('depositModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function openWithdrawModal() {
    if (!currentUser || !userData) {
        showNotification('Please login first!', 'error');
        return;
    }
    
    // Reset form
    document.getElementById('withdrawForm').reset();
    
    // Show modal
    document.getElementById('withdrawModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Check withdrawal eligibility
    checkWithdrawalEligibility();
}

function closeWithdrawModal() {
    document.getElementById('withdrawModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function checkWithdrawalEligibility() {
    // Show loading status
    document.getElementById('withdrawStatus').classList.remove('hidden');
    document.getElementById('withdrawStatus').classList.add('flex', 'flex-col');
    document.getElementById('statusMessage').textContent = 'Checking eligibility...';
    document.getElementById('eligibleMessage').classList.add('hidden');
    document.getElementById('notEligibleMessage').classList.add('hidden');
    document.getElementById('withdrawFormFields').classList.add('hidden');
    document.getElementById('backToHomeBtn').classList.add('hidden');
    
    // Get current balance and referral count
    const currentBalance = userData.balance || 0;
    const successfulReferrals = userData.successfulReferrals || 0;
    const requiredReferrals = 20;
    const minBalance = 500;
    
    // Update display
    document.getElementById('currentBalanceDisplay').textContent = `৳${currentBalance}`;
    document.getElementById('referralCountDisplay').textContent = `${successfulReferrals}/${requiredReferrals}`;
    document.getElementById('availableBalance').textContent = `৳${currentBalance}`;
    
    // Check balance requirement
    const balanceCheckElement = document.getElementById('balanceCheck');
    const balanceStatusElement = document.getElementById('balanceStatus');
    
    if (currentBalance >= minBalance) {
        balanceCheckElement.classList.add('border-green-200', 'dark:border-green-800', 'bg-green-50', 'dark:bg-green-900/20');
        balanceCheckElement.classList.remove('border-red-200', 'dark:border-red-800', 'bg-red-50', 'dark:bg-red-900/20');
        balanceStatusElement.textContent = '✓ Eligible';
        balanceStatusElement.className = 'text-sm text-green-600 dark:text-green-400';
    } else {
        balanceCheckElement.classList.add('border-red-200', 'dark:border-red-800', 'bg-red-50', 'dark:bg-red-900/20');
        balanceCheckElement.classList.remove('border-green-200', 'dark:border-green-800', 'bg-green-50', 'dark:bg-green-900/20');
        balanceStatusElement.textContent = `Need ৳${minBalance - currentBalance} more`;
        balanceStatusElement.className = 'text-sm text-red-600 dark:text-red-400';
    }
    
    // Check referral requirement
    const referralCheckElement = document.getElementById('referralCheck');
    const referralStatusElement = document.getElementById('referralStatus');
    
    if (successfulReferrals >= requiredReferrals) {
        referralCheckElement.classList.add('border-green-200', 'dark:border-green-800', 'bg-green-50', 'dark:bg-green-900/20');
        referralCheckElement.classList.remove('border-red-200', 'dark:border-red-800', 'bg-red-50', 'dark:bg-red-900/20');
        referralStatusElement.textContent = '✓ Eligible';
        referralStatusElement.className = 'text-sm text-green-600 dark:text-green-400';
    } else {
        referralCheckElement.classList.add('border-red-200', 'dark:border-red-800', 'bg-red-50', 'dark:bg-red-900/20');
        referralCheckElement.classList.remove('border-green-200', 'dark:border-green-800', 'bg-green-50', 'dark:bg-green-900/20');
        referralStatusElement.textContent = `Need ${requiredReferrals - successfulReferrals} more`;
        referralStatusElement.className = 'text-sm text-red-600 dark:text-red-400';
    }
    
    // Simulate API call delay
    setTimeout(() => {
        document.getElementById('withdrawStatus').classList.add('hidden');
        
        // Check if both requirements are met
        if (currentBalance >= minBalance && successfulReferrals >= requiredReferrals) {
            document.getElementById('eligibleMessage').classList.remove('hidden');
            document.getElementById('withdrawFormFields').classList.remove('hidden');
            
            // Update available balance
            document.getElementById('availableBalance').textContent = `৳${currentBalance}`;
            
            // Set max withdrawal amount
            const withdrawAmountInput = document.getElementById('withdrawAmount');
            withdrawAmountInput.max = currentBalance;
            withdrawAmountInput.value = Math.min(currentBalance, 500); // Default to min or available
            
            // Calculate initial amounts
            calculateWithdrawAmount();
            
        } else {
            document.getElementById('notEligibleMessage').classList.remove('hidden');
            document.getElementById('backToHomeBtn').classList.remove('hidden');
            
            // Show reason
            const reasons = [];
            if (currentBalance < minBalance) {
                reasons.push(`Minimum balance ৳${minBalance} required`);
            }
            if (successfulReferrals < requiredReferrals) {
                reasons.push(`${requiredReferrals} successful referrals required`);
            }
            
            document.getElementById('notEligibleReason').textContent = 
                `You need to complete: ${reasons.join(' and ')}`;
        }
    }, 1500);
}

function calculateWithdrawAmount() {
    const withdrawAmount = parseFloat(document.getElementById('withdrawAmount').value) || 0;
    const transactionFee = 10;
    const netAmount = withdrawAmount - transactionFee;
    
    document.getElementById('displayWithdrawAmount').textContent = `৳${withdrawAmount}`;
    document.getElementById('transactionFee').textContent = `৳${transactionFee}`;
    document.getElementById('netAmount').textContent = `৳${netAmount > 0 ? netAmount : 0}`;
}

async function handleDeposit(e) {
    e.preventDefault();
    
    const depositAmount = parseFloat(document.getElementById('depositAmount').value);
    const transactionId = document.getElementById('transactionId').value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value;
    const senderNumber = document.getElementById('senderNumber').value.trim();
    
    // Validation
    if (!depositAmount || depositAmount < 10) {
        showNotification('Minimum deposit amount is ৳10', 'error');
        return;
    }
    
    if (!transactionId) {
        showNotification('Please enter transaction ID', 'error');
        return;
    }
    
    if (!paymentMethod) {
        showNotification('Please select payment method', 'error');
        return;
    }
    
    if (!senderNumber || senderNumber.length < 11) {
        showNotification('Please enter valid phone number', 'error');
        return;
    }
    
    try {
        // Show loading spinner
        document.getElementById('depositSpinner').classList.remove('hidden');
        document.getElementById('submitDepositBtn').disabled = true;
        
        // Create deposit record
        const depositData = {
            userId: currentUser.uid,
            amount: depositAmount,
            transactionId: transactionId,
            paymentMethod: paymentMethod,
            senderNumber: senderNumber,
            receiverNumber: '01749666991',
            status: 'pending',
            timestamp: new Date().toISOString(),
            userName: userData.fullName,
            userEmail: userData.email
        };
        
        // Save to database
        const depositRef = database.ref('deposits').push();
        await depositRef.set(depositData);
        
        // Update user's pending deposits
        const userRef = database.ref('users/' + currentUser.uid);
        const userSnapshot = await userRef.once('value');
        const currentUserData = userSnapshot.val();
        
        const pendingDeposits = currentUserData.pendingDeposits || [];
        pendingDeposits.push({
            id: depositRef.key,
            amount: depositAmount,
            timestamp: new Date().toISOString()
        });
        
        await userRef.update({
            pendingDeposits: pendingDeposits,
            totalDeposits: (currentUserData.totalDeposits || 0) + 1
        });
        
        // Send notification to admin (simulated)
        const notificationData = {
            type: 'new_deposit',
            title: 'New Deposit Request',
            message: `${userData.fullName} requested ৳${depositAmount} deposit`,
            userId: currentUser.uid,
            depositId: depositRef.key,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        await database.ref('admin_notifications').push(notificationData);
        
        // Close deposit modal
        closeDepositModal();
        
        // Show success modal
        showDepositSuccess(depositAmount, paymentMethod, transactionId);
        
        // Send confirmation notification
        showNotification(`Deposit request submitted! Amount: ৳${depositAmount}`, 'success');
        
    } catch (error) {
        console.error('Deposit error:', error);
        showNotification('Failed to submit deposit request. Please try again.', 'error');
    } finally {
        document.getElementById('depositSpinner').classList.add('hidden');
        document.getElementById('submitDepositBtn').disabled = false;
    }
}

async function handleWithdraw(e) {
    e.preventDefault();
    
    const withdrawAmount = parseFloat(document.getElementById('withdrawAmount').value);
    const withdrawMethod = document.getElementById('withdrawMethod').value;
    const accountNumber = document.getElementById('accountNumber').value.trim();
    const accountName = document.getElementById('accountName').value.trim();
    const transactionFee = 10;
    const netAmount = withdrawAmount - transactionFee;
    
    // Validation
    if (!withdrawAmount || withdrawAmount < 500) {
        showNotification('Minimum withdrawal amount is ৳500', 'error');
        return;
    }
    
    if (withdrawAmount > userData.balance) {
        showNotification('Insufficient balance', 'error');
        return;
    }
    
    if (!withdrawMethod) {
        showNotification('Please select payment method', 'error');
        return;
    }
    
    if (!accountNumber) {
        showNotification('Please enter account number', 'error');
        return;
    }
    
    if (!accountName) {
        showNotification('Please enter account holder name', 'error');
        return;
    }
    
    // Check eligibility again
    if (userData.balance < 500 || (userData.successfulReferrals || 0) < 20) {
        showNotification('You are not eligible for withdrawal', 'error');
        return;
    }
    
    try {
        // Show loading spinner
        document.getElementById('withdrawSpinner').classList.remove('hidden');
        document.getElementById('submitWithdrawBtn').disabled = true;
        
        // Create withdrawal record
        const withdrawData = {
            userId: currentUser.uid,
            amount: withdrawAmount,
            netAmount: netAmount,
            transactionFee: transactionFee,
            paymentMethod: withdrawMethod,
            accountNumber: accountNumber,
            accountName: accountName,
            status: 'pending',
            timestamp: new Date().toISOString(),
            userName: userData.fullName,
            userEmail: userData.email,
            userPhone: userData.phone || '',
            successfulReferrals: userData.successfulReferrals || 0
        };
        
        // Save to database
        const withdrawRef = database.ref('withdrawals').push();
        await withdrawRef.set(withdrawData);
        
        // Update user balance and withdrawals
        const userRef = database.ref('users/' + currentUser.uid);
        const userSnapshot = await userRef.once('value');
        const currentUserData = userSnapshot.val();
        
        const pendingWithdrawals = currentUserData.pendingWithdrawals || [];
        pendingWithdrawals.push({
            id: withdrawRef.key,
            amount: withdrawAmount,
            netAmount: netAmount,
            timestamp: new Date().toISOString()
        });
        
        await userRef.update({
            balance: (currentUserData.balance || 0) - withdrawAmount,
            pendingWithdrawals: pendingWithdrawals,
            totalWithdrawals: (currentUserData.totalWithdrawals || 0) + 1,
            totalWithdrawalAmount: (currentUserData.totalWithdrawalAmount || 0) + withdrawAmount
        });
        
        // Update local user data
        userData.balance -= withdrawAmount;
        updateUserInterface();
        
        // Send notification to admin
        const notificationData = {
            type: 'new_withdrawal',
            title: 'New Withdrawal Request',
            message: `${userData.fullName} requested ৳${withdrawAmount} withdrawal`,
            userId: currentUser.uid,
            withdrawalId: withdrawRef.key,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        await database.ref('admin_notifications').push(notificationData);
        
        // Close withdraw modal
        closeWithdrawModal();
        
        // Show success modal
        showWithdrawSuccess(withdrawAmount, withdrawMethod, accountNumber, netAmount);
        
        // Send confirmation notification
        showNotification(`Withdrawal request submitted! You will receive ৳${netAmount}`, 'success');
        
    } catch (error) {
        console.error('Withdrawal error:', error);
        showNotification('Failed to submit withdrawal request. Please try again.', 'error');
    } finally {
        document.getElementById('withdrawSpinner').classList.add('hidden');
        document.getElementById('submitWithdrawBtn').disabled = false;
    }
}

function showDepositSuccess(amount, method, transactionId) {
    // Update success modal content
    document.getElementById('successDepositAmount').textContent = `৳${amount}`;
    document.getElementById('successPaymentMethod').textContent = getPaymentMethodName(method);
    document.getElementById('successTransactionId').textContent = transactionId;
    
    // Show success modal
    document.getElementById('depositSuccessModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeDepositSuccessModal() {
    document.getElementById('depositSuccessModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function showWithdrawSuccess(amount, method, accountNumber, netAmount) {
    // Update success modal content
    document.getElementById('successWithdrawAmount').textContent = `৳${amount}`;
    document.getElementById('successWithdrawMethod').textContent = getPaymentMethodName(method);
    document.getElementById('successAccountNumber').textContent = accountNumber;
    document.getElementById('successNetAmount').textContent = `৳${netAmount}`;
    
    // Show success modal
    document.getElementById('withdrawSuccessModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeWithdrawSuccessModal() {
    document.getElementById('withdrawSuccessModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function getPaymentMethodName(method) {
    const methods = {
        'bkash': 'বিকাশ',
        'nagad': 'নগদ',
        'bank': 'Bank Account'
    };
    return methods[method] || method;
}

// Initialize deposit/withdraw events when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupDepositWithdrawEvents();
});



// Update the initializeApp function or add this in DOMContentLoaded
function initializeApp() {
    const savedTheme = localStorage.getItem('dailyEarningTheme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark');
        updateThemeIcon(true);
    }
    
    // Initialize deposit/withdraw events
    setupDepositWithdrawEvents();
}

// রেফারেল কাউন্ট আপডেট ফাংশন
async function updateReferralCount() {
    if (!currentUser) return;
    
    try {
        // Count successful referrals from referrals collection
        const referralsSnapshot = await database.ref(`referrals/${currentUser.uid}`).once('value');
        const referrals = referralsSnapshot.val();
        
        let successfulReferrals = 0;
        let activeReferrals = 0;
        
        if (referrals) {
            Object.keys(referrals).forEach(key => {
                const referral = referrals[key];
                if (referral.status === 'completed' || referral.isActive) {
                    successfulReferrals++;
                    
                    // Check if referred user is still active
                    if (referral.isActive) {
                        activeReferrals++;
                    }
                }
            });
        }
        
        // Update user data with actual counts
        await database.ref('users/' + currentUser.uid).update({
            successfulReferrals: successfulReferrals,
            activeReferrals: activeReferrals,
            referrals: successfulReferrals // Update referrals count too
        });
        
        // Update local userData
        userData.successfulReferrals = successfulReferrals;
        userData.activeReferrals = activeReferrals;
        userData.referrals = successfulReferrals;
        
    } catch (error) {
        console.error('Error updating referral count:', error);
    }
}
// রেফারেল ট্র্যাকিং সিস্টেম সেটআপ
async function setupReferralTracking() {
    if (!currentUser) return;
    
    // Check if user has pending referral from localStorage
    const pendingReferral = localStorage.getItem('pendingReferralCode');
    if (pendingReferral) {
        // If user logged in with a referral code pending
        if (pendingReferral.startsWith('ref_')) {
            const referrerId = pendingReferral.substring(4);
            try {
                const referrerSnapshot = await database.ref('users/' + referrerId).once('value');
                if (referrerSnapshot.exists()) {
                    // Check if this referral already processed
                    const referralCheck = await database.ref(`referrals/${referrerId}/${currentUser.uid}`).once('value');
                    if (!referralCheck.exists()) {
                        // Process referral reward
                        await processReferralReward(referrerId, currentUser.uid, pendingReferral);
                        
                        // Update current user's data to show who referred them
                        await database.ref('users/' + currentUser.uid).update({
                            referredBy: referrerId,
                            referralSource: pendingReferral
                        });
                    }
                }
            } catch (error) {
                console.error('Error processing pending referral:', error);
            }
        }
        localStorage.removeItem('pendingReferralCode');
    }
}
// রেফারেল স্ট্যাটস দেখানোর ফাংশন
async function showReferralStats() {
    if (!currentUser) {
        showNotification('Please login first!', 'error');
        return;
    }
    
    try {
        // Fetch referral details
        const referralsSnapshot = await database.ref(`referrals/${currentUser.uid}`).once('value');
        const referrals = referralsSnapshot.val();
        
        let totalEarned = 0;
        let referralList = [];
        
        if (referrals) {
            Object.keys(referrals).forEach(key => {
                const referral = referrals[key];
                referralList.push({
                    userId: key,
                    reward: referral.reward || 20,
                    timestamp: referral.timestamp,
                    status: referral.status || 'completed'
                });
                totalEarned += referral.reward || 20;
            });
        }
        
        // Create stats modal
        const statsHTML = `
            <div class="modal-overlay" id="referralStatsModal">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3 class="modal-title">📊 Referral Statistics</h3>
                        <button class="modal-close" id="closeReferralStats">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="space-y-4">
                        <!-- Summary Stats -->
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                                <p class="text-sm text-blue-600 dark:text-blue-400">Total Referrals</p>
                                <p class="text-2xl font-bold">${referralList.length}</p>
                            </div>
                            <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl">
                                <p class="text-sm text-green-600 dark:text-green-400">Total Earned</p>
                                <p class="text-2xl font-bold">৳${totalEarned}</p>
                            </div>
                        </div>
                        
                        <!-- Requirements -->
                        <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-xl">
                            <div class="flex items-center mb-2">
                                <i class="fas fa-info-circle text-yellow-600 dark:text-yellow-400 mr-2"></i>
                                <p class="font-medium">Withdrawal Requirements</p>
                            </div>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <span>Minimum Referrals:</span>
                                    <span class="font-bold ${referralList.length >= 20 ? 'text-green-600' : 'text-red-600'}">
                                        ${referralList.length}/20
                                    </span>
                                </div>
                                <div class="text-xs text-gray-600 dark:text-gray-400">
                                    ${referralList.length >= 20 
                                        ? '✅ You meet the referral requirement for withdrawal!' 
                                        : `You need ${20 - referralList.length} more referrals for withdrawal`}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Referral List -->
                        <div>
                            <h4 class="font-bold mb-3">Your Referrals</h4>
                            ${referralList.length > 0 ? `
                                <div class="space-y-3 max-h-60 overflow-y-auto">
                                    ${referralList.map((ref, index) => `
                                        <div class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl">
                                            <div>
                                                <p class="font-medium">Referred User #${index + 1}</p>
                                                <p class="text-xs text-gray-500">${new Date(ref.timestamp).toLocaleDateString()}</p>
                                            </div>
                                            <div class="text-right">
                                                <p class="font-bold text-green-600">+৳${ref.reward}</p>
                                                <p class="text-xs ${ref.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}">
                                                    ${ref.status}
                                                </p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <div class="text-center py-8">
                                    <i class="fas fa-users text-4xl text-gray-400 mb-3"></i>
                                    <p class="text-gray-500">No referrals yet</p>
                                    <p class="text-sm text-gray-400 mt-2">Share your referral link to earn</p>
                                </div>
                            `}
                        </div>
                        
                        <!-- Close Button -->
                        <button id="closeStatsBtn" class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = statsHTML;
        document.body.appendChild(modalContainer.firstElementChild);
        
        // Add event listeners
        document.getElementById('closeReferralStats').addEventListener('click', () => {
            const modal = document.getElementById('referralStatsModal');
            if (modal) modal.remove();
        });
        
        document.getElementById('closeStatsBtn').addEventListener('click', () => {
            const modal = document.getElementById('referralStatsModal');
            if (modal) modal.remove();
        });
        
        // Close when clicking outside
        modalContainer.firstElementChild.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                const modal = document.getElementById('referralStatsModal');
                if (modal) modal.remove();
            }
        });
        
    } catch (error) {
        console.error('Error loading referral stats:', error);
        showNotification('Error loading referral statistics', 'error');
    }
}
// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    checkForReferralInURL();
    
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            loadUserData();
        } else {
            showAuthPages();
        }
    });
});
// Save task progress to Firebase
async function saveTaskProgressToFirebase() {
    if (!currentUser) return;
    
    try {
        const userTaskProgress = JSON.parse(localStorage.getItem(`taskProgress_${currentUser.uid}`)) || {};
        await database.ref(`taskProgress/${currentUser.uid}`).set(userTaskProgress);
    } catch (error) {
        console.error('Error saving task progress:', error);
    }
}

// Load task progress from Firebase
async function loadTaskProgressFromFirebase() {
    if (!currentUser) return;
    
    try {
        const snapshot = await database.ref(`taskProgress/${currentUser.uid}`).once('value');
        const firebaseTaskProgress = snapshot.val();
        
        if (firebaseTaskProgress) {
            // Merge with local storage
            const localTaskProgress = JSON.parse(localStorage.getItem(`taskProgress_${currentUser.uid}`)) || {};
            const mergedProgress = { ...firebaseTaskProgress, ...localTaskProgress };
            
            // Save merged progress
            localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(mergedProgress));
            await database.ref(`taskProgress/${currentUser.uid}`).set(mergedProgress);
        }
    } catch (error) {
        console.error('Error loading task progress:', error);
    }
}

// Load user data ফাংশনে যোগ করুন
async function loadUserData() {
    if (!currentUser) return;
    
    try {
        const snapshot = await database.ref('users/' + currentUser.uid).once('value');
        userData = snapshot.val();
        
        if (!userData) {
            // ... existing code ...
        } else {
            // ... existing code ...
            
            // Load task progress from Firebase
            await loadTaskProgressFromFirebase();
        }
        
        updateUserInterface();
        showMainApp();
        
        // Check for pending referrals
        await setupReferralTracking();
        
    } catch (error) {
        console.error('Error loading user data:', error);
        showNotification('Error loading user data', 'error');
    }
}

// Task unlock/download ফাংশনে Firebase save যোগ করুন
async function handleTaskUnlock(taskId) {
    // ... existing code ...
    
    // Save to Firebase
    await saveTaskProgressToFirebase();
    
    // ... rest of the code ...
}

async function handleTaskDownload(taskId) {
    // ... existing code ...
    
    // Save to Firebase
    await saveTaskProgressToFirebase();
    
    // ... rest of the code ...
}



// টেস্ট ফাংশন - ডিবাগ করার জন্য
function testUnlockButton() {
    console.log('Testing unlock button...');
    
    // টাস্ক প্রোগ্রেস রিসেট
    if (currentUser) {
        const userTaskProgress = {};
        localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(userTaskProgress));
        console.log('Task progress reset');
    }
    
    // UI রিফ্রেশ
    loadAllTasks();
    
    // প্রথম টাস্কের আনলক বাটন খুঁজুন
    const unlockBtn = document.querySelector('.task-unlock-btn');
    if (unlockBtn) {
        console.log('Unlock button found:', unlockBtn);
        unlockBtn.style.border = '2px solid red';
        setTimeout(() => {
            unlockBtn.style.border = '';
        }, 2000);
    } else {
        console.log('Unlock button NOT found');
    }
}

// ব্রাউজার কনসোলে টেস্ট করার জন্য
window.testTasks = function() {
    console.log('=== TASK SYSTEM DEBUG ===');
    console.log('Current User:', currentUser?.uid);
    
    if (currentUser) {
        const progress = JSON.parse(localStorage.getItem(`taskProgress_${currentUser.uid}`)) || {};
        console.log('Task Progress:', progress);
        
        // টেস্ট বাটন যোগ করুন
        const testBtn = document.createElement('button');
        testBtn.innerHTML = '🧪 Test Task 1';
        testBtn.style.cssText = 'position: fixed; top: 100px; right: 20px; z-index: 9999; background: #f00; color: white; padding: 10px; border-radius: 5px;';
        testBtn.onclick = () => handleTaskUnlock(1);
        document.body.appendChild(testBtn);
        
        const testBtn2 = document.createElement('button');
        testBtn2.innerHTML = '🧪 Test Download 1';
        testBtn2.style.cssText = 'position: fixed; top: 140px; right: 20px; z-index: 9999; background: #0f0; color: white; padding: 10px; border-radius: 5px;';
        testBtn2.onclick = () => handleTaskDownload(1);
        document.body.appendChild(testBtn2);
    }
};

// পেজ লোড হওয়ার পর ডিবাগ ইনিশিয়ালাইজ করুন
document.addEventListener('DOMContentLoaded', function() {
    // 3 সেকেন্ড পর ডিবাগ মোড চালু করুন
    setTimeout(() => {
        window.testTasks();
    }, 3000);
});
