-- RANA'S Supabase order tables and policies.
-- Run only if you have not already run the setup SQL in this project.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text,
  customer_name text not null,
  phone text not null,
  address text not null,
  city text,
  payment_method text,
  items jsonb not null,
  total numeric not null,
  status text default 'Pending',
  created_at timestamptz default now()
);
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id)
);
alter table public.orders enable row level security;
alter table public.admins enable row level security;
drop policy if exists "Allow checkout orders" on public.orders;
create policy "Allow checkout orders" on public.orders for insert to anon, authenticated with check (true);
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable
as $$ select exists (select 1 from public.admins where user_id = auth.uid()); $$;
drop policy if exists "Admins can view orders" on public.orders;
create policy "Admins can view orders" on public.orders for select to authenticated using (public.is_admin());
drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
