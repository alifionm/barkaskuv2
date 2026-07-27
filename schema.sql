-- Barkasku Marketplace - Supabase Schema
-- Run this in your Supabase SQL Editor

-- 1. Create Profiles Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  role text default 'user' check (role in ('user', 'admin')),
  full_name text not null,
  whatsapp_number text not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. Create Ads Table
CREATE TABLE IF NOT EXISTS public.ads (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  description text not null,
  price numeric not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  images text[] not null default '{}',
  category_id uuid references public.categories(id) on delete set null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- 4. Create Banners Table
CREATE TABLE IF NOT EXISTS public.banners (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  link text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- 5. Create Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  content text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 6. Create FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid default gen_random_uuid() primary key,
  question text not null,
  answer text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- 7. Trigger for automatic profile creation when a user signs up
-- We will handle profile creation via the App code since we need full_name and whatsapp_number.
-- We can also use a trigger if we pass metadata. For this project, we'll insert from app code.

-- RLS POLICIES

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile." ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete any profile." ON public.profiles FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Categories
CREATE POLICY "Categories are viewable by everyone." ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admins can insert categories." ON public.categories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can update categories." ON public.categories FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete categories." ON public.categories FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Ads
CREATE POLICY "Approved ads are viewable by everyone." ON public.ads FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view their own ads regardless of status." ON public.ads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all ads." ON public.ads FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can insert their own ads." ON public.ads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ads." ON public.ads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any ads." ON public.ads FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can delete their own ads." ON public.ads FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can delete any ads." ON public.ads FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Banners
CREATE POLICY "Active banners are viewable by everyone." ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all banners." ON public.banners FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can modify banners." ON public.banners FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Articles
CREATE POLICY "Articles are viewable by everyone." ON public.articles FOR SELECT USING (true);
CREATE POLICY "Only admins can modify articles." ON public.articles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- FAQs
CREATE POLICY "FAQs are viewable by everyone." ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Only admins can modify faqs." ON public.faqs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Storage (Create a bucket for barang images)
INSERT INTO storage.buckets (id, name, public) VALUES ('barang_images', 'barang_images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public profiles are viewable by everyone." ON storage.objects FOR SELECT USING (bucket_id = 'barang_images');
CREATE POLICY "Authenticated users can upload images." ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'barang_images' AND auth.role() = 'authenticated'
);
CREATE POLICY "Users can update their own images." ON storage.objects FOR UPDATE USING (
  bucket_id = 'barang_images' AND auth.uid() = owner
);
CREATE POLICY "Users can delete their own images." ON storage.objects FOR DELETE USING (
  bucket_id = 'barang_images' AND auth.uid() = owner
);

-- 8. Trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, whatsapp_number, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'whatsapp_number', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 9. Seed Default Categories
INSERT INTO public.categories (name, slug) VALUES 
('Elektronik', 'elektronik'),
('Kendaraan', 'kendaraan'),
('Properti', 'properti'),
('Pakaian', 'pakaian'),
('Hobi & Olahraga', 'hobi-olahraga'),
('Lainnya', 'lainnya')
ON CONFLICT (slug) DO NOTHING;
