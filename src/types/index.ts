export type ZoneId = 'ethno' | 'agro' | 'martuk_dami' | 'eco' | 'smart_hub';

export interface ParkZone {
  id: ZoneId;
  name: string;
  shortName: string;
  areaHa: number;
  color: string;
  themeColor: string;
  tagline: string;
  description: string;
  keyFeatures: string[];
  activities: string[];
  educationalContent: string;
  purpose: string; // Аймақтың мақсаты
  coreServices: string[]; // Негізгі қызметтері
  visitorExperience: string; // Туристке беретін тәжірибесі
  parkContribution: string; // Кешенге қосатын үлесі
  position3D: [number, number, number];
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
}

export interface GastronomyProduct {
  id: string;
  name: string;
  category: 'Сүт өнімдері' | 'Дәстүрлі тағам' | 'Нан өнімдері' | 'Ауыл өнімдері' | 'Маусымдық өнім';
  priceKzt: number;
  description: string;
  isMartukSpecific: boolean;
  localOriginNote: string;
}

export interface TourRoute {
  id: string;
  title: string;
  targetAudience: string;
  durationHours: number;
  baseCostKzt: number;
  zoneIds: ZoneId[];
  goal: string;
  infrastructure: string[];
  highlights: string[];
  resourceLoadDesc: string;
  visitorExperienceLevel: string;
}

export interface SmartTechItem {
  id: string;
  name: string;
  category: string;
  zone: string;
  activeByDefault: boolean;
  whyNeeded: string;
  problemSolved: string;
  whereApplied: string;
  implementationNeeds: string;
  modelImpact: {
    waterDeltaDesc: string;
    powerDeltaDesc: string;
    experienceDeltaDesc: string;
    complexityLevel: 'Оңай' | 'Орташа' | 'Күрделі';
  };
}

export interface ProjectAlternative {
  id: 'A' | 'B' | 'C';
  codeLetter: 'А' | 'Ә' | 'Б';
  name: string;
  tagline: string;
  scores: Record<string, number>; // 1-10 scale
  strengths: string[];
  weaknesses: string[];
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  description: string;
  defaultWeight: number; // 1-5
}

export interface HistoryEra {
  id: 'past' | 'present' | 'future';
  title: string;
  period: string;
  tagline: string;
  summary: string;
  facts: {
    title: string;
    description: string;
    source: string;
    isVerified: boolean;
  }[];
}

export interface SimulationParams {
  dailyVisitors: number;
  averageSpendKzt: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  selectedRouteId: string | null;
  activeServicesCount: number;
  waterIntensityMode: 'low' | 'normal' | 'high';
  powerIntensityMode: 'low' | 'normal' | 'high';
  solarEnergyActive: boolean;
  smartLightingActive: boolean;
  dripIrrigationActive: boolean;
  qrGuideActive: boolean;
  smartWasteSortingActive: boolean;
  visitorSchedulingActive: boolean;
}

export interface SimulationResults {
  dailyVisitors: number;
  monthlyVisitors: number;
  averageSpendKzt: number;
  dailyRevenueKzt: number;
  monthlyRevenueKzt: number;
  dailyServiceCostKzt: number;
  dailyOperatingCostKzt: number;
  monthlyOperatingCostKzt: number;
  monthlyOperatingMarginKzt: number;
  dailyWaterNeedLiters: number;
  dailyPowerNeedKwh: number;
  maxVisitorCapacity: number;
  waterSavedLitersDaily: number;
  powerSavedKwhDaily: number;
}
