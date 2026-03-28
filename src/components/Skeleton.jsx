export function SkeletonLine({ width = 'w-full', height = 'h-3' }) {
  return (
    <div className={`${width} ${height} bg-[#1a1a1a] animate-pulse`} />
  )
}

export function SkeletonCard() {
  return (
    <div className="border border-[#1f1f1f] p-8 flex flex-col gap-4">
      <SkeletonLine width="w-20" height="h-2.5" />
      <div className="flex flex-col gap-2 pt-1">
        <SkeletonLine width="w-4/5" height="h-5" />
        <SkeletonLine width="w-3/5" height="h-5" />
      </div>
      <div className="flex flex-col gap-2 pt-2">
        <SkeletonLine />
        <SkeletonLine />
        <SkeletonLine width="w-2/3" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <SkeletonLine width="w-24" height="h-2.5" />
        <SkeletonLine width="w-16" height="h-2.5" />
      </div>
    </div>
  )
}
