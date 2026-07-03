export class TeamFileNumberAlreadyExists extends Error {
	constructor(fileNumber: string) {
		super(`The team with file number <${fileNumber}> already exists`);
	}
}
