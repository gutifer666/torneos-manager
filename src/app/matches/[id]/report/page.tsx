"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

interface Player {
	id: string;
	name: string;
	surname: string;
	dorsal: number;
	fileNumber: string;
}

interface Team {
	id: string;
	clubName: string;
	fileNumber: string;
	playerIds: string[];
}

interface Match {
	id: string;
	tournamentId: string;
	localTeamId: string;
	visitorTeamId: string;
	matchday: number;
}

interface Tournament {
	id: string;
	name: string;
	category: string;
}

export default function MatchReportPage({ params }: { params: Promise<{ id: string }> }) {
	const { id: matchId } = use(params);
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(true);
	const [match, setMatch] = useState<Match | null>(null);
	const [tournament, setTournament] = useState<Tournament | null>(null);
	const [localTeam, setLocalTeam] = useState<Team | null>(null);
	const [visitorTeam, setVisitorTeam] = useState<Team | null>(null);
	const [players, setPlayers] = useState<Player[]>([]);

	// Form State
	const [startTime, setStartTime] = useState("");
	const [assistants, setAssistants] = useState("");
	const [lineups, setLineups] = useState<{ teamId: string; playerFileNumber: string; role: string }[]>([]);
	const [incidents, setIncidents] = useState<{ 
		id: string; 
		type: string; 
		minute: number; 
		teamId: string; 
		playerFileNumber?: string;
		goalType?: string;
		color?: string;
		reason?: string;
		playerInFileNumber?: string;
		playerOutFileNumber?: string;
	}[]>([]);
	const [observations, setObservations] = useState("");
	const [signature, setSignature] = useState("");

	useEffect(() => {
		async function fetchData() {
			try {
				const matchRes = await fetch(`/api/matches/${matchId}`);
				const matchData = await matchRes.json();
				if (matchData.error) throw new Error(matchData.error);

				setMatch(matchData.match);
				setTournament(matchData.tournament);

				const [teamsRes, playersRes] = await Promise.all([
					fetch("/api/teams"),
					fetch("/api/players"),
				]);

				const teamsData = await teamsRes.json();
				const playersData = await playersRes.json();

				setPlayers(playersData);
				setLocalTeam(teamsData.find((t: Team) => t.id === matchData.match.localTeamId));
				setVisitorTeam(teamsData.find((t: Team) => t.id === matchData.match.visitorTeamId));
				
				setLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
				setLoading(false);
			}
		}
		fetchData();
	}, [matchId]);

	if (loading) return <div className="p-8 text-center text-green-800">Cargando...</div>;
	if (!match || !tournament || !localTeam || !visitorTeam) return <div className="p-8 text-center text-red-600">Error al cargar los datos del partido.</div>;

	const nextStep = () => setStep(step + 1);
	const prevStep = () => setStep(step - 1);

	const handleSubmit = async () => {
		const payload = {
			tournamentId: tournament.id,
			refereeId: "00000000-0000-0000-0000-000000000000", // Dummy for now
			actualStartTime: new Date().toISOString(), // Use startTime from form
			assistantNames: assistants,
			lineups,
			incidents,
			extraordinaryIncidents: observations,
			refereeSignature: signature || "Signed",
		};

		try {
			const res = await fetch(`/api/matches/${matchId}/report`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (res.ok) {
				alert("Acta enviada correctamente");
				router.push(`/tournaments/${tournament.id}`);
			} else {
				const data = await res.json();
				alert(`Error: ${data.error}`);
			}
		} catch (error) {
			console.error("Error submitting report:", error);
			alert("Error al enviar el acta");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-4 font-sans text-gray-900">
			<div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
				<div className="bg-green-700 p-4 text-white">
					<h1 className="text-xl font-bold">Acta Digital</h1>
					<p className="text-sm opacity-90">{tournament.name} - {tournament.category}</p>
					<p className="text-xs opacity-75">Jornada {match.matchday} | {localTeam.clubName} vs {visitorTeam.clubName}</p>
				</div>

				<div className="p-6">
					<div className="flex justify-between mb-8">
						{[1, 2, 3, 4].map((s) => (
							<div
								key={s}
								className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
									step >= s ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"
								}`}
							>
								{s}
							</div>
						))}
					</div>

					{step === 1 && (
						<div className="space-y-4">
							<h2 className="text-lg font-bold border-b pb-2">Paso 1: Cabecera</h2>
							<div>
								<label className="block text-sm font-medium text-gray-700">Hora Real de Inicio</label>
								<input
									type="time"
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
									value={startTime}
									onChange={(e) => setStartTime(e.target.value)}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">Asistentes</label>
								<textarea
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
									rows={3}
									placeholder="Nombres de los árbitros asistentes..."
									value={assistants}
									onChange={(e) => setAssistants(e.target.value)}
								></textarea>
							</div>
							<button
								onClick={nextStep}
								className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
							>
								Siguiente
							</button>
						</div>
					)}

					{step === 2 && (
						<div className="space-y-6">
							<h2 className="text-lg font-bold border-b pb-2">Paso 2: Plantillas</h2>
							<p className="text-sm text-gray-600">Selecciona los jugadores para cada equipo.</p>
							
							{/* Local Team */}
							<div className="bg-gray-50 p-3 rounded-lg">
								<h3 className="font-bold text-green-800 mb-2">{localTeam.clubName} (Local)</h3>
								<div className="max-h-48 overflow-y-auto space-y-1">
									{players.filter(p => localTeam.playerIds.includes(p.id)).map(p => (
										<div key={p.id} className="flex items-center text-sm">
											<input 
												type="checkbox" 
												className="rounded text-green-600 mr-2" 
												onChange={(e) => {
													if (e.target.checked) {
														setLineups(prev => {
															if (prev.some(l => l.playerFileNumber === p.fileNumber)) return prev;
															return [...prev, { teamId: localTeam.id, playerFileNumber: p.fileNumber, role: 'Starter' }];
														});
													} else {
														setLineups(prev => prev.filter(l => l.playerFileNumber !== p.fileNumber));
													}
												}}
											/>
											<span>{p.dorsal} - {p.name} {p.surname} ({p.fileNumber})</span>
										</div>
									))}
								</div>
							</div>

							{/* Visitor Team */}
							<div className="bg-gray-50 p-3 rounded-lg">
								<h3 className="font-bold text-blue-800 mb-2">{visitorTeam.clubName} (Visitante)</h3>
								<div className="max-h-48 overflow-y-auto space-y-1">
									{players.filter(p => visitorTeam.playerIds.includes(p.id)).map(p => (
										<div key={p.id} className="flex items-center text-sm">
											<input 
												type="checkbox" 
												className="rounded text-blue-600 mr-2"
												onChange={(e) => {
													if (e.target.checked) {
														setLineups(prev => {
															if (prev.some(l => l.playerFileNumber === p.fileNumber)) return prev;
															return [...prev, { teamId: visitorTeam.id, playerFileNumber: p.fileNumber, role: 'Starter' }];
														});
													} else {
														setLineups(prev => prev.filter(l => l.playerFileNumber !== p.fileNumber));
													}
												}}
											/>
											<span>{p.dorsal} - {p.name} {p.surname} ({p.fileNumber})</span>
										</div>
									))}
								</div>
							</div>

							<div className="flex gap-2">
								<button onClick={prevStep} className="flex-1 border border-gray-300 py-2 rounded-md">Atrás</button>
								<button onClick={nextStep} className="flex-1 bg-green-600 text-white py-2 rounded-md">Siguiente</button>
							</div>
						</div>
					)}

					{step === 3 && (
						<div className="space-y-4">
							<h2 className="text-lg font-bold border-b pb-2">Paso 3: Incidencias</h2>
							
							<div className="space-y-2">
								{incidents.map((inc, index) => (
									<div key={index} className="text-sm bg-gray-100 p-2 rounded flex justify-between">
										<span>{inc.minute}&apos; - {inc.type} ({inc.playerFileNumber})</span>
										<button onClick={() => setIncidents(prev => prev.filter((_, i) => i !== index))} className="text-red-500">X</button>
									</div>
								))}
							</div>

							<div className="grid grid-cols-2 gap-2">
								<button 
									onClick={() => {
										const fileNumber = prompt("Número de ficha del jugador:");
										const teamId = prompt("ID del equipo (L/V):") === 'L' ? localTeam.id : visitorTeam.id;
										if (fileNumber) setIncidents(prev => [...prev, { id: crypto.randomUUID(), type: 'Goal', minute: 10, playerFileNumber: fileNumber, teamId, goalType: 'regular' }]);
									}}
									className="bg-yellow-100 text-yellow-800 py-2 px-1 rounded text-xs font-bold"
								>
									+ GOL
								</button>
								<button 
									onClick={() => {
										const fileNumber = prompt("Número de ficha del jugador:");
										const teamId = prompt("ID del equipo (L/V):") === 'L' ? localTeam.id : visitorTeam.id;
										if (fileNumber) setIncidents(prev => [...prev, { id: crypto.randomUUID(), type: 'Card', minute: 20, playerFileNumber: fileNumber, teamId, color: 'yellow', reason: 'Falta' }]);
									}}
									className="bg-red-100 text-red-800 py-2 px-1 rounded text-xs font-bold"
								>
									+ TARJETA
								</button>
							</div>

							<div className="flex gap-2 pt-4">
								<button onClick={prevStep} className="flex-1 border border-gray-300 py-2 rounded-md">Atrás</button>
								<button onClick={nextStep} className="flex-1 bg-green-600 text-white py-2 rounded-md">Siguiente</button>
							</div>
						</div>
					)}

					{step === 4 && (
						<div className="space-y-4">
							<h2 className="text-lg font-bold border-b pb-2">Paso 4: Cierre</h2>
							<div>
								<label className="block text-sm font-medium text-gray-700">Observaciones Finales</label>
								<textarea
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
									rows={4}
									placeholder="Incidencias extraordinarias, estado del campo..."
									value={observations}
									onChange={(e) => setObservations(e.target.value)}
								></textarea>
							</div>
							<div className="border-2 border-dashed border-gray-300 p-8 text-center text-gray-400 rounded-lg">
								<p>Área de Firma</p>
								<input 
									type="text" 
									placeholder="Escribe tu nombre para firmar" 
									className="mt-2 text-center border-b border-gray-300 focus:outline-none w-full"
									value={signature}
									onChange={(e) => setSignature(e.target.value)}
								/>
							</div>
							<div className="flex gap-2">
								<button onClick={prevStep} className="flex-1 border border-gray-300 py-2 rounded-md">Atrás</button>
								<button onClick={handleSubmit} className="flex-1 bg-green-800 text-white py-2 rounded-md font-bold">ENVIAR ACTA</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
