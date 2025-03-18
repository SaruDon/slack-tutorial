This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel


## API

### Convex API

The project uses Convex for backend services. Below are the details of the APIs and hooks provided:

# Authentication System

## Overview

A modern authentication system built with React, TypeScript, and Convex for secure user management.
In this project Convex OAuth is used.

### Features

#### Authentication Methods

- **Email/Password**: Traditional authentication with secure password handling
- **Google Authentication**: One-click sign-in with Google accounts
- **GitHub Authentication**: One-click sign-in with GitHub accounts

#### Convex Integration

The system integrates with Convex backend through:

- `useQuery` hook for fetching current user data
- `useAuthActions` hook for handling authentication actions

#### Components

- **AuthScreen**: Container component that handles the auth flow state
- **SignInCard**: Form component for user login
- **SignUpCard**: Form component for user registration
- **UserButton**: Avatar button with dropdown menu for logged-in users

### Security Considerations

- Password authentication with secure handling
- OAuth integration for social login
- Proper error management without exposing sensitive information
- Loading states for all asynchronous operations


# Channel Management System

## Overview

A robust channel management system built with React, TypeScript, and Convex for managing workspace channels.

This channel management system provides a complete solution for creating, reading, updating, and deleting channels within workspaces. It leverages Convex for data management and React hooks for state management.

## Features

- Create new channels with custom names
- Retrieve individual channels by ID
- List all channels within a workspace
- Update channel information
- Remove channels
- Modal UI for channel creation

## API Integration

The system integrates with Convex backend through:

- `useQuery` hooks for fetching channel data
- `useMutation` hooks for creating, updating, and removing channels

## Custom Hooks

All API operations are wrapped in custom hooks:

- `useCreateChannel`: Creates a new channel within a workspace
- `useGetChannel`: Retrieves details of a specific channel by ID
- `useGetChannels`: Lists all channels within a workspace
- `useRemoveChannel`: Deletes a channel
- `useUpdateChannel`: Updates a channel's information

These hooks handle loading states, errors, and success callbacks for a smooth user experience.


The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
