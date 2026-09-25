import { IDonante } from '../models/donante.model';
import * as donanteRepository from '../repositories/donante.repository';
import { CreateDonanteDto, UpdateDonanteDto } from '../schemas/donante.schema';
import { AppError } from '../errors/AppError';

export async function getAll(): Promise<IDonante[]> {
  return donanteRepository.findAll();
}

export async function getById(id: string): Promise<IDonante> {
  const donante = await donanteRepository.findById(id);
  if (!donante) {
    throw new AppError(404, `Donante con ID ${id} no encontrado`);
  }
  return donante;
}

export async function create(
  dto: CreateDonanteDto,
  userId: string
): Promise<IDonante> {
  return donanteRepository.create({ ...dto, createdBy: userId });
}

export async function update(
  id: string,
  dto: UpdateDonanteDto
): Promise<IDonante> {
  await getById(id);
  const updatedDonante = await donanteRepository.updateById(id, dto);
  if (!updatedDonante) {
    throw new AppError(404, `Donante con ID ${id} no encontrado`);
  }
  return updatedDonante;
}

export async function remove(id: string): Promise<void> {
  const deleted = await donanteRepository.deleteById(id);
  if (!deleted) {
    throw new AppError(404, `Donante con ID ${id} no encontrado`);
  }
}
