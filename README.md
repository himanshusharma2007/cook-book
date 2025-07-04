
# 🍽️ Cook Book App

A full-stack recipe sharing web application where users can create, view, favorite, and manage their own cooking recipes. Built with **React + Vite + TailwindCSS + Redux Toolkit (Frontend)** and **NestJS + PostgreSQL + Sequelize (Backend)**. Dockerized and deployed on **Render** (backend) and **Vercel** (frontend).

---

## 🚀 Live Demo

- **Frontend (Vercel):** [https://cookbook-topaz.vercel.app](https://cookbook-topaz.vercel.app/)
- **Backend (Render):** [https://cook-book-otll.onrender.com](https://cook-book-otll.onrender.com)
- **GitHub Repo:** [https://github.com/himanshusharma2007/cook-book](https://github.com/himanshusharma2007/cook-book)

---

## 📦 Features

- 🔐 **Authentication** using JWT (stored in HTTP-only cookies)
- 🧾 **Recipe Management** (create, read, delete your recipes)
- 💡 **Recipe Suggestions** using Forkify API
- ⭐ **Favorites System**
- 📁 **Image Uploads** (stored locally on the server)
- 🎨 Responsive **UI/UX** with TailwindCSS
- ⚙️ Backend with **NestJS + Sequelize + PostgreSQL**
- 🐳 **Dockerized** full-stack application
- 🌐 Deployed on **Render & Vercel**

---

## 🧱 Tech Stack

### Frontend

- React + Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios
- React Toastify
- React Quill

### Backend

- NestJS
- PostgreSQL (via Sequelize ORM)
- JWT & Cookie-parser
- Multer (for file uploads)
- Docker + Docker Compose

---

## 🛠️ Project Structure

```

cook-book/
├── client/            # Frontend (React)
│   ├── src/
│   └── public/
├── server/            # Backend (NestJS)
│   ├── src/
│   ├── Dockerfile
│   └── .env
├── docker-compose.yml # Dev deployment
└── README.md

````

---

## 🌐 API Overview

| Method | Endpoint            | Description                    | Auth |
|--------|---------------------|--------------------------------|------|
| POST   | `/auth/register`    | Register a new user            | ❌   |
| POST   | `/auth/login`       | Login and receive JWT cookie   | ❌   |
| GET    | `/auth/me`          | Get current user               | ✅   |
| POST   | `/recipes`          | Create a recipe                | ✅   |
| GET    | `/recipes`          | Get all recipes                | ❌   |
| GET    | `/recipes/mine`     | Get current user recipes       | ✅   |
| GET    | `/recipes/:id`      | Get recipe by ID               | ❌   |
| DELETE | `/recipes/:id`      | Delete a recipe                | ✅   |
| GET    | `/favorites`        | Get all favorites              | ✅   |
| POST   | `/favorites/:id`    | Add recipe to favorites        | ✅   |
| DELETE | `/favorites/:id`    | Remove recipe from favorites   | ✅   |

---

## 🧠 Forkify Integration

- Used for **suggesting recipe names** during recipe creation.
- Also **fetches full recipe info** (instructions, ingredients, etc.)
- API used: [Forkify API](https://forkify-api.herokuapp.com/v2)

---

## ⚙️ .env Setup

### Backend (`server/.env`)

```env
DB_NAME=cook-book
DB_USER=postgres
DB_PASS=yourpassword
DB_HOST=postgres
DB_PORT=5432

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
PORT=5000
````

### Frontend (`client/.env`)

```env
VITE_BACKEND_URL=https://cook-book-otll.onrender.com
```

---

## 🐳 Docker Setup

**Development**

```bash
docker-compose up --build
```

> This starts:
>
> * Backend on port `5000`
> * Frontend on port `3000`
> * PostgreSQL DB on port `5432`

---

## 🔐 Authentication

* JWT tokens are stored in `httpOnly` secure cookies.
* Axios is configured to use `withCredentials: true`.
* CORS enabled with credentials in backend:

```ts
app.enableCors({
  origin: "https://cook-book-client.vercel.app",
  credentials: true,
});
```

---

## 🧪 Testing

You can test the backend APIs using tools like **Postman** or frontend UI forms.

---

## 🧼 Linting & Formatting

```bash
# Lint
npm run lint

# Format
npm run format
```

---

## 📦 Build & Deployment

### Backend

* **Platform:** Render
* **Build Command:** `npm install && npm run build`
* **Start Command:** `npm run start:prod`

### Frontend

* **Platform:** Vercel
* **Build Command:** `npm install && npm run build`
* **Output Directory:** `dist`

---

## 👨‍💻 Author

**Himanshu Sharma**
BCA Student | Full Stack Developer
[GitHub](https://github.com/himanshusharma2007) | [LinkedIn](https://www.linkedin.com/in/himanshusharma2007)

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).


---

Let me know if you'd like a version with badges (like build, license, or deployment) or a shorter version.
```
