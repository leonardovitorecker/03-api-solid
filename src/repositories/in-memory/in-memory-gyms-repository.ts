import { Gym as IGym, Prisma } from "@prisma/client";
import { IFindManyNearbyParams, IGymsRepository } from "../gyms-repository";
import { randomUUID } from "crypto";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements IGymsRepository {
  public items: IGym[] = [];
  async findById(id: string): Promise<IGym | null> {
    const gym = this.items.find((g) => g.id === id);
    if (!gym) {
      return null;
    }
    return gym;
  }
  async create(data: Prisma.GymCreateInput): Promise<IGym> {
    const gym = {
      id: randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    this.items.push(gym);
    return gym;
  }
  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }
  async findManyNearby(params: IFindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
        }
      );
      return distance < 10;
    });
  }
}
