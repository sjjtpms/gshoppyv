import { BatteryCharging, Lightbulb, PenTool, Projector, Smartphone, type LucideIcon } from "lucide-react";
import { productImages } from "./product-images";

export type CategorySlug = "everyday-gadgets" | "phone-accessories" | "projectors" | "charging-gear" | "smart-home";
export type Compatibility = "Universal" | "Apple" | "Android" | "USB-C" | "Smart Home" | "HDMI";
export interface Category { slug: CategorySlug; name: string; tagline: string; icon: LucideIcon; tile: string; }
export interface Product { id: string; name: string; category: CategorySlug; price: number; oldPrice: number | undefined; rating: number; reviews: number; badge: string | undefined; blurb: string; description: string; image: string; compatibility: Compatibility[]; specs: Record<string,string>; gallery: string[]; }

export const categories: Category[] = [
  { slug:"everyday-gadgets", name:"Everyday Gadgets", tagline:"Clever little fixes for everyday annoyances.", icon:PenTool, tile:"bg-chart-1/10 text-chart-1" },
  { slug:"phone-accessories", name:"Phone Accessories", tagline:"Keep your phone protected, mounted and organized.", icon:Smartphone, tile:"bg-chart-2/10 text-chart-2" },
  { slug:"projectors", name:"Projectors", tagline:"Big-screen movie nights, anywhere.", icon:Projector, tile:"bg-chart-3/10 text-chart-3" },
  { slug:"charging-gear", name:"Charging Gear", tagline:"Power that keeps up with your day.", icon:BatteryCharging, tile:"bg-chart-4/10 text-chart-4" },
  { slug:"smart-home", name:"Smart Home", tagline:"Make your place smarter, one device at a time.", icon:Lightbulb, tile:"bg-chart-5/10 text-chart-5" },
];
export function getCategory(slug:string){ return categories.find(c=>c.slug===slug); }
export function tileFor(slug:CategorySlug){ return getCategory(slug)?.tile ?? "bg-muted text-muted-foreground"; }

type Seed = Omit<Product,"image"|"gallery"|"description"|"specs"> & { specs?:Record<string,string>; description?:string };
const seeds: Seed[] = [
["multitool-pen","6-in-1 Tech Multitool Pen","everyday-gadgets",16.99,4.8,214,"Bestseller","Ruler, level, stylus, screwdrivers and a ballpoint in one pocket-size pen.",["Universal"]],
["desk-vacuum","Mini Desk Vacuum","everyday-gadgets",12.99,4.6,132,undefined,"Clears crumbs, dust and eraser shavings off your desk in seconds.",["USB-C"]],
["tracker-card","Bluetooth Tracker Card","everyday-gadgets",24.99,4.7,98,"New","Credit-card thin finder for your wallet, bag or passport.",["Apple","Android"]],
["luggage-scale","Digital Luggage Scale","everyday-gadgets",14.99,4.5,76,undefined,"Weighs bags up to 50 kg so you never pay overweight fees again.",["Universal"]],
["hand-warmer","Rechargeable Hand Warmer","everyday-gadgets",18.99,4.6,143,"Deal","Doubles as a 5,000 mAh power bank for cold commutes.",["USB-C"]],
["mag-wallet","Magnetic Card Wallet","phone-accessories",22.99,4.8,312,"Bestseller","Snap-on magnetic wallet that holds three cards.",["Apple"]],
["privacy-glass","Privacy Tempered Glass 2-Pack","phone-accessories",11.99,4.5,187,undefined,"9H glass keeps your screen — and your messages — private.",["Apple","Android"]],
["grip-stand","Folding Grip Stand","phone-accessories",9.99,4.4,91,undefined,"Grip, stand and car mount in one pocketable ring.",["Universal"]],
["lens-kit","4-in-1 Phone Lens Kit","phone-accessories",29.99,4.6,64,undefined,"Wide, macro, fisheye and CPL lenses with a clip-on mount.",["Apple","Android"]],
["cable-organizer","Magnetic Cable Organizer 3-Pack","phone-accessories",7.99,4.5,120,undefined,"Keeps charging cables where you left them, on desk or wall.",["Universal","USB-C"]],
["pico-projector","Pico Portable Projector","projectors",189,4.7,156,"Bestseller","1080p picture, built-in speaker and 4-hour battery in a 0.7 kg body.",["HDMI","USB-C"]],
["smart-projector","Smart LED Projector 700","projectors",259,4.8,88,undefined,"Android TV built in, auto-focus and 700 ANSI lumens.",["Android","HDMI"]],
["projector-screen",'100\" Projector Screen',"projectors",49.99,4.5,71,undefined,"Wrinkle-free matte screen with wall and tripod mounting.",["Universal"]],
["projector-tripod","Projector Tripod Mount","projectors",27.99,4.4,39,undefined,"360° adjustable stand for projectors and small cameras.",["Universal"]],
["streaming-stick","4K Streaming Stick","projectors",39.99,4.6,205,"New","Turns any HDMI port into a smart TV with 4K streaming.",["HDMI","Smart Home"]],
["gan-charger","65W GaN Fast Charger","charging-gear",34.99,4.9,428,"Bestseller","Charges a laptop, phone and earbuds from one tiny brick.",["USB-C","Apple","Android"]],
["power-bank","20,000 mAh Power Bank","charging-gear",45.99,4.7,356,undefined,"Three outputs and a digital battery readout for long trips.",["USB-C","Apple","Android"]],
["wireless-pad","Magnetic Wireless Charger","charging-gear",29.99,4.6,149,undefined,"15W magnetic pad with a soft-glow charge indicator.",["Apple"]],
["charging-dock","3-in-1 Charging Dock","charging-gear",59.99,4.7,203,undefined,"Folds flat for travel; charges phone, watch and earbuds at once.",["Apple"]],
["usb-c-cable","Braided USB-C Cable 2 m","charging-gear",12.99,4.8,264,undefined,"240W-rated, 30,000-bend tested, with a leather strap.",["USB-C","Apple","Android"]],
["smart-plug","Mini Smart Plug 4-Pack","smart-home",24.99,4.7,331,"Bestseller","Voice control and schedules for any standard appliance.",["Smart Home","Apple","Android"]],
["video-doorbell","Video Doorbell 2K","smart-home",89.99,4.6,174,"Deal","2K HDR video, person detection and two-way talk.",["Smart Home","Apple","Android"]],
["smart-bulbs","Color Smart Bulb Starter Kit","smart-home",34.99,4.5,142,undefined,"Three bulbs, 16 million colors, no hub needed.",["Smart Home","Apple","Android"]],
["motion-light","Motion Sensor Light","smart-home",19.99,4.4,87,undefined,"Battery-powered night light that follows you down the hall.",["Universal"]],
["smart-speaker","Smart Speaker Mini","smart-home",49.99,4.6,118,"New","Room-filling sound with a built-in assistant.",["Smart Home","Apple","Android"]],
].map((r:any[])=>({id:r[0],name:r[1],category:r[2],price:r[3],rating:r[4],reviews:r[5],badge:r[6],blurb:r[7],compatibility:r[8],oldPrice:["hand-warmer","video-doorbell"].includes(r[0])?(r[0]==="hand-warmer"?22.99:109.99):undefined}));

export const products: Product[] = seeds.map((p)=>({
 ...p, image:productImages[p.id] ?? "", gallery:[productImages[p.id] ?? "", productImages[p.id] ?? "", productImages[p.id] ?? ""],
 description:p.description ?? `${p.blurb} Designed for reliable daily use, this gshoppy pick combines practical details with a clean, durable finish.`,
 specs:p.specs ?? { "In the box":"Product, quick-start guide", "Warranty":"2 years", "Ships in":"1–2 business days", "Returns":"30 days" },
}));
export function getProduct(id:string){ return products.find(p=>p.id===id); }
export const compatibilityOptions: Compatibility[]=["Universal","Apple","Android","USB-C","Smart Home","HDMI"];
export function formatPrice(value:number){ return `$${value.toFixed(2)}`; }
