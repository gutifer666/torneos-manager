import { Service } from "diod";
import { Player } from "../domain/Player";
import { PlayerRepository } from "../domain/PlayerRepository";
import { PostgresClient } from "../../../shared/infrastructure/postgres/PostgresClient";

@Service()
export class PostgresPlayerRepository extends PlayerRepository {
  constructor(private readonly client: PostgresClient) {
    super();
  }

  async save(player: Player): Promise<void> {
    const primitives = player.toPrimitives();
    const query = {
      text: `INSERT INTO players (id, name, surname, birth_date, dorsal, file_number)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO UPDATE SET
               name = EXCLUDED.name,
               surname = EXCLUDED.surname,
               birth_date = EXCLUDED.birth_date,
               dorsal = EXCLUDED.dorsal,
               file_number = EXCLUDED.file_number`,
      values: [
        primitives.id,
        primitives.name,
        primitives.surname,
        primitives.birthDate,
        primitives.dorsal,
        primitives.fileNumber,
      ],
    };

    await this.client.query(query.text, query.values);
  }
}
