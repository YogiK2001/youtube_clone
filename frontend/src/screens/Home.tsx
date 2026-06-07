import axios from "axios";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router";

// Interface for Video data structure
// This defines the shape of each video object we'll use
interface Video {
  id: string;
  title: string; // Video title
  thumbnail: string; // URL of video thumbnail image
  videoUrl: string; // URL to the video file
  slug: string; // URL-friendly video identifier
  videoTitle: string; // Title of the video (from database)
  channelName: string; // Name of the channel that uploaded
  channelImage: string; // URL of channel's profile picture
  views: number; // Number of video views
  uploadDate: string; // When the video was uploaded
  userId: string; // ID of the user who uploaded
}

const SAMPLE_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Learn React Hooks in 10 Minutes",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=320&h=180&fit=crop",
    videoUrl: "https://example.com/video1.mp4",
    slug: "learn-react-hooks",
    videoTitle: "Learn React Hooks in 10 Minutes",
    channelName: "Code Masters",
    channelImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    views: 125000,
    uploadDate: "2 days ago",
    userId: "user1",
  },
  {
    id: "2",
    title: "Web Development Full Course 2024",
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=320&h=180&fit=crop",
    videoUrl: "https://example.com/video2.mp4",
    slug: "web-dev-course",
    videoTitle: "Web Development Full Course 2024",
    channelName: "Tech Academy",
    channelImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    views: 450000,
    uploadDate: "1 week ago",
    userId: "user2",
  },
  {
    id: "3",
    title: "JavaScript Tips & Tricks",
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=320&h=180&fit=crop",
    videoUrl: "https://example.com/video3.mp4",
    slug: "js-tips-tricks",
    videoTitle: "JavaScript Tips & Tricks",
    channelName: "Dev Tips",
    channelImage:
      "https://images.unsplash.com/photo-1517849845537-1d51a20414de?w=40&h=40&fit=crop",
    views: 89000,
    uploadDate: "3 days ago",
    userId: "user3",
  },
  {
    id: "4",
    title: "CSS Grid Masterclass",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=320&h=180&fit=crop",
    videoUrl: "https://example.com/video4.mp4",
    slug: "css-grid-master",
    videoTitle: "CSS Grid Masterclass",
    channelName: "Design Hub",
    channelImage:
      "https://images.unsplash.com/photo-1502323777036-f29e3e72d5f6?w=40&h=40&fit=crop",
    views: 234000,
    uploadDate: "5 days ago",
    userId: "user4",
  },
  {
    id: "5",
    title: "React vs Vue: Comparison",
    thumbnail:
      "https://i.ytimg.com/vi/I1V9YWqRIeI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCUpXqM9EVYbIRkQaKY4npt1jsCtg",
    videoUrl: "https://example.com/video5.mp4",
    slug: "react-vs-vue",
    videoTitle: "React vs Vue: Comparison",
    channelName: "Code Masters",
    channelImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    views: 567000,
    uploadDate: "1 day ago",
    userId: "user1",
  },
  {
    id: "6",
    title: "TypeScript Advanced Patterns",
    thumbnail:
      "https://i.ytimg.com/vi/b9eMGE7QtTk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBOnG0zwhzzqEDQotmupnMOmrpHlQ",
    videoUrl: "https://example.com/video6.mp4",
    slug: "typescript-patterns",
    videoTitle: "TypeScript Advanced Patterns",
    channelName: "Tech Academy",
    channelImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    views: 312000,
    uploadDate: "4 days ago",
    userId: "user2",
  },
  {
    id: "7",
    title: "Building a Backend with Node.js",
    thumbnail:
      "https://i.ytimg.com/vi/b9eMGE7QtTk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBOnG0zwhzzqEDQotmupnMOmrpHlQ",
    videoUrl: "https://example.com/video7.mp4",
    slug: "nodejs-backend",
    videoTitle: "Building a Backend with Node.js",
    channelName: "Backend Basics",
    channelImage:
      "https://i.ytimg.com/vi/b9eMGE7QtTk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBOnG0zwhzzqEDQotmupnMOmrpHlQ",
    views: 156000,
    uploadDate: "6 days ago",
    userId: "user5",
  },
  {
    id: "8",
    title: "Database Design Best Practices",
    thumbnail:
      "https://i.ytimg.com/vi/b9eMGE7QtTk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBOnG0zwhzzqEDQotmupnMOmrpHlQ",
    videoUrl: "https://example.com/video8.mp4",
    slug: "database-design",
    videoTitle: "Database Design Best Practices",
    channelName: "Data Guru",
    channelImage:
      "https://i.ytimg.com/vi/b9eMGE7QtTk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBOnG0zwhzzqEDQotmupnMOmrpHlQ",
    views: 234000,
    uploadDate: "2 days ago",
    userId: "user6",
  },
];

function formatViews(views: number): string {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M";
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K";
  }
  return views?.toString();
}

// VideoCard Component - Displays a single video in the feed
// This is what users see for each video
interface VideoCardProps {
  video: Video;
}

function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="cursor-pointer transition-transform duration-200 hover:scale-[1.02]">
      {/* THUMBNAIL SECTION */}
      <div className="relative mb-3">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-45 w-full rounded-xl bg-border object-cover"
        />
        {/* Video duration badge - placeholder for now */}
        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs font-medium text-white">
          12:34 {/* TODO: Replace with actual video duration */}
        </div>
      </div>

      {/* VIDEO INFO SECTION - Title, channel, views, date */}
      <div className="flex gap-3">
        {/* Channel Profile Picture */}
        <img
          src={video.channelImage}
          alt={video.channelName}
          className="h-9 w-9 shrink-0 rounded-full bg-[#ccc]"
        />

        {/* Video Title and Metadata */}
        <div className="min-w-0 flex-1">
          {/* Video Title - truncated to 2 lines */}
          <h3 className="mb-2 line-clamp-2 text-sm font-medium leading-[1.4] text-text-primary">
            {video.title}
          </h3>

          {/* Channel Name - clickable in real app */}
          <p className="mb-1 text-xs text-text-secondary">
            {video.channelName}
          </p>

          {/* View Count and Upload Date */}
          <p className="text-xs text-text-secondary">
            {formatViews(video.views)} views • {video.uploadDate}
          </p>
        </div>
      </div>
    </div>
  );
}

// SIDEBAR Component - Navigation menu like YouTube
function Sidebar() {
  const menuItems = [
    { icon: "🏠", label: "Home" },
    { icon: "🎬", label: "Shorts" },
    { icon: "📺", label: "Subscriptions" },
    { icon: "📚", label: "Library" },
  ];

  return (
    <div className="fixed left-0 top-14 h-screen w-[250px] overflow-y-auto border-r border-border bg-surface py-4">
      {/* Sidebar Menu Items */}
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="flex cursor-pointer items-center gap-6 px-6 py-3 text-sm text-text-primary transition-colors duration-200 hover:bg-hover"
        >
          <span className="text-xl">{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// HEADER Component - Top navigation bar
function Header() {
  let navigate = useNavigate();
  return (
    <div className="fixed left-0 right-0 top-0 z-100 flex h-14 items-center justify-between border-b border-border bg-white px-4">
      {/* Logo */}
      <div className="cursor-pointer text-2xl font-bold text-text-primary">
        ▶️ YouTube
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search"
        className="w-[350px] rounded-3xl border border-[#ccc] px-4 py-2.5 text-sm outline-none"
      />

      {/* User Profile / Sign In */}
      <div className="flex items-center gap-4">
        <button
          className="cursor-pointer rounded-[20px] border border-accent bg-white px-6 py-2 text-sm font-medium text-accent"
          onClick={() => {
            navigate("/signup");
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

// MAIN HOME COMPONENT
export function Home() {
  // State to store videos (will be fetched from API later)
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect hook runs when component mounts
  // TODO: Replace this with actual API call to fetch videos from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/videos");
        const data = response.data;
        console.log("Fetched videos:", data);
        setVideos(data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        // setVideos(SAMPLE_VIDEOS);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <div className="mt-14 flex">
        <Sidebar />
        <div className="ml-[250px] flex-1 p-6">
          {loading && (
            <div className="p-10 text-center">
              <p>Loading videos...</p>
            </div>
          )}
          <div className="grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
