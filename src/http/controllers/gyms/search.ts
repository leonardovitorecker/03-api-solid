import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().int().min(1).default(1),
  });

  const searchGymsUseCase = makeSearchGymsUseCase();

  const { q, page } = searchGymsQuerySchema.parse(request.query);

  const { gyms } = await searchGymsUseCase.execute({
    query: q,
    page,
  });

  return reply.status(200).send({ gyms });
}
