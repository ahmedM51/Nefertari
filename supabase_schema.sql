-- ==========================================
-- NEFERTARI (نفرتاري) DATABASE SETUP
-- Supabase PostgreSQL Migrations Schema
-- ==========================================

-- 1. Create Role Enum & Category Enums
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE monument_category AS ENUM ('historical', 'religious', 'natural');
CREATE TYPE product_category AS ENUM ('statues', 'papyrus', 'accessories', 'handicrafts');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'rejected');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered');

-- 2. Profiles Table
-- Managed via Auth triggers, stores user-specific billing/role metadata
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles metadata" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow individual user to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 3. Monuments Table
CREATE TABLE public.monuments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_urls TEXT[] NOT NULL DEFAULT '{}',
    location_coords TEXT, -- Format: "latitude, longitude"
    governorate TEXT NOT NULL, -- e.g., "Luxor", "Aswan", "Cairo"
    category monument_category NOT NULL DEFAULT 'historical',
    opening_hours TEXT NOT NULL, -- e.g., "09:00 - 17:00"
    ticket_prices JSONB NOT NULL DEFAULT '{"foreign": 200, "local": 40}'::jsonb, -- e.g., local & foreign adult rates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Monuments
ALTER TABLE public.monuments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to monuments" ON public.monuments
    FOR SELECT USING (true);

CREATE POLICY "Allow write/edit access to admin only" ON public.monuments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 4. Tours Table
CREATE TABLE public.tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monument_id UUID REFERENCES public.monuments(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(10, 2) NOT NULL,
    city TEXT NOT NULL,
    image_urls TEXT[] NOT NULL DEFAULT '{}',
    itinerary JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of daily descriptions
    slots_available INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Tours
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to tours" ON public.tours
    FOR SELECT USING (true);

CREATE POLICY "Allow write/edit access to admin only on tours" ON public.tours
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 5. Bookings Table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
    number_of_people INTEGER NOT NULL DEFAULT 1 CONSTRAINT chk_people CHECK (number_of_people > 0),
    tour_date DATE NOT NULL,
    contact_info JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g., email, alternative phone
    status booking_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to make bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow admins to adjust or oversee all bookings" ON public.bookings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 6. Products Table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category product_category NOT NULL,
    image_urls TEXT[] NOT NULL DEFAULT '{}',
    rating NUMERIC(3, 2) DEFAULT 5.00,
    stock INTEGER NOT NULL DEFAULT 0 CONSTRAINT chk_stock CHECK (stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write/edit to products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 7. Orders Table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status order_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to place orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow admins full control on orders" ON public.orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 8. Order Items Table
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CONSTRAINT chk_qty CHECK (quantity > 0),
    price_at_purchase NUMERIC(10, 2) NOT NULL,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE
);

-- Enable RLS for Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own order items through order validation" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Allow users to write order items for their orders" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Allow admins to oversee all order items" ON public.order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );


-- Trigger pattern for auth.users linking profiles automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, address, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.email),
        COALESCE(new.raw_user_meta_data->>'phone', ''),
        COALESCE(new.raw_user_meta_data->>'address', ''),
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'user'::user_role)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- SEED INITIAL DATA (Optional - can be run to populate tables)
-- Insert a sample Admin monument, tour and product to test the flow out of the box
INSERT INTO public.monuments (name, description, image_urls, location_coords, governorate, category, opening_hours, ticket_prices)
VALUES 
('The Pyramids of Giza', 'The Great Pyramids and the Sphinx of the Giza Plateau have symbolized Egypt for thousands of years.', ARRAY['https://modo3.com/thumbs/fit630x300/38407/1431247353/%D9%85%D8%A7_%D9%87%D9%88_%D8%A3%D8%A8%D9%88_%D8%A7%D9%84%D9%87%D9%88%D9%84.jpg'], '29.9792,31.1342', 'Giza', 'historical', '08:00 - 17:00', '{"foreign": 360, "local": 60}'),
('Karnak TempleComplex', 'Karnak is the largest religious building ever made, constructed over more than two thousand years by generations of Pharaohs.', ARRAY['https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80'], '25.7188,32.6573', 'Luxor', 'historical', '06:00 - 18:00', '{"foreign": 300, "local": 40}'),
('Abu Simbel Temples', 'Two massive rock-cut temples in Nubia, southern Egypt, carved out of the mountainside during the reign of Pharaoh Ramesses II.', ARRAY['https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80'], '22.3372,31.6258', 'Aswan', 'historical', '05:00 - 17:00', '{"foreign": 400, "local": 50}');
