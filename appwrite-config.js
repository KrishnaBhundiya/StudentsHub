// Appwrite Configuration for Google OAuth
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1'; // Your Appwrite endpoint
const APPWRITE_PROJECT_ID = '693407da0024bcceded8'; // Your Appwrite Project ID

// Initialize Appwrite Client
let client = null;
let account = null;

// Wait for SDK to load, then initialize
function initAppwrite() {
    if (typeof sdk !== 'undefined') {
        try {
            client = new sdk.Client()
                .setEndpoint(APPWRITE_ENDPOINT)
                .setProject(APPWRITE_PROJECT_ID);
            
            account = new sdk.Account(client);
            
            // Export for use in other files
            window.appwriteConfig = {
                client: client,
                account: account,
                endpoint: APPWRITE_ENDPOINT,
                projectId: APPWRITE_PROJECT_ID
            };
        } catch (error) {
            console.error('Appwrite initialization error:', error);
            window.appwriteConfig = {
                client: null,
                account: null,
                endpoint: APPWRITE_ENDPOINT,
                projectId: APPWRITE_PROJECT_ID
            };
        }
    } else {
        // SDK not loaded yet, try again after a short delay
        setTimeout(initAppwrite, 100);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppwrite);
} else {
    initAppwrite();
}

