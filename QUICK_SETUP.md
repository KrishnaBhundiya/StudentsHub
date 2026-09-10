# Quick Setup Guide - Google Sign In

## Step 1: Get Your Appwrite Project ID

1. Go to https://cloud.appwrite.io/
2. Sign up or log in
3. Create a new project (or use existing one)
4. Copy your **Project ID** from the project settings

## Step 2: Update appwrite-config.js

Open `appwrite-config.js` and replace `YOUR_PROJECT_ID` with your actual Project ID:

```javascript
const APPWRITE_PROJECT_ID = 'your-actual-project-id-here'; // Replace this!
```

**Example:**
```javascript
const APPWRITE_PROJECT_ID = '65a1b2c3d4e5f6g7h8i9j0'; // Your real Project ID
```

## Step 3: Enable Google OAuth in Appwrite

1. In your Appwrite project dashboard, go to **Auth** → **Settings**
2. Scroll to **OAuth Providers**
3. Click **Enable** on **Google**
4. You'll need to add:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)
   - **Redirect URLs**: 
     - Success: `http://127.0.0.1:5503/login.html` (or your URL)
     - Failure: `http://127.0.0.1:5503/login.html` (or your URL)

## Step 4: Get Google OAuth Credentials (Optional - for full setup)

If you want to complete the Google OAuth setup:

1. Go to https://console.cloud.google.com/
2. Create a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google`
6. Copy Client ID and Secret to Appwrite

## That's It!

After updating the Project ID, the Google Sign In button should work (it will show a different error if Google OAuth isn't fully configured in Appwrite, but the basic connection will work).

