export interface FeaturedProject {
  id: number;
  title: string;
  artist: string;
  genre: string;
  release_date: string;
  thoughts: string;
  rating: number;
  spotify_id: string;
  favorites: string;
  type: string;
}

export interface PendingProject {
  id: number;
  title: string;
  type: string;
  artist: string;
  release_date: string;
}

export interface Project {
  id: number;
  title: string;
  type: string;
  artist: string;
  release_date: string;
  rating: number;
  favorites: string;
  genre: string;
  thoughts: string | null; 
  spotify_id: string;
  tens_id: string | null; 
}