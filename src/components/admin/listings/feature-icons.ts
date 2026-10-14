import {
  Armchair, ArrowUpDown, Car, CookingPot, Fence, Flame, Home, Layers,
  Package, ParkingSquare, Sprout, Sun, Toilet, Accessibility, Warehouse,
  Maximize2, TreeDeciduous, PlugZap, AirVent, Waves, ThermometerSun, ShieldCheck, Wifi, Blinds, type LucideIcon,
} from "lucide-react";

/** Recognition aid next to each equipment label in the listing editor (label always shown). */
export const FEATURE_ICONS: Record<string, LucideIcon> = {
  balcony: Fence,
  terrace: Sun,
  garden: Sprout,
  cellar: Warehouse,
  lift: ArrowUpDown,
  garage: Car,
  parking_space: ParkingSquare,
  underground_parking: Layers,
  fitted_kitchen: CookingPot,
  guest_wc: Toilet,
  barrier_free: Accessibility,
  underfloor_heating: Flame,
  fireplace: Flame,
  attic: Home,
  storage_room: Package,
  high_ceilings: Maximize2,
  wooden_floors: TreeDeciduous,
  photovoltaic: Sun,
  ev_charging: PlugZap,
  air_conditioning: AirVent,
  swimming_pool: Waves,
  sauna: ThermometerSun,
  alarm_system: ShieldCheck,
  smart_home: Wifi,
  electric_shutters: Blinds,
};
export const FallbackFeatureIcon = Armchair;
