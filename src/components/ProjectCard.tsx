import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../types';
import { fetchAlbumArt } from '../services/spotify';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const [albumArt, setAlbumArt] = useState<string | null>(null);

  useEffect(() => {
    // fetch the album art only once when the card mounts
    let isMounted = true;
    if (project.spotify_id) {
      fetchAlbumArt(project.spotify_id).then((url) => {
        if (isMounted) setAlbumArt(url);
      });
    }
    return () => { isMounted = false; };
  }, [project.spotify_id]);

  // if project has tens_id, route to tens page, otherwise route to reviewed page
  const targetUrl = project.tens_id ? `/tens/${project.tens_id}` : `/reviewed/${project.id}`;

  return (
    <Link 
      to={targetUrl} 
      className="group relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.15)] block"
    >
      {/* album art */}
      {albumArt ? (
        <img 
          src={albumArt} 
          alt={project.title} 
          className="w-full h-full object-cover opacity-90 group-hover:opacity-30 transition-opacity duration-500 ease-out"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-neutral-700 animate-pulse bg-neutral-950">
          Loading...
        </div>
      )}

      {/* hover content overlay */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out translate-y-4 group-hover:translate-y-0">
        <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
          {project.title}
        </h2>
        <p className="text-blue-400 font-medium tracking-wide text-sm uppercase drop-shadow-md">
          {project.artist}
        </p>
        
        {/* rating badge */}
        <div className="mt-3">
          <span className="inline-block bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
            {project.rating}/10
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;