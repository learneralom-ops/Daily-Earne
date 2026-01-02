// Tailwind Config
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'primary': '#3B82F6',
                'secondary': '#10B981',
                'accent': '#F59E0B',
            },
            animation: {
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'countdown-pulse': 'countdownPulse 1s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' }
                },
                countdownPulse: {
                    '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.05)', opacity: 0.8 }
                }
            }
        }
    }
}

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA2HUBFhHEWg4MwkJB4BVdJxUun0Gy07Ts",
    authDomain: "daily-earne-aea89.firebaseapp.com",
    databaseURL: "https://daily-earne-aea89-default-rtdb.firebaseio.com",
    projectId: "daily-earne-aea89",
    storageBucket: "daily-earne-aea89.firebasestorage.app",
    messagingSenderId: "444567470638",
    appId: "1:444567470638:web:0fa323d9f5ef6aba1155bf"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();
