export default function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-28 mb-20">
      <div className="flex flex-col md:flex-row gap-12 animate-pulse">
        <div className="w-full md:w-1/2">
          <div className="rounded-2xl h-120 bg-gray-100" />
          <div className="flex gap-3 mt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-20 h-20 rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2 pt-4 space-y-4">
          <div className="h-3 bg-gray-100 rounded-full w-1/4" />
          <div className="h-9 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-8 bg-gray-100 rounded w-1/4" />
          <div className="h-24 bg-gray-100 rounded" />
          <div className="h-14 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}
