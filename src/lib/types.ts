import { TagCategory } from './utils/ingredient-tags';

// Base interface for scraped drinks (without id)
export interface ScrapedDrink {
  name: string;
  price: number;
  image: string;
  store: string;
  ingredients: string[];
  url: string;
  tags?: TagCategory[];
}

// Extended interface for drinks stored in database (with id)
export interface Drink extends ScrapedDrink {
  id: number;
}


export interface UserData {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  imageUrl: string;
  emailAddress: string | undefined; // Can be undefined from Clerk
  createdAt: Date | null; // Clerk provides Date | null, not number
}

// Strava Activity Data 
export interface Activity {
  id: number
  name: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  sport_type: string
  start_date: string
  start_date_local: string
  timezone: string
  start_latlng: [number, number]
  end_latlng: [number, number]
  achievement_count: number
  kudos_count: number
  comment_count: number
  athlete_count: number
  photo_count: number
  map: {
    id: string
    summary_polyline: string
    resource_state: number
  }
  trainer: boolean
  commute: boolean
  manual: boolean
  private: boolean
  visibility: string
  flagged: boolean
  gear_id?: string
  average_speed: number
  max_speed: number
  has_heartrate: boolean
  average_heartrate?: number
  max_heartrate?: number
  heartrate_opt_out: boolean
  display_hide_heartrate_option: boolean
  elev_high?: number
  elev_low?: number
  upload_id: number
  upload_id_str: string
  external_id: string
  average_cadence?: number
  average_watts?: number
  weighted_average_watts?: number
  kilojoules?: number
  device_watts?: boolean
  max_watts?: number
  from_accepted_tag: boolean
  pr_count: number
  total_photo_count: number
  has_kudoed: boolean
  type: string
  workout_type?: number
  location_city?: string | null
  location_state?: string | null
  location_country?: string | null
  athlete: {
    id: number
    resource_state: number
  }
  resource_state: number
}



export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      drinks: {
        Row: {
          // the data expected from .select()
          id: number
          name: string
          data: Json | null
        }
        Insert: {
          // the data to be passed to .insert()
          id?: never // generated columns must not be supplied
          name: string // `not null` columns with no default must be supplied
          data?: Json | null // nullable columns can be omitted
        }
        Update: {
          // the data to be passed to .update()
          id?: never
          name?: string // `not null` columns are optional on .update()
          data?: Json | null
        }
      }
    }
  }
}