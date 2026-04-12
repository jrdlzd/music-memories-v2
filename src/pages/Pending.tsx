import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { PendingProject } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export const Pending = () => {
  const [pending, setPending] = useState<PendingProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingProjects = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('pending_projects')
          .select('*')
          .order('id', { ascending: true }); // You can change 'id' to 'release_date' if you prefer

          if (fetchError) throw fetchError;
          setPending(data as PendingProject[]);
      } catch (err: any) {
        console.error('Error fetching pending projects:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingProjects();
  }, []);

  if (isLoading) {
    return <Spinner message="Loading project details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="px-6 md:px-12 py-12 max-w-5xl mx-auto animate-fade-in">
      
      {/* Header */}
      <h1 className="text-5xl font-bold tracking-tight mb-4">Up Next</h1>
      <p className="text-neutral-400 max-w-2xl mb-12">
        The backlog. A collection of albums, EPs, and mini-albums waiting to be listened to and reviewed.
      </p>

      {/* The List Container */}
      <div className="space-y-4">
        {pending.length === 0 ? (
          <div className="text-center py-20 border border-neutral-800 rounded-2xl bg-neutral-900/50">
            <p className="text-neutral-500 text-lg">Your queue is currently empty!</p>
          </div>
        ) : (
          pending.map((project) => (
            // Individual List Item
            <div 
              key={project.id} 
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 transition-all duration-300 hover:border-blue-500/50 hover:bg-neutral-800/50"
            >
              
              {/* Left Side: Title & Artist */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-lg text-neutral-400">
                  {project.artist}
                </p>
              </div>

              {/* Right Side: Metadata Badges */}
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <span className="bg-neutral-950 text-blue-400 border border-blue-900/50 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide uppercase">
                  {project.type}
                </span>
                <span className="bg-neutral-950 text-neutral-400 border border-neutral-800 px-4 py-1.5 rounded-full text-sm font-medium">
                  {project.release_date}
                </span>
              </div>
              
            </div>
          ))
        )}
      </div>

    </div>
  );
};