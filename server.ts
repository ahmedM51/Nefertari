import express from "express";
import path from "path";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==========================================================
// DB STATE (FALLBACK TO FULL METRIC & DATA SIMULATOR IF SUPABASE IS ACTIVE/INACTIVE)
// ==========================================================
let monuments = [
  {
    id: "m1",
    name: "The Pyramids of Giza & Great Sphinx",
    description: "The Great Pyramids and the silent Sphinx of the Giza Plateau stand as timeless monuments of human achievement. Built during the Fourth Dynasty of the Old Kingdom, they were constructed as monumental tombs for the Pharaohs Khufu, Khafre, and Menkaure.",
    image_urls: [
      "https://modo3.com/thumbs/fit630x300/38407/1431247353/%D9%85%D8%A7_%D9%87%D9%88_%D8%A3%D8%A8%D9%88_%D8%A7%D9%84%D9%87%D9%88%D9%84.jpg",
      "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80"
    ],
    location_coords: "29.9792,31.1342",
    governorate: "Giza",
    category: "historical",
    opening_hours: "08:00 - 17:00",
    ticket_prices: { foreign: 360, local: 60 }
  },
  {
    id: "m2",
    name: "Karnak Temple Complex",
    description: "Karnak is the largest religious temple complex ever constructed, developed over 2,000 years by more than 30 Pharaohs. Dedicated to the Theban Triad of Amun, Mut, and Khonsu, it features the grand Hypostyle Hall with 134 towering sandstone pillars.",
    image_urls: [
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=1200&q=80"
    ],
    location_coords: "25.7188,32.6573",
    governorate: "Luxor",
    category: "historical",
    opening_hours: "06:00 - 18:00",
    ticket_prices: { foreign: 300, local: 40 }
  },
  {
    id: "m3",
    name: "Valley of the Kings",
    description: "The primary burial site for pharaohs of the New Kingdom, including Tutankhamun and Ramesses the Great. Nestled deep within the Theban Hills, these rock-cut tombs contain some of the most vibrant and well-preserved ancient frescoes in existence.",
    image_urls: [
      "https://images.unsplash.com/photo-1626509135832-fb91b4898160?auto=format&fit=crop&w=1200&q=80"
    ],
    location_coords: "25.7402,32.6014",
    governorate: "Luxor",
    category: "historical",
    opening_hours: "06:00 - 17:00",
    ticket_prices: { foreign: 400, local: 50 }
  },
  {
    id: "m4",
    name: "Temple of Philae & Isis Sanctuary",
    description: "Surrounded by the waters of the Nile, Philae Temple was rescued from submersion during the Aswan Low Dam construction and moved to Agilkia Island. It is dedicated to Isis, goddess of magic, motherhood, and healing.",
    image_urls: [
      "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=80"
    ],
    location_coords: "24.0249,32.8845",
    governorate: "Aswan",
    category: "religious",
    opening_hours: "07:00 - 16:00",
    ticket_prices: { foreign: 200, local: 30 }
  },
  {
    id: "m5",
    name: "Ras Muhammad National Park",
    description: "A spectacular natural reserve at the southern tip of the Sinai Peninsula. Renowned globally for marine biodiversity, vibrant coral reefs, shipwrecks, and crystalloid desert bays matching ancient natural marine paths.",
    image_urls: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
    ],
    location_coords: "27.7288,34.2575",
    governorate: "South Sinai",
    category: "natural",
    opening_hours: "08:00 - 17:00",
    ticket_prices: { foreign: 150, local: 25 }
  }
];

let tours = [
  {
    id: "t1",
    monument_id: "m1",
    title: "Giza Pyramids & Grand Egyptian Museum Expedition",
    description: "An intensive single-day luxury tour diving deep into ancient Memphis geology, Fourth Dynasty architecture, and Khufu's solar ship, guided by a licensed Egyptologist.",
    duration_days: 1,
    price: 95.0,
    city: "Cairo & Giza",
    image_urls: [
      "https://modo3.com/thumbs/fit630x300/38407/1431247353/%D9%85%D8%A7_%D9%87%D9%88_%D8%A3%D8%A8%D9%88_%D8%A7%D9%84%D9%87%D9%88%D9%84.jpg"
    ],
    itinerary: [
      { day: 1, title: "Plateau Exploration & Solar Ship Museum", description: "Start with sunrise over Giza, a camel trek around the Great Sphinx, and entry into the interior chambers of Khufu's pyramid. Follow with private access gallery viewings inside the newly curated Grand Egyptian Museum." }
    ],
    slots_available: 18
  },
  {
    id: "t2",
    monument_id: "m2",
    title: "Luxor & Theban Necropolis 3-Day Heritage Passage",
    description: "Discover the immense contrast between the East Bank (temples of Karnak & Luxor) and the West Bank (Valley of the Kings, Hatshepsut Temple, Memnon Colossi). Includes traditional felucca cruising at sunset.",
    duration_days: 3,
    price: 240.0,
    city: "Luxor",
    image_urls: [
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80"
    ],
    itinerary: [
      { day: 1, title: "The East Bank Majesty & Hypostyle Immersion", description: "Arrive in Luxor. Walk the path of Sphinxes connecting Karnak Temple to Luxor Temple. Experience the evening Sound & Light performance." },
      { day: 2, title: "Tombs of the Pharaohs & Queen Hatshepsut Terraces", description: "Cross the Nile at dawn. Spend hours exploring 3 royal tombs inside the Valley of the Kings, followed by the impressive rock-cut temple of Hatshepsut. Stop by the giant Memnon Colossi." },
      { day: 3, title: "Traditional Felucca Sailing & Local Artisan Crafts", description: "Sunset trip aboard a sailboat, visiting banana island. Browse local alabaster and papyrus workshops to see ancient methods of manual production." }
    ],
    slots_available: 12
  },
  {
    id: "t3",
    monument_id: "m4",
    title: "Nile Cruise & Aswan Island Echoes",
    description: "Relaxing 4-day excursion through the ancient temples flanking the Nile, culminating in Philae Island, Elephantine Island, and visiting a Nubian Village.",
    duration_days: 4,
    price: 380.0,
    city: "Aswan & Edfu",
    image_urls: [
      "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=80"
    ],
    itinerary: [
      { day: 1, title: "Philae Temple & Aswan High Dam", description: "Visit Philae Island by motorboat. Learn about the legendary salvage mission." },
      { day: 2, title: "Kom Ombo & Crocodile Museum", description: "Sail north. Explore the unique double-temple of Sobek & Haroeris." },
      { day: 3, title: "Edfu Horus Sanctuary", description: "Tour Edfu temple via horse carriage, viewing the best preserved Greco-Roman temple in Egypt." },
      { day: 4, title: "Nubian Cultural Experience", description: "Visit botanical gardens and enjoy a sunset feast with traditional Nubian musicians." }
    ],
    slots_available: 8
  }
];

let products = [
  {
    id: "p1",
    name: "Tutankhamun Ceremonial Burial Mask Reproduction",
    description: "An authentic, handcrafted resin bust of the boy king Tutankhamun, meticulously finished with deep gold and lapis-lazuli blue enamel colors. Made by multi-generation artisans in Khan El-Khalili.",
    price: 120.0,
    category: "statues",
    image_urls: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.9,
    stock: 25
  },
  {
    id: "p2",
    name: "Nefertari & Anubis Papyrus Painting",
    description: "Painted by hand using organic mineral pigments on genuine Egyptian papyrus reeds. This masterpiece depicts Queen Nefertari being guided through the underworld by Anubis, matching the actual reliefs from her Luxor tomb QV66.",
    price: 45.0,
    category: "papyrus",
    image_urls: [
      "https://images.unsplash.com/photo-1599733490715-18db6ded1503?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.8,
    stock: 14
  },
  {
    id: "p3",
    name: "Lapis Lazuli Pharaoh Cartouche Bracelet",
    description: "An elegant bracelet featuring sterling silver cartouche elements and deep blue Afghanistan Lapis Lazuli beads, symbolizing divine kingship and the starry night sky of Nut.",
    price: 75.0,
    category: "accessories",
    image_urls: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 5.0,
    stock: 8
  },
  {
    id: "p4",
    name: "Handcrafted Alabaster Urn & Candle Holder",
    description: "Sculpted out of raw Egyptian translucent white alabaster from Aswan. When lit, the natural striations and crystalline channels emit an ethereal golden glow reminiscent of ancient temples.",
    price: 35.0,
    category: "handicrafts",
    image_urls: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.7,
    stock: 30
  }
];

let bookings = [
  {
    id: "b1",
    user_id: "demo-user-id",
    tour_id: "t1",
    number_of_people: 2,
    tour_date: "2026-08-15",
    contact_info: { email: "ahmedmohamed4336@gmail.com", alt_phone: "+201012345678" },
    status: "confirmed",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "b2",
    user_id: "demo-user-id",
    tour_id: "t2",
    number_of_people: 4,
    tour_date: "2026-09-10",
    contact_info: { email: "ahmedmohamed4336@gmail.com", alt_phone: "+201012345678" },
    status: "pending",
    created_at: new Date().toISOString()
  }
];

let orders = [
  {
    id: "o1",
    user_id: "demo-user-id",
    customer_name: "Ahmed Mohamed",
    phone: "+201122334455",
    shipping_address: "15 Zamalek Mansions, Cairo, Egypt",
    total_price: 165.0,
    status: "processing",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { product_id: "p1", name: "Tutankhamun Ceremonial Burial Mask Reproduction", quantity: 1, price_at_purchase: 120.0 },
      { product_id: "p2", name: "Nefertari & Anubis Papyrus Painting", quantity: 1, price_at_purchase: 45.0 }
    ]
  }
];

let profiles = [
  {
    id: "demo-user-id",
    full_name: "Ahmed Mohamed",
    phone: "+201122334455",
    address: "15 Zamalek Mansions, Cairo, Egypt",
    role: "user",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "demo-admin-id",
    full_name: "Nefertari Admin Team",
    phone: "+2010099887766",
    address: "Tourism Development Bureau, Heliopolis, Cairo",
    role: "admin",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Local mock credential store (used when Supabase is not configured)
const registeredUsers: { email: string; password: string; profileId: string }[] = [];

// ==========================================================
// SUPABASE CLIENT INITIALIZATION (LAZY / AUTO DETECT)
// ==========================================================
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
const isSupabaseConfigured = supabaseUrl !== "" && supabaseAnonKey !== "";

let supabase: any = null;
if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log("Supabase Client initialized successfully using master service role key.");
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
  }
} else {
  console.log("Supabase credentials missing. Utilizing highly stateful Mock Database Engine for live demo.");
}

// ==========================================================
// MIDDLEWARES
// ==========================================================

// Authenticate user
const requireAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // If we're simulating, we can accept a demo-user header too
    const demoUserHeader = req.headers["x-demo-user-id"];
    if (demoUserHeader) {
      req.user = profiles.find(p => p.id === demoUserHeader) || profiles[0];
      return next();
    }
    return res.status(401).json({ error: "Access Denied: Missing auth credentials." });
  }

  const token = authHeader.split(" ")[1];

  // If Supabase is active, check token
  if (isSupabaseConfigured && supabase) {
    if (token === "mock-user-token" || token === "mock-admin-token") {
      const is_admin = token === "mock-admin-token";
      const user_id = is_admin ? "22222222-2222-2222-2222-222222222222" : "11111111-1111-1111-1111-111111111111";
      const profile_data = is_admin ? {
        id: user_id,
        full_name: "Nefertari Admin Team",
        phone: "+2010099887766",
        address: "Tourism Development Bureau, Heliopolis, Cairo",
        role: "admin"
      } : {
        id: user_id,
        full_name: "Ahmed Mohamed",
        phone: "+201122334455",
        address: "15 Zamalek Mansions, Cairo, Egypt",
        role: "user"
      };

      try {
        const { data: existing } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user_id)
          .maybeSingle();

        if (!existing) {
          await supabase.from("profiles").insert(profile_data);
          console.log(`Seeded deterministic mock profile for ${profile_data.role} successfully in Supabase.`);
        }
      } catch (err) {
        console.error("Failed to seed mock profile in Supabase profiles:", err);
      }

      req.user = {
        id: user_id,
        email: is_admin ? "admin@nefertari.com" : "ahmedmohamed4336@gmail.com",
        role: is_admin ? "admin" : "user",
        full_name: profile_data.full_name,
        phone: profile_data.phone,
        address: profile_data.address
      };
      return next();
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({ error: "Invalid auth token." });
      }

      // Fetch Profile Role
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      req.user = {
        id: user.id,
        email: user.email,
        role: profile ? profile.role : "user",
        full_name: profile ? profile.full_name : user.email,
        phone: profile ? profile.phone : "",
        address: profile ? profile.address : ""
      };
      return next();
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    // Local memory authentication bypass using simple mock tokens
    if (token === "mock-admin-token") {
      req.user = profiles[1]; // Admin
    } else if (token === "mock-user-token") {
      req.user = profiles[0]; // Standard user
    } else {
      req.user = profiles[0]; 
    }
    next();
  }
};

// Require Admin Middleware
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin privileges required." });
  }

  next();
};

// ==========================================================
// PUBLIC API ENDPOINTS
// ==========================================================

// GET Monuments
app.get("/api/monuments", async (req, res) => {
  const { search, category, governorate } = req.query;

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from("monuments").select("*");
      if (search) query = query.ilike("name", `%${search}%`);
      if (category) query = query.eq("category", category);
      if (governorate) query = query.eq("governorate", governorate);
      const { data, error } = await query;
      if (error) throw error;
      return res.json(data);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Fallback to local
  let result = [...monuments];
  if (search) {
    const s = String(search).toLowerCase();
    result = result.filter(m => m.name.toLowerCase().includes(s) || m.description.toLowerCase().includes(s));
  }
  if (category) {
    result = result.filter(m => m.category === category);
  }
  if (governorate) {
    result = result.filter(m => m.governorate.toLowerCase() === String(governorate).toLowerCase());
  }
  res.json(result);
});

// GET Tours
app.get("/api/tours", async (req, res) => {
  const { city, search } = req.query;

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from("tours").select("*, monuments(*)");
      if (search) query = query.ilike("title", `%${search}%`);
      if (city) query = query.ilike("city", `%${city}%`);
      const { data, error } = await query;
      if (error) throw error;
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  let result = [...tours];
  if (search) {
    const s = String(search).toLowerCase();
    result = result.filter(t => t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s));
  }
  if (city) {
    const c = String(city).toLowerCase();
    result = result.filter(t => t.city.toLowerCase().includes(c));
  }
  res.json(result);
});

// GET Products
app.get("/api/products", async (req, res) => {
  const { search, category } = req.query;

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from("products").select("*");
      if (search) query = query.ilike("name", `%${search}%`);
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (error) throw error;
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  let result = [...products];
  if (search) {
    const s = String(search).toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
  }
  if (category) {
    result = result.filter(p => p.category === category);
  }
  res.json(result);
});

// ==========================================================
// USER ENDPOINTS (AUTHENTICATED)
// ==========================================================

// Create booking
app.post("/api/bookings", requireAuth, async (req: any, res) => {
  const { tour_id, number_of_people, tour_date, contact_info } = req.body;
  const user_id = req.user.id;

  if (!tour_id || !number_of_people || !tour_date) {
    return res.status(400).json({ error: "Missing required booking details." });
  }

  if (isSupabaseConfigured && supabase) {
    try {
      // Create transaction via direct supabase operations
      // First ensure tour exists and slots are enough
      const { data: tour, error: tourErr } = await supabase
        .from("tours")
        .select("slots_available")
        .eq("id", tour_id)
        .single();
      
      if (tourErr || !tour) return res.status(404).json({ error: "Tour packages not found." });
      if (tour.slots_available < number_of_people) {
        return res.status(400).json({ error: "Insufficient available tour slots." });
      }

      // Put booking
      const { data: booking, error: bErr } = await supabase
        .from("bookings")
        .insert({
          user_id,
          tour_id,
          number_of_people,
          tour_date,
          contact_info: contact_info || {},
          status: "pending"
        })
        .select()
        .single();

      if (bErr) throw bErr;

      // Update tourslots
      await supabase
        .from("tours")
        .update({ slots_available: tour.slots_available - number_of_people })
        .eq("id", tour_id);

      return res.json({ success: true, booking });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Local fallback
  const tour = tours.find(t => t.id === tour_id);
  if (!tour) return res.status(404).json({ error: "Tour not found." });
  if (tour.slots_available < number_of_people) {
    return res.status(400).json({ error: "Not enough tour slots available for chosen date." });
  }

  // Update original tour slots
  tour.slots_available -= Number(number_of_people);

  const newBooking = {
    id: "b_" + Math.random().toString(36).substr(2, 9),
    user_id,
    tour_id,
    number_of_people: Number(number_of_people),
    tour_date,
    contact_info: contact_info || {},
    status: "pending" as const,
    created_at: new Date().toISOString()
  };

  bookings.push(newBooking);
  res.json({ success: true, booking: newBooking });
});

// Fetch personal bookings history
app.get("/api/users/bookings", requireAuth, async (req: any, res) => {
  const user_id = req.user.id;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, tour:tours(*)")
        .eq("user_id", user_id);
      if (error) throw error;
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Return local bookings for current user, attaching complete tour description
  const userBookings = bookings.filter(b => b.user_id === user_id).map(b => {
    return {
      ...b,
      tour: tours.find(t => t.id === b.tour_id)
    };
  });
  res.json(userBookings);
});

// Fetch personal orders history
app.get("/api/users/orders", requireAuth, async (req: any, res) => {
  const user_id = req.user.id;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, items:order_items(*, product:products(*))")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Transform structure to match frontend expectations
      const formatted = (data || []).map((o: any) => {
        const formattedItems = (o.items || []).map((item: any) => ({
          product_id: item.product_id,
          name: item.product?.name || "Handicraft item",
          quantity: item.quantity,
          price_at_purchase: Number(item.price_at_purchase)
        }));
        return {
          id: o.id,
          user_id: o.user_id,
          customer_name: o.customer_name,
          phone: o.phone,
          shipping_address: o.shipping_address,
          total_price: Number(o.total_price),
          status: o.status,
          created_at: o.created_at,
          items: formattedItems
        };
      });

      return res.json(formatted);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  const userOrders = orders.filter(o => o.user_id === user_id);
  res.json(userOrders);
});

// Place e-commerce order
app.post("/api/orders", requireAuth, async (req: any, res) => {
  const { customer_name, phone, shipping_address, cart_items } = req.body;
  const user_id = req.user.id;

  if (!cart_items || cart_items.length === 0 || !customer_name || !phone || !shipping_address) {
    return res.status(400).json({ error: "Order details or Cart Items are missing." });
  }

  if (isSupabaseConfigured && supabase) {
    try {
      // Calculate Total with Database integrity checks
      let total = 0;
      for (const item of cart_items) {
        const { data: pr, error: prErr } = await supabase
          .from("products")
          .select("price, stock")
          .eq("id", item.product_id)
          .single();
        if (prErr || !pr) return res.status(400).json({ error: `Product ID ${item.product_id} is unavailable.` });
        if (pr.stock < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for product ${item.name}.` });
        }
        total += pr.price * item.quantity;
      }

      // Insert Order
      const { data: order, error: oErr } = await supabase
        .from("orders")
        .insert({
          user_id,
          customer_name,
          phone,
          shipping_address,
          total_price: total,
          status: "pending"
        })
        .select()
        .single();
      if (oErr) throw oErr;

      // Decrement stock & save items
      for (const item of cart_items) {
        const { data: pr } = await supabase.from("products").select("stock").eq("id", item.product_id).single();
        
        await supabase
          .from("products")
          .update({ stock: pr.stock - item.quantity })
          .eq("id", item.product_id);

        await supabase.from("order_items").insert({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.price
        });
      }

      return res.json({ success: true, order_id: order.id, total_price: total });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Local fallback Stock checking and purchase simulation
  let total_price = 0;
  const orderItemsList = [];

  for (const item of cart_items) {
    const product = products.find(p => p.id === item.product_id);
    if (!product) {
      return res.status(404).json({ error: `Product ${item.name} not found.` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for Egyptian Handicraft: ${item.name}. Only ${product.stock} items remaining.` });
    }
    total_price += product.price * item.quantity;
    orderItemsList.push({
      product_id: item.product_id,
      name: item.name,
      quantity: item.quantity,
      price_at_purchase: product.price
    });
  }

  // Deduct stock
  for (const item of cart_items) {
    const product = products.find(p => p.id === item.product_id)!;
    product.stock -= item.quantity;
  }

  const newOrder = {
    id: "ord_" + Math.random().toString(36).substr(2, 9),
    user_id,
    customer_name,
    phone,
    shipping_address,
    total_price,
    status: "pending" as const,
    created_at: new Date().toISOString(),
    items: orderItemsList
  };

  orders.push(newOrder);
  res.json({ success: true, order_id: newOrder.id, total_price });
});

// ==========================================================
// ADMIN CRUDS (RESTRICTED TO ADMIN ONLY)
// ==========================================================

// Auth simulation endpoint (easy toggle in web screen)
app.post("/api/auth/demo-toggle", (req, res) => {
  const { role } = req.body;
  if (role === "admin") {
    res.json({ token: "mock-admin-token", profile: profiles[1] });
  } else {
    res.json({ token: "mock-user-token", profile: profiles[0] });
  }
});

// Account registration endpoint
app.post("/api/auth/register", async (req, res) => {
  const { email, password, full_name, phone } = req.body;
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPassword = (password || "").trim();
  const cleanName = (full_name || "").trim();

  if (!cleanEmail || !cleanPassword || !cleanName) {
    return res.status(400).json({ error: "Email, password, and full name are required." });
  }
  if (cleanPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }
  if (cleanEmail === "admin@gmail.com") {
    return res.status(400).json({ error: "This email is reserved for administration." });
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: { data: { full_name: cleanName, phone: phone || "" } }
      });
      if (error) throw error;

      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: cleanName,
          phone: phone || "",
          address: "",
          role: "user"
        });
      }

      return res.json({ success: true, message: "Account created successfully. You can now sign in." });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  if (registeredUsers.some((u) => u.email === cleanEmail)) {
    return res.status(400).json({ error: "An account with this email already exists." });
  }

  const newProfile = {
    id: "user_" + Math.random().toString(36).substr(2, 9),
    full_name: cleanName,
    phone: phone || "",
    address: "",
    role: "user" as const,
    created_at: new Date().toISOString()
  };

  registeredUsers.push({ email: cleanEmail, password: cleanPassword, profileId: newProfile.id });
  profiles.push(newProfile);

  res.json({ success: true, message: "Account created successfully. You can now sign in." });
});

// Credentials verification endpoint
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPassword = (password || "").trim();

  if (!cleanEmail || !cleanPassword) {
    return res.status(400).json({ error: "Missing email or password." });
  }

  // Hardcoded admin credentials (works in both mock and Supabase modes)
  if (cleanEmail === "admin@gmail.com" && cleanPassword.toUpperCase() === "ADMIN1234") {
    return res.json({ token: "mock-admin-token", profile: profiles[1] });
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });
      if (error) throw error;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();

      return res.json({
        token: data.session?.access_token,
        profile: profile || {
          id: data.user.id,
          full_name: cleanNameFromEmail(cleanEmail),
          phone: "",
          address: "",
          role: "user",
          created_at: new Date().toISOString()
        }
      });
    } catch (error: any) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
  }

  // Mock mode: verify registered users
  const registered = registeredUsers.find((u) => u.email === cleanEmail);
  if (registered) {
    if (registered.password !== cleanPassword) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const profile = profiles.find((p) => p.id === registered.profileId);
    if (profile) {
      return res.json({ token: "mock-user-token", profile });
    }
  }

  return res.status(401).json({ error: "Invalid credentials. Please register a new account first." });
});

function cleanNameFromEmail(email: string) {
  return email.split("@")[0].replace(/[._]/g, " ");
}

// Update Profile Detail (Tabs editing)
app.put("/api/users/profile", requireAuth, async (req: any, res) => {
  const { full_name, phone, address } = req.body;
  const user_id = req.user.id;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name, phone, address })
        .eq("id", user_id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  const profile = profiles.find(p => p.id === user_id);
  if (profile) {
    profile.full_name = full_name;
    profile.phone = phone;
    profile.address = address;
  }
  res.json({ success: true, profile });
});

// 1. Monuments CRUD
app.post("/api/admin/monuments", requireAuth, requireAdmin, async (req, res) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("monuments").insert(req.body).select().single();
      if (error) throw error;
      return res.json(data);
    } catch (e: any) { return res.status(520).json({ error: e.message }); }
  }

  const newM = { id: "m_" + Math.random().toString(36).substr(2, 9), ...req.body };
  monuments.unshift(newM);
  res.json(newM);
});

app.put("/api/admin/monuments/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("monuments").update(req.body).eq("id", id).select().single();
      if (error) throw error;
      return res.json(data);
    } catch (e: any) { return res.status(500).json({ error: e.message }); }
  }

  const index = monuments.findIndex(m => m.id === id);
  if (index !== -1) {
    monuments[index] = { ...monuments[index], ...req.body };
    return res.json(monuments[index]);
  }
  res.status(404).json({ error: "Monument not found" });
});

app.delete("/api/admin/monuments/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("monuments").delete().eq("id", id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (e: any) { return res.status(500).json({ error: e.message }); }
  }

  monuments = monuments.filter(m => m.id !== id);
  res.json({ success: true });
});


// 2. Tours CRUD
app.post("/api/admin/tours", requireAuth, requireAdmin, async (req, res) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("tours").insert(req.body).select().single();
      if (error) throw error;
      return res.json(data);
    } catch (e: any) { return res.status(500).json({ error: e.message }); }
  }

  const newT = { id: "t_" + Math.random().toString(36).substr(2, 9), ...req.body };
  tours.unshift(newT);
  res.json(newT);
});

app.put("/api/admin/tours/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("tours").update(req.body).eq("id", id).select().single();
      if (error) throw error;
      return res.json(data);
    } catch (e: any) { return res.status(500).json({ error: e.message }); }
  }

  const index = tours.findIndex(t => t.id === id);
  if (index !== -1) {
    tours[index] = { ...tours[index], ...req.body };
    return res.json(tours[index]);
  }
  res.status(404).json({ error: "Tour not found" });
});

app.delete("/api/admin/tours/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("tours").delete().eq("id", id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (e: any) { return res.status(500).json({ error: e.message }); }
  }

  tours = tours.filter(t => t.id !== id);
  res.json({ success: true });
});


// 3. Products CRUD
app.post("/api/admin/products", requireAuth, requireAdmin, async (req, res) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("products").insert(req.body).select().single();
      if (error) throw error;
      return res.json(data);
    } catch (e: any) { return res.status(500).json({ error: e.message }); }
  }

  const newP = { id: "p_" + Math.random().toString(36).substr(2, 9), ...req.body, rating: 5.0 };
  products.unshift(newP);
  res.json(newP);
});

app.put("/api/admin/products/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("products").update(req.body).eq("id", id).select().single();
      if (error) throw error;
      return res.json(data);
    } catch (e: any) { return res.status(500).json({ error: e.message }); }
  }

  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    return res.json(products[index]);
  }
  res.status(404).json({ error: "Product not found" });
});

app.delete("/api/admin/products/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (e: any) { return res.status(500).json({ error: e.message }); }
  }

  products = products.filter(p => p.id !== id);
  res.json({ success: true });
});

// PUT Admin update Booking Status
app.put("/api/admin/bookings/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "confirmed", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid booking status" });
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  const booking = bookings.find(b => b.id === id);
  if (booking) {
    booking.status = status;
    return res.json(booking);
  }
  res.status(404).json({ error: "Booking session not found" });
});

// PUT Admin update Order Status
app.put("/api/admin/orders/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "processing", "shipped", "delivered"].includes(status)) {
    return res.status(400).json({ error: "Invalid shipping status" });
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    return res.json(order);
  }
  res.status(404).json({ error: "Order details not found" });
});

// GET Admin Dashboard (KPI metrics stats)
app.get("/api/admin/dashboard", requireAuth, requireAdmin, async (req, res) => {
  if (isSupabaseConfigured && supabase) {
    try {
      // Direct count of each table using supabase selectors
      const { count: userCount, error: ue } = await supabase.from("profiles").select("*", { count: "exact" });
      const { count: bookingCount, error: be } = await supabase.from("bookings").select("*", { count: "exact" });
      const { count: orderCount, error: oe } = await supabase.from("orders").select("*", { count: "exact" });
      
      // Calculate revenue sum from orders
      const { data: ords, error: re } = await supabase.from("orders").select("total_price").eq("status", "delivered");
      const rev = ords ? ords.reduce((sum: number, o: any) => sum + Number(o.total_price), 0) : 0;

      if (ue || be || oe || re) throw new Error("Dashboard compilation failed.");

      return res.json({
        total_users: userCount || 0,
        total_bookings: bookingCount || 0,
        total_orders: orderCount || 0,
        total_revenue: rev || 0
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Local fallback aggregation calculations
  const total_users = profiles.length;
  const total_bookings = bookings.length;
  const total_orders = orders.length;
  const total_revenue = orders.reduce((acc, current) => acc + current.total_price, 0);

  res.json({
    total_users,
    total_bookings,
    total_orders,
    total_revenue
  });
});

// Return connection status for UI notification banners
app.get("/api/database-status", (req, res) => {
  res.json({
    isSupabaseConfigured,
    supabaseUrl: isSupabaseConfigured ? supabaseUrl : null
  });
});

// Admin listings of bookings & orders
app.get("/api/admin/bookings", requireAuth, requireAdmin, async (req, res) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, tour:tours(*), user:profiles(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  const result = bookings.map(b => {
    return {
      ...b,
      tour: tours.find(t => t.id === b.tour_id),
      user: profiles.find(p => p.id === b.user_id)
    };
  });
  res.json(result);
});

app.get("/api/admin/orders", requireAuth, requireAdmin, async (req, res) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, user:profiles(*), items:order_items(*, product:products(*))")
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Transform structure to match frontend expectations
      const formatted = (data || []).map((o: any) => {
        const formattedItems = (o.items || []).map((item: any) => ({
          product_id: item.product_id,
          name: item.product?.name || "Handicraft item",
          quantity: item.quantity,
          price_at_purchase: Number(item.price_at_purchase)
        }));
        return {
          id: o.id,
          user_id: o.user_id,
          customer_name: o.customer_name,
          phone: o.phone,
          shipping_address: o.shipping_address,
          total_price: Number(o.total_price),
          status: o.status,
          created_at: o.created_at,
          items: formattedItems,
          user: o.user
        };
      });

      return res.json(formatted);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  const result = orders.map(o => {
    return {
      ...o,
      user: profiles.find(p => p.id === o.user_id)
    };
  });
  res.json(result);
});

app.get("/api/admin/users", requireAuth, requireAdmin, async (req, res) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.json(profiles);
});

// Global JSON error handler (prevents HTML error pages on API routes)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("API error:", err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({ error: err.message || "Internal server error" });
  }
});

// ==========================================================
// VITE CLIENT INTEGRATION MIDDLEWARES & LAUNCHER
// ==========================================================
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Start Server listening (bound strictly to Port 3000 and 0.0.0.0)
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nefertari (نفرتاري) Node server active on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  initializeServer().catch((err) => {
    console.error("Failed to start civilizers server:", err);
  });
}

export default app;
