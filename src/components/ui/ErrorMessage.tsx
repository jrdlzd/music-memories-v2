import { useNavigate } from 'react-router-dom';

export const ErrorMessage = ({ message }: { message: string }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 text-center animate-fade-in">
      <div className="bg-red-950/30 border border-red-900/50 p-8 rounded-2xl max-w-lg w-full">
        <h2 className="text-xl font-bold text-red-400 mb-3">Something went wrong</h2>
        <p className="text-neutral-400 mb-8">{message}</p>
        
        <button 
          onClick={() => navigate('/')}
          className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors border border-neutral-800"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};