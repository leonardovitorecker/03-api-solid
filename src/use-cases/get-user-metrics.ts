import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { ICheckInsRepository } from "@/repositories/check-ins-repository";
interface IGetUserMetricsUseCaseRequest {
  userId: string;
}

interface IGetUserMetricsUseCaseResponse {
  checkInsCount: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    userId,
  }: IGetUserMetricsUseCaseRequest): Promise<IGetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId);
    return {
      checkInsCount,
    };
  }
}
