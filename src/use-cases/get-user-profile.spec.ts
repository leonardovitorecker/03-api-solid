import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;
describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });
  it("should be able to get user profile", async () => {
    const createUser = await usersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: await hash("password123", 6),
    });

    const { user } = await sut.execute({ userId: createUser.id });
    expect(user.name).toBe("John Doe");
  });
  it("should not be able get user profile with wrong id", async () => {
    await expect(() =>
      sut.execute({ userId: "non-existing-id" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
