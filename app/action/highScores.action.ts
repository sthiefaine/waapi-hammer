"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function fetchHighScores() {
  const highScores = await prisma.highScore.findMany({
    orderBy: {
      score: "desc",
    },
    take: 20,
  });

  return highScores;
}

const formDataSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  azerty: z
    .string()
    .optional()
    .refine((val) => val === "", {
      message: "error: 0",
    }),
  score: z.preprocess((val) => parseInt(val as string, 10), z.number().int()),
});

export async function addHighScore(
  prevState: { score: number },
  initialState: any,
  formData: FormData
) {
  const rawFormData = Object.fromEntries(formData.entries());

  rawFormData.score = prevState.score.toString();

  const validation = formDataSchema.safeParse(rawFormData);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors.map((err) => err.message).join(", "),
    };
  }

  const { name, azerty, score } = validation.data;

  if (azerty) {
    return {
      success: false,
      message: "error: 0",
    };
  }

  try {
    const result = await prisma.highScore.create({
      data: {
        name,
        score,
      },
    });

    if (result) {
      revalidatePath("/highscores", "page");
      return {
        name: result.name,
        success: true,
        message: "Score added!",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Database error: unable to add score",
    };
  }

  return {
    success: false,
    message: "error: 1",
  };
}
