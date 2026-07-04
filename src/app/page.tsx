import Link from "next/link";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen bg-green-800 text-white font-sans">
			<header className="py-12 px-6 text-center bg-green-900 shadow-lg">
				<h1 className="text-5xl font-extrabold tracking-tight mb-2">
					⚽ Gestor de Torneos
				</h1>
				<p className="text-xl text-green-200">
					La plataforma definitiva para la gestión de equipos y jugadores
				</p>
			</header>

			<main className="flex-1 flex flex-col items-center justify-center p-8 gap-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
					<Link
						href="/players/new"
						className="group flex flex-col items-center p-8 bg-white text-green-900 rounded-2xl shadow-xl transition-all hover:scale-105 hover:bg-green-50"
					>
						<div className="text-6xl mb-4 group-hover:animate-bounce">🏃‍♂️</div>
						<h2 className="text-2xl font-bold mb-2 text-green-900">Registrar Jugador</h2>
						<p className="text-center text-green-700">
							Añade nuevos talentos a tu base de datos con todos sus detalles técnicos.
						</p>
					</Link>

					<Link
						href="/teams/new"
						className="group flex flex-col items-center p-8 bg-white text-green-900 rounded-2xl shadow-xl transition-all hover:scale-105 hover:bg-green-50"
					>
						<div className="text-6xl mb-4 group-hover:animate-bounce">🛡️</div>
						<h2 className="text-2xl font-bold mb-2 text-green-900">Registrar Club</h2>
						<p className="text-center text-green-700">
							Configura nuevos equipos, gestiona sus expedientes y asigna plantillas.
						</p>
					</Link>

					<Link
						href="/tournaments/new"
						className="group flex flex-col items-center p-8 bg-white text-green-900 rounded-2xl shadow-xl transition-all hover:scale-105 hover:bg-green-50"
					>
						<div className="text-6xl mb-4 group-hover:animate-bounce">🏆</div>
						<h2 className="text-2xl font-bold mb-2 text-green-900">Crear Torneo</h2>
						<p className="text-center text-green-700">
							Configura y lanza nuevas competiciones, ligas o torneos de eliminación.
						</p>
					</Link>

					<Link
						href="/tournaments"
						className="group flex flex-col items-center p-8 bg-white text-green-900 rounded-2xl shadow-xl transition-all hover:scale-105 hover:bg-green-50"
					>
						<div className="text-6xl mb-4 group-hover:animate-bounce">📅</div>
						<h2 className="text-2xl font-bold mb-2 text-green-900">Consultar Torneos</h2>
						<p className="text-center text-green-700">
							Explora el calendario, resultados y clasificaciones de los torneos activos.
						</p>
					</Link>
				</div>

				<div className="mt-8 text-center max-w-2xl">
					<div className="inline-block p-4 bg-green-700/50 rounded-lg backdrop-blur-sm">
						<p className="text-green-100 italic">
							&quot;El fútbol es la cosa más importante de las cosas menos importantes.&quot;
						</p>
					</div>
				</div>
			</main>

			<footer className="py-6 text-center bg-green-900 text-green-400 text-sm">
				&copy; {new Date().getFullYear()} Gestor de Torneos - Fútbol Base
			</footer>
		</div>
	);
}
