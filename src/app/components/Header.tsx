"use client";

import Link from "next/link";
import { useAuth } from "../AuthContext";

export const Header = () => {
	const { user, logout } = useAuth();

	return (
		<header className="bg-blue-600 text-white p-4 shadow-md">
			<div className="container mx-auto flex justify-between items-center">
				<Link href="/" className="text-xl font-bold">
					Gestor de Torneos
				</Link>
				<nav className="flex items-center gap-4">
					<Link href="/tournaments" className="hover:underline">
						Torneos
					</Link>
					{user ? (
						<>
							<span className="text-sm bg-blue-700 px-2 py-1 rounded">
								{user.username} ({user.role})
							</span>
							<button
								onClick={logout}
								className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
							>
								Cerrar Sesión
							</button>
						</>
					) : (
						<Link
							href="/login"
							className="bg-white text-blue-600 hover:bg-gray-100 px-3 py-1 rounded text-sm font-medium transition-colors"
						>
							Iniciar Sesión
						</Link>
					)}
				</nav>
			</div>
		</header>
	);
};
