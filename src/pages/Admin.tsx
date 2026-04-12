import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ProjectManager } from '../components/admin/ProjectManager';
import { PendingManager } from '../components/admin/PendingManager';

export const Admin = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // state to track which tab is active
  const [activeTab, setActiveTab] = useState<'projects' | 'pending'>('projects');

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="px-6 md:px-12 py-12 max-w-6xl mx-auto animate-fade-in">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-neutral-900 pb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Admin Dashboard</h1>
          <p className="text-neutral-400">
            Logged in as <span className="text-blue-400">{user?.email}</span>
          </p>
        </div>
        
        <button
          onClick={handleSignOut}
          className="bg-neutral-900 hover:bg-red-950/40 text-neutral-300 hover:text-red-400 border border-neutral-800 hover:border-red-900/50 px-6 py-2.5 rounded-full text-sm font-medium transition-all w-fit"
        >
          Sign Out
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('projects')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'projects' 
              ? 'bg-blue-600 text-white' 
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          Manage Projects
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'pending' 
              ? 'bg-blue-600 text-white' 
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          Manage Pending
        </button>
      </div>

      {/* Dynamic Content Rendering */}
      <div className="animate-fade-in">
        {activeTab === 'projects' && <ProjectManager />}
        {activeTab === 'pending' && <PendingManager />}
      </div>

    </div>
  );
};