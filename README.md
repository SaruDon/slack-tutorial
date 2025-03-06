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

#### `get` Query

The `get` query retrieves all workspaces associated with the authenticated user.

- **File**: `convex/workspace.ts`
- **Path**: `api.workspace.get`
- **Description**: This query fetches all workspaces linked to the authenticated user. It first retrieves the user ID, then queries the database for all members associated with that user ID. Finally, it fetches the workspace details for each workspace ID and returns them.

#### `useGetWorkSpaces` Hook

The `useGetWorkSpaces` hook is a React hook that utilizes the `get` query to fetch workspaces.

- **File**: `src/features/workspaces/api/use-get-workspaces.ts`
- **Description**: This hook uses the `useQuery` hook from Convex to fetch the workspaces. It returns the data and a loading state.

### Usage

To use the `get` query, you can import and call it from your components or services:

```typescript
import { api } from "../../../../convex/_generated/api";

const workspaces = await api.workspace.get();
```

To use the `useGetWorkSpaces` hook, you can import and call it in your React components:

```typescript
import { useGetWorkSpaces } from "./use-get-workspaces";

const { data, isLoading } = useGetWorkSpaces();
```


The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
