import express from "express";
import type { NextFunction, Request, Response } from "express";
import * as z from "zod";
import bcrypt from "bcrypt";
import { prisma } from "./db";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(express.json());

// CORS Middleware - Allow requests from frontend running on different port
app.use(cors());

interface AuthRequest extends Request {
  userId?: string;
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: "JWT_SECRET is not defined" });
    return;
  }
  try {
    const payload = jwt.verify(token, secret) as { id: string };
    req.userId = payload.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

const SiginupSchema = z.object({
  username: z.string(),
  password: z.string(),
  gender: z
    .enum(["Male", "Female", "Non-Binary", "Others"])
    .transform((value) => (value === "Non-Binary" ? "Non_Binary" : value)),
});

const SInginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

//zod validations

// signup

app.post("/siginup", async (req, res) => {
  try {
    //data check
    const pasredData = SiginupSchema.safeParse(req.body);
    if (!pasredData.success) {
      res.status(400).json({
        error: "Invalid request body",
        details: pasredData.error.message,
      });
      return;
    }

    const { username, password, gender } = pasredData.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    //existing user check
    const existing = await prisma.user.findFirst({ where: { username } });
    if (existing) {
      res.status(409).json({ error: "User Already Exists" });
      return;
    }

    const createdUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        gender,
        channelName: username,
      },
    });

    res.status(201).json({
      message: "User created",
      user: {
        id: createdUser.id,
        username: createdUser.username,
        gender: createdUser.gender,
        channelName: createdUser.channelName,
      },
    });
  } catch (error) {
    console.error("Signup failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//signin
app.post("/signin", async (req, res) => {
  const pasredData = SiginupSchema.safeParse(req.body);
  if (!pasredData.success) {
    res.status(400).json({
      error: "Invalid request body",
      details: pasredData.error.message,
    });
    return;
  }
  const { username, password } = req.body;
  const existing = await prisma.user.findFirst({ where: { username } });
  const passwordMatch = existing
    ? await bcrypt.compare(password, existing.password)
    : false;

  if (!existing || !passwordMatch) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  //Just TS things!!
  const jwtCheck = process.env.JWT_SECRET;
  if (!jwtCheck) {
    res
      .status(500)
      .json({ error: "JWT_SECRET is not defined in environment variables" });
    return;
  }

  const jwtToken = jwt.sign(
    {
      id: existing.id,
    },
    jwtCheck,
  );

  res.status(200).json({
    message: "Signin successful",
    token: jwtToken,
  });
});

// ---Video Upload---

app.get("/videos", async (req, res) => {
  const videos = await prisma.uploads.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  // Transform database response to match frontend's Video interface
  const formattedVideos = videos.map((video) => ({
    id: video.id,
    title: video.videoTitle, // Map videoTitle to title
    thumbnail: video.thumbnail,
    videoUrl: video.videoUrl,
    slug: video.slug,
    videoTitle: video.videoTitle,
    channelName: video.user.channelName,
    channelImage: video.user.profilePicture || "https://via.placeholder.com/40", // Fallback if no image
    views: video.views,
    uploadDate: new Date(video.createdAt).toLocaleDateString(), // Format date as "4/20/2026"
    userId: video.userId,
  }));

  res.json(formattedVideos);
});

app.get("/videos/:id", async (req, res) => {
  const { id } = req.params;
  const video = await prisma.uploads.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!video) {
    res.status(404).json({ error: "Video not found" });
    return;
  }

  // Transform to match frontend interface
  const formattedVideo = {
    id: video.id,
    title: video.videoTitle,
    thumbnail: video.thumbnail,
    videoUrl: video.videoUrl,
    slug: video.slug,
    videoTitle: video.videoTitle,
    channelName: video.user.channelName,
    channelImage: video.user.profilePicture || "https://via.placeholder.com/40",
    views: video.views,
    uploadDate: new Date(video.createdAt).toLocaleDateString(),
    userId: video.userId,
  };

  res.json(formattedVideo);
});

const UploadSchema = z.object({
  slug: z.string().min(1),
  videoTitle: z.string().min(1),
  videoUrl: z.url(),
  thumbnail: z.url(),
});

app.post("/videos", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = UploadSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid request body", details: parsed.error.message });
    return;
  }

  const { slug, videoTitle, videoUrl, thumbnail } = parsed.data;

  const video = await prisma.uploads.create({
    data: {
      slug,
      videoTitle,
      videoUrl,
      thumbnail,
      userId: req.userId!,
    },
  });

  res.status(201).json(video);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
