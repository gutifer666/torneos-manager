import { Tournament } from "../../../../../src/contexts/tournaments/tournament/domain/Tournament";

describe("Tournament", () => {
	it("should throw an error if the end date is before the start date", () => {
		const startDate = new Date("2026-12-02");
		const endDate = new Date("2026-12-01");

		expect(() => {
			Tournament.create(
				"id",
				"name",
				"description",
				"category",
				startDate,
				endDate,
				16,
				"Liga",
				"Partido único",
				"Borrador",
				[]
			);
		}).toThrow("The end date must be after the start date");
	});

	it("should throw an error if the format is knockout and max participants is odd", () => {
		const startDate = new Date();
		startDate.setDate(startDate.getDate() + 1);
		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + 1);

		expect(() => {
			Tournament.create(
				"id",
				"name",
				"description",
				"category",
				startDate,
				endDate,
				15,
				"Eliminación directa",
				"Partido único",
				"Borrador",
				[]
			);
		}).toThrow("The maximum number of participants must be even for knockout format");
	});

	it("should throw an error if the start date is in the past", () => {
		const startDate = new Date("2020-01-01");
		const endDate = new Date("2020-01-02");

		expect(() => {
			Tournament.create(
				"id",
				"name",
				"description",
				"category",
				startDate,
				endDate,
				16,
				"Liga",
				"Partido único",
				"Borrador",
				[]
			);
		}).toThrow("The start date cannot be in the past");
	});

	it("should throw an error if the number of participating teams exceeds max participants", () => {
		const startDate = new Date();
		startDate.setDate(startDate.getDate() + 1);
		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + 1);

		expect(() => {
			Tournament.create(
				"id",
				"name",
				"description",
				"category",
				startDate,
				endDate,
				2,
				"Liga",
				"Partido único",
				"Borrador",
				["team1", "team2", "team3"]
			);
		}).toThrow("The maximum number of participants (2) has been exceeded");
	});

	it("should create a valid tournament", () => {
		const startDate = new Date();
		startDate.setDate(startDate.getDate() + 1);
		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + 1);

		const tournament = Tournament.create(
			"id",
			"name",
			"description",
			"category",
			startDate,
			endDate,
			16,
			"Liga",
			"Partido único",
			"Borrador",
			["team1", "team2"]
		);

		expect(tournament).toBeInstanceOf(Tournament);
		expect(tournament.toPrimitives().name).toBe("name");
		expect(tournament.toPrimitives().participatingTeams).toEqual(["team1", "team2"]);
	});
});
