RANA'S — Supabase Connected Version

Files:
- index.html, style.css, script.js: existing storefront (design retained)
- supabase-config.js: Supabase project URL + publishable key
- admin.html, admin.js, admin.css: admin login and orders dashboard
- supabase_setup.sql: setup SQL (already run in your project, so do not run again unless needed)

IMPORTANT:
1. Only the Supabase publishable key is used in browser code. Never add service_role/secret keys.
2. Your admin account must already exist in Supabase Authentication > Users, and its UUID must be in public.admins.
3. Upload ALL files in this folder to the same GitHub repository root (including admin files and supabase-config.js).
4. Vercel should redeploy automatically after GitHub receives the commit.
5. Admin dashboard URL: https://YOUR-VERCEL-DOMAIN/admin.html
6. Test with one small order. It should appear in Supabase Table Editor > orders and in admin.html.
7. Password reset: open /admin.html, enter your registered email, and click "Forgot password?". The email link should open /reset-password.html on your Vercel domain. Set a new password there, then log in normally.
8. In Supabase Authentication > URL Configuration, set Site URL to https://ecommercewithrana.vercel.app and add https://ecommercewithrana.vercel.app/** to Redirect URLs.


CUSTOMER ORDER TRACKING
1. Run track_order_setup.sql once in Supabase SQL Editor.
2. Upload all files in this ZIP to the root of your GitHub repository and commit.
3. Vercel will redeploy. Customers can open /track-order.html or use Track Order in the store menu.
4. Customers need the Order Number shown after checkout and the same phone number used at checkout.
