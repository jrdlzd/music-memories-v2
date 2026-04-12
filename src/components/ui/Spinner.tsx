export const Spinner = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4 animate-fade-in">
      <div className="w-12 h-12 border-4 border-neutral-800 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-neutral-500 font-medium tracking-wide animate-pulse uppercase text-sm">
        {message}
      </p>
    </div>
  );
};