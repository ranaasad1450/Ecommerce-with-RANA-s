RANA'S — Supabase Orders + Admin Dashboard

FILES
- index.html, style.css, script.js: updated storefront. Existing visual design is preserved.
- admin.html: private admin login and order dashboard.
- supabase_setup.sql: database table and Row Level Security policies.

SETUP (do these steps before publishing)
1. Open Supabase project: https://supabase.com/dashboard/project/njxxaosdtvrgalfcnwxz
2. Open SQL Editor > New query. Open supabase_setup.sql, copy all SQL, paste, and click Run.
3. In Supabase Authentication > Users, create your admin user with your own email/password.
4. Copy that user's UUID. In SQL Editor run this, replacing the placeholder with your UUID:
   insert into public.admin_users (user_id) values ('PASTE-YOUR-ADMIN-USER-UUID-HERE');
5. Upload/replace index.html, style.css and script.js in your website project and redeploy to Vercel.
6. Also upload admin.html to the same project. Admin page URL will be your-domain/admin.html
7. Open admin.html and sign in using the Auth email/password created in step 3.

IMPORTANT SECURITY
- The Publishable key is designed for frontend use. RLS policies protect customer order data.
- Never put a Supabase secret/service_role key or database password in these files.
- Only the UUID inserted into admin_users can read/update customer orders.
- Do not share admin login details. Use a strong password.

HOW IT WORKS
When a customer submits checkout, the order is inserted into Supabase. It appears in admin.html after login. You can change its status (New, Confirmed, Dispatched, Delivered, Cancelled).
