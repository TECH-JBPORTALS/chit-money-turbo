### Chit.Money

###### Modernize Your Chit Fund Management

Streamline operations, build trust, and grow your chit fund business with our digital management platform designed specifically for collectors.

## Quick Start

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Set up environment**
   Copy `.env.example` to `.env` and add your keys.

3. **Start development**

   ```bash
   # Web App
   pnpm run dev --filter=web

   # Collector Console App
   pnpm run dev --filter=collector-console

   # Mobile App (Subscriber App)
   pnpm dev:mobile

   # All apps
   pnpm dev
   ```

## Project Structure

```
chit.money/
├── apps/
│   ├── collector-console/ # Collector console
│   ├── mobile/            # Expo mobile app
│   └── web/               # Next.js web app for main application
├── packages/
│   ├── api/                # Shared API
│   ├── eslint-config/      # Shared ES Lint Configuration
│   ├── typescript-config/  # Shared typescript Configuration
│   └── ui/                 # Shared UI (Shadcn ui reusable components)
```

## Technologies

- **Monorepo**: Turborepo with pnpm
- **Web**: Next.js
- **Mobile**: Expo/React Native
- **Auth**: Clerk
- **File Uploads**: Uploadthing

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `UPLOADTHING_TOKEN`
- Clerk redirect URLs

## Commands

- `pnpm dev` - Start all apps
- `pnpm build` - Build all apps
- `pnpm lint` - Run linting
