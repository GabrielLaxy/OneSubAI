import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FinalMovie {
	id: number;
	poster_url: string;
	title_pt_br: string;
	genres: number[];
	providers: number[];
	overview: string;
}

interface FinalMovieContextType {
	finalMovie: FinalMovie | null;
	setFinalMovie: (movie: FinalMovie) => void;
}

const FinalMovieContext = createContext<FinalMovieContextType | undefined>(
	undefined
);

export const FinalMovieProvider = ({ children }: { children: ReactNode }) => {
	const [finalMovie, setFinalMovie] = useState<FinalMovie | null>(null);

	return (
		<FinalMovieContext.Provider value={{ finalMovie, setFinalMovie }}>
			{children}
		</FinalMovieContext.Provider>
	);
};

export const useFinalMovie = () => {
	const context = useContext(FinalMovieContext);
	if (!context) {
		throw new Error('useFinalMovie must be used within a FinalMovieProvider');
	}
	return context;
};
