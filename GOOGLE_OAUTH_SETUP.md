# Google OAuth Setup Guide

## Prerequisites

1. Create an account at [Appwrite Cloud](https://cloud.appwrite.io/) or use self-hosted Appwrite
2. Create a new project in Appwrite
3. Get your Project ID and Endpoint

## Setup Instructions

### Step 1: Configure Appwrite

1. Open `appwrite-config.js`
2. Replace `YOUR_PROJECT_ID` with your actual Appwrite Project ID
3. If using a custom endpoint, update `APPWRITE_ENDPOINT` (default is `https://cloud.appwrite.io/v1`)

```javascript
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = 'your-actual-project-id-here';
```

### Step 2: Enable Google OAuth in Appwrite

1. Go to your Appwrite project dashboard
2. Navigate to **Auth** → **Settings**
3. Scroll to **OAuth Providers**
4. Enable **Google**
5. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
6. Add redirect URLs:
   - Success: `http://localhost:5500/login.html` (or your domain)
   - Failure: `http://localhost:5500/login.html` (or your domain)

### Step 3: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google`
7. Copy **Client ID** and **Client Secret** to Appwrite

### Step 4: Test

1. Open `login.html` or `signup.html`
2. Click "Sign in/up with Google"
3. You should be redirected to Google login
4. After authentication, you'll be redirected back

## How It Works

1. User clicks "Sign in/up with Google" button
2. Appwrite creates OAuth2 session with Google
3. User authenticates with Google
4. Google redirects back to your success/failure URL
5. App retrieves user info from Appwrite
6. User is created/updated in local database
7. User is redirected to appropriate dashboard

## Notes

- Users signing up with Google will have a default role of "student"
- You can modify the role selection in the OAuth success handler
- OAuth users don't have passwords in the local database
- The system checks if a user exists by email before creating a new account

## Troubleshooting

- **"Google Sign In is not configured"**: Check that `appwrite-config.js` has correct Project ID
- **OAuth redirect fails**: Verify redirect URLs in Appwrite match your domain
- **User not created**: Check browser console for errors
- **SDK not loading**: Ensure internet connection and CDN is accessible

