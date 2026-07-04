export type IncidentType = "Goal" | "Card" | "Substitution";

export interface IncidentBase {
	id: string;
	type: IncidentType;
	minute: number;
	teamId: string;
}

export interface Goal extends IncidentBase {
	type: "Goal";
	playerFileNumber: string;
	goalType: "regular" | "penalty" | "autogol";
}

export interface Card extends IncidentBase {
	type: "Card";
	playerFileNumber: string;
	color: "yellow" | "red";
	reason: string;
}

export interface Substitution extends IncidentBase {
	type: "Substitution";
	playerInFileNumber: string;
	playerOutFileNumber: string;
}

export type Incident = Goal | Card | Substitution;
