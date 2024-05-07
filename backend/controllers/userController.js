import prisma from "../db/db.config.js";
import path from "path";
import Jimp from "jimp";
import fs from "fs";
import mime from "mime-types";

export const getUser = async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const protectedUser = {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    avatarPath: user.avatarPath,
  };

  return res.status(200).json({ user: protectedUser });
};

export const getUserAvatar = async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const avatarPath = path.join(
    process.cwd(),
    "public",
    "avatars",
    `${user.id}.png`
  );

  if (fs.existsSync(avatarPath)) {
    return res.status(200).sendFile(avatarPath);
  }

  const defaultAvatarPath = path.join(
    process.cwd(),
    "public",
    "avatars",
    "default.png"
  );

  return res.status(200).sendFile(defaultAvatarPath);
};

export const updateUserAvatar = async (req, res) => {
  const { userId } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "No file provided." });
  }

  const mimeType = mime.lookup(req.file.originalname);
  if (!mimeType || !mimeType.startsWith("image/")) {
    return res
      .status(400)
      .json({ message: "Invalid file format. Only images are allowed." });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const avatarPath = path.join(
    process.cwd(),
    "public",
    "avatars",
    `${user.id}.png`
  );

  const resizeSize = 512;

  const avatarImage = await Jimp.read(req.file.path);
  await avatarImage.cover(resizeSize, resizeSize).write(avatarPath);
  fs.unlinkSync(req.file.path);

  return res.status(200).json({ message: "Avatar updated successfully." });
};
