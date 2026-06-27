# Nexora Tech

Nexora Tech is split for separate hosting:

- Frontend: Vite/React app in the project root, ready for Vercel.
- Backend: Express/MongoDB API in `backend`, ready for Render.

## Local Development

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
npm run dev
```

The frontend dev server proxies `/api` requests to `http://127.0.0.1:5001`.

For local backend environment variables, copy `backend/.env.example` to `backend/.env` and put your real MongoDB Atlas URI there:

```bash
MONGODB_URI=your_mongodb_connection_string
PORT=5001
CORS_ORIGIN=http://127.0.0.1:8080
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=nexora/projects
```

## Render Backend

Create a Render Web Service with:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Set these Render environment variables:

```bash
MONGODB_URI=your_mongodb_connection_string
PORT=10000
CORS_ORIGIN=https://your-vercel-domain.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=nexora/projects
```

Render provides `PORT` automatically, so you can also omit it.
Do not rely on a committed `.env` file on Render; use Render's Environment tab for these values.

> [!TIP]
> **CORS Configuration**: The `CORS_ORIGIN` variable supports multiple comma-separated origins. For example, to allow access from both your production Vercel app and local environment, set:
> `CORS_ORIGIN=https://your-vercel-domain.vercel.app,http://127.0.0.1:8080`
>
> **Database Seeding**: The server automatically seeds initial records (services, projects, pricing, FAQs, and categories) on startup if the MongoDB database collections are empty.

## Vercel Frontend

Create a Vercel project from the repo root with:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Set this Vercel environment variable:

```bash
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

> [!NOTE]
> Make sure to configure the Vercel environment variables *before* triggerring the build, since Vite bakes these environment variables into the static javascript build bundle.
> Leave `VITE_API_BASE_URL` empty only for local development.
