export type BusinessId =
  | 'apex-road-lines'
  | 'apex-bio-fuel'
  | 'pranar-oils'
  | 'apex-natural-lubes'
  | 'js-fuels';

export type AssetId = 'tanker' | 'biofuel' | 'drum' | 'canister' | 'dispenser';

export interface BusinessEntity {
  id: BusinessId;
  index: string;
  name: string;
  shortName: string;
  assetId: AssetId;
  sector: string;
  introHeadline: string;
  capabilitiesHeadline: string;
  summary: string;
  capabilitiesSummary: string;
  focusAreas: string[];
  capabilityHighlights: string[];
  productCategories?: string[];
  websiteUrl: string;
  domainLabel: string;
  imageUrl: string;
  accentHex: string;
  introSceneIndex: number;
  capabilitiesSceneIndex: number;
}

export const APEX_BUSINESSES: BusinessEntity[] = [
  {
    id: 'apex-road-lines',
    index: '01',
    name: 'Apex Road Lines',
    shortName: 'Road Lines',
    assetId: 'tanker',
    sector: 'Bulk Liquid & Petroleum Logistics',
    introHeadline: 'Moving What Matters.',
    capabilitiesHeadline: 'Built for Every Journey.',
    summary:
      'Dedicated road transport infrastructure moving petroleum products, industrial oils, and bulk liquid cargo across regional corridors with disciplined fleet operations.',
    capabilitiesSummary:
      'Engineered tanker configurations designed for bulk cargo integrity, synchronized corridor dispatch, and dependable fleet visibility from terminal to destination.',
    focusAreas: [
      'Bulk petroleum tanker haulage',
      'Industrial chemical & oil transport',
      'Scheduled corridor logistics',
    ],
    capabilityHighlights: [
      'Multi-compartment stainless & carbon steel tankers',
      'Controlled loading, sealing, and discharge protocols',
      'Synchronized highway lighting & corridor safety systems',
    ],
    websiteUrl: 'https://apexroadline.vercel.app/',
    domainLabel: 'apexroadline.vercel.app',
    imageUrl: '/src/assets/images/biz_road_lines_1795516479774.jpg',
    accentHex: '#F28C28',
    introSceneIndex: 1,
    capabilitiesSceneIndex: 2,
  },
  {
    id: 'apex-bio-fuel',
    index: '02',
    name: 'Apex Bio Fuel India Pvt. Ltd.',
    shortName: 'Bio Fuel',
    assetId: 'biofuel',
    sector: 'Renewable & Biomass Energy',
    introHeadline: 'Cleaner Energy Ahead.',
    capabilitiesHeadline: 'Renewable Supply Chain.',
    summary:
      'Advancing cleaner industrial combustion through biomass energy solutions and renewable fuel supply chains built for commercial transition.',
    capabilitiesSummary:
      'Consistent biomass processing and thermal energy feedstocks engineered to help industrial boilers and commercial operations reduce reliance on conventional fuels.',
    focusAreas: [
      'Renewable biofuel processing',
      'Industrial thermal energy supply',
      'Lower-carbon fuel alternatives',
    ],
    capabilityHighlights: [
      'Controlled thermal conversion & feedstock conditioning',
      'Steady calorific consistency for commercial boilers',
      'Integrated collection, processing, and bulk delivery',
    ],
    websiteUrl: 'https://apex-road.vercel.app/',
    domainLabel: 'apex-road.vercel.app',
    imageUrl: '/src/assets/images/biz_bio_fuel_1795516480181.jpg',
    accentHex: '#D99B38',
    introSceneIndex: 3,
    capabilitiesSceneIndex: 4,
  },
  {
    id: 'pranar-oils',
    index: '03',
    name: 'Pranar Oils & Chemicals',
    shortName: 'Pranar Oils',
    assetId: 'drum',
    sector: 'Industrial Oils & Specialty Chemicals',
    introHeadline: 'Industrial Precision.',
    capabilitiesHeadline: 'Oils & Specialty Chemicals.',
    summary:
      'Supplying refined industrial oils, base stocks, and chemical intermediates engineered for manufacturing, processing, and heavy industry.',
    capabilitiesSummary:
      'Precision-handled drummed and bulk chemical supply supporting metalworking, manufacturing plants, and specialty industrial blending operations.',
    focusAreas: [
      'Drummed & bulk industrial oils',
      'Specialty chemical distribution',
      'Consistent batch supply',
    ],
    capabilityHighlights: [
      'Sealed 208L steel drum & bulk tanker fulfillment',
      'Refined industrial base oils & process fluids',
      'Dedicated chemical handling & batch traceability',
    ],
    websiteUrl: 'https://apex-pranar-oils.vercel.app/',
    domainLabel: 'apex-pranar-oils.vercel.app',
    imageUrl: '/src/assets/images/biz_pranar_oils_1795516480756.jpg',
    accentHex: '#C89B54',
    introSceneIndex: 5,
    capabilitiesSceneIndex: 6,
  },
  {
    id: 'apex-natural-lubes',
    index: '04',
    name: 'Apex Natural Lubes & Chemicals FZCO',
    shortName: 'Natural Lubes',
    assetId: 'canister',
    sector: 'Engineered Lubricants & Formulations',
    introHeadline: 'Engineered Protection.',
    capabilitiesHeadline: 'Formulated for Performance.',
    summary:
      'Formulating and packaging automotive and industrial lubricants designed for thermal stability, wear protection, and modern machinery longevity.',
    capabilitiesSummary:
      'High-viscosity-index formulations engineered to minimize friction across pistons, gears, hydraulic circuits, and heavy commercial drivetrains.',
    focusAreas: [
      'Packaged automotive engine oils',
      'Heavy-duty industrial lubricants',
      'Free-zone export & distribution',
    ],
    capabilityHighlights: [
      'Thermal stability under continuous operating loads',
      'Anti-wear protection across gear & bearing interfaces',
      'Precision-sealed packaging from workshop packs to bulk',
    ],
    productCategories: [
      'Engine Oils',
      'Diesel Engine Oils',
      'Gear Oils',
      'Hydraulic Oils',
      'Transmission Fluids',
    ],
    websiteUrl: 'https://apex-lude.vercel.app/',
    domainLabel: 'apex-lude.vercel.app',
    imageUrl: '/src/assets/images/biz_natural_lubes_1795516481310.jpg',
    accentHex: '#F28C28',
    introSceneIndex: 7,
    capabilitiesSceneIndex: 8,
  },
  {
    id: 'js-fuels',
    index: '05',
    name: 'JS Fuels',
    shortName: 'JS Fuels',
    assetId: 'dispenser',
    sector: 'Retail & Commercial Fuel Dispensing',
    introHeadline: 'Fueling Every Mile.',
    capabilitiesHeadline: 'Complete Forecourt Experience.',
    summary:
      'Delivering dependable fuel retailing and commercial dispensing operations that connect upstream supply directly to fleets and motorists.',
    capabilitiesSummary:
      'Modern multi-fuel forecourt infrastructure built for rapid fleet turnaround, accurate metering, and day-and-night operational reliability.',
    focusAreas: [
      'Forecourt fuel retailing',
      'Commercial fleet refueling',
      'High-throughput dispensing systems',
    ],
    capabilityHighlights: [
      'Precision digital metering across multi-hose islands',
      'Dedicated bays for commercial transport & passenger vehicles',
      'Architectural forecourt lighting engineered for 24/7 visibility',
    ],
    productCategories: ['Petrol', 'Diesel', 'CNG', 'LPG'],
    websiteUrl: 'https://js-fuel.vercel.app/',
    domainLabel: 'js-fuel.vercel.app',
    imageUrl: '/src/assets/images/biz_js_fuels_1795516481929.jpg',
    accentHex: '#E07A22',
    introSceneIndex: 9,
    capabilitiesSceneIndex: 10,
  },
];

export interface SceneChapterMeta {
  id: string;
  number: string;
  label: string;
  groupLabel: string;
}

export const SCENE_CHAPTERS: SceneChapterMeta[] = [
  { id: 'scene-01-hero', number: '01', label: 'Ecosystem', groupLabel: 'Apex Group' },
  { id: 'scene-02-roadlines-intro', number: '02', label: 'Road Lines', groupLabel: 'Apex Road Lines' },
  { id: 'scene-03-roadlines-capabilities', number: '03', label: 'Fleet Motion', groupLabel: 'Apex Road Lines' },
  { id: 'scene-04-biofuel-intro', number: '04', label: 'Bio Fuel', groupLabel: 'Apex Bio Fuel' },
  { id: 'scene-05-biofuel-capabilities', number: '05', label: 'Renewable Flow', groupLabel: 'Apex Bio Fuel' },
  { id: 'scene-06-pranar-intro', number: '06', label: 'Pranar Oils', groupLabel: 'Pranar Oils' },
  { id: 'scene-07-pranar-capabilities', number: '07', label: 'Specialty Chem', groupLabel: 'Pranar Oils' },
  { id: 'scene-08-lubes-intro', number: '08', label: 'Natural Lubes', groupLabel: 'Natural Lubes' },
  { id: 'scene-09-lubes-tech', number: '09', label: 'Formulations', groupLabel: 'Natural Lubes' },
  { id: 'scene-10-jsfuels-intro', number: '10', label: 'JS Fuels', groupLabel: 'JS Fuels' },
  { id: 'scene-11-jsfuels-experience', number: '11', label: 'Forecourt', groupLabel: 'JS Fuels' },
  { id: 'scene-12-finale', number: '12', label: 'Connected Future', groupLabel: 'Apex Group' },
];

export interface IndustrySector {
  index: string;
  title: string;
  description: string;
  alignedDivisions: string[];
}

export const INDUSTRY_SECTORS: IndustrySector[] = [
  {
    index: '01',
    title: 'Heavy Transport & Commercial Fleets',
    description:
      'Bulk petroleum movement, commercial diesel engine lubricants, and dedicated forecourt fueling keeping highway logistics moving.',
    alignedDivisions: ['Apex Road Lines', 'Apex Natural Lubes', 'JS Fuels'],
  },
  {
    index: '02',
    title: 'Manufacturing & Industrial Processing',
    description:
      'Industrial oils, specialty chemical intermediates, hydraulic fluids, and biomass thermal feedstocks supporting continuous plant output.',
    alignedDivisions: ['Pranar Oils & Chemicals', 'Apex Bio Fuel', 'Apex Natural Lubes'],
  },
  {
    index: '03',
    title: 'Automotive & Mobility Retail',
    description:
      'Multi-fuel retail forecourts offering Petrol, Diesel, CNG, and LPG alongside packaged synthetic and mineral engine oils.',
    alignedDivisions: ['JS Fuels', 'Apex Natural Lubes'],
  },
  {
    index: '04',
    title: 'Energy Transition & Industrial Heat',
    description:
      'Renewable biomass supply chains and cleaner combustion alternatives bridging conventional fuel infrastructure with lower-carbon operations.',
    alignedDivisions: ['Apex Bio Fuel India', 'Apex Road Lines'],
  },
];
