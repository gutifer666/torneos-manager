"use client";

import { useAuth } from "../AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
	children: React.ReactNode;
	allowedRole: "ADMIN" | "REFEREE";
}

export const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && (!user || user.role !== allowedRole)) {
			router.push("/");
		}
	}, [user, isLoading, allowedRole, router]);

	if (isLoading) {
		return <div className="p-8 text-center bg-white min-h-screen font-sans text-gray-600">Cargando...</div>;
	}

	if (!user || user.role !== allowedRole) {
		return null;
	}

	return <>{children}</>;
};
