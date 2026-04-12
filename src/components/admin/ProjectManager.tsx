import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import type { Project } from '../../types';

// The shape of our form state
const initialFormState = {
  title: '',
  artist: '',
  type: 'Album', 
  genre: '',
  release_date: '',
  rating: 0,
  spotify_id: '',
  favorites: '',
  thoughts: '',
  tens_id: '',
};

export const ProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isFeaturedChecked, setIsFeaturedChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [editOriginalSpotifyId, setEditOriginalSpotifyId] = useState<string |null>(null);

  // fetch existing projects on load
  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: false });
    
    if (!error && data) setProjects(data as Project[]);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'spotify_id') {
      // extract id if link was pasted
      let parsedId = value;
      
      const urlMatch = value.match(/\/(album|track|playlist|episode)\/([a-zA-Z0-9]{22})/);
      if (urlMatch && urlMatch[2]) {
        parsedId = urlMatch[2];
      } 
      else {
        const uriMatch = value.match(/spotify:(album|track|playlist|episode):([a-zA-Z0-9]{22})/);
        if (uriMatch && uriMatch[2]) {
          parsedId = uriMatch[2];
        }
      }

      setForm(prev => ({ ...prev, [name]: parsedId }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // submit handler
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // clean up empty strings to nulls for optional DB columns
      const projectPayload = {
        ...form,
        thoughts: form.thoughts.trim() === '' ? null : form.thoughts,
        tens_id: form.tens_id.trim() === '' ? null : form.tens_id,
      };

      const featuredPayload = {
        title: form.title,
        artist: form.artist,
        genre: form.genre,
        release_date: form.release_date,
        thoughts: form.thoughts,
        rating: form.rating,
        spotify_id: form.spotify_id,
        favorites: form.favorites,
        type: form.type,
      };

      if (isEditing) {
        const { error: updateError } = await supabase
          .from('projects')
          .update(projectPayload)
          .eq('id', isEditing);
          
        if (updateError) throw updateError;

        if (isFeaturedChecked) {
          await supabase.from('featured').delete().eq('spotify_id', editOriginalSpotifyId);
          await supabase.from('featured').insert([featuredPayload]);
        } else {
          await supabase.from('featured').update(featuredPayload).eq('spotify_id', editOriginalSpotifyId);
        }


        setMessage({ text: 'Project updated successfully!', type: 'success' });
      } else {
        const { error: insertError } = await supabase
          .from('projects')
          .insert([projectPayload]);
          
        if (insertError) throw insertError;

        if (isFeaturedChecked) {
          const { error: featuredError } = await supabase
            .from('featured')
            .insert([featuredPayload]);

          if (featuredError) console.error("Featured error:", featuredError);
        }

        setMessage({ text: 'Project added successfully!', type: 'success' });
      }

      // reset form and reload list
      setForm(initialFormState);
      setIsEditing(null);
      setEditOriginalSpotifyId(null);
      setIsFeaturedChecked(false);
      loadProjects();

    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // edit & delete handlers
  const handleEditClick = (project: Project) => {
    setForm({
      title: project.title,
      artist: project.artist,
      type: (project as any).type || 'Album', // Fallback in case type isn't populated
      genre: project.genre,
      release_date: project.release_date,
      rating: project.rating,
      spotify_id: project.spotify_id,
      favorites: project.favorites,
      thoughts: project.thoughts || '',
      tens_id: project.tens_id || '',
    });
    setIsEditing(project.id);
    setEditOriginalSpotifyId(project.spotify_id);
    setIsFeaturedChecked(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ text: 'Project deleted.', type: 'success' });
      loadProjects();
    }
  };

  return (
    <div className="space-y-12">
      
      {/* --- FORM SECTION --- */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
        
        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm ${message.type === 'success' ? 'bg-green-950/50 text-green-400 border border-green-900' : 'bg-red-950/50 text-red-400 border border-red-900'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Title</label>
              <input required type="text" name="title" value={form.title} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2.5 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Artist</label>
              <input required type="text" name="artist" value={form.artist} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2.5 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2.5 focus:border-blue-500 focus:outline-none">
                <option value="Album">Album</option>
                <option value="Extended Play">Extended Play</option>
                <option value="Mini Album">Mini Album</option>
                <option value="Single">Single</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Genre</label>
              <input required type="text" name="genre" value={form.genre} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2.5 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Release Date (YYYY-MM-DD)</label>
              <input required type="text" name="release_date" value={form.release_date} onChange={handleChange} placeholder="e.g. 2026-08-14" className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2.5 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Rating (0-10)</label>
              <input 
                required 
                type="number" 
                min="0" 
                max="10" 
                step="0.5" 
                name="rating" 
                value={form.rating} 
                onChange={handleChange} 
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2.5 focus:border-blue-500 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Spotify ID or Link</label>
              <input required type="text" name="spotify_id" value={form.spotify_id} onChange={handleChange} placeholder="Paste ID or full URL" className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2.5 focus:border-blue-500 focus:outline-none placeholder:text-neutral-700" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">10/10 Anchor ID (Optional)</label>
              <input type="text" name="tens_id" value={form.tens_id} onChange={handleChange} placeholder="e.g. album_a" className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2.5 focus:border-blue-500 focus:outline-none placeholder:text-neutral-700" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Favorite Tracks</label>
            <input required type="text" name="favorites" value={form.favorites} onChange={handleChange} placeholder="Track 1, Track 2" className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2.5 focus:border-blue-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Thoughts</label>
            <textarea rows={4} name="thoughts" value={form.thoughts} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2.5 focus:border-blue-500 focus:outline-none"></textarea>
          </div>

          {/* toggle if featured */}
          <div className="flex items-center gap-3 py-2">
            <input 
              type="checkbox" 
              id="featuredToggle" 
              checked={isFeaturedChecked}
              onChange={(e) => setIsFeaturedChecked(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded bg-neutral-900 border-neutral-700 cursor-pointer"
            />
            <label htmlFor="featuredToggle" className="text-neutral-300 font-medium cursor-pointer select-none">
              Automatically set as Project of the Month (Featured)
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-neutral-800">
            <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50">
              {isLoading ? 'Saving...' : isEditing ? 'Update Project' : 'Add Project'}
            </button>
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(null); setEditOriginalSpotifyId(null); setForm(initialFormState); }} className="text-neutral-400 hover:text-white px-4">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- LIST SECTION --- */}
      <div>
        <h2 className="text-xl font-bold mb-6 text-neutral-300">Existing Projects ({projects.length})</h2>
        <div className="grid gap-4">
          {projects.map(project => (
            <div key={project.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
              <div>
                <h3 className="font-bold text-white">{project.title}</h3>
                <p className="text-sm text-neutral-400">{project.artist} • {project.release_date}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleEditClick(project)} className="text-sm bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-1.5 rounded-md transition-colors">
                  Edit
                </button>
                <button onClick={() => handleDelete(project.id, project.title)} className="text-sm bg-red-950/30 hover:bg-red-900/50 text-red-400 px-4 py-1.5 rounded-md transition-colors border border-red-900/30">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};