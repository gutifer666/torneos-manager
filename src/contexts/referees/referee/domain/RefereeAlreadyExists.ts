export class RefereeAlreadyExists extends Error {
	constructor(value: string) {
		super(`Referee with value ${value} already exists`);
	}
}
