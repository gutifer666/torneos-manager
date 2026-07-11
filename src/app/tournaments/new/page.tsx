"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ProtectedRoute } from "../../components/ProtectedRoute";

export default function NewTournamentPage() {
	return (
		<ProtectedRoute allowedRole="ADMIN">
			<NewTournamentPageContent />
		</ProtectedRoute>
	);
}

function NewTournamentPageContent() {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		category: "",
		startDate: "",
		endDate: "",
		maxParticipants: 16,
		format: "Liga",
		rules: "Partido único",
		status: "Borrador",
		participatingTeams: [] as string[],
	});
	const [availableTeams, setAvailableTeams] = useState<any[]>([]);
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [message, setMessage] = useState("");

	useEffect(() => {
		fetch("/api/teams")
			.then((res) => res.json())
			.then((data) => setAvailableTeams(data))
			.catch((err) => console.error("Error fetching teams:", err));
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleTeamsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
		setFormData((prev) => ({ ...prev, participatingTeams: selectedOptions }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");

		const tournamentData = {
			id: uuidv4(),
			...formData,
			maxParticipants: Number(formData.maxParticipants),
		};

		try {
			const response = await fetch("/api/tournaments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(tournamentData),
			});

			if (response.ok) {
				setStatus("success");
				setMessage("Torneo creado correctamente");
				setFormData({
					name: "",
					description: "",
					category: "",
					startDate: "",
					endDate: "",
					maxParticipants: 16,
					format: "Liga",
					rules: "Partido único",
					status: "Borrador",
					participatingTeams: [],
				});
			} else {
				const errorData = await response.json();
				setStatus("error");
				setMessage(errorData.error || "Error al crear el torneo");
			}
		} catch {
			setStatus("error");
			setMessage("Error de conexión");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
			<div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
				<h1 className="text-3xl font-bold mb-6 text-green-800">Crear Nuevo Torneo</h1>
				
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 font-sans">Nombre del Torneo</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 font-sans">Descripción</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black"
							rows={3}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 font-sans">Categoría / División</label>
							<input
								type="text"
								name="category"
								value={formData.category}
								onChange={handleChange}
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 font-sans">Nº Máximo de Participantes</label>
							<input
								type="number"
								name="maxParticipants"
								value={formData.maxParticipants}
								onChange={handleChange}
								required
								min={2}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 font-sans">Fecha y Hora de Inicio</label>
							<input
								type="datetime-local"
								name="startDate"
								value={formData.startDate}
								onChange={handleChange}
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 font-sans">Fecha y Hora de Finalización</label>
							<input
								type="datetime-local"
								name="endDate"
								value={formData.endDate}
								onChange={handleChange}
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 font-sans">Formato</label>
							<select
								name="format"
								value={formData.format}
								onChange={handleChange}
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black"
							>
								<option value="Eliminación directa">Eliminación directa</option>
								<option value="Liga">Liga</option>
								<option value="Grupos">Grupos</option>
								<option value="Mixto">Mixto</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 font-sans">Reglas</label>
							<select
								name="rules"
								value={formData.rules}
								onChange={handleChange}
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black"
							>
								<option value="Partido único">Partido único</option>
								<option value="Ida y vuelta">Ida y vuelta</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 font-sans">Estado Inicial</label>
							<select
								name="status"
								value={formData.status}
								onChange={handleChange}
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black"
							>
								<option value="Borrador">Borrador</option>
								<option value="Inscripción Abierta">Inscripción Abierta</option>
								<option value="En Curso">En Curso</option>
								<option value="Finalizado">Finalizado</option>
								<option value="Cancelado">Cancelado</option>
							</select>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 font-sans">Equipos Participantes</label>
						<select
							multiple
							name="participatingTeams"
							value={formData.participatingTeams}
							onChange={handleTeamsChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black min-h-[150px]"
						>
							{availableTeams.map((team) => (
								<option key={team.id} value={team.id}>
									{team.clubName} ({team.fileNumber})
								</option>
							))}
						</select>
						<p className="mt-1 text-xs text-gray-500">Mantén presionado Ctrl (o Cmd) para seleccionar múltiples equipos.</p>
					</div>
					
					<div className="flex gap-4">
						<button
							type="submit"
							disabled={status === "loading"}
							className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 cursor-pointer"
						>
							{status === "loading" ? "Guardando..." : "Guardar"}
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
