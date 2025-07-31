# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ReflexMaster is a React-based web application that tests users' reaction times and integrates with the Welshare health wallet system for secure data storage. The application is built with Vite, TypeScript, and Tailwind CSS, and deployed on Vercel.

## Development Commands

### Local Development
- `npm run dev` - Start development server with Vite
- `npm run vdev` - Start local development with Vercel dev server (includes API routes)
- `npm run prevdev` - Create symlink for API routes before running vercel dev

### Build and Deploy
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Vercel-specific
- `npm run vercel-dev-helper` - Helper script for Vercel deployment

## Architecture

### Frontend Structure
- **App.tsx**: Main application component with React Router setup
- **src/pages/**: Route-based page components
  - **GamePage.tsx**: Game page with navigation to leaderboard
  - **LeaderboardPage.tsx**: Leaderboard page with back navigation
- **Game.tsx**: Core game component handling user interactions and wallet integration
- **useReactionGame.ts**: Custom hook managing game state and reaction time logic
- **Components**: Modular UI components (ReactionButton, Stats, Instructions, Leaderboard)

### Routing
- **React Router DOM**: Browser-based routing with proper URL handling
- **Routes**: 
  - `/` - Game page (default)
  - `/leaderboard` - Leaderboard page
- **Navigation**: Link-based navigation supporting page reloads and direct URL access

### Backend API
- **_api/submit.ts**: Serverless function for submitting reaction time data to Welshare wallet
- **_api/test.ts**: Test endpoint for API functionality

### Key Integration Points
- **Welshare Wallet**: Secure data submission through popup window communication
- **Session Management**: Public key-based session authentication
- **Data Flow**: Game → Stats → Wallet → Backend API → Welshare platform

## Important Technical Details

### Vercel API Route Configuration
Due to Vercel's handling of serverless functions, the project uses:
- `_api/` directory for actual serverless functions
- Symlink from `api` to `_api` for local development
- Use `npm run vdev` for local development with API routes

### Environment Variables


### Game Logic
- Random delays between 2-6 seconds for reaction testing
- Minimum 3 attempts required before data submission
- Real-time statistics tracking (average, best time, history)
- Early click detection and penalty handling

### Security Considerations
- Origin verification for wallet communication
- Signed payloads for data integrity
- Bearer token authentication for API requests
- Message validation for popup window communication

## Testing and Development

When making changes:
1. Run `npm run lint` to check code style
2. Test both local development modes (`npm run dev` and `npm run vdev`)
3. Verify wallet integration works in popup mode
4. Test API endpoints through the game interface

## Common Tasks

### Adding New Game Features
- Extend `GameState` type in `src/types/game.ts`
- Update `useReactionGame` hook logic
- Modify `Game.tsx` component UI and interactions

### API Modifications
- Edit files in `_api/` directory (not `api/`)
- Test locally with `npm run vdev`
- Ensure proper error handling and TypeScript types

### Wallet Integration Changes
- Update message handling in `Game.tsx`
- Verify origin checking for security
- Test popup communication flow