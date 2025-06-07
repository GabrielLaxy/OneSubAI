import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserContextType = {
	numbers: number[];
	setNumbers: React.Dispatch<React.SetStateAction<number[]>>;
	userId: string;
	setUserId: React.Dispatch<React.SetStateAction<string>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [numbers, setNumbers] = useState<number[]>([]);
	const [userId, setUserId] = useState<string>('');

	useEffect(() => {
		const generateHash = () => {
			return (
				Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
			);
		};

		setUserId(generateHash());
	}, []);

	return (
		<UserContext.Provider value={{ numbers, setNumbers, userId, setUserId }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUserContext must be used within a UserProvider');
	}
	return context;
};
