import {
  BarChart3, CalendarCheck, CalendarDays, CalendarX, Factory, FileText, Flame, Fuel, Gauge,
  Mountain, Sun, Thermometer, TreePine, Wind, Zap, type LucideIcon,
} from "lucide-react";

/** Recognition aids beside each label; the text label always stays. */
export const FIELD_ICONS: Record<string, LucideIcon> = {
  certificate_type: FileText,
  final_energy: Gauge,
  hwb: Gauge,
  eeb: Gauge,
  fgee: Gauge,
  energy_source: Flame,
  efficiency_class: BarChart3,
  year_built: CalendarDays,
  certificate_date: CalendarCheck,
  certificate_valid_until: CalendarX,
};

export const SOURCE_ICONS: Record<string, LucideIcon> = {
  district_heating: Factory,
  natural_gas: Flame,
  lpg: Fuel,
  heating_oil: Fuel,
  electricity: Zap,
  heat_pump: Wind,
  wood_pellets: TreePine,
  solar: Sun,
  geothermal: Mountain,
  chp: Thermometer,
};

