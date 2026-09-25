import { z } from 'zod';

export const createDonanteSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    message: 'Tipo de sangre inválido (A+, A-, B+, B-, AB+, AB-, O+, O-)',
  }),
  age: z
    .number()
    .int('La edad debe ser un número entero')
    .min(18, 'La edad mínima para donar es 18 años')
    .max(65, 'La edad máxima para donar es 65 años'),
  phone: z.string().min(7, 'El teléfono debe tener al menos 7 caracteres'),
  email: z.string().email('Debe ser un correo electrónico válido'),
  lastDonationDate: z.coerce.date().optional(),
  isEligible: z.boolean().default(true),
});

export const updateDonanteSchema = createDonanteSchema.partial();

export type CreateDonanteDto = z.infer<typeof createDonanteSchema>;
export type UpdateDonanteDto = z.infer<typeof updateDonanteSchema>;
