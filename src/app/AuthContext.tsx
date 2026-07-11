"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
	id: string;
	username: string;
	role: "ADMIN" | "REFEREE";
}

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUser = async () => {
		try {
			const response = await fetch("/api/auth/me");
			const data = await response.json();
			if (data.user) {
				setUser(data.user);
			} else {
				setUser(null);
			}
		} catch (error) {
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	const login = async (username: string, password: string) => {
		const response = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Error al iniciar sesión");
		}

		const data = await response.json();
		setUser(data);
	};

	const logout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, isLoading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
