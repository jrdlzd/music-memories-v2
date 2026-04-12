import { useState } from 'react';

// available years
interface FilterBarProps {
  filterYear: string;
  setFilterYear: (year: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  onSearch: (query: string) => void;
  availableYears: string[]; 
}

const FilterBar = ({ filterYear, setFilterYear, sortOption, setSortOption, onSearch, availableYears }: FilterBarProps) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 w-full">
      <div className="flex flex-wrap gap-4">
        {/* sorting */}
        <select 
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="appearance-none bg-neutral-900 border border-neutral-800 text-white rounded-full px-6 py-3 pr-10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-position-[right_1rem_center] bg-size-[1.2em_1.2em]"
        >
          <option value="none">Default Sort</option>
          <option value="release_date_newest">Newest First</option>
          <option value="release_date_oldest">Oldest First</option>
          <option value="rating_high_to_low">Highest Rated</option>
          <option value="rating_low_to_high">Lowest Rated</option>
          <option value="alphabetical">Alphabetical</option>
        </select>

        {/* filter year */}
        <select 
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="appearance-none bg-neutral-900 border border-neutral-800 text-white rounded-full px-6 py-3 pr-10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-position-[right_1rem_center] bg-size-[1.2em_1.2em]"
        >
          <option value="all">All Years</option>
          {/* dynamically map over the available years */}
          {availableYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* search */}
      <div className="flex gap-3 ml-auto w-full md:w-auto">
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch(inputValue)}
          placeholder="Search artists, titles..." 
          className="flex-1 bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 rounded-full px-6 py-3 md:w-64 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
        <button 
          onClick={() => onSearch(inputValue)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default FilterBar;