# My Cuddly Coding Buddy

This application allows users to talk annd compare GitHub repositories. It uses Next.js, NextAuth.js for authentication with GitHub OAuth, and the GitHub API.

## Prerequisites

Before you begin, ensure you have the following:
- Node.js installed (v12.x or later)
- npm (usually comes with Node.js)
- A GitHub account

## Initial Setup

Follow these steps to set up the application:

### 1. Clone the Repository

First, clone the repository to your local machine


### 2. Install Dependencies

Run the following command in the root directory of your project to install the necessary dependencies:

```npm install```


### 3. Create GitHub OAuth Credentials

To authenticate users via GitHub, you need to create OAuth credentials:

- Go to your GitHub account settings
- Navigate to **Developer settings** > **OAuth Apps** > **New OAuth App**
- Fill in the **Application name**, **Homepage URL**, and **Authorization callback URL**. For local development, use `http://localhost:3000/api/auth/callback/github` for the callback URL.
- Click **Register application**
- After registration, you will get a **Client ID** and **Client Secret**

### 4. Generate a NextAuth Secret

The `NEXTAUTH_SECRET` is used to encrypt and verify tokens and session cookies. Generate a secure secret using Node.js:

```node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"```


### 5. Configure Your `.env.local`

Create a `.env.local` file in the root of your project and add your GitHub credentials and the NextAuth secret:

GITHUB_ID=your_github_client_id_here
GITHUB_SECRET=your_github_client_secret_here
NEXTAUTH_SECRET=your_generated_nextauth_secret_here


Replace `your_github_client_id_here`, `your_github_client_secret_here`, and `your_generated_nextauth_secret_here` with your actual GitHub Client ID, GitHub Client Secret, and generated NextAuth secret.

## Running the Application

To run the application locally, execute:

```npm run dev```
