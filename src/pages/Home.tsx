import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { fetchAlbumArt } from '../services/spotify';
import type { FeaturedProject } from '../types';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export const Home = () => {
  const [featured, setFeatured] = useState<FeaturedProject | null>(null);
  const [albumArt, setAlbumArt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedProject = async () => {
      try {
        // fetch single record from featured_projects table
        const { data, error: fetchError } = await supabase
          .from('featured')
          .select('*')
          .order('id', { ascending: false }) // Sorts highest/newest ID to the top
          .limit(1)
          .single();
        
        if (fetchError) throw fetchError;
        setFeatured(data);

        // fetch art if spotify id exists
        if (data?.spotify_id) {
          const artUrl = await fetchAlbumArt(data.spotify_id);
          setAlbumArt(artUrl);
        }
      } catch (err: any) {
        console.error('Error fetching featured project:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadFeaturedProject();
  }, []);

  if (isLoading) {
    return (
      <div className="px-6 md:px-12 py-20 text-neutral-500 animate-pulse text-lg">
        Loading the latest memory...
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage message={error} />
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 md:py-20 space-y-24">
      
      {/* about */}
      <section className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Welcome to <span className="text-blue-500">Music Memories</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
          A curated collection of albums, EPs, and mini-albums. This serves as a personal archive 
          to rate, review, and remember the music that soundtracks my life. Here, you can explore what I've listened to,
          see what's next, and look at my perfect 10s.
        </p>
      </section>

      {/* Project of the Month Section */}
      {featured && (
        <section>
          <div className="border-b border-neutral-900 mb-10 pb-4">
            <h2 className="text-2xl font-semibold tracking-wider uppercase text-neutral-600">
              Project of the Month
            </h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-12 items-start">
            
            <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
              <div className="sticky top-28 flex flex-col gap-6">
                {/* album art */}
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-[0_0_40px_rgba(37,99,235,0.1)]">
                  {albumArt ? (
                    <img src={albumArt} alt={featured.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 animate-pulse bg-neutral-950">
                      Loading...
                    </div>
                  )}
                </div>

                {/* spotify embed */}
                <div className="w-full bg-neutral-900 rounded-2xl overflow-hidden shadow-lg border border-neutral-800/50 p-2">
                  <iframe
                    style={{ borderRadius: '16px', width: '100%' }}
                    src={`https://open.spotify.com/embed/album/${featured.spotify_id}?utm_source=generator&theme=0`}
                    height="152"
                    allowFullScreen={false}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="block w-full"
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <p className="text-blue-400 font-medium tracking-wide text-sm uppercase mb-2">
                  {featured.type} • {featured.genre}
                </p>
                <h3 className="text-4xl md:text-5xl font-bold mb-2 text-white tracking-tight leading-none">
                  {featured.title}
                </h3>
                <p className="text-xl text-neutral-400">{featured.artist}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <span className="bg-neutral-900 text-white px-4 py-1.5 rounded-full border border-neutral-800">
                  Rating: {featured.rating}/10
                </span>
                <span className="text-neutral-500">
                  Released: {featured.release_date}
                </span>
              </div>

              <div className="text-neutral-300 leading-relaxed text-lg pt-2 whitespace-pre-wrap">
                <p>{featured.thoughts}</p>
              </div>

              {featured.favorites && (
                <div className="pt-6 border-t border-neutral-900">
                  <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2 font-bold">
                    Favorite Tracks
                  </p>
                  <p className="text-neutral-300">{featured.favorites}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );

}