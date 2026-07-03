"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface Player {
	id: string;
	name: string;
	surname: string;
	fileNumber: string;
}

export default function NewTeamPage() {
	const [formData, setFormData] = useState({
		clubName: "",
		fileNumber: "",
	});
	const [allPlayers, setAllPlayers] = useState<Player[]>([]);
	const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [message, setMessage] = useState("");

	useEffect(() => {
		fetch("/api/players")
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data)) {
					setAllPlayers(data);
				}
			})
			.catch((err) => console.error("Error fetching players:", err));
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const togglePlayer = (playerId: string) => {
		setSelectedPlayerIds((prev) =>
			prev.includes(playerId)
				? prev.filter((id) => id !== playerId)
				: [...prev, playerId]
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");

		const teamData = {
			id: uuidv4(),
			...formData,
			players: selectedPlayerIds,
		};

		try {
			const response = await fetch("/api/teams", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(teamData),
			});

			if (response.ok) {
				setStatus("success");
				setMessage("Equipo/Club registrado correctamente");
				setFormData({ clubName: "", fileNumber: "" });
				setSelectedPlayerIds([]);
			} else {
				const errorData = await response.json();
				setStatus("error");
				setMessage(errorData.error || "Error al registrar el equipo");
			}
		} catch {
			setStatus("error");
			setMessage("Error de conexión");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
			<div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
				<h1 className="text-3xl font-bold mb-6 text-green-800">Registrar Nuevo Club/Equipo</h1>
				
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 font-sans">Nombre del Club</label>
							<input
								type="text"
								name="clubName"
								value={formData.clubName}
								onChange={handleChange}
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black"
							/>
						</div>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-gray-700 font-sans">Número de Expediente</label>
						<input
							type="text"
							name="fileNumber"
							value={formData.fileNumber}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Seleccionar Jugadores de la Plantilla</label>
						<div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-2">
							{allPlayers.length === 0 && <p className="text-gray-500 text-sm italic">No hay jugadores registrados.</p>}
							{allPlayers.map((player) => (
								<div 
									key={player.id} 
									onClick={() => togglePlayer(player.id)}
									className={`flex justify-between items-center p-2 rounded cursor-pointer border transition-colors ${
										selectedPlayerIds.includes(player.id) 
											? "bg-green-100 border-green-500" 
											: "hover:bg-gray-50 border-gray-100"
									}`}
								>
									<span className="text-sm font-medium text-gray-900">{player.name} {player.surname}</span>
									<span className="text-xs text-gray-500">Exp: {player.fileNumber}</span>
								</div>
							))}
						</div>
					</div>
					
					<div className="flex gap-4">
						<button
							type="submit"
							disabled={status === "loading"}
							className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 cursor-pointer"
						>
							{status === "loading" ? "Registrando..." : "Registrar Club"}
						</button>
						<button
							type="button"
							onClick={() => window.location.href = "/"}
							className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
						>
							Volver
						</button>
					</div>
				</form>

				{message && (
					<div className={`mt-4 p-3 rounded ${status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
						{message}
					</div>
				)}
			</div>
		</div>
	);
}
