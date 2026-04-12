import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import type { PendingProject } from '../../types';

const initialFormState = {
  title: '',
  artist: '',
  type: 'Album',
  release_date: '',
};

export const PendingManager = () => {
  const [pending, setPending] = useState<PendingProject[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // fetch existing pending projects on load
  const loadPending = async () => {
    const { data, error } = await supabase
      .from('pending_projects')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) setPending(data as PendingProject []);
  };

  useEffect(() => {
    loadPending();
  }, []);

  // handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // submit handler for add/edit
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      if (isEditing) {
        // update
        const { error: updateError } = await supabase
          .from('pending_projects')
          .update(form)
          .eq('id', isEditing);
        
        if (updateError) throw updateError;
        setMessage({ text: 'Pending project updated!', type: 'success' });
      } else {
        // insert
        const { error: insertError } = await supabase
          .from('pending_projects')
          .insert([form]);

        if (insertError) throw insertError;
        setMessage({ text: 'Added to the queue!', type: 'success' });
      }

      // reset form and reload list
      setForm(initialFormState);
      setIsEditing(null);
      loadPending();

    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // edit and delete handlers
  const handleEditClick = (project: PendingProject) => {
    setForm({
      title: project.title,
      artist: project.artist,
      type: project.type || 'Album',
      release_date: project.release_date,
    });
    setIsEditing(project.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the queue?`)) return;
    const { error } = await supabase.from('pending_projects').delete().eq('id', id);
    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ text: 'Project removed from queue.', type: 'success' });
      loadPending();
    }
  };

  return (
    <div className="space-y-12">
      
      {/* --- FORM SECTION --- */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Pending Project' : 'Add to Queue'}</h2>
        
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
              <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Release Date (YYYY-MM-DD)</label>
              <input required type="text" name="release_date" value={form.release_date} onChange={handleChange} placeholder="e.g. 2026-08-14" className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2.5 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-neutral-800">
            <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50">
              {isLoading ? 'Saving...' : isEditing ? 'Update Queue' : 'Add to Queue'}
            </button>
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(null); setForm(initialFormState); }} className="text-neutral-400 hover:text-white px-4">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- LIST SECTION --- */}
      <div>
        <h2 className="text-xl font-bold mb-6 text-neutral-300">Current Queue ({pending.length})</h2>
        <div className="grid gap-4">
          {pending.map(project => (
            <div key={project.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
              <div>
                <h3 className="font-bold text-white">{project.title}</h3>
                <p className="text-sm text-neutral-400">{project.artist} • {project.release_date} • {project.type}</p>
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
}