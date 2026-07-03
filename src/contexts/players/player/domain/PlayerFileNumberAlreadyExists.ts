export class PlayerFileNumberAlreadyExists extends Error {
	constructor(fileNumber: string) {
		super(`The player with file number <${fileNumber}> already exists`);
	}
}
