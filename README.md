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

## Admin Authentication & Management

Samartha Trust features a production-grade Super Admin authentication system using PostgreSQL, Prisma ORM, bcrypt password hashing, and HttpOnly cookie sessions.

- **Admin Login**: `http://localhost:3000/admin/login`
- **Protected Console**: `http://localhost:3000/admin`
- **Documentation**: See [`docs/AUTHENTICATION.md`](./docs/AUTHENTICATION.md) for full architecture and operations details.

### Database & Authentication Commands

```bash
# Apply Prisma migrations
pnpm db:migrate

# Seed the initial Super Admin account
pnpm db:seed

# Run the complete automated test suite
pnpm test

# Run type check, linting, and production build
pnpm type-check
pnpm lint
pnpm build
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
