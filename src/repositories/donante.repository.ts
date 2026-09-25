import { DonanteModel, IDonante } from '../models/donante.model';
import { CreateDonanteDto, UpdateDonanteDto } from '../schemas/donante.schema';

export async function findAll(): Promise<IDonante[]> {
  return DonanteModel.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
}

export async function findById(id: string): Promise<IDonante | null> {
  return DonanteModel.findById(id).populate('createdBy', 'name email');
}

export async function create(
  data: CreateDonanteDto & { createdBy: string }
): Promise<IDonante> {
  return DonanteModel.create(data);
}

export async function updateById(
  id: string,
  data: UpdateDonanteDto
): Promise<IDonante | null> {
  return DonanteModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('createdBy', 'name email');
}

export async function deleteById(id: string): Promise<boolean> {
  const result = await DonanteModel.findByIdAndDelete(id);
  return result !== null;
}
