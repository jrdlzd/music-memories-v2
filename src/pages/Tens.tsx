import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { fetchAlbumArt } from '../services/spotify';
import type { Project } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

const TensEntry = ({ project, isTarget }: { project: Project; isTarget: boolean }) => {
  const [albumArt, setAlbumArt] = useState<string | null>(null);
  const entryRef = useRef<HTMLDivElement>(null);

  // fetch album art
  useEffect(() => {
    let isMounted = true;
    if (project.spotify_id) {
      fetchAlbumArt(project.spotify_id).then((url) => {
        if (isMounted) setAlbumArt(url);
      });
    }
    return () => { isMounted = false; };
  }, [project.spotify_id]);

  // anchor routing
  useEffect(() => {
    if (isTarget && entryRef.current) {
      setTimeout(() => {
        entryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [isTarget]);

  return (
    <div 
      id={project.tens_id || undefined} 
      ref={entryRef} 
      className="scroll-mt-32 flex flex-col md:flex-row gap-12 border-b border-neutral-900 pb-24"
    >
      <div className="w-full md:w-1/3 shrink-0">
        <div className="sticky top-32 space-y-6">
          <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-[0_0_30px_rgba(255,215,0,0.05)]">
            {albumArt ? (
              <img src={albumArt} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-700 animate-pulse bg-neutral-950">
                Loading...
              </div>
            )}
          </div>
          
          <div>
            <p className="text-yellow-500/80 font-medium tracking-widest text-xs uppercase mb-2">
              Perfect Score
            </p>
            <h2 className="text-4xl font-bold text-white tracking-tight mb-1">
              {project.title}
            </h2>
            <p className="text-xl text-neutral-400 mb-4">{project.artist}</p>
            
            <div className="flex flex-wrap gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">
              <span>{project.genre}</span>
              <span>•</span>
              <span>{project.release_date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* review and favorites */}
      <div className="w-full md:w-2/3 flex flex-col pt-2 md:pt-12">
        <div className="flex-1 space-y-8">
          <p className="text-xl md:text-2xl text-neutral-200 leading-relaxed font-light">
            {project.thoughts}
          </p>

          {project.favorites && (
            <div className="bg-neutral-900/50 border border-neutral-800/50 p-6 rounded-2xl">
              <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-500 mb-2">
                Favorites
              </h3>
              <p className="text-neutral-300">{project.favorites}</p>
            </div>
          )}
        </div>

        {/* spotify embed */}
        <div className="mt-12 w-full bg-neutral-900 rounded-2xl overflow-hidden shadow-lg border border-neutral-800/50">
          <iframe
            style={{ borderRadius: '12px', width: '100%' }}
            src={`https://open.spotify.com/embed/album/${project.spotify_id}?utm_source=generator&theme=0`}
            height="152"
            allowFullScreen={false}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="block w-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export const Tens = () => {
  const {tens_id } = useParams();
  const[tensProjects, setTensProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTens = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .not('tens_id', 'is', null)
          .order('release_date', { ascending: false });

          if (fetchError) throw fetchError;
          setTensProjects(data as Project[]);
      } catch (err: any) {
        console.error('Error fetching 10/10 projects:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTens();
  }, []);

  if (isLoading) {
    return <Spinner message="Loading project details..." />;
  }
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="px-6 md:px-12 py-12 max-w-6xl mx-auto animate-fade-in">
      {/* header */}
      <header className="mb-24 text-center max-w-3xl mx-auto border-b border-neutral-900 pb-12">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-linear-to-r from-yellow-500 to-amber-300 bg-clip-text text-transparent">
          The Perfect 10s
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
          Just. Perfect.
        </p>
      </header>

      {/* continuous scroll list */}
      <div className="space-y-24">
        {tensProjects.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 text-lg">
            No perfect scores yet. The bar is high tho.
          </div>
        ) : (
          tensProjects.map((project) => (
            <TensEntry 
              key={project.id} 
              project={project} 
              isTarget={project.tens_id === tens_id} 
            />
          ))
        )}
      </div>
    </div>
  );
};


