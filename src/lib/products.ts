import {
  BatteryCharging,
  Bell,
  Brush,
  Cable,
  Camera,
  Flame,
  Grip,
  Layers,
  Lightbulb,
  Magnet,
  MonitorPlay,
  PenTool,
  Plug,
  PlugZap,
  Presentation,
  Projector,
  Radar,
  Scale,
  Smartphone,
  Speaker,
  Tv,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type CategorySlug =
  | "everyday-gadgets"
  | "phone-accessories"
  | "projectors"
  | "charging-gear"
  | "smart-home";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon tile (literal strings so the compiler sees them) */
  tile: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategorySlug;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  blurb: string;
  icon: LucideIcon;
}

export const categories: Category[] = [
  {
    slug: "everyday-gadgets",
    name: "Everyday Gadgets",
    tagline: "Clever little fixes for everyday annoyances.",
    icon: PenTool,
    tile: "bg-chart-1/10 text-chart-1",
  },
  {
    slug: "phone-accessories",
    name: "Phone Accessories",
    tagline: "Keep your phone protected, mounted and organized.",
    icon: Smartphone,
    tile: "bg-chart-2/10 text-chart-2",
  },
  {
    slug: "projectors",
    name: "Projectors",
    tagline: "Big-screen movie nights, anywhere.",
    icon: Projector,
    tile: "bg-chart-3/10 text-chart-3",
  },
  {
    slug: "charging-gear",
    name: "Charging Gear",
    tagline: "Power that keeps up with your day.",
    icon: BatteryCharging,
    tile: "bg-chart-4/10 text-chart-4",
  },
  {
    slug: "smart-home",
    name: "Smart Home",
    tagline: "Make your place smarter, one device at a time.",
    icon: Lightbulb,
    tile: "bg-chart-5/10 text-chart-5",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function tileFor(slug: CategorySlug): string {
  return getCategory(slug)?.tile ?? "bg-muted text-muted-foreground";
}

export const products: Product[] = [
  // Everyday Gadgets
  {
    id: "multitool-pen",
    name: "6-in-1 Tech Multitool Pen",
    category: "everyday-gadgets",
    price: 16.99,
    rating: 4.8,
    reviews: 214,
    badge: "Bestseller",
    blurb: "Ruler, level, stylus, screwdrivers and a ballpoint in one pocket-size pen.",
    icon: PenTool,
  },
  {
    id: "desk-vacuum",
    name: "Mini Desk Vacuum",
    category: "everyday-gadgets",
    price: 12.99,
    rating: 4.6,
    reviews: 132,
    blurb: "Clears crumbs, dust and eraser shavings off your desk in seconds.",
    icon: Brush,
  },
  {
    id: "tracker-card",
    name: "Bluetooth Tracker Card",
    category: "everyday-gadgets",
    price: 24.99,
    rating: 4.7,
    reviews: 98,
    badge: "New",
    blurb: "Credit-card thin finder for your wallet, bag or passport.",
    icon: Radar,
  },
  {
    id: "luggage-scale",
    name: "Digital Luggage Scale",
    category: "everyday-gadgets",
    price: 14.99,
    rating: 4.5,
    reviews: 76,
    blurb: "Weighs bags up to 50 kg so you never pay overweight fees again.",
    icon: Scale,
  },
  {
    id: "hand-warmer",
    name: "Rechargeable Hand Warmer",
    category: "everyday-gadgets",
    price: 18.99,
    oldPrice: 22.99,
    rating: 4.6,
    reviews: 143,
    badge: "Deal",
    blurb: "Doubles as a 5,000 mAh power bank for cold commutes.",
    icon: Flame,
  },
  // Phone Accessories
  {
    id: "mag-wallet",
    name: "Magnetic Card Wallet",
    category: "phone-accessories",
    price: 22.99,
    rating: 4.8,
    reviews: 312,
    badge: "Bestseller",
    blurb: "Snap-on MagSafe-compatible wallet that holds three cards.",
    icon: Wallet,
  },
  {
    id: "privacy-glass",
    name: "Privacy Tempered Glass 2-Pack",
    category: "phone-accessories",
    price: 11.99,
    rating: 4.5,
    reviews: 187,
    blurb: "9H glass keeps your screen — and your messages — private.",
    icon: Smartphone,
  },
  {
    id: "grip-stand",
    name: "Folding Grip Stand",
    category: "phone-accessories",
    price: 9.99,
    rating: 4.4,
    reviews: 91,
    blurb: "Grip, stand and car mount in one pocketable ring.",
    icon: Grip,
  },
  {
    id: "lens-kit",
    name: "4-in-1 Phone Lens Kit",
    category: "phone-accessories",
    price: 29.99,
    rating: 4.6,
    reviews: 64,
    blurb: "Wide, macro, fisheye and CPL lenses with a clip-on mount.",
    icon: Camera,
  },
  {
    id: "cable-organizer",
    name: "Magnetic Cable Organizer 3-Pack",
    category: "phone-accessories",
    price: 7.99,
    rating: 4.5,
    reviews: 120,
    blurb: "Keeps charging cables where you left them, on desk or wall.",
    icon: Cable,
  },
  // Projectors
  {
    id: "pico-projector",
    name: "Pico Portable Projector",
    category: "projectors",
    price: 189.0,
    rating: 4.7,
    reviews: 156,
    badge: "Bestseller",
    blurb: "1080p picture, built-in speaker and 4-hour battery in a 0.7 kg body.",
    icon: Projector,
  },
  {
    id: "smart-projector",
    name: "Smart LED Projector 700",
    category: "projectors",
    price: 259.0,
    rating: 4.8,
    reviews: 88,
    blurb: "Android TV built in, auto-focus and 700 ANSI lumens.",
    icon: MonitorPlay,
  },
  {
    id: "projector-screen",
    name: '100" Projector Screen',
    category: "projectors",
    price: 49.99,
    rating: 4.5,
    reviews: 71,
    blurb: "Wrinkle-free matte screen with wall and tripod mounting.",
    icon: Presentation,
  },
  {
    id: "projector-tripod",
    name: "Projector Tripod Mount",
    category: "projectors",
    price: 27.99,
    rating: 4.4,
    reviews: 39,
    blurb: "360° adjustable stand for projectors and small cameras.",
    icon: Camera,
  },
  {
    id: "streaming-stick",
    name: "4K Streaming Stick",
    category: "projectors",
    price: 39.99,
    rating: 4.6,
    reviews: 205,
    badge: "New",
    blurb: "Turns any HDMI port into a smart TV with 4K streaming.",
    icon: Tv,
  },
  // Charging Gear
  {
    id: "gan-charger",
    name: "65W GaN Fast Charger",
    category: "charging-gear",
    price: 34.99,
    rating: 4.9,
    reviews: 428,
    badge: "Bestseller",
    blurb: "Charges a laptop, phone and earbuds from one tiny brick.",
    icon: PlugZap,
  },
  {
    id: "power-bank",
    name: "20,000 mAh Power Bank",
    category: "charging-gear",
    price: 45.99,
    rating: 4.7,
    reviews: 356,
    blurb: "Three outputs and a digital battery readout for long trips.",
    icon: BatteryCharging,
  },
  {
    id: "wireless-pad",
    name: "Magnetic Wireless Charger",
    category: "charging-gear",
    price: 29.99,
    rating: 4.6,
    reviews: 149,
    blurb: "15W magnetic pad with a soft-glow charge indicator.",
    icon: Magnet,
  },
  {
    id: "charging-dock",
    name: "3-in-1 Charging Dock",
    category: "charging-gear",
    price: 59.99,
    rating: 4.7,
    reviews: 203,
    blurb: "Folds flat for travel; charges phone, watch and earbuds at once.",
    icon: Layers,
  },
  {
    id: "usb-c-cable",
    name: "Braided USB-C Cable 2 m",
    category: "charging-gear",
    price: 12.99,
    rating: 4.8,
    reviews: 264,
    blurb: "240W-rated, 30,000-bend tested, with a leather strap.",
    icon: Cable,
  },
  // Smart Home
  {
    id: "smart-plug",
    name: "Mini Smart Plug 4-Pack",
    category: "smart-home",
    price: 24.99,
    rating: 4.7,
    reviews: 331,
    badge: "Bestseller",
    blurb: "Voice control and schedules for any dumb appliance.",
    icon: Plug,
  },
  {
    id: "video-doorbell",
    name: "Video Doorbell 2K",
    category: "smart-home",
    price: 89.99,
    oldPrice: 109.99,
    rating: 4.6,
    reviews: 174,
    badge: "Deal",
    blurb: "2K HDR video, person detection and two-way talk.",
    icon: Bell,
  },
  {
    id: "smart-bulbs",
    name: "Color Smart Bulb Starter Kit",
    category: "smart-home",
    price: 34.99,
    rating: 4.5,
    reviews: 142,
    blurb: "Three bulbs, 16 million colors, no hub needed.",
    icon: Lightbulb,
  },
  {
    id: "motion-light",
    name: "Motion Sensor Light",
    category: "smart-home",
    price: 19.99,
    rating: 4.4,
    reviews: 87,
    blurb: "Battery-powered night light that follows you down the hall.",
    icon: Radar,
  },
  {
    id: "smart-speaker",
    name: "Smart Speaker Mini",
    category: "smart-home",
    price: 49.99,
    rating: 4.6,
    reviews: 118,
    badge: "New",
    blurb: "Room-filling sound with a built-in assistant.",
    icon: Speaker,
  },
];

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
