import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;
describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: await hash("password123", 6),
    });
    const { user } = await sut.execute({
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "john.doe@example.com",
        password: "password123",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
  it("should not be able to authenticate with wrong email", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: await hash("password123", 6),
    });

    await expect(() =>
      sut.execute({
        email: "wrong.email@example.com",
        password: "password1234",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
