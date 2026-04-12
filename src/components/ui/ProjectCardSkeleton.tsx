export const ProjectCardSkeleton = () => {
  return (
    <div className="w-full aspect-square rounded-2xl bg-neutral-900 border border-neutral-800 animate-pulse flex flex-col justify-end p-6">
      {/* Title Placeholder */}
      <div className="h-6 bg-neutral-800 rounded-md w-3/4 mb-2"></div>
      {/* Artist Placeholder */}
      <div className="h-4 bg-neutral-800 rounded-md w-1/2 mb-4"></div>
      {/* Badge Placeholder */}
      <div className="h-6 bg-neutral-800 rounded-full w-16 mt-3"></div>
    </div>
  );
};