export default function CouponsLoading() {
  return (
    <div className="space-y-8">
      <div className="h-32 bg-slate-800/50 rounded-2xl animate-pulse"></div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-800/50 rounded-lg animate-pulse"></div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-80 bg-slate-800/50 rounded-lg animate-pulse"></div>
        ))}
      </div>
      <div className="h-96 bg-slate-800/50 rounded-lg animate-pulse"></div>
    </div>
  )
}
