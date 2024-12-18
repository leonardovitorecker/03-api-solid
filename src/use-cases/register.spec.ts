import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;
describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });
  it("should register a new user", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john.doe@example.com");
  });
  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );
    expect(isPasswordCorrectlyHashed).toBe(false);
  });
  it("should not be able to register with same email twice", async () => {
    const email = "john.doe@example.com";
    await sut.execute({
      name: "John Doe",
      email,
      password: "password123",
    });

    await expect(() =>
      sut.execute({
        name: "Jane Doe",
        email,
        password: "password123",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
