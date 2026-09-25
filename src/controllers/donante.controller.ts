import { Request, Response, NextFunction } from 'express';
import * as donanteService from '../services/donante.service';
import { createDonanteSchema, updateDonanteSchema } from '../schemas/donante.schema';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const donantes = await donanteService.getAll();
    res.status(200).json({ status: 'success', data: donantes });
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const donante = await donanteService.getById(id);
    res.status(200).json({ status: 'success', data: donante });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = createDonanteSchema.parse(req.body);
    const userId = req.user!.sub;
    const donante = await donanteService.create(dto, userId);
    res.status(201).json({ status: 'success', data: donante });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const dto = updateDonanteSchema.parse(req.body);
    const donante = await donanteService.update(id, dto);
    res.status(200).json({ status: 'success', data: donante });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    await donanteService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
