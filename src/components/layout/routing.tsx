"use client";

import dynamic from "next/dynamic";
import { useSidebar } from "@/components/ui/sidebar";
import { HomePageSkeleton } from "./skeletons/home-page-skeleton";
import { UserSubmissions } from "./user-submissions";

// Dynamically import page components with suspense and ssr disabled
const HomePage = dynamic(() => import('@/app/(main)/home/page'), { 
  ssr: false, 
  loading: () => <HomePageSkeleton />
});

const ComponentsPage = dynamic(() => import('@/app/(main)/components/page'), { 
  ssr: false, 
  loading: () => <HomePageSkeleton /> // Using the same skeleton for now
});

const CreatorsPage = dynamic(() => import('@/app/(main)/creators/page'), { 
  ssr: false, 
  loading: () => <HomePageSkeleton /> // Using the same skeleton for now
});

// Use the existing client component directly
const ProfilePage = UserSubmissions;

const PublishPage = dynamic(() => import('@/app/(main)/publish/page'), { 
  ssr: false, 
  loading: () => <HomePageSkeleton /> // Using the same skeleton for now
});

export function ContentRouter() {
  const { activeItem } = useSidebar();
  
  return (
    <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
      {(activeItem === "home" && <HomePage />) ||
        (activeItem === "components" && <ComponentsPage />) ||
        (activeItem === "creators" && <CreatorsPage />) ||
        (activeItem === "submissions" && <ProfilePage />) ||
        (activeItem === "bookmarks" && <ProfilePage />) ||
        (activeItem === "publish" && <PublishPage />) ||
        <div>Content not found</div>
      }
    </div>
  );
}
