import { supabase } from './supabaseClient';

// store token in memory
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

// calls supabase edge function to retrieve spotify access token
export const getSpotifyToken = async (): Promise<string | null> => {
  // return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    // call edge function to get new token
    const { data, error } = await supabase.functions.invoke('get-spotify-token');
    
    if (error) throw new Error(error.message);

    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 300) * 1000; // cache for slightly less than the actual expiry time

    return cachedToken;
  } catch (error){
    console.error('Error fetching Spotify token from Edge Function:', error);
    return null;
  }
};

// uses spotify id to fetch album art url
export const fetchAlbumArt = async (spotifyId: string): Promise<string | null> => {
  if (!spotifyId) return null;

  const token = await getSpotifyToken();
  if (!token) return null;

  try {
    const response = await fetch(`https://api.spotify.com/v1/albums/${spotifyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Failed to fetch data for Spotify ID ${spotifyId}: ${response.statusText}`);

    const data = await response.json();
    return data.images?.[0]?.url || null; // return the URL of the largest image, or null if not available
  } catch (error) {
    console.error('Error fetching album art:', error);
    return null;
  }
};