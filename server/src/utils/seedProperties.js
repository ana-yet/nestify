import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Property from "../models/Property.js";
import bcrypt from "bcryptjs";

dotenv.config();

const owners = [
  {
    name: "Sarah Johnson",
    email: "sarah.owner@nestify.com",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Chen",
    email: "michael.owner@nestify.com",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Emily Rodriguez",
    email: "emily.owner@nestify.com",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

const properties = [
  // ── Sarah's properties ──────────────────────────
  {
    title: "Modern Downtown Apartment",
    description:
      "Stylish 2-bedroom apartment in the heart of downtown with floor-to-ceiling windows, hardwood floors, and a gourmet kitchen. Walking distance to restaurants, shops, and public transit.",
    location: {
      address: "125 Main Street, Unit 14B",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
      coordinates: { lat: 40.7484, lng: -73.9967 },
    },
    propertyType: "apartment",
    rent: 3200,
    rentType: "monthly",
    bedrooms: 2,
    bathrooms: 2,
    propertySize: 1100,
    amenities: ["WiFi", "Air Conditioning", "Gym", "Doorman", "Laundry"],
    extraFeatures: ["City View", "Smart Home System", "Walk-in Closet"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    ],
    status: "approved",
    isFeatured: true,
    averageRating: 4.8,
    reviewCount: 12,
  },
  {
    title: "Cozy Studio near Central Park",
    description:
      "Charming studio apartment just steps from Central Park. Perfect for young professionals. Includes updated kitchen, exposed brick walls, and abundant natural light.",
    location: {
      address: "890 Columbus Ave, Apt 3C",
      city: "New York",
      state: "NY",
      zip: "10025",
      country: "USA",
      coordinates: { lat: 40.7831, lng: -73.9712 },
    },
    propertyType: "apartment",
    rent: 2100,
    rentType: "monthly",
    bedrooms: 0,
    bathrooms: 1,
    propertySize: 500,
    amenities: ["WiFi", "Heating", "Laundry"],
    extraFeatures: ["Exposed Brick", "Park View"],
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
    ],
    status: "approved",
    isFeatured: false,
    averageRating: 4.3,
    reviewCount: 7,
  },
  {
    title: "Luxury Penthouse Suite",
    description:
      "Stunning penthouse with panoramic skyline views, private terrace, and designer furnishings. Features a chef's kitchen, spa bathroom, and home automation throughout.",
    location: {
      address: "400 Fifth Avenue, PH1",
      city: "New York",
      state: "NY",
      zip: "10018",
      country: "USA",
      coordinates: { lat: 40.7489, lng: -73.9857 },
    },
    propertyType: "apartment",
    rent: 8500,
    rentType: "monthly",
    bedrooms: 3,
    bathrooms: 3,
    propertySize: 2800,
    amenities: [
      "WiFi",
      "Air Conditioning",
      "Gym",
      "Pool",
      "Doorman",
      "Parking",
      "Laundry",
    ],
    extraFeatures: [
      "Private Terrace",
      "Skyline View",
      "Smart Home System",
      "Wine Cellar",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    status: "approved",
    isFeatured: true,
    averageRating: 5.0,
    reviewCount: 5,
  },

  // ── Michael's properties ────────────────────────
  {
    title: "Charming Suburban House",
    description:
      "Beautiful 4-bedroom family home in a quiet neighborhood with a large backyard, modern kitchen, and two-car garage. Near top-rated schools and parks.",
    location: {
      address: "456 Oak Lane",
      city: "Austin",
      state: "TX",
      zip: "78701",
      country: "USA",
      coordinates: { lat: 30.2672, lng: -97.7431 },
    },
    propertyType: "house",
    rent: 2800,
    rentType: "monthly",
    bedrooms: 4,
    bathrooms: 3,
    propertySize: 2400,
    amenities: [
      "WiFi",
      "Air Conditioning",
      "Parking",
      "Backyard",
      "Washer/Dryer",
    ],
    extraFeatures: ["Two-Car Garage", "Fireplace", "Home Office"],
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800",
    ],
    status: "approved",
    isFeatured: true,
    averageRating: 4.6,
    reviewCount: 18,
  },
  {
    title: "Beachfront Condo with Ocean Views",
    description:
      "Wake up to ocean views in this stunning 2-bedroom beachfront condo. Features an open floor plan, private balcony, and direct beach access.",
    location: {
      address: "789 Seaside Blvd, Unit 2201",
      city: "Miami",
      state: "FL",
      zip: "33139",
      country: "USA",
      coordinates: { lat: 25.7617, lng: -80.1918 },
    },
    propertyType: "condo",
    rent: 4200,
    rentType: "monthly",
    bedrooms: 2,
    bathrooms: 2,
    propertySize: 1350,
    amenities: [
      "WiFi",
      "Air Conditioning",
      "Pool",
      "Gym",
      "Parking",
      "Doorman",
    ],
    extraFeatures: ["Ocean View", "Private Balcony", "Beach Access"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800",
    ],
    status: "approved",
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 22,
  },
  {
    title: "Rustic Mountain Cabin",
    description:
      "Secluded log cabin nestled in the mountains. Perfect getaway with wood-burning fireplace, hot tub, and hiking trails right outside your door.",
    location: {
      address: "12 Timber Ridge Road",
      city: "Denver",
      state: "CO",
      zip: "80202",
      country: "USA",
      coordinates: { lat: 39.7392, lng: -104.9903 },
    },
    propertyType: "house",
    rent: 1800,
    rentType: "weekly",
    bedrooms: 3,
    bathrooms: 2,
    propertySize: 1800,
    amenities: ["WiFi", "Heating", "Parking", "Hot Tub", "Fireplace"],
    extraFeatures: ["Mountain View", "Hiking Trails", "BBQ Grill"],
    images: [
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
    ],
    status: "approved",
    isFeatured: false,
    averageRating: 4.7,
    reviewCount: 15,
  },

  // ── Emily's properties ──────────────────────────
  {
    title: "Elegant Townhouse in Georgetown",
    description:
      "Historic 3-story townhouse with original hardwood floors, updated kitchen, and private courtyard garden. Located in the heart of Georgetown.",
    location: {
      address: "321 M Street NW",
      city: "Washington",
      state: "DC",
      zip: "20007",
      country: "USA",
      coordinates: { lat: 38.9072, lng: -77.0369 },
    },
    propertyType: "townhouse",
    rent: 4500,
    rentType: "monthly",
    bedrooms: 3,
    bathrooms: 2,
    propertySize: 2200,
    amenities: ["WiFi", "Air Conditioning", "Washer/Dryer", "Heating"],
    extraFeatures: [
      "Courtyard Garden",
      "Original Hardwood Floors",
      "Exposed Brick",
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
    ],
    status: "approved",
    isFeatured: false,
    averageRating: 4.5,
    reviewCount: 9,
  },
  {
    title: "Sunny Lakeside Villa",
    description:
      "Gorgeous waterfront villa with private dock, infinity pool, and stunning sunset views. Open-concept living with high-end finishes throughout.",
    location: {
      address: "55 Lakeview Drive",
      city: "Chicago",
      state: "IL",
      zip: "60611",
      country: "USA",
      coordinates: { lat: 41.8781, lng: -87.6298 },
    },
    propertyType: "villa",
    rent: 6500,
    rentType: "monthly",
    bedrooms: 5,
    bathrooms: 4,
    propertySize: 4200,
    amenities: [
      "WiFi",
      "Air Conditioning",
      "Pool",
      "Parking",
      "Washer/Dryer",
      "Gym",
    ],
    extraFeatures: [
      "Lake View",
      "Private Dock",
      "Infinity Pool",
      "Home Theater",
    ],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    status: "approved",
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 30,
  },
  {
    title: "Trendy Loft in Arts District",
    description:
      "Open-concept loft in a converted warehouse with soaring ceilings, industrial finishes, and an abundance of natural light. Walking distance to galleries and cafes.",
    location: {
      address: "888 Arts Blvd, Loft 7",
      city: "Los Angeles",
      state: "CA",
      zip: "90013",
      country: "USA",
      coordinates: { lat: 34.0407, lng: -118.2468 },
    },
    propertyType: "apartment",
    rent: 3800,
    rentType: "monthly",
    bedrooms: 1,
    bathrooms: 1,
    propertySize: 1200,
    amenities: ["WiFi", "Air Conditioning", "Laundry", "Parking"],
    extraFeatures: [
      "High Ceilings",
      "Exposed Ductwork",
      "Polished Concrete Floors",
    ],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    status: "approved",
    isFeatured: false,
    averageRating: 4.4,
    reviewCount: 11,
  },
  {
    title: "Spacious Family Home with Pool",
    description:
      "Newly renovated 5-bedroom home with a sparkling pool, large deck, and open-concept living. Great for families, close to schools and shopping.",
    location: {
      address: "2100 Elm Street",
      city: "Dallas",
      state: "TX",
      zip: "75201",
      country: "USA",
      coordinates: { lat: 32.7767, lng: -96.797 },
    },
    propertyType: "house",
    rent: 3200,
    rentType: "monthly",
    bedrooms: 5,
    bathrooms: 3,
    propertySize: 3100,
    amenities: [
      "WiFi",
      "Air Conditioning",
      "Pool",
      "Parking",
      "Washer/Dryer",
      "Backyard",
    ],
    extraFeatures: ["Large Deck", "Updated Kitchen", "Smart Thermostat"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800",
    ],
    status: "pending",
    isFeatured: false,
    averageRating: 0,
    reviewCount: 0,
  },
];

const seedProperties = async () => {
  await connectDB();

  // Clean existing data
  await Property.deleteMany({});
  await User.deleteMany({ role: { $ne: "admin" } });
  console.log("Cleared existing properties and non-admin users");

  const passwordHash = await bcrypt.hash("Owner@123456", 12);

  const createdOwners = [];
  for (const owner of owners) {
    const user = await User.create({
      name: owner.name,
      email: owner.email,
      photo: owner.photo,
      passwordHash,
      role: "owner",
      authProvider: "email",
      phone: "+1-555-0100",
    });
    createdOwners.push(user);
    console.log(`Owner created: ${owner.email}`);
  }

  // Assign properties to owners round-robin
  for (let i = 0; i < properties.length; i++) {
    const owner = createdOwners[i % createdOwners.length];
    const prop = {
      ...properties[i],
      ownerId: owner._id,
      ownerInfo: {
        name: owner.name,
        email: owner.email,
        photo: owner.photo,
      },
    };
    await Property.create(prop);
    console.log(`Property created: ${prop.title} → ${owner.name}`);
  }

  console.log(
    `\nSeed complete: ${createdOwners.length} owners, ${properties.length} properties`,
  );
  console.log("Owner login password: Owner@123456");
  process.exit(0);
};

seedProperties().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
