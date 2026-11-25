import roadLinesImage from '../assets/images/biz_road_lines_1795516479774.jpg';
import bioFuelImage from '../assets/images/biz_bio_fuel_1795516480181.jpg';
import pranarImage from '../assets/images/biz_pranar_oils_1795516480756.jpg';
import naturalLubesImage from '../assets/images/biz_natural_lubes_1795516481310.jpg';
import jsFuelsImage from '../assets/images/biz_js_fuels_1795516481929.jpg';

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
    introHeadline: 'Moving Energy. Connecting Industries.',
    capabilitiesHeadline: 'Reliable Transport. Every Mile.',
    summary: 'Apex Road Lines provides road transportation for petroleum products, industrial oils and bulk liquid cargo, connecting supply points with the businesses that depend on them.',
    capabilitiesSummary: 'Bulk liquid transportation requires careful coordination at every stage, from loading and transit to delivery. Our logistics focus is on cargo handling, planned dispatch and meeting industrial transportation requirements.',
    focusAreas: ['Petroleum and bulk liquid transportation', 'Industrial oil and chemical logistics', 'Transport support for commercial and industrial customers'],
    capabilityHighlights: ['Cargo handling and loading coordination', 'Route planning and scheduled dispatch', 'Bulk liquid delivery and discharge coordination'],
    websiteUrl: 'https://apexroadline.vercel.app/',
    domainLabel: 'apexroadline.vercel.app',
    imageUrl: roadLinesImage,
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
    introHeadline: 'Advancing Alternative Energy.',
    capabilitiesHeadline: 'Renewable Energy for Industrial Needs.',
    summary: 'Apex Bio Fuel India focuses on biomass and renewable fuel solutions for industrial energy requirements, supporting businesses exploring alternatives to conventional fuels.',
    capabilitiesSummary: 'Industrial boilers and process heating require fuels suited to their operating conditions. Biomass-based energy offers an alternative for suitable applications, with fuel selection and supply planning guided by the customer’s requirements.',
    focusAreas: ['Biomass-based fuel solutions', 'Alternative fuels for industrial heating', 'Renewable fuel supply for commercial applications'],
    capabilityHighlights: ['Fuel selection for boiler and thermal applications', 'Feedstock quality and suitability considerations', 'Supply planning for industrial energy requirements'],
    websiteUrl: 'https://apex-road.vercel.app/',
    domainLabel: 'apex-road.vercel.app',
    imageUrl: bioFuelImage,
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
    introHeadline: 'Essential Solutions for Industry.',
    capabilitiesHeadline: 'The Right Oils for Every Application.',
    summary: 'Pranar Oils & Chemicals supplies industrial oils, base oils and chemical products for manufacturing, processing and industrial blending applications.',
    capabilitiesSummary: 'Different industrial processes demand different material properties. Our focus is on matching oil and chemical supply requirements to the intended application, packaging needs and purchasing volumes.',
    focusAreas: ['Industrial oils and base stocks', 'Specialty chemical supply', 'Drummed and bulk product requirements'],
    capabilityHighlights: ['Oil selection for manufacturing and process applications', 'Chemical supply for industrial and blending requirements', 'Packaging and bulk supply coordination'],
    productCategories: ['Industrial Oils', 'Base Oils', 'Process Fluids', 'Specialty Chemicals'],
    websiteUrl: 'https://apex-pranar-oils.vercel.app/',
    domainLabel: 'apex-pranar-oils.vercel.app',
    imageUrl: pranarImage,
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
    sector: 'Automotive & Industrial Lubricants',
    introHeadline: 'Performance in Every Drop.',
    capabilitiesHeadline: 'Engineered for Protection.',
    summary: 'Apex Natural Lubes & Chemicals FZCO offers automotive and industrial lubricant solutions for engines, transmissions, hydraulic systems and machinery, serving diverse equipment lubrication requirements.',
    capabilitiesSummary: 'The right lubricant helps manage friction, wear and operating temperatures. Our product range addresses different vehicle and machinery applications, with selection based on viscosity, operating conditions and equipment specifications.',
    focusAreas: ['Automotive and diesel engine oils', 'Industrial machinery lubrication', 'Packaged lubricant supply and distribution'],
    capabilityHighlights: ['Engine lubrication for passenger and commercial vehicles', 'Gear and transmission lubrication applications', 'Hydraulic fluids for industrial equipment'],
    productCategories: ['Engine Oils', 'Diesel Engine Oils', 'Gear Oils', 'Hydraulic Oils', 'Transmission Fluids'],
    websiteUrl: 'https://apex-lude.vercel.app/',
    domainLabel: 'apex-lude.vercel.app',
    imageUrl: naturalLubesImage,
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
    sector: 'Retail & Commercial Fuelling',
    introHeadline: 'Fuelling Everyday Progress.',
    capabilitiesHeadline: 'Energy for Every Journey.',
    summary: 'JS Fuels connects motorists, commercial vehicles and transport businesses with fuel retail and dispensing solutions for everyday travel and commercial mobility.',
    capabilitiesSummary: 'From personal journeys to commercial transport, different vehicles have different fuel requirements. Explore our fuel categories and contact JS Fuels to confirm availability and services at your preferred location.',
    focusAreas: ['Fuel retail for everyday motorists', 'Commercial vehicle and fleet fuelling', 'Fuel options for different vehicle requirements'],
    capabilityHighlights: ['Passenger and commercial vehicle fuelling', 'Digital fuel dispensing and metering', 'Forecourt services and fuel availability enquiries'],
    productCategories: ['Petrol', 'Diesel', 'CNG', 'LPG'],
    websiteUrl: 'https://js-fuel.vercel.app/',
    domainLabel: 'js-fuel.vercel.app',
    imageUrl: jsFuelsImage,
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
  { id: 'scene-03-roadlines-capabilities', number: '03', label: 'Transport Services', groupLabel: 'Apex Road Lines' },
  { id: 'scene-04-biofuel-intro', number: '04', label: 'Bio Fuel', groupLabel: 'Apex Bio Fuel' },
  { id: 'scene-05-biofuel-capabilities', number: '05', label: 'Renewable Energy', groupLabel: 'Apex Bio Fuel' },
  { id: 'scene-06-pranar-intro', number: '06', label: 'Pranar Oils', groupLabel: 'Pranar Oils' },
  { id: 'scene-07-pranar-capabilities', number: '07', label: 'Industrial Solutions', groupLabel: 'Pranar Oils' },
  { id: 'scene-08-lubes-intro', number: '08', label: 'Natural Lubes', groupLabel: 'Natural Lubes' },
  { id: 'scene-09-lubes-tech', number: '09', label: 'Lubricant Range', groupLabel: 'Natural Lubes' },
  { id: 'scene-10-jsfuels-intro', number: '10', label: 'JS Fuels', groupLabel: 'JS Fuels' },
  { id: 'scene-11-jsfuels-experience', number: '11', label: 'Fuel Solutions', groupLabel: 'JS Fuels' },
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
    title: 'Transport & Commercial Fleets',
    description: 'Bulk liquid logistics, commercial vehicle lubricants and fuel solutions for businesses that depend on road transportation.',
    alignedDivisions: ['Apex Road Lines', 'Apex Natural Lubes', 'JS Fuels'],
  },
  {
    index: '02',
    title: 'Manufacturing & Industrial Processing',
    description: 'Industrial oils, chemical products, hydraulic fluids and alternative energy solutions for production and processing requirements.',
    alignedDivisions: ['Pranar Oils & Chemicals', 'Apex Bio Fuel', 'Apex Natural Lubes'],
  },
  {
    index: '03',
    title: 'Automotive & Mobility',
    description: 'Fuel and lubricant categories for passenger vehicles, commercial vehicles and automotive maintenance applications.',
    alignedDivisions: ['JS Fuels', 'Apex Natural Lubes'],
  },
  {
    index: '04',
    title: 'Renewable Energy & Industrial Heat',
    description: 'Biomass-based fuel alternatives for suitable industrial heating and thermal energy applications.',
    alignedDivisions: ['Apex Bio Fuel India'],
  },
];
