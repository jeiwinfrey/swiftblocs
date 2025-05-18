# SwiftBlocs

SwiftBlocs is a platform for sharing and discovering SwiftUI components. It allows users to publish their SwiftUI code snippets, browse components created by others, and build beautiful iOS interfaces faster.

## Features

- **Component Sharing**: Publish your SwiftUI components with code and preview images
- **Component Discovery**: Browse and search for components by tags and authors
- **User Profiles**: Create an account, customize your profile, and track your published components
- **Bookmarks**: Save your favorite components for later use

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: CSS variables with OKLCH color format, and TailwindCSS
- **Authentication**: Supabase Auth (email/password)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage for avatars and component images

## Project Structure

```
src/
├── app/               # Next.js app directory
│   ├── (auth)/        # Authentication-related pages
│   ├── (main)/        # Main application pages
│   └── api/           # API routes
├── components/        # React components
│   ├── auth/          # Authentication components
│   ├── layout/        # Layout components
│   └── ui/            # UI components
├── constants/         # Constants and configuration
├── hooks/             # Custom React hooks
├── lib/               # Library code and utilities
├── services/          # Service layer for API interactions
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project

### Environment Setup

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com) from the creators of Next.js.
