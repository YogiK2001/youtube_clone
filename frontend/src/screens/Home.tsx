import axios from "axios";
import { useEffect, useState } from "react";
import {
  FONTS,
  FONT_SIZES,
  FONT_WEIGHTS,
  TEXT_COLORS,
  getTextStyle,
} from "../styles/fonts";

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
    <div
      style={{
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => {
        // Small zoom effect when hovering over the card
        (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        // Return to normal size when not hovering
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
      }}
    >
      {/* THUMBNAIL SECTION - Shows the video preview image */}
      <div style={{ position: "relative", marginBottom: "12px" }}>
        <img
          src={video.thumbnail}
          alt={video.title}
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
            borderRadius: "12px",
            backgroundColor: "#e0e0e0",
          }}
        />
        {/* Video duration badge - placeholder for now */}
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          12:34 {/* TODO: Replace with actual video duration */}
        </div>
      </div>

      {/* VIDEO INFO SECTION - Title, channel, views, date */}
      <div style={{ display: "flex", gap: "12px" }}>
        {/* Channel Profile Picture */}
        <img
          src={video.channelImage}
          alt={video.channelName}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            flexShrink: 0,
            backgroundColor: "#ccc",
          }}
        />

        {/* Video Title and Metadata */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Video Title - truncated to 2 lines */}
          <h3
            style={{
              margin: "0 0 8px 0",
              ...getTextStyle("videoTitle", "medium"),
              lineHeight: "1.4",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: TEXT_COLORS.primary,
            }}
          >
            {video.title}
          </h3>

          {/* Channel Name - clickable in real app */}
          <p
            style={{
              margin: "0 0 4px 0",
              ...getTextStyle("channelName"),
              color: TEXT_COLORS.secondary,
            }}
          >
            {video.channelName}
          </p>

          {/* View Count and Upload Date */}
          <p
            style={{
              margin: "0",
              ...getTextStyle("metadata"),
              color: TEXT_COLORS.secondary,
            }}
          >
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
    <div
      style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        borderRight: "1px solid #e0e0e0",
        padding: "16px 0",
        overflowY: "auto",
        position: "fixed",
        left: 0,
        top: "56px",
        fontFamily: FONTS.primary,
      }}
    >
      {/* Sidebar Menu Items */}
      {menuItems.map((item, index) => (
        <div
          key={index}
          style={{
            padding: "12px 24px",
            cursor: "pointer",
            ...getTextStyle("body"),
            display: "flex",
            alignItems: "center",
            gap: "24px",
            color: TEXT_COLORS.primary,
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "#f0f0f0";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "transparent";
          }}
        >
          <span style={{ fontSize: "20px" }}>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// HEADER Component - Top navigation bar
function Header() {
  return (
    <div
      style={{
        height: "56px",
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "16px",
        paddingRight: "16px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        fontFamily: FONTS.primary,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontSize: "24px",
          fontWeight: FONT_WEIGHTS.bold,
          color: TEXT_COLORS.primary,
          cursor: "pointer",
        }}
      >
        ▶️ YouTube
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search"
        style={{
          width: "350px",
          padding: "10px 16px",
          borderRadius: "24px",
          border: "1px solid #ccc",
          ...getTextStyle("body"),
          outline: "none",
        }}
      />

      {/* User Profile / Sign In */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          style={{
            padding: "8px 24px",
            borderRadius: "20px",
            border: "1px solid #3ea6ff",
            backgroundColor: "white",
            color: "#3ea6ff",
            cursor: "pointer",
            ...getTextStyle("body", "medium"),
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
    <div style={{
      backgroundColor: "#f9f9f9",
      minHeight: "100vh",
      fontFamily: FONTS.primary,
    }}>
      <Header />
      <div style={{ display: "flex", marginTop: "56px" }}>
        <Sidebar />
        <div
          style={{
            marginLeft: "250px",
            padding: "24px",
            flex: 1,
          }}
        >
          {loading && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Loading videos...</p>
            </div>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "16px",
              width: "100%",
            }}
          >
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
