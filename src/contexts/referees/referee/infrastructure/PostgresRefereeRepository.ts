import { Service } from "diod";
import { Referee } from "../domain/Referee";
import { RefereeRepository } from "../domain/RefereeRepository";
import { PostgresClient } from "../../../shared/infrastructure/postgres/PostgresClient";
import { RefereeAlreadyExists } from "../domain/RefereeAlreadyExists";

@Service()
export class PostgresRefereeRepository extends RefereeRepository {
  constructor(private readonly client: PostgresClient) {
    super();
  }

  async save(referee: Referee): Promise<void> {
    const primitives = referee.toPrimitives();
    const query = {
      text: `INSERT INTO referees (id, name, collegiate_number, email, password)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (id) DO UPDATE SET
               name = EXCLUDED.name,
               collegiate_number = EXCLUDED.collegiate_number,
               email = EXCLUDED.email,
               password = EXCLUDED.password`,
      values: [
        primitives.id,
        primitives.name,
        primitives.collegiateNumber,
        primitives.email,
        primitives.password,
      ],
    };

    try {
      await this.client.query(query.text, query.values);
    } catch (error) {
      if ((error as { code?: string }).code === "23505") {
        throw new RefereeAlreadyExists(primitives.collegiateNumber);
      }
      throw error;
    }
  }
}
