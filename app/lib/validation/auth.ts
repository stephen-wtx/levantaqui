import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Nome de utilizador é obrigatório'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória'),
  branch: z.string().trim().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
