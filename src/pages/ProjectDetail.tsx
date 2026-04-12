import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { fetchAlbumArt } from '../services/spotify';
import type { Project } from '../types';
import { Spinner } from '../components/ui/Spinner';

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [albumArt, setAlbumArt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  // fetch project and album art
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setProject(data as Project);

        // fetch background art
        if (data?.spotify_id) {
          const artUrl = await fetchAlbumArt(data.spotify_id);
          setAlbumArt(artUrl);
        }
      } catch (err: any) {
        console.error('Error fetching project details:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProjectDetails();
  }, [id]);

  // scroll listener for bg
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeOpacity = Math.max(0, 0.4 - (scrollY / 800) * 0.4);
  const parallaxOffset = scrollY * 0.35;

  if (isLoading) {
    return <Spinner message="Loading project details..." />;
  }
  
  if (error || !project) {
    return (
      <div className="px-6 md:px-12 py-20 max-w-4xl mx-auto">
        <p className="text-red-400 mb-6">Failed to load project: {error || 'Project not found.'}</p>
        <button onClick={() => navigate(-1)} className="text-blue-400 hover:text-blue-300">← Go Back</button>
      </div>
    );
  }

  return (
    <>
      {/* fading background */}
      {albumArt && (
        <div 
          className="fixed inset-[-10%] z-0 pointer-events-none" 
          style={{
            backgroundImage: `url(${albumArt})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            opacity: fadeOpacity,
            transform: `translateY(-${parallaxOffset}px) scale(1.1)`, 
          }}
        >
          {/* fade from transparent to black */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-neutral-950"></div>
        </div>
      )}

      {/* main content */}
      <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto space-y-16 animate-fade-in relative z-10">
        
        {/* back to grid */}
        <div>
          <button 
            onClick={() => navigate('/reviewed')} 
            className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium uppercase tracking-wider bg-neutral-950/50 px-4 py-2 rounded-full backdrop-blur-md border border-neutral-800/50 w-fit"
          >
            <span>←</span> Back to Grid
          </button>
        </div>

        {/* header */}
        <header className="space-y-4">
          <p className="text-blue-400 font-medium tracking-wide text-sm uppercase drop-shadow-md">
            {project.type} • {project.genre}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
            {project.title}
          </h1>
          <p className="text-2xl md:text-3xl text-neutral-300 drop-shadow-md">
            {project.artist}
          </p>
          
          {/* badges */}
          <div className="flex flex-wrap items-center gap-4 pt-6 text-sm font-medium">
            <span className="bg-blue-600/90 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] px-5 py-2 rounded-full backdrop-blur-sm">
              Rating: {project.rating}/10
            </span>
            <span className="bg-neutral-900/80 text-neutral-300 border border-neutral-700/50 px-5 py-2 rounded-full backdrop-blur-sm">
              Released: {project.release_date}
            </span>
          </div>
        </header>

        {/* thoughts and favs */}
        <div className="space-y-12">
          {project.thoughts && (
            <section>
              <h2 className="text-xl font-semibold tracking-wider uppercase text-neutral-500 mb-6 border-b border-neutral-800/50 pb-3">
                Thoughts
              </h2>
              <p className="text-xl text-neutral-200 leading-relaxed font-light">
                {project.thoughts}
              </p>
            </section>
          )}

          {project.favorites && (
            <section>
              <h2 className="text-xl font-semibold tracking-wider uppercase text-neutral-500 mb-6 border-b border-neutral-800/50 pb-3">
                Favorite Tracks
              </h2>
              <p className="text-xl text-neutral-200 leading-relaxed font-light">
                {project.favorites}
              </p>
            </section>
          )}
        </div>

        {/* spotify embed */}
        <section className="pt-8 w-full">
          <h2 className="text-xl font-semibold tracking-wider uppercase text-neutral-500 mb-6 border-b border-neutral-800/50 pb-3">
            Listen
          </h2>
          
          <div className="w-full bg-neutral-900 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-neutral-800/50">
            <iframe
              style={{ borderRadius: '12px', width: '100%' }}
              src={`https://open.spotify.com/embed/album/${project.spotify_id}?utm_source=generator&theme=0`}
              height="352"
              allowFullScreen={false}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block w-full"
            ></iframe>
          </div>
        </section>

      </div>
    </>
  );
};