"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface Match {
	id: string;
	localTeamId: string;
	visitorTeamId: string;
	matchday: number;
	localScore?: number;
	visitorScore?: number;
	status: string;
}

interface Tournament {
	id: string;
	name: string;
	description?: string;
	category: string;
	startDate: string;
	endDate: string;
	format: string;
	status: string;
	participatingTeams: string[];
	matches: Match[];
}

interface Team {
	id: string;
	clubName: string;
}

interface Standing {
	teamId: string;
	teamName: string;
	played: number;
	won: number;
	drawn: number;
	lost: number;
	goalsFor: number;
	goalsAgainst: number;
	points: number;
}

export default function TournamentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const [tournament, setTournament] = useState<Tournament | null>(null);
	const [teams, setTeams] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<"calendar" | "standings">("calendar");
	const [editingMatch, setEditingMatch] = useState<string | null>(null);
	const [scores, setScores] = useState({ local: 0, visitor: 0 });

	const fetchData = async () => {
		try {
			const [tournamentRes, teamsRes] = await Promise.all([
				fetch(`/api/tournaments/${id}`),
				fetch("/api/teams")
			]);

			const tournamentData = await tournamentRes.json();
			const teamsData = await teamsRes.json();

			if (tournamentData.id) {
				setTournament(tournamentData);
			}

			if (Array.isArray(teamsData)) {
				const teamsMap: Record<string, string> = {};
				teamsData.forEach((t: Team) => {
					teamsMap[t.id] = t.clubName;
				});
				setTeams(teamsMap);
			}
		} catch (err) {
			console.error("Error fetching data:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [id]);

	const handleUpdateResult = async (matchId: string) => {
		try {
			const res = await fetch(`/api/tournaments/${id}/matches/${matchId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ localScore: scores.local, visitorScore: scores.visitor })
			});

			if (res.ok) {
				setEditingMatch(null);
				fetchData(); // Refresh data
			}
		} catch (err) {
			console.error("Error updating result:", err);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-green-50">
				<p className="text-green-600 animate-pulse">Cargando detalles del torneo...</p>
			</div>
		);
	}

	if (!tournament) {
		return (
			<div className="flex flex-col justify-center items-center min-h-screen bg-green-50 p-4">
				<h1 className="text-2xl font-bold text-red-600 mb-4">Torneo no encontrado</h1>
				<Link href="/tournaments" className="text-green-600 hover:underline">
					Volver a la lista
				</Link>
			</div>
		);
	}

	const calculateStandings = (): Standing[] => {
		const standingsMap: Record<string, Standing> = {};

		tournament.participatingTeams.forEach((teamId) => {
			standingsMap[teamId] = {
				teamId,
				teamName: teams[teamId] || "Equipo desconocido",
				played: 0,
				won: 0,
				drawn: 0,
				lost: 0,
				goalsFor: 0,
				goalsAgainst: 0,
				points: 0,
			};
		});

		tournament.matches.forEach((match) => {
			if (match.status === "Finished" && match.localScore !== undefined && match.visitorScore !== undefined) {
				const local = standingsMap[match.localTeamId];
				const visitor = standingsMap[match.visitorTeamId];

				if (local && visitor) {
					local.played++;
					visitor.played++;
					local.goalsFor += match.localScore;
					local.goalsAgainst += match.visitorScore;
					visitor.goalsFor += match.visitorScore;
					visitor.goalsAgainst += match.localScore;

					if (match.localScore > match.visitorScore) {
						local.won++;
						local.points += 3;
						visitor.lost++;
					} else if (match.localScore < match.visitorScore) {
						visitor.won++;
						visitor.points += 3;
						local.lost++;
					} else {
						local.drawn++;
						local.points += 1;
						visitor.drawn++;
						visitor.points += 1;
					}
				}
			}
		});

		return Object.values(standingsMap).sort((a, b) => {
			if (b.points !== a.points) return b.points - a.points;
			const goalDiffA = a.goalsFor - a.goalsAgainst;
			const goalDiffB = b.goalsFor - b.goalsAgainst;
			if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
			return b.goalsFor - a.goalsFor;
		});
	};

	const matchesByDay = tournament.matches.reduce((acc, match) => {
		if (!acc[match.matchday]) acc[match.matchday] = [];
		acc[match.matchday].push(match);
		return acc;
	}, {} as Record<number, Match[]>);

	const standings = calculateStandings();

	return (
		<div className="flex flex-col min-h-screen bg-green-50">
			{/* Header */}
			<div className="bg-white shadow-sm border-b border-green-100 p-4 md:p-8">
				<div className="max-w-6xl mx-auto">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
						<div>
							<Link href="/tournaments" className="text-sm text-green-600 hover:underline mb-2 block">
								← Volver a la lista
							</Link>
							<h1 className="text-3xl font-bold text-gray-900">{tournament.name}</h1>
							<p className="text-gray-500">{tournament.category} • {tournament.format}</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
								{tournament.status}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="max-w-6xl mx-auto w-full p-4 md:p-8">
				<div className="flex border-b border-gray-200 mb-6">
					<button
						className={`py-2 px-4 font-semibold text-sm transition-colors ${
							activeTab === "calendar" ? "border-b-2 border-green-600 text-green-600" : "text-gray-500 hover:text-green-600"
						}`}
						onClick={() => setActiveTab("calendar")}
					>
						Calendario
					</button>
					{tournament.format === "Liga" && (
						<button
							className={`py-2 px-4 font-semibold text-sm transition-colors ${
								activeTab === "standings" ? "border-b-2 border-green-600 text-green-600" : "text-gray-500 hover:text-green-600"
							}`}
							onClick={() => setActiveTab("standings")}
						>
							Clasificación
						</button>
					)}
				</div>

				{/* Content */}
				{activeTab === "calendar" ? (
					<div className="space-y-8">
						{Object.keys(matchesByDay).sort((a, b) => Number(a) - Number(b)).map((day) => (
							<div key={day} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
								<div className="bg-green-600 text-white px-4 py-2 font-bold">
									Jornada {day}
								</div>
								<div className="divide-y divide-gray-100">
									{matchesByDay[Number(day)].map((match) => (
										<div key={match.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
											<div className="flex-1 text-right pr-4 font-medium text-gray-800">
												{teams[match.localTeamId] || "Cargando..."}
											</div>
											
											{editingMatch === match.id ? (
												<div className="flex items-center gap-2">
													<input
														type="number"
														className="w-12 p-1 border rounded text-center"
														value={scores.local}
														onChange={(e) => setScores({ ...scores, local: parseInt(e.target.value) || 0 })}
													/>
													<span>-</span>
													<input
														type="number"
														className="w-12 p-1 border rounded text-center"
														value={scores.visitor}
														onChange={(e) => setScores({ ...scores, visitor: parseInt(e.target.value) || 0 })}
													/>
													<button
														onClick={() => handleUpdateResult(match.id)}
														className="bg-green-600 text-white p-1 rounded hover:bg-green-700"
													>
														✓
													</button>
													<button
														onClick={() => setEditingMatch(null)}
														className="bg-gray-400 text-white p-1 rounded hover:bg-gray-500"
													>
														✕
													</button>
												</div>
											) : (
												<button
													onClick={() => {
														setEditingMatch(match.id);
														setScores({ local: match.localScore || 0, visitor: match.visitorScore || 0 });
													}}
													className="bg-gray-100 px-3 py-1 rounded-md font-mono text-lg font-bold flex gap-2 min-w-[80px] justify-center hover:bg-gray-200 transition-colors"
												>
													{match.status === "Finished" ? (
														<>
															<span>{match.localScore}</span>
															<span>-</span>
															<span>{match.visitorScore}</span>
														</>
													) : (
														<span className="text-gray-400 text-sm">vs</span>
													)}
												</button>
											)}

											<div className="flex-1 text-left pl-4 font-medium text-gray-800 flex items-center justify-between">
												<span>{teams[match.visitorTeamId] || "Cargando..."}</span>
												<Link
													href={`/matches/${match.id}/report`}
													className="ml-4 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
												>
													Reportar Acta
												</Link>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
						{Object.keys(matchesByDay).length === 0 && (
							<div className="text-center p-12 bg-white rounded-lg border border-dashed border-gray-300">
								<p className="text-gray-500">No hay partidos programados todavía.</p>
							</div>
						)}
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
						<table className="w-full text-sm text-left">
							<thead className="bg-gray-50 text-gray-700 uppercase text-xs">
								<tr>
									<th className="px-6 py-3">Pos</th>
									<th className="px-6 py-3">Equipo</th>
									<th className="px-6 py-3 text-center">PJ</th>
									<th className="px-6 py-3 text-center">PG</th>
									<th className="px-6 py-3 text-center">PE</th>
									<th className="px-6 py-3 text-center">PP</th>
									<th className="px-6 py-3 text-center">GF</th>
									<th className="px-6 py-3 text-center">GC</th>
									<th className="px-6 py-3 text-center">DG</th>
									<th className="px-6 py-3 text-center font-bold">PTS</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{standings.map((s, index) => (
									<tr key={s.teamId} className={index < 3 ? "bg-green-50/30" : ""}>
										<td className="px-6 py-4 font-bold">{index + 1}</td>
										<td className="px-6 py-4 font-medium text-gray-900">{s.teamName}</td>
										<td className="px-6 py-4 text-center">{s.played}</td>
										<td className="px-6 py-4 text-center">{s.won}</td>
										<td className="px-6 py-4 text-center">{s.drawn}</td>
										<td className="px-6 py-4 text-center">{s.lost}</td>
										<td className="px-6 py-4 text-center">{s.goalsFor}</td>
										<td className="px-6 py-4 text-center">{s.goalsAgainst}</td>
										<td className="px-6 py-4 text-center">{s.goalsFor - s.goalsAgainst}</td>
										<td className="px-6 py-4 text-center font-bold text-green-700">{s.points}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
