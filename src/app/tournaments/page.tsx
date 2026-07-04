"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Tournament {
	id: string;
	name: string;
	category: string;
	startDate: string;
	endDate: string;
	maxParticipants: number;
	format: string;
	rules: string;
	status: string;
}

export default function TournamentsListPage() {
	const [tournaments, setTournaments] = useState<Tournament[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/tournaments")
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data)) {
					setTournaments(data);
				}
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error fetching tournaments:", err);
				setLoading(false);
			});
	}, []);

	return (
		<div className="flex flex-col min-h-screen bg-green-50 p-4 md:p-8">
			<div className="max-w-6xl mx-auto w-full">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-green-800">Lista de Torneos</h1>
					<Link
						href="/tournaments/new"
						className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
					>
						+ Nuevo Torneo
					</Link>
				</div>

				{loading ? (
					<div className="flex justify-center items-center h-64">
						<p className="text-green-600">Cargando torneos...</p>
					</div>
				) : tournaments.length === 0 ? (
					<div className="bg-white p-8 rounded-lg shadow text-center">
						<p className="text-gray-600 mb-4">No hay torneos registrados todavía.</p>
						<Link href="/tournaments/new" className="text-green-600 font-bold hover:underline">
							¡Crea el primero!
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{tournaments.map((tournament) => (
							<div key={tournament.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
								<div className="p-6 flex-1">
									<div className="flex justify-between items-start mb-2">
										<h2 className="text-xl font-bold text-gray-900">{tournament.name}</h2>
										<span className={`text-xs px-2 py-1 rounded-full font-bold ${
											tournament.status === "Borrador" ? "bg-gray-100 text-gray-600" :
											tournament.status === "Inscripción Abierta" ? "bg-blue-100 text-blue-600" :
											tournament.status === "En Curso" ? "bg-green-100 text-green-600" :
											tournament.status === "Finalizado" ? "bg-purple-100 text-purple-600" :
											"bg-red-100 text-red-600"
										}`}>
											{tournament.status}
										</span>
									</div>
									<p className="text-sm text-gray-500 mb-4">{tournament.category}</p>
									
									<div className="space-y-2 text-sm text-gray-700">
										<div className="flex items-center">
											<span className="font-semibold w-24">Inicio:</span>
											<span>{new Date(tournament.startDate).toLocaleDateString()}</span>
										</div>
										<div className="flex items-center">
											<span className="font-semibold w-24">Fin:</span>
											<span>{new Date(tournament.endDate).toLocaleDateString()}</span>
										</div>
										<div className="flex items-center">
											<span className="font-semibold w-24">Participantes:</span>
											<span>Máx. {tournament.maxParticipants}</span>
										</div>
										<div className="flex items-center">
											<span className="font-semibold w-24">Formato:</span>
											<span>{tournament.format}</span>
										</div>
									</div>
								</div>
								<div className="bg-gray-50 p-4 border-t border-gray-100">
									<button className="w-full text-green-600 text-sm font-bold hover:text-green-800 transition-colors">
										Ver detalles →
									</button>
								</div>
							</div>
						))}
					</div>
				)}
				
				<div className="mt-8 text-center">
					<Link href="/" className="text-gray-600 hover:underline text-sm">
						Volver al Inicio
					</Link>
				</div>
			</div>
		</div>
	);
}
