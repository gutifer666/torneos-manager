"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function NewPlayerPage() {
	const [formData, setFormData] = useState({
		name: "",
		surname: "",
		birthDate: "",
		dorsal: "",
		fileNumber: "",
	});
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [message, setMessage] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");

		const playerData = {
			id: uuidv4(),
			...formData,
			dorsal: Number(formData.dorsal),
		};

		try {
			const response = await fetch("/api/players", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(playerData),
			});

			if (response.ok) {
				setStatus("success");
				setMessage("Jugador creado correctamente");
				setFormData({
					name: "",
					surname: "",
					birthDate: "",
					dorsal: "",
					fileNumber: "",
				});
			} else {
				const errorData = await response.json();
				setStatus("error");
				setMessage(errorData.error || "Error al crear el jugador");
			}
		} catch {
			setStatus("error");
			setMessage("Error de conexión");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
			<div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
				<h1 className="text-2xl font-bold mb-6 text-gray-800">Crear Nuevo Jugador</h1>
				
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">Nombre</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Apellidos</label>
						<input
							type="text"
							name="surname"
							value={formData.surname}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
						<input
							type="date"
							name="birthDate"
							value={formData.birthDate}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Dorsal</label>
						<input
							type="number"
							name="dorsal"
							value={formData.dorsal}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Número de Expediente</label>
						<input
							type="text"
							name="fileNumber"
							value={formData.fileNumber}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
						/>
					</div>
					
					<button
						type="submit"
						disabled={status === "loading"}
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
					>
						{status === "loading" ? "Creando..." : "Crear Jugador"}
					</button>
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
