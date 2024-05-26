import prisma from "../db/db.config.js";

export const getCanvasById = async (req, res) => {
  const { canvasId } = req.params;

  const canvas = await prisma.canvas.findUnique({
    where: {
      id: canvasId,
    },
  });

  if (!canvas) {
    return res.status(404).json({ message: "Canvas not found." });
  }

  return res.status(200).json(canvas);
};

export const getUserCanvases = async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const canvases = await prisma.canvas.findMany({
    where: {
      userId,
    },
  });

  return res.status(200).json(canvases);
};

export const createCanvas = async (req, res) => {
  const { name, description, userId, canvasJSON } = req.body;
  console.log(name);

  if (!name || !userId || !canvasJSON) {
    return res.status(400).json({ message: "Missing parameters." });
  }

  const canvas = await prisma.canvas.create({
    data: {
      name,
      userId,
      description,
      canvasJSON,
    },
  });

  return res.status(201).json(canvas);
};

export const updateCanvas = async (req, res) => {
  const { canvasId } = req.params;
  const { name, description, canvasJSON } = req.body;

  if (!name || !canvasJSON) {
    return res.status(400).json({ message: "Missing parameters." });
  }

  const canvas = await prisma.canvas.update({
    where: {
      id: canvasId,
    },
    data: {
      name,
      description,
      canvasJSON,
    },
  });

  return res.status(200).json(canvas);
};

export const deleteCanvas = async (req, res) => {
  const { canvasId } = req.params;

  const canvas = await prisma.canvas.findUnique({
    where: {
      id: canvasId,
    },
  });

  if (!canvas) {
    return res.status(404).json({ message: "Canvas not found." });
  }

  await prisma.canvas.delete({
    where: {
      id: canvasId,
    },
  });

  return res.status(204).json({ message: "Canvas deleted." });
};
