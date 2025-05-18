import { CreatorCardSkeleton } from "@/components/layout/creator-card-skeleton";

export function CreatorPageSkeleton() {
  return (
    <>
      {Array.from({ length: 15 }).map((_, index) => (
        <CreatorCardSkeleton key={index} />
      ))}
    </>
  );
}
