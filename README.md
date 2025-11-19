# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
Grymt 🙌 Då gör vi en tydlig **API-routes översikt** som matchar ditt schema.
Jag utgår från att alla resurser följer **REST-standard** och att du har **auth med JWT**.

---

# 🌐 API Routes Plan

## 🔑 Auth / Users

* **POST** `/api/auth/login` → logga in, returnerar JWT + user info

* **POST** `/api/auth/register` (om du vill ha registrering)

* **POST** `/api/auth/logout` (om du kör med httpOnly cookies)

* **GET** `/api/users` → lista alla users (endast ADMIN)

* **GET** `/api/users/:id` → hämta specifik user

* **POST** `/api/users` → skapa user (ADMIN)

* **PUT** `/api/users/:id` → uppdatera user

* **DELETE** `/api/users/:id` → ta bort user (ADMIN)

---

## 📰 News

* **GET** `/api/news` → lista nyheter (stöd för `?page`, `?limit`, `?q`, `?sort`)
* **GET** `/api/news/:id` → hämta specifik nyhet
* **POST** `/api/news` → skapa nyhet
* **PUT** `/api/news/:id` → uppdatera nyhet
* **DELETE** `/api/news/:id` → ta bort nyhet

---

## 📅 Events

* **GET** `/api/events`
* **GET** `/api/events/:id`
* **POST** `/api/events`
* **PUT** `/api/events/:id`
* **DELETE** `/api/events/:id`

---

## 📂 Projects

* **GET** `/api/projects`
* **GET** `/api/projects/:id`
* **POST** `/api/projects`
* **PUT** `/api/projects/:id`
* **DELETE** `/api/projects/:id`

---

## 🤝 Partners

* **GET** `/api/partners`
* **GET** `/api/partners/:id`
* **POST** `/api/partners`
* **PUT** `/api/partners/:id`
* **DELETE** `/api/partners/:id`

---

## 🖼️ Media

* **GET** `/api/media`
* **GET** `/api/media/:id`
* **POST** `/api/media` → upload (multipart/form-data eller Cloudinary)
* **PUT** `/api/media/:id`
* **DELETE** `/api/media/:id`

---

## 📩 Contact Messages

* **GET** `/api/contacts` → lista inkommande meddelanden
* **GET** `/api/contacts/:id` → visa specifikt meddelande
* **POST** `/api/contacts` → nytt kontaktmeddelande (från frontend-formulär)
* **PUT** `/api/contacts/:id` → uppdatera status (`READ`, `REPLIED`, etc.)
* **DELETE** `/api/contacts/:id` → arkivera/radera

---

# 📌 Exempel med query params (Pagination + Filter)

* `GET /api/news?page=2&limit=10&sort=publishedDate:desc&q=education`
* Returnerar:

```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 53,
    "pages": 6
  }
}
```

---

⚡ Detta ger dig en **heltäckande API-karta** för alla modeller i ditt schema.
Nästa steg: vi kan börja med att implementera **en resurs (t.ex. News)** i adminpanelen och se att CRUD fungerar hela vägen.

👉 Vill du att jag gör ett **konkret exempel för `NewsForm.tsx`** där vi kör `api.create("news")` och `api.update("news", id)`?
