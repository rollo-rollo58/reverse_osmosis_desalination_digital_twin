export interface OperatingPoint {
  feed_m3_h: number;
  feed_salinity_g_l: number;
  feed_pressure_bar: number;
  permeate_pressure_bar: number;
  temperature_c: number;
  pump_efficiency: number;
  energy_recovery_efficiency: number;
  silt_density_index: number;
  runtime_hours: number;
}

export interface StageBalance {
  stage_number: number;
  feed_m3_h: number;
  feed_salinity_g_l: number;
  permeate_m3_h: number;
  concentrate_m3_h: number;
  permeate_salinity_g_l: number;
  concentrate_salinity_g_l: number;
  flux_lmh: number;
  net_driving_pressure_bar: number;
  recovery_fraction: number;
}

export interface PlantBalance {
  total_permeate_m3_h: number;
  concentrate_m3_h: number;
  combined_permeate_salinity_g_l: number;
  concentrate_salinity_g_l: number;
  recovery_fraction: number;
  pump_power_kw: number;
  recovery_credit_kw: number;
  net_power_kw: number;
  specific_energy_kwh_m3: number;
  stages: StageBalance[];
}

export interface PerformanceIndicators {
  salt_rejection_fraction: number;
  recovery_fraction: number;
  productivity_m3_day: number;
  specific_energy_kwh_m3: number;
  alerts: string[];
  status: string;
}

export interface TelemetrySample {
  timestamp: string;
  simulated: boolean;
  feed_pressure_bar: number;
  feed_flow_m3_h: number;
  product_conductivity_us_cm: number;
  temperature_c: number;
  silt_density_index: number;
}

export interface Overview {
  plant: string;
  train: string;
  simulated: boolean;
  operating: OperatingPoint;
  balance: PlantBalance;
  performance: PerformanceIndicators;
  telemetry: TelemetrySample;
}

export interface SimulationResponse {
  simulated: true;
  balance: PlantBalance;
  performance: PerformanceIndicators;
}

export interface OptimizationCandidate {
  pressure_bar: number;
  recovery_fraction: number;
  product_salinity_g_l: number;
  specific_energy_kwh_m3: number;
  feasible: boolean;
}

export interface OptimizationResult {
  status: string;
  best: OptimizationCandidate | null;
  candidates: OptimizationCandidate[];
  note: string;
}

export interface ObservationEvent {
  id: number;
  recorded_at: string;
  channel: string;
  value: number;
  unit: string;
  source: string;
}
