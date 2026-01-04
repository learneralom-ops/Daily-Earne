
// Global Variables
let currentUser = null;
let userData = null;
let selectedProfilePicture = null;
let countdownInterval = null;
let countdownSeconds = 15;
let isVideoAd = false;
let referralCodeFromUrl = null;
let activeTaskTimers = {};

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
    closeProfileEditModal: document.getElementById('closeProfileEditModal'),
    
    // Deposit/Withdraw Elements
    depositBtn: document.getElementById('depositBtn'),
    withdrawBtn: document.getElementById('withdrawBtn'),
    depositModal: document.getElementById('depositModal'),
    withdrawModal: document.getElementById('withdrawModal'),
    depositSuccessModal: document.getElementById('depositSuccessModal'),
    withdrawSuccessModal: document.getElementById('withdrawSuccessModal')
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

// Placeholder function for show_8954258 ads
function show_8954258(type = 'interstitial') {
    return new Promise((resolve) => {
        console.log(`Showing ad: ${type}`);
        // Simulate ad loading and completion
        setTimeout(resolve, 1500);
    });
}

function checkForReferralInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    
    if (referralCode) {
        referralCodeFromUrl = referralCode;
        localStorage.setItem('pendingReferralCode', referralCode);
        
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
        
        let referrerId = null;
        let usedReferralCode = null;
        
        if (referralCode) {
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
            referrer: referrerId,
            referralCode: `ref_${currentUser.uid}`,
            signupTimestamp: new Date().toISOString(),
            isActive: true
        };
        
        await database.ref('users/' + currentUser.uid).set(userData);
        
        if (referrerId) {
            await processReferralReward(referrerId, currentUser.uid, usedReferralCode);
            
            localStorage.removeItem('pendingReferralCode');
            referralCodeFromUrl = null;
            
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
        const reward = 20;
        
        const referrerRef = database.ref('users/' + referrerId);
        const referrerSnapshot = await referrerRef.once('value');
        const referrerData = referrerSnapshot.val();
        
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
        
        const referralRecord = {
            referrerId: referrerId,
            referredUserId: referredUserId,
            referralCode: referralCode,
            reward: reward,
            timestamp: new Date().toISOString(),
            status: 'completed',
            isActive: true
        };
        
        await database.ref(`referrals/${referrerId}/${referredUserId}`).set(referralRecord);
        
        await database.ref('all_referrals/' + referredUserId).set({
            referrerId: referrerId,
            referralCode: referralCode,
            timestamp: new Date().toISOString()
        });
        
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
                referralCode: `ref_${currentUser.uid}`
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
            
            await updateReferralCount();
            await loadTaskProgressFromFirebase();
        }
        
        updateUserInterface();
        showMainApp();
        
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
            checkActiveTaskTimers();
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
    if (!elements.allTasksList || !currentUser) return;
    
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
    
    const userTaskProgress = JSON.parse(localStorage.getItem(`taskProgress_${currentUser.uid}`)) || {};
    
    tasks.forEach(task => {
        const taskData = userTaskProgress[task.id] || {
            unlockCount: 0,
            completed: false,
            timerActive: false,
            timeRemaining: 0,
            lastUnlockTime: null
        };
        
        if (taskData.completed) completedCount++;
        
        const isUnlocked = taskData.unlockCount >= 10;
        const showTimer = taskData.timerActive && taskData.timeRemaining > 0;
        
        const taskElement = document.createElement('div');
        taskElement.className = `glass-card rounded-2xl p-4 border border-gray-200 dark:border-gray-700 mb-4`;
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
                    <p class="font-bold text-green-600 dark:text-green-400">ফ্রি DOWNLOAD </p>
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
                        `${10 - taskData.unlockCount} more unlocks needed for download` : 
                        '✅ Ready to download!'}
                </p>
            </div>
            
            <div class="space-y-2">
                ${showTimer ? `
                    <button class="w-full bg-gray-400 dark:bg-gray-600 text-white font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center" disabled>
                        <div class="loader mr-2" style="width: 20px; height: 20px;"></div>
                        Wait ${taskData.timeRemaining}s
                    </button>
                ` : isUnlocked ? `
                    <button class="task-download-btn w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition flex items-center justify-center" 
                            data-task-id="${task.id}">
                        <i class="fas fa-download mr-2"></i> DOWNLOAD
                    </button>
                ` : `
                    <button class="task-unlock-btn w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition flex items-center justify-center" 
                            data-task-id="${task.id}">
                        <i class="fas fa-lock mr-2"></i> UNLOCK (${taskData.unlockCount + 0}/10)
                    </button>
                `}
            </div>
        `;
        elements.allTasksList.appendChild(taskElement);
    });
    
    elements.tasksProgress.textContent = `${completedCount}/${tasks.length}`;
    
    attachTaskEventListeners();
}

function attachTaskEventListeners() {
    // Remove existing event listeners first
    document.querySelectorAll('.task-unlock-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    document.querySelectorAll('.task-download-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    // Add new event listeners for UNLOCK buttons
    document.querySelectorAll('.task-unlock-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const taskId = parseInt(this.getAttribute('data-task-id'));
            handleTaskUnlock(taskId);
        });
    });
    
    // Add new event listeners for DOWNLOAD buttons
    document.querySelectorAll('.task-download-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const taskId = parseInt(this.getAttribute('data-task-id'));
            handleTaskDownload(taskId);
        });
    });
}

function handleTaskUnlock(taskId) {
    if (!currentUser) {
        showNotification('Please login first!', 'error');
        return;
    }
    
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
    
    const userTaskProgress = JSON.parse(localStorage.getItem(`taskProgress_${currentUser.uid}`)) || {};
    const taskData = userTaskProgress[taskId] || {
        unlockCount: 0,
        completed: false,
        timerActive: false,
        timeRemaining: 0,
        lastUnlockTime: null
    };
    
    if (taskData.timerActive && taskData.timeRemaining > 0) {
        showNotification(`Please wait ${taskData.timeRemaining} seconds!`, 'warning');
        return;
    }
    
    // সরাসরি UNLOCK প্রসেস শুরু করি
    taskData.unlockCount = (taskData.unlockCount || 0) + 1;
    taskData.timerActive = true;
    taskData.timeRemaining = 30; // ৩০ সেকেন্ড রাখলাম
    taskData.lastUnlockTime = Date.now();
    
    userTaskProgress[taskId] = taskData;
    localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(userTaskProgress));
    
    const remainingUnlocks = 10 - taskData.unlockCount;
    if (remainingUnlocks > 0) {
        showNotification(`Unlock ${taskData.unlockCount}/5 completed! ${remainingUnlocks} more to go.`, 'info');
    } else {
        showNotification('🎉 All unlocks completed! Now you can download.', 'success');
    }
    
    // UNLOCK link ওপেন করি (নতুন ট্যাবে ওপেন হবে, ব্যাক হবে না)
    const linkIndex = taskData.unlockCount % task.unlockLinks.length;
    const unlockLink = task.unlockLinks[linkIndex];
    
    // নতুন ট্যাবে লিংক ওপেন করুন
    window.open(unlockLink, '_blank', 'noopener,noreferrer');
    
    loadAllTasks();
    startTaskTimer(taskId);
    saveTaskProgressToFirebase();
}

function startTaskTimer(taskId) {
    if (activeTaskTimers[taskId]) {
        clearInterval(activeTaskTimers[taskId]);
    }
    
    activeTaskTimers[taskId] = setInterval(() => {
        const userTaskProgress = JSON.parse(localStorage.getItem(`taskProgress_${currentUser.uid}`)) || {};
        const taskData = userTaskProgress[taskId];
        
        if (!taskData || !taskData.timerActive) {
            clearInterval(activeTaskTimers[taskId]);
            delete activeTaskTimers[taskId];
            return;
        }
        
        if (taskData.timeRemaining > 1) {
            taskData.timeRemaining--;
            userTaskProgress[taskId] = taskData;
            localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(userTaskProgress));
            
            if (document.getElementById('tasksPage').classList.contains('active')) {
                updateTaskTimerUI(taskId, taskData.timeRemaining);
            }
        } else {
            taskData.timerActive = false;
            taskData.timeRemaining = 0;
            userTaskProgress[taskId] = taskData;
            localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(userTaskProgress));
            
            clearInterval(activeTaskTimers[taskId]);
            delete activeTaskTimers[taskId];
            
            if (document.getElementById('tasksPage').classList.contains('active')) {
                loadAllTasks();
                showNotification('Timer completed! You can proceed now.', 'info');
            }
        }
    }, 1000);
}

function updateTaskTimerUI(taskId, timeRemaining) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (!taskElement) return;
    
    const unlockBtn = taskElement.querySelector('.task-unlock-btn');
    const downloadBtn = taskElement.querySelector('.task-download-btn');
    
    if (unlockBtn) {
        unlockBtn.innerHTML = `<div class="loader mr-2" style="width: 20px; height: 20px;"></div> Wait ${timeRemaining}s`;
        unlockBtn.disabled = true;
        unlockBtn.className = "w-full bg-gray-400 dark:bg-gray-600 text-white font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center";
    }
    
    if (downloadBtn) {
        downloadBtn.innerHTML = `<div class="loader mr-2" style="width: 20px; height: 20px;"></div> Wait ${timeRemaining}s`;
        downloadBtn.disabled = true;
        downloadBtn.className = "w-full bg-gray-400 dark:bg-gray-600 text-white font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center";
    }
}

function checkActiveTaskTimers() {
    if (!currentUser) return;
    
    const userTaskProgress = JSON.parse(localStorage.getItem(`taskProgress_${currentUser.uid}`)) || {};
    
    Object.keys(userTaskProgress).forEach(taskId => {
        const taskData = userTaskProgress[taskId];
        if (taskData.timerActive && taskData.lastUnlockTime) {
            const timeElapsed = Math.floor((Date.now() - taskData.lastUnlockTime) / 1000);
            if (timeElapsed >= 30) {
                taskData.timerActive = false;
                taskData.timeRemaining = 0;
                userTaskProgress[taskId] = taskData;
                localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(userTaskProgress));
            } else {
                taskData.timeRemaining = 30 - timeElapsed;
                userTaskProgress[taskId] = taskData;
                localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(userTaskProgress));
                startTaskTimer(parseInt(taskId));
            }
        }
    });
}

async function handleTaskDownload(taskId) {
    if (!currentUser) {
        showNotification('Please login first!', 'error');
        return;
    }
    
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
    
    const userTaskProgress = JSON.parse(localStorage.getItem(`taskProgress_${currentUser.uid}`)) || {};
    const taskData = userTaskProgress[taskId] || {
        unlockCount: 0,
        completed: false,
        timerActive: false,
        timeRemaining: 0,
        lastUnlockTime: null
    };
    
    if (taskData.unlockCount < 10) {
        showNotification(`Please complete ${10 - taskData.unlockCount} more unlocks first!`, 'error');
        return;
    }
    
    if (taskData.timerActive && taskData.timeRemaining > 0) {
        showNotification(`Please wait ${taskData.timeRemaining} seconds!`, 'warning');
        return;
    }
    
    // নতুন ট্যাবে ডাউনলোড লিংক ওপেন করুন
    window.open(task.downloadLink, '_blank', 'noopener,noreferrer');
    
    taskData.timerActive = true;
    taskData.timeRemaining = 30; // ৩০ সেকেন্ড রাখলাম
    taskData.lastUnlockTime = Date.now();
    // completed স্টেট রিসেট করবেন না - বাটন হাইড হবে না
    // taskData.completed = true; // এই লাইন রিমুভ করুন
    
    userTaskProgress[taskId] = taskData;
    localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(userTaskProgress));
    
    showNotification('Download link opened! Return in 30 seconds to get reward.', 'info');
    
    loadAllTasks();
    startTaskTimer(taskId);
    
    setTimeout(async () => {
        try {
            // টাইমার বন্ধ করুন কিন্তু completed স্টেট সেট করবেন না
            taskData.timerActive = false;
            taskData.timeRemaining = 0;
            // unlockCount রিসেট করুন যাতে আবার শুরু করা যায়
            taskData.unlockCount = 0;
            
            userTaskProgress[taskId] = taskData;
            localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(userTaskProgress));
            
            const updates = {
                balance: (userData.balance || 0) + task.reward,
                totalEarnings: (userData.totalEarnings || 0) + task.reward,
                tasksCompleted: (userData.tasksCompleted || 0) + 1,
                monthlyTasks: (userData.monthlyTasks || 0) + 1
            };
            
            await database.ref('users/' + currentUser.uid).update(updates);
            
            userData = { ...userData, ...updates };
            updateUserInterface();
            
            loadAllTasks();
            
            showNotification(`🎉 Task completed! +৳${task.reward} added to your balance.`, 'success');
            
            saveTaskProgressToFirebase();
            
        } catch (error) {
            console.error('Error adding reward:', error);
            showNotification('Error processing reward. Please try again.', 'error');
        }
    }, 30000); // ৩০ সেকেন্ড রাখলাম
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
    
    if (userData.dailyAdsWatched >= 15) {
        showNotification('আজকের লিমিট শেষ! আগামীকাল আবার ট্রাই করুন।', 'error');
        return;
    }

    elements.adsLoadingOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    try {
        // সরলীকৃত version
        updateAdsProgress(1, 10);
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateAdsProgress(1, 100);
        
        updateAdsProgress(2, 10);
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateAdsProgress(2, 100);
        
        updateAdsProgress(3, 10);
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateAdsProgress(3, 100);

        elements.adsLoadingOverlay.classList.add('hidden');
        startCountdown();

    } catch (error) {
        console.error("Ad Sequence Error:", error);
        showNotification('অ্যাড দেখা সম্পন্ন হয়নি। আবার চেষ্টা করুন।', 'warning');
        
        elements.adsLoadingOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
        return;
    }
}

async function triggerVideoAd() {
    isVideoAd = true;
    
    const today = new Date().toDateString();
    const lastVideoDate = userData.lastVideoDate ? new Date(userData.lastVideoDate).toDateString() : null;
    
    if (lastVideoDate === today && userData.videosWatched >= 10) {
        showNotification('আজকের ভিডিও লিমিট শেষ! আগামীকাল আবার ট্রাই করুন।', 'error');
        return;
    }

    elements.videoAdLoadingOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    try {
        updateVideoProgress(10);
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 সেকেন্ডে ভিডিও দেখানো হচ্ছে বলে দেখানো
        updateVideoProgress(100);

        elements.videoAdLoadingOverlay.classList.add('hidden');
        startCountdown();

    } catch (error) {
        console.error("Video Ad Error:", error);
        showNotification('ভিডিও অ্যাড দেখা সম্পন্ন হয়নি। আবার চেষ্টা করুন।', 'warning');
        
        elements.videoAdLoadingOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
        return;
    }
}

function updateAdsProgress(step, progress) {
    elements.adsStep1.classList.remove('active', 'completed');
    elements.adsStep2.classList.remove('active', 'completed');
    elements.adsStep3.classList.remove('active', 'completed');
    
    if (step >= 1) elements.adsStep1.classList.add('completed');
    if (step >= 2) elements.adsStep2.classList.add('completed');
    if (step >= 3) elements.adsStep3.classList.add('completed');
    
    if (step === 1) elements.adsStep1.classList.add('active');
    if (step === 2) elements.adsStep2.classList.add('active');
    if (step === 3) elements.adsStep3.classList.add('active');
    
    const totalProgress = (step - 1) * 33 + progress;
    elements.adsProgressFill.style.width = `${totalProgress}%`;
}

function updateVideoProgress(progress) {
    elements.videoProgressFill.style.width = `${progress}%`;
}

function startCountdown() {
    countdownSeconds = 15;
    elements.countdownNumber.textContent = countdownSeconds;
    elements.remainingSeconds.textContent = countdownSeconds;
    
    elements.countdownOverlay.classList.remove('hidden');
    
    countdownInterval = setInterval(() => {
        countdownSeconds--;
        elements.countdownNumber.textContent = countdownSeconds;
        elements.remainingSeconds.textContent = countdownSeconds;
        
        if (countdownSeconds <= 0) {
            clearInterval(countdownInterval);
            endCountdown();
        }
    }, 1000);
}

function endCountdown() {
    elements.countdownOverlay.classList.add('hidden');
    
    if (isVideoAd) {
        rewardUserAfterVideoAd();
    } else {
        rewardUserAfterAds();
    }
    
    setTimeout(() => {
        showCelebration();
    }, 500);
}

async function rewardUserAfterAds() {
    const reward = 0.5;
    try {
        const updates = {};
        updates['balance'] = (userData.balance || 0) + reward;
        updates['totalEarnings'] = (userData.totalEarnings || 0) + reward;
        updates['dailyAdsWatched'] = (userData.dailyAdsWatched || 0) + 0.5;
        updates['lastAdsDate'] = new Date().toISOString();
        
        await database.ref('users/' + currentUser.uid).update(updates);
        
        userData = { ...userData, ...updates };
        updateUserInterface();
        
    } catch (err) {
        console.error('Reward error:', err);
        showNotification('টাকা যোগ করতে সমস্যা হয়েছে', 'error');
    }
}

async function rewardUserAfterVideoAd() {
    const reward = 0.5;
    try {
        const updates = {};
        updates['balance'] = (userData.balance || 0) + reward;
        updates['totalEarnings'] = (userData.totalEarnings || 0) + reward;
        updates['videosWatched'] = (userData.videosWatched || 0) + 0.5;
        updates['lastVideoDate'] = new Date().toISOString();
        
        await database.ref('users/' + currentUser.uid).update(updates);
        
        userData = { ...userData, ...updates };
        updateUserInterface();
        
    } catch (err) {
        console.error('Video reward error:', err);
        showNotification('টাকা যোগ করতে সমস্যা হয়েছে', 'error');
    }
}

function showCelebration() {
    createConfetti();
    
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
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    }
}

function closeCelebration() {
    elements.celebrationOverlay.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    const confettiElements = elements.celebrationOverlay.querySelectorAll('.confetti');
    confettiElements.forEach(confetti => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    });
    
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
    
    elements.editProfilePreview.src = userData.profilePicture;
    elements.editFullName.value = userData.fullName || '';
    elements.editEmail.value = userData.email || '';
    elements.editPhoneNumber.value = userData.phone || '';
    
    elements.currentPassword.value = '';
    elements.newPassword.value = '';
    elements.confirmNewPassword.value = '';
    
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
    
    if (!currentPasswordValue) {
        showNotification('Please enter your current password for verification', 'error');
        return;
    }
    
    try {
        const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, currentPasswordValue);
        await currentUser.reauthenticateWithCredential(credential);
        
        elements.saveProfileSpinner.classList.remove('hidden');
        elements.saveProfileBtn.disabled = true;
        
        let profilePicUrl = userData.profilePicture;
        
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
        
        await database.ref('users/' + currentUser.uid).update(updates);
        
        if (email !== currentUser.email) {
            await currentUser.updateEmail(email);
        }
        
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
    if (!document.getElementById('depositBtn')) return;
    
    document.getElementById('depositBtn').addEventListener('click', openDepositModal);
    document.getElementById('closeDepositModal').addEventListener('click', closeDepositModal);
    document.getElementById('cancelDeposit').addEventListener('click', closeDepositModal);
    document.getElementById('depositForm').addEventListener('submit', handleDeposit);
    
    document.getElementById('withdrawBtn').addEventListener('click', openWithdrawModal);
    document.getElementById('closeWithdrawModal').addEventListener('click', closeWithdrawModal);
    document.getElementById('cancelWithdraw').addEventListener('click', closeWithdrawModal);
    document.getElementById('withdrawForm').addEventListener('submit', handleWithdraw);
    
    document.getElementById('closeDepositSuccessBtn').addEventListener('click', closeDepositSuccessModal);
    document.getElementById('closeDepositSuccess').addEventListener('click', closeDepositSuccessModal);
    document.getElementById('closeWithdrawSuccessBtn').addEventListener('click', closeWithdrawSuccessModal);
    document.getElementById('closeWithdrawSuccess').addEventListener('click', closeWithdrawSuccessModal);
    
    document.getElementById('goBackBtn').addEventListener('click', closeWithdrawModal);
}

function openDepositModal() {
    if (!currentUser || !userData) {
        showNotification('Please login first!', 'error');
        return;
    }
    
    document.getElementById('depositForm').reset();
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
    
    document.getElementById('withdrawForm').reset();
    document.getElementById('withdrawModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    checkWithdrawalEligibility();
}

function closeWithdrawModal() {
    document.getElementById('withdrawModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function checkWithdrawalEligibility() {
    document.getElementById('withdrawStatus').classList.remove('hidden');
    document.getElementById('withdrawStatus').classList.add('flex', 'flex-col');
    document.getElementById('statusMessage').textContent = 'Checking eligibility...';
    document.getElementById('eligibleMessage').classList.add('hidden');
    document.getElementById('notEligibleMessage').classList.add('hidden');
    document.getElementById('withdrawFormFields').classList.add('hidden');
    document.getElementById('backToHomeBtn').classList.add('hidden');
    
    const currentBalance = userData.balance || 0;
    const successfulReferrals = userData.successfulReferrals || 0;
    const requiredReferrals = 20;
    const minBalance = 500;
    
    document.getElementById('currentBalanceDisplay').textContent = `৳${currentBalance}`;
    document.getElementById('referralCountDisplay').textContent = `${successfulReferrals}/${requiredReferrals}`;
    document.getElementById('availableBalance').textContent = `৳${currentBalance}`;
    
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
    
    setTimeout(() => {
        document.getElementById('withdrawStatus').classList.add('hidden');
        
        if (currentBalance >= minBalance && successfulReferrals >= requiredReferrals) {
            document.getElementById('eligibleMessage').classList.remove('hidden');
            document.getElementById('withdrawFormFields').classList.remove('hidden');
            
            document.getElementById('availableBalance').textContent = `৳${currentBalance}`;
            
            const withdrawAmountInput = document.getElementById('withdrawAmount');
            withdrawAmountInput.max = currentBalance;
            withdrawAmountInput.value = Math.min(currentBalance, 500);
            
            calculateWithdrawAmount();
            
        } else {
            document.getElementById('notEligibleMessage').classList.remove('hidden');
            document.getElementById('backToHomeBtn').classList.remove('hidden');
            
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
    
    if (!depositAmount || depositAmount < 100) {
        showNotification('Minimum deposit amount is ৳100', 'error');
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
        document.getElementById('depositSpinner').classList.remove('hidden');
        document.getElementById('submitDepositBtn').disabled = true;
        
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
        
        const depositRef = database.ref('deposits').push();
        await depositRef.set(depositData);
        
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
        
        closeDepositModal();
        
        showDepositSuccess(depositAmount, paymentMethod, transactionId);
        
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
    
    if (userData.balance < 500 || (userData.successfulReferrals || 0) < 20) {
        showNotification('You are not eligible for withdrawal', 'error');
        return;
    }
    
    try {
        document.getElementById('withdrawSpinner').classList.remove('hidden');
        document.getElementById('submitWithdrawBtn').disabled = true;
        
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
        
        const withdrawRef = database.ref('withdrawals').push();
        await withdrawRef.set(withdrawData);
        
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
        
        userData.balance -= withdrawAmount;
        updateUserInterface();
        
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
        
        closeWithdrawModal();
        
        showWithdrawSuccess(withdrawAmount, withdrawMethod, accountNumber, netAmount);
        
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
    document.getElementById('successDepositAmount').textContent = `৳${amount}`;
    document.getElementById('successPaymentMethod').textContent = getPaymentMethodName(method);
    document.getElementById('successTransactionId').textContent = transactionId;
    
    document.getElementById('depositSuccessModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeDepositSuccessModal() {
    document.getElementById('depositSuccessModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function showWithdrawSuccess(amount, method, accountNumber, netAmount) {
    document.getElementById('successWithdrawAmount').textContent = `৳${amount}`;
    document.getElementById('successWithdrawMethod').textContent = getPaymentMethodName(method);
    document.getElementById('successAccountNumber').textContent = accountNumber;
    document.getElementById('successNetAmount').textContent = `৳${netAmount}`;
    
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

async function updateReferralCount() {
    if (!currentUser) return;
    
    try {
        const referralsSnapshot = await database.ref(`referrals/${currentUser.uid}`).once('value');
        const referrals = referralsSnapshot.val();
        
        let successfulReferrals = 0;
        let activeReferrals = 0;
        
        if (referrals) {
            Object.keys(referrals).forEach(key => {
                const referral = referrals[key];
                if (referral.status === 'completed' || referral.isActive) {
                    successfulReferrals++;
                    
                    if (referral.isActive) {
                        activeReferrals++;
                    }
                }
            });
        }
        
        await database.ref('users/' + currentUser.uid).update({
            successfulReferrals: successfulReferrals,
            activeReferrals: activeReferrals,
            referrals: successfulReferrals
        });
        
        userData.successfulReferrals = successfulReferrals;
        userData.activeReferrals = activeReferrals;
        userData.referrals = successfulReferrals;
        
    } catch (error) {
        console.error('Error updating referral count:', error);
    }
}

async function setupReferralTracking() {
    if (!currentUser) return;
    
    const pendingReferral = localStorage.getItem('pendingReferralCode');
    if (pendingReferral) {
        if (pendingReferral.startsWith('ref_')) {
            const referrerId = pendingReferral.substring(4);
            try {
                const referrerSnapshot = await database.ref('users/' + referrerId).once('value');
                if (referrerSnapshot.exists()) {
                    const referralCheck = await database.ref(`referrals/${referrerId}/${currentUser.uid}`).once('value');
                    if (!referralCheck.exists()) {
                        await processReferralReward(referrerId, currentUser.uid, pendingReferral);
                        
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

async function showReferralStats() {
    if (!currentUser) {
        showNotification('Please login first!', 'error');
        return;
    }
    
    try {
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
                        
                        <button id="closeStatsBtn" class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = statsHTML;
        document.body.appendChild(modalContainer.firstElementChild);
        
        document.getElementById('closeReferralStats').addEventListener('click', () => {
            const modal = document.getElementById('referralStatsModal');
            if (modal) modal.remove();
        });
        
        document.getElementById('closeStatsBtn').addEventListener('click', () => {
            const modal = document.getElementById('referralStatsModal');
            if (modal) modal.remove();
        });
        
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

async function saveTaskProgressToFirebase() {
    if (!currentUser) return;
    
    try {
        const userTaskProgress = JSON.parse(localStorage.getItem(`taskProgress_${currentUser.uid}`)) || {};
        await database.ref(`taskProgress/${currentUser.uid}`).set(userTaskProgress);
    } catch (error) {
        console.error('Error saving task progress:', error);
    }
}

async function loadTaskProgressFromFirebase() {
    if (!currentUser) return;
    
    try {
        const snapshot = await database.ref(`taskProgress/${currentUser.uid}`).once('value');
        const firebaseTaskProgress = snapshot.val();
        
        if (firebaseTaskProgress) {
            const localTaskProgress = JSON.parse(localStorage.getItem(`taskProgress_${currentUser.uid}`)) || {};
            const mergedProgress = { ...firebaseTaskProgress, ...localTaskProgress };
            
            localStorage.setItem(`taskProgress_${currentUser.uid}`, JSON.stringify(mergedProgress));
            await database.ref(`taskProgress/${currentUser.uid}`).set(mergedProgress);
        }
    } catch (error) {
        console.error('Error loading task progress:', error);
    }
}

// Update the loadUserData function to include task progress loading
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
                referralCode: `ref_${currentUser.uid}`
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
            
            await updateReferralCount();
            await loadTaskProgressFromFirebase();
        }
        
        updateUserInterface();
        showMainApp();
        
        await setupReferralTracking();
        
    } catch (error) {
        console.error('Error loading user data:', error);
        showNotification('Error loading user data', 'error');
    }
}
