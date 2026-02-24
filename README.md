# SimpliCity

![SimpliCity logo](public/assets/logos/SimpliCity_dark_logo_crop.png)

**SimpliCity** is a property advice MVP that connects people with property experts. Whether you’re buying, renting, letting or selling, you can find trusted experts and save the services that matter to you.

## Concept

- **Users** sign up and set their role (buyer, renter, landlord, seller). They browse expert services, get advice, and save favorites.
- **Experts** have profiles (level, area, bio) and list **services** (title, description, price, booking link). Users can favorite and revisit them.
- The app is auth-backed (Supabase), with profiles, expert vs user roles, and a simple services-and-favorites flow—keeping things **simple** while you navigate the **city** of property.

## Tech

- **Next.js** (App Router), **React**, **Tailwind CSS**
- **Supabase** (auth, Postgres)
- See `docs/database/schema_v1.sql` for the data model.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Configure Supabase (e.g. `.env.local`) as needed.
