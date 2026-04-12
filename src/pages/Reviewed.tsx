import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Project } from '../types';
import ProjectCard from '../components/ProjectCard';
import FilterBar from '../components/FilterBar';
import { ProjectCardSkeleton } from '../components/ui/ProjectCardSkeleton';
import { ErrorMessage } from '../components/ui/ErrorMessage';

const ITEMS_PER_PAGE = 16;

export const Reviewed = () => {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filterYear, setFilterYear] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('none');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // fetching data
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: true });

        if (fetchError) throw fetchError;
        setAllProjects(data as Project[] || []);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // handle search trigger
  const handleSearch = useCallback((query: string) => {
    setSearchTerm(query.toLowerCase());
  }, []);

  // reset to page 1 whenever filters or search term change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterYear, sortOption]);

  // controls
  const displayedProjects = useMemo(() => {
    let result = [...allProjects];

    // search filtering
    if (searchTerm) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.artist.toLowerCase().includes(searchTerm) ||
        p.genre.toLowerCase().includes(searchTerm)
      );
    }

    // year filtering
    if (filterYear !== 'all') {
      result = result.filter(p => p.release_date.startsWith(filterYear));
    }

    // sorting
    switch (sortOption) {
      case 'rating_high_to_low':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating_low_to_high':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'release_date_newest':
        result.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
        break;
      case 'release_date_oldest':
        result.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
        break;
      default:
        break;
    }

    return result;
  }, [allProjects, filterYear, sortOption, searchTerm]);

  const availableYears = useMemo(() => {
    const years = allProjects.map(p => p.release_date.substring(0, 4));
    const uniqueYears = Array.from(new Set(years));
    return uniqueYears.sort((a, b) => b.localeCompare(a));
  }, [allProjects]);

  // pagination slicing
  const totalPages = Math.ceil(displayedProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = displayedProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // scroll to top on page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="px-6 md:px-12 py-12">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Reviewed</h1>
        <p className="text-neutral-400 max-w-2xl mb-10">A collection of music memories and reviews.</p>
        <div className="grid gap-6 min-h-125" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {[...Array(12)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="px-6 md:px-12 py-12">
      {/* header */}
      <h1 className="text-5xl font-bold tracking-tight mb-4">Reviewed</h1>
      <p className="text-neutral-400 max-w-2xl mb-10">
        All of the music projects I've reviewed, from rock to K-pop to pop.
      </p>

      {/* Controls Container */}
      <div className="mb-12">
        <FilterBar
          filterYear={filterYear}
          setFilterYear={setFilterYear}
          sortOption={sortOption}
          setSortOption={setSortOption}
          onSearch={handleSearch}
          availableYears={availableYears}
        />
      </div>

      {/* dynamic grid */}
      <div 
        className="grid gap-6 min-h-125" 
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
      > 
        {paginatedProjects.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-neutral-500 text-lg">No results found matching your criteria.</p>
          </div>
        ) : (
          paginatedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div> 

      {/* pagination controls */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-6 border-t border-neutral-900 pt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-6 py-2 rounded-full font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800"
          >
            Previous
          </button>
          
          <span className="text-neutral-400 text-sm font-medium">
            Page <span className="text-white">{currentPage}</span> of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-6 py-2 rounded-full font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};