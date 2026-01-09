
export enum CategoryType {
  Movie = '電影感 / 劇院 (Cinematic)',
  Product = '商業產品攝影 (Product Photography)',
  PeopleCommercial = '商業人像 (Commercial Portrait)',
  Lifestyle = '生活風格 (Lifestyle)',
  Ethereal = '空靈氛圍 (Ethereal Space)',
  HyperRealistic = '超寫實 (Hyper-Realistic)',
  Anime = '動漫風格 (Anime / Manga Style)',
  SpecialPOV = '特殊創意視角 (Creative POV)'
}

export interface CompositionConfig {
  rule: string;
  focal_point: string;
  alignment: string;
}

export interface CameraConfig {
  shotType: string;
  angle: string;
  aspectRatio: string;
  lens: string;
  roll: number;
  composition: CompositionConfig;
  visualYOffset: number; 
}

export interface OpticsConfig {
  dof: string;
  lightColor: string;
  ambientColor: string;
  lightIntensity: number;
  lightRotation: number;
  studioSetup: string;
  source: string;
  mood: string;
  useAdvancedLighting: boolean;
  fillLightColor: string;
  fillLightIntensity: number;
  rimLightColor: string;
  rimLightIntensity: number;
}

export interface StyleConfig {
  postProcessing: string[];
  filmStyle: string;
  grain: string;
  vignette: boolean;
}

export interface PromptState {
  category: CategoryType;
  camera: CameraConfig;
  subject: {
    type: string;
    description: string;
    materials: string[];
    tags: string[];
    view_angle: string;
    key_feature: string;
  };
  background: {
    description: string;
    environment: string;
    tags: string[];
    bgColor?: string; 
  };
  optics: OpticsConfig;
  style: StyleConfig;
  thumbnail?: string; 
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  config: PromptState;
  series?: string; 
}

export interface TagGroup {
  name: string;
  tags: string[];
}

export interface CustomTags {
  subject: string[];
  background: string[];
  cameraAngle: string[];
  mood: string[];
  style: string[];
}
