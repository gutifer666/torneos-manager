"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function NewRefereePage() {
	const [formData, setFormData] = useState({
		name: "",
		collegiateNumber: "",
		email: "",
		password: "",
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

		const refereeData = {
			id: uuidv4(),
			...formData,
		};

		try {
			const response = await fetch("/api/referees", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(refereeData),
			});

			if (response.ok) {
				setStatus("success");
				setMessage("Árbitro registrado correctamente");
				setFormData({
					name: "",
					collegiateNumber: "",
					email: "",
					password: "",
				});
			} else {
				const errorData = await response.json();
				setStatus("error");
				setMessage(errorData.error || "Error al registrar el árbitro");
			}
		} catch {
			setStatus("error");
			setMessage("Error de conexión");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
			<div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
				<h1 className="text-2xl font-bold mb-6 text-gray-800">Registrar Nuevo Árbitro</h1>
				
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Número de Colegiado</label>
						<input
							type="text"
							name="collegiateNumber"
							value={formData.collegiateNumber}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Contraseña</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border text-black"
						/>
					</div>
					
					<div className="flex gap-4">
						<button
							type="submit"
							disabled={status === "loading"}
							className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
						>
							{status === "loading" ? "Registrando..." : "Registrar Árbitro"}
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
