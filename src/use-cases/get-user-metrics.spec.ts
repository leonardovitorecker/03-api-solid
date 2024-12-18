import { expect, describe, it, beforeEach } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { GetUserMetricsUseCase } from "./get-user-metrics";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;
describe("Get User Metrics Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });
  it("should be able to get check-ins count from metrics", async () => {
    await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });
    await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-01",
    });
    expect(checkInsCount).toBe(2);
  });
});
