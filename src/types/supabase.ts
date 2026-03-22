// Supabase Database type definitions
// TODO: Replace with generated types via `supabase gen types typescript`

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      family_profiles: {
        Row: {
          id: string;
          adult_count: number;
          children_ages: number[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          adult_count?: number;
          children_ages?: number[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          adult_count?: number;
          children_ages?: number[];
          updated_at?: string;
        };
      };
      trip_proposals: {
        Row: {
          id: string;
          user_id: string;
          condition: Json;
          destinations: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          condition: Json;
          destinations: Json;
          created_at?: string;
        };
        Update: {
          condition?: Json;
          destinations?: Json;
        };
      };
      saved_proposals: {
        Row: {
          id: string;
          user_id: string;
          proposal_id: string | null;
          destination: Json;
          memo: string;
          is_decided: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          proposal_id?: string | null;
          destination: Json;
          memo?: string;
          is_decided?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          destination?: Json;
          memo?: string;
          is_decided?: boolean;
          updated_at?: string;
        };
      };
      itineraries: {
        Row: {
          id: string;
          user_id: string;
          saved_proposal_id: string | null;
          title: string;
          travel_dates: Json;
          schedule: Json;
          accommodation: Json;
          packing_list: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          saved_proposal_id?: string | null;
          title: string;
          travel_dates?: Json;
          schedule?: Json;
          accommodation?: Json;
          packing_list?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          travel_dates?: Json;
          schedule?: Json;
          accommodation?: Json;
          packing_list?: Json;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
