import {
  Armchair, ArrowUpDown, CookingPot, Fence, Flame, Home, Layers,
  Package, ParkingSquare, Archive, Cable, Heater, HousePlug, SolarPanel, Sprout, Sun, Toilet, Accessibility, Warehouse,
  Maximize2, TreeDeciduous, PlugZap, AirVent, Waves, ThermometerSun, ShieldCheck, Blinds, type LucideIcon,
} from "lucide-react";

/** Recognition aid next to each equipment label in the listing editor (label always shown). */
export const FEATURE_ICONS: Record<string, LucideIcon> = {
  balcony: Fence,
  terrace: Sun,
  garden: Sprout,
  cellar: Archive,
  lift: ArrowUpDown,
  garage: Warehouse,
  parking_space: ParkingSquare,
  underground_parking: Layers,
  fitted_kitchen: CookingPot,
  guest_wc: Toilet,
  barrier_free: Accessibility,
  underfloor_heating: Heater,
  fireplace: Flame,
  attic: Home,
  storage_room: Package,
  high_ceilings: Maximize2,
  wooden_floors: TreeDeciduous,
  photovoltaic: SolarPanel,
  ev_charging: PlugZap,
  air_conditioning: AirVent,
  swimming_pool: Waves,
  sauna: ThermometerSun,
  alarm_system: ShieldCheck,
  smart_home: HousePlug,
  fiber_internet: Cable,
  electric_shutters: Blinds,
};
export const FallbackFeatureIcon = Armchair;
