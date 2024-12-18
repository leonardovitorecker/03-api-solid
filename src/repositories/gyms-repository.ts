import { Gym, Gym as IGym, Prisma } from "@prisma/client";

export interface IFindManyNearbyParams {
  latitude: number;
  longitude: number;
}

export interface IGymsRepository {
  create(data: Prisma.GymCreateInput): Promise<IGym>;
  findById(id: string): Promise<IGym | null>;
  searchMany(query: string, page: number): Promise<IGym[]>;
  findManyNearby(params: IFindManyNearbyParams): Promise<IGym[]>;
}
