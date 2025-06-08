This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Fuel Your Tempo web application

A smart beverage discovery platform that helps users explore and track functional drinks across major Estonian retailers. Built with Next.js, TypeScript, Supabase, TanStack Query, Puppeteer and Tailwind CSS.

## Features

### Core Functionality
- 🔍 Smart filtering system for functional drinks
- 💾 Real-time price tracking across multiple retailers
- ❤️ Personal favorites list
- 🔄 Carousel view for featured and favorite drinks

### Technical Features
- Authentication via Clerk
- Real-time data with Supabase
- Protected API Routes
- Responsive design
- Server-side rendering
- Client-side caching

## Tech Stack

### Frontend
- Next.js 15.3
- TanStack Query for data fetching
- Tailwind CSS for styling
- shadcn/ui components
- React Markdown for LLM response formatting

### Backend & Database
- Supabase (PostgreSQL)
- Clerk Authentication
- Next.js API Routes

### AI & Natural Language Processing
- OpenRouter API integration for AI models integration
- react-markdown for LLM output formatting

### Deployment & CI/CD
- Vercel for hosting and deployments
- Automatic preview deployments
- Continuous Integration pipeline
- Environment variable management

### External Services & APIs
- OpenRouter for LLM access
- Resend Email API to handle email sign ups
- Clerk for user authentication and account management
- Supabase for database hosting
- Vercel for deployment and hosting

### Data Collection
- Puppeteer for web scraping

### State Management & Caching
- TanStack Query
- React Context API
- Client-side caching


## Project Structure

```
find-my-function/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── components/      # React components
│   │   └── pages/          # Page components
│   ├── lib/
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Utility functions
│   └── types/              # TypeScript definitions
```
