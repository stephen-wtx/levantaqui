import { z } from 'zod';

export const atmUpdateSchema = z.object({
  estado: z.enum(['DISPONIVEL', 'INDISPONIVEL', 'MANUTENCAO']),
});

export type ATMUpdateInput = z.infer<typeof atmUpdateSchema>;

export const servicoUpdateSchema = z.object({
  estado: z.enum(['ABERTO', 'FECHADO']),
});

export type ServicoUpdateInput = z.infer<typeof servicoUpdateSchema>;

export function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map((v) => parseInt(v, 10));
  return hours * 60 + minutes;
}

/**
 * Validação rigorosa de regras de horários:
 * - De Segunda a Sexta: 07:00 às 16:00
 * - Ao Sábado: 07:00 às 12:00
 * - Hora de fecho estritamente posterior à hora de abertura
 */
export function validateHorarioRule(
  diaSemana: 'SEGUNDA' | 'TERCA' | 'QUARTA' | 'QUINTA' | 'SEXTA' | 'SABADO' | string,
  horaAbertura: string,
  horaFecho: string
): string | null {
  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
  if (!timeRegex.test(horaAbertura)) {
    return 'Hora de abertura deve estar no formato HH:MM (ex: 08:00)';
  }
  if (!timeRegex.test(horaFecho)) {
    return 'Hora de fecho deve estar no formato HH:MM (ex: 15:30)';
  }

  const startMin = parseTimeToMinutes(horaAbertura);
  const endMin = parseTimeToMinutes(horaFecho);

  if (endMin <= startMin) {
    return 'A hora de fecho deve ser posterior à hora de abertura';
  }

  const minCommon = 7 * 60; // 07:00

  if (diaSemana === 'SABADO' || diaSemana === 'Sábado') {
    const maxSabado = 12 * 60; // 12:00
    if (startMin < minCommon || startMin > maxSabado) {
      return 'Ao sábado, a hora de abertura deve estar entre 07:00 e 12:00';
    }
    if (endMin < minCommon || endMin > maxSabado) {
      return 'Ao sábado, a hora de fecho deve estar entre 07:00 e 12:00';
    }
  } else {
    // SEGUNDA a SEXTA
    const maxSemana = 16 * 60; // 16:00
    if (startMin < minCommon || startMin > maxSemana) {
      return 'De segunda a sexta, a hora de abertura deve estar entre 07:00 e 16:00';
    }
    if (endMin < minCommon || endMin > maxSemana) {
      return 'De segunda a sexta, a hora de fecho deve estar entre 07:00 e 16:00';
    }
  }

  return null;
}

export const horarioItemSchema = z
  .object({
    diaSemana: z.enum([
      'SEGUNDA',
      'TERCA',
      'QUARTA',
      'QUINTA',
      'SEXTA',
      'SABADO',
    ]),
    horaAbertura: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora de abertura deve estar no formato HH:MM'),
    horaFecho: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora de fecho deve estar no formato HH:MM'),
  })
  .superRefine((val, ctx) => {
    const errorMsg = validateHorarioRule(
      val.diaSemana,
      val.horaAbertura,
      val.horaFecho
    );
    if (errorMsg) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorMsg,
        path: ['horaFecho'],
      });
    }
  });

export const horariosUpdateSchema = z.object({
  horarios: z
    .array(horarioItemSchema)
    .min(1, 'Pelo menos um horário deve ser fornecido'),
});

export type HorariosUpdateInput = z.infer<typeof horariosUpdateSchema>;
