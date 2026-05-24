export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-56 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-2.5 bg-gray-100 rounded-full w-1/3" />
        <div className="h-5 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="flex justify-between items-center pt-3">
          <div className="h-6 bg-gray-100 rounded w-24" />
          <div className="h-8 bg-gray-100 rounded-full w-28" />
        </div>
      </div>
    </div>
  );
}
