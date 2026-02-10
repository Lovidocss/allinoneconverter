# AllInOnePDF - Frontend

Next.js frontend for AllInOnePDF - a free online PDF tools application.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Animations**: Framer Motion

## Setup

### Prerequisites

- Node.js 18+
- Backend server running (see `../server/`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env.local
```

3. Update `.env.local`:
```env
# For local development
NEXT_PUBLIC_API_URL=http://localhost:5000

# For production (your VPS URL)
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Development

First, make sure the backend server is running, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── admin/          # Admin dashboard
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # User dashboard
│   ├── pricing/        # Pricing page
│   ├── tool/           # Tool pages
│   └── tools/          # Tools listing
├── components/         # Reusable components
│   └── ui/            # UI components
└── lib/               # Utilities & configs
    ├── api.ts         # API configuration
    ├── mock-data.ts   # Mock data
    └── tools-data.ts  # Tools configuration
```

## Deploy on Vercel

1. Push your code to GitHub

2. Import the project in Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Set environment variables:
     - `NEXT_PUBLIC_API_URL`: Your VPS API URL

3. Deploy!

### Environment Variables for Vercel

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (e.g., https://api.yourdomain.com) |

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │   Backend       │
│   (Vercel)      │ ──────> │   (VPS)         │
│   Next.js       │         │   Express.js    │
└─────────────────┘         └─────────────────┘
                                    │
                                    v
                            ┌─────────────────┐
                            │   MongoDB       │
                            │   (Atlas/Local) │
                            └─────────────────┘
```

## License

MIT

