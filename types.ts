
export enum RaceStatus {
  UPCOMING = 'UPCOMING',
  COMPLETED = 'COMPLETED',
  LIVE = 'LIVE'
}

export type Language = 'en' | 'zh';

export type SeriesId = 'GT3_OPEN' | 'ROOKIES';

export interface Season {
  id: string;
  name: string;
  year: number;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface Series {
  id: SeriesId;
  name: string;
  description: string;
}

export interface Race {
  id: string;
  seasonId: string;
  seriesId: SeriesId;
  seriesName: string;
  track: string;
  dateTime: string; // ISO String
  status: RaceStatus;
  laps?: number;
  durationMinutes?: number;
  winner?: string;
  image: string;
  subsessionId?: number;
}

export interface LocalManagedRace extends Race {
  detailedResult: IRacingEventResult;
  uploadDate: string;
}

export interface IRacingResultRow {
  cust_id: number;
  display_name: string;
  finish_position: number;
  starting_position: number;
  car_name: string;
  car_id: number;
  best_lap_time: number;
  average_lap: number;
  incidents: number;
  interval: number;
  oldi_rating: number;
  newi_rating: number;
  laps_complete: number;
  laps_lead: number;
  league_points: number;
}

export interface IRacingEventResult {
  subsession_id: number;
  league_name: string;
  track: {
    track_name: string;
    config_name: string;
  };
  weather: {
    temp_value: number;
    rel_humidity: number;
    wind_value: number;
  };
  event_strength_of_field: number;
  session_results: Array<{
    simsession_type_name: string;
    results: IRacingResultRow[];
  }>;
}

export interface Driver {
  id: string; // iRacing Customer ID
  name: string;
  iRating: number;
  safetyRating: string;
  country: string;
  lat: number;
  lng: number;
  status: 'Online' | 'Offline' | 'Racing';
  avatar: string;
  cnaDriverNumber?: string;
}

export interface AuthUser extends Driver {
  email?: string;
  isAdmin: boolean;
}

export interface Standing {
  driverId: string;
  seriesId: SeriesId;
  seasonId: string;
  points: number;
  wins: number;
  podiums: number;
  racesRun: number;
}

export type TeamGoal = 'COMPETITIVE' | 'CASUAL';

export interface EnduranceTeam {
  id: string;
  name: string;
  series: string;
  car: string;
  raceName: string;
  eventDateTime: string; // ISO String for event start
  timeslot: number; // 1, 2, or 3
  members: string[]; 
  recruiting: boolean;
  notes: string;
  creatorId: string;
  maxMembers: number;
  targetGoal: TeamGoal;
}
