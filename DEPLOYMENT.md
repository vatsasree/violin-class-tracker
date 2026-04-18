# Deployment Guide: Violin Tracker

Follow these steps to get your app live on the web and accessible from your iPhone.

## 1. Setup the Database (Neon.tech)
1. Go to [Neon.tech](https://neon.tech) and create a free account.
2. Create a new project called `violin-tracker`.
3. Select **Postgres 16**.
4. Copy your **Connection String**. It should look like this:
   `postgresql://user:password@ep-something.aws.neon.tech/neondb?sslmode=require`
5. **CRITICAL**: Change the prefix from `postgresql://` to `postgresql+asyncpg://`.
   *   *Example*: `postgresql+asyncpg://user:password@ep-something.aws.neon.tech/neondb?sslmode=require`

## 2. Deploy the Backend (Render.com)
1. Go to [Render.com](https://render.com) and create a free account.
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository: `vatsasree/violin-class-tracker`.
4. Configure the service:
   - **Name**: `violin-api`
   - **Environment**: `Python 3`
   - **Region**: (Choose closest to you)
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn -k uvicorn.workers.UvicornWorker app.main:app --chdir backend --bind 0.0.0.0:$PORT`
5. Click **Advanced** and add an Environment Variable:
   - **Key**: `DATABASE_URL`
   - **Value**: (Your modified Neon connection string from Step 1)
6. Click **Create Web Service**. 
7. Copy the URL Render gives you (e.g., `https://violin-api.onrender.com`).

## 3. Deploy the Frontend (Vercel.com)
1. Go to [Vercel.com](https://vercel.com) and create a free account.
2. Click **Add New** > **Project**.
3. Import your GitHub repository: `vatsasree/violin-class-tracker`.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
5. Add an Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: (Your Render URL from Step 2, including `/api/v1`)
     *   *Example*: `https://violin-api.onrender.com/api/v1`
6. Click **Deploy**.

---

## 4. Setup on iPhone
Once the Vercel deployment is finished:
1. Open the **Vercel URL** in **Safari** on your iPhone.
2. Tap the **Share** button (the square with an arrow).
3. Scroll down and tap **"Add to Home Screen"**.
4. Confirm the name "Violin Tracker" and tap **Add**.

Your premium dashboard is now ready to use!
