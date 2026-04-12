import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  // grab current url path
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 font-sans">
      
      {/* nav bar */}
      <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-wrap items-center justify-between gap-4">
          
          <Link to="/" className="text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors">
            Music Memories
          </Link>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium tracking-wide">
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <Link to="/reviewed" className="hover:text-blue-400 transition-colors">Reviewed</Link>
            <Link to="/pending" className="hover:text-blue-400 transition-colors">Pending</Link>
            <Link to="/tens" className="hover:text-blue-400 transition-colors">10/10</Link>
            <Link to="/admin" className="hover:text-blue-400 transition-colors text-neutral-600 ml-2 md:ml-6">Admin</Link>
          </div>

        </div>
      </nav>

      {/* main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto overflow-hidden">
        <div key={location.pathname} className="animate-fade-in">
          <Outlet /> 
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-8 mt-12 text-center text-neutral-600 text-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>Made by Jared Luzod</p>
          <div className="flex items-center gap-6">
              <a 
                href="https://github.com/jrdlzd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-2"
                aria-label="GitHub"
              >
                {/* GitHub SVG Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
                  <path d="M12 18h.01"></path>
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </a>

              <a 
                href="https://linkedin.com/in/jared-luzod" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors flex items-center gap-2"
                aria-label="LinkedIn"
              >
                {/* LinkedIn SVG Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
            </div>
        </div>
        
      </footer>

    </div>
  );
};

export default Layout;