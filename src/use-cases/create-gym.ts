import { Gym as IGym } from "@prisma/client";
import { IGymsRepository } from "@/repositories/gyms-repository";

interface ICreateGymUseCaseRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface ICreateGymUseCaseResponse {
  gym: IGym;
}
export class CreateGymUseCase {
  constructor(private gymsRepository: IGymsRepository) {}
  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: ICreateGymUseCaseRequest): Promise<ICreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return {
      gym,
    };
  }
}
