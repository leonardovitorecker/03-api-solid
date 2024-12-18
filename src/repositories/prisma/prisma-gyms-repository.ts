import { Prisma, Gym as IGym } from "@prisma/client";
import { IFindManyNearbyParams, IGymsRepository } from "../gyms-repository";
import { prisma } from "@/lib/prisma";

export class PrismaGymsRepository implements IGymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({ data });
    return gym;
  }
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({ where: { id } });
    return gym;
  }
  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: { contains: query },
      },
      skip: (page - 1) * 20,
      take: 20,
    });
    return gyms;
  }
  async findManyNearby({ latitude, longitude }: IFindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<IGym[]>`
    SELECT * FROM gyms 
    where (6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return gyms;
  }
}
