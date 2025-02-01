# Todo List Frontend

## Overview

A modern, responsive Todo List application built with Next.js 13, React, TypeScript, and Tailwind CSS.

## Features

- Responsive design
- Dark/Light theme support
- Authentication
- Dynamic routing

## Prerequisites

- Node.js (v18+)
- npm or yarn

## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app/frontend
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env` file with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

Run tests:

```bash
npm test
# or
yarn test
```

## Build

Create a production build:

```bash
npm run build
# or
yarn build
```

## Deployment

The application is configured for deployment on Vercel:

- Ensure all environment variables are set in Vercel
- Connect your GitHub repository
- Vercel will automatically deploy on push to main branch

## Technologies

- Next.js 13
- React
- TypeScript
- Tailwind CSS
- SCSS
- Jest
- React Testing Library

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API base URL

## License

MIT License
