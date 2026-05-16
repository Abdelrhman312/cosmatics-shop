create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price numeric(10,2) not null check (price >= 0),
  category text not null,
  skin_type text not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null default '',
  total_amount numeric(10,2) not null check (total_amount >= 0),
  payment_method text not null check (payment_method in ('cod', 'manual_transfer')),
  payment_proof_url text,
  status text not null default 'pending_review',
  created_at timestamptz not null default now()
);

alter table public.orders
  add column if not exists customer_address text not null default '';

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  unit_price numeric(10,2) not null check (unit_price >= 0),
  quantity int not null check (quantity > 0)
);

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do nothing;

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Allow checkout order creation" on public.orders;
create policy "Allow checkout order creation"
on public.orders
for insert
to anon, authenticated
with check (true);

drop policy if exists "Allow checkout order id return" on public.orders;
create policy "Allow checkout order id return"
on public.orders
for select
to anon, authenticated
using (true);

drop policy if exists "Allow checkout order item creation" on public.order_items;
create policy "Allow checkout order item creation"
on public.order_items
for insert
to anon, authenticated
with check (true);

drop policy if exists "Allow payment proof uploads" on storage.objects;
create policy "Allow payment proof uploads"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'payment-proofs');

drop policy if exists "Allow payment proof reads" on storage.objects;
create policy "Allow payment proof reads"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'payment-proofs');
