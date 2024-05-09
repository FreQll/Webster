import prisma from "../db/db.config.js";
import { generateRandomCode, jwtGenerator } from "../tools/auth.js";

import bcrypt from "bcrypt";
import { sendEmail } from "../tools/sendEmail.js";
import { resetPasswordHTML } from "../public/emails/resetPasswordHTML.js";
import { confirmEmailHTML } from "../public/emails/confirmEmailHTML.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing parameters." });
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  if (!user.isConfirmed) {
    return res.status(401).json({ message: "Email not confirmed." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  let token = jwtGenerator(user.id, user.email, user.name);

  const protectedUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    token,
  };

  return res.status(200).json(protectedUser);
};

export const register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Missing parameters." });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ message: "Invalid email." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      avatarPath: `http://localhost:3001/user/avatar/${user.id}`,
    },
  });

  const emailConfirmation = await prisma.confirmEmailCode.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (emailConfirmation && emailConfirmation.confirmedAt) {
    return res.status(400).json({ message: "Email already confirmed." });
  }

  if (emailConfirmation) {
    return res
      .status(400)
      .json({ message: "Email confirmation pending. Check your email." });
  }

  const emailConfirmationCode = generateRandomCode();
  const emailConfirmationCodeHashed = await bcrypt.hash(
    emailConfirmationCode.toString(),
    10
  );

  await prisma.confirmEmailCode.create({
    data: {
      userId: user.id,
      token: emailConfirmationCodeHashed,
    },
  });

  await sendEmail(
    email,
    "📧 Email Confirmation 📧",
    confirmEmailHTML(user.name, emailConfirmationCode)
  );

  const protectedUser = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  return res.status(200).json({ user: protectedUser });
};

export const confirmEmail = async (req, res) => {
  const { code, email } = req.body;

  if (!code || !email) {
    return res.status(400).json({ message: "Missing parameters." });
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const emailConfirmation = await prisma.confirmEmailCode.findFirst({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!emailConfirmation) {
    return res.status(404).json({ message: "Email confirmation not found." });
  }

  if (emailConfirmation.confirmedAt) {
    return res.status(400).json({ message: "Email already confirmed." });
  }

  const isCodeValid = await bcrypt.compare(code, emailConfirmation.token);

  if (!isCodeValid) {
    return res.status(401).json({ message: "Invalid confirmation code." });
  }

  await prisma.confirmEmailCode.update({
    where: {
      id: emailConfirmation.id,
    },
    data: {
      confirmedAt: new Date(),
    },
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isConfirmed: true,
    },
  });

  return res.status(200).json({ message: "Email confirmed." });
};

export const resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Missing parameters." });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const resetCode = generateRandomCode();
  const resetCodeCrypted = await bcrypt.hash(resetCode.toString(), 10);

  await prisma.resetPasswordCode.create({
    data: {
      userId: user.id,
      token: resetCodeCrypted,
      expirationTime: new Date(Date.now() + 60 * 60 * 1000), //* 1 hour
    },
  });

  await sendEmail(
    email,
    "🔒 Password Reset 🔒",
    resetPasswordHTML(user.name, resetCode)
  );

  return res.status(200).json({ message: "Reset link sent." });
};

export const confirmResetPassword = async (req, res) => {
  const { newPassword, code, email } = req.body;

  if (!newPassword || !code || !email) {
    return res.status(400).json({ message: "Missing parameters." });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const resetCode = await prisma.resetPasswordCode.findFirst({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!resetCode) {
    return res.status(404).json({ message: "Reset code not found." });
  }

  const isCodeValid = await bcrypt.compare(code, resetCode.token);

  if (!isCodeValid) {
    return res.status(401).json({ message: "Invalid reset code." });
  }

  if (resetCode.expirationTime < new Date()) {
    return res.status(401).json({ message: "Reset code expired." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.resetPasswordCode.delete({
    where: {
      id: resetCode.id,
    },
  });

  return res.status(200).json({ message: "Password changed." });
};
