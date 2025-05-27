import { TagCategory } from './ingredient-tags';

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