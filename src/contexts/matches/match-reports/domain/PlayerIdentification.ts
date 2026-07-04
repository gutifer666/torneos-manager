export class PlayerIdentification {
	constructor(private readonly value: string) {
		this.ensureIsNotEmpty(value);
	}

	private ensureIsNotEmpty(value: string): void {
		if (!value || value.trim().length === 0) {
			throw new Error("Player identification (fileNumber) cannot be empty");
		}
	}

	getValue(): string {
		return this.value;
	}

	equals(other: PlayerIdentification): boolean {
		return this.value === other.getValue();
	}
}
