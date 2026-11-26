-- RANA'S order database. Run this entire script in Supabase > SQL Editor > New query.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  payment_method text not null,
  items jsonb not null,
  subtotal numeric(12,2) not null,
  shipping numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  status text not null default 'New' check (status in ('New','Confirmed','Dispatched','Delivered','Cancelled')),
  created_at timestamptz not null default now()
);

-- Admin allow-list. Add only your own Auth user UUID to this table.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
alter table public.admin_users enable row level security;

-- Anyone can submit an order from the storefront; customers cannot read orders.
drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders" on public.orders
for insert to anon, authenticated with check (
  char_length(customer_name) >= 3 and char_length(phone) >= 10
  and char_length(address) >= 10 and jsonb_typeof(items) = 'array'
  and total >= 0
);

-- Admin can read and update orders only when their Auth UUID is allow-listed.
drop policy if exists "Admins can read orders" on public.orders;
create policy "Admins can read orders" on public.orders
for select to authenticated using (
  exists (select 1 from public.admin_users a where a.user_id = auth.uid())
);
drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders" on public.orders
for update to authenticated using (
  exists (select 1 from public.admin_users a where a.user_id = auth.uid())
) with check (
  exists (select 1 from public.admin_users a where a.user_id = auth.uid())
);

-- Admin can check their own allow-list entry; no browser insert/update policy is granted.
drop policy if exists "Admins can view own admin record" on public.admin_users;
create policy "Admins can view own admin record" on public.admin_users
for select to authenticated using (user_id = auth.uid());

grant usage on schema public to anon, authenticated;
grant insert on public.orders to anon, authenticated;
grant select, update on public.orders to authenticated;
grant select on public.admin_users to authenticated;
