import React, { createContext, useContext, useState, useEffect } from 'react';
import { getInitialMovies } from '../services/httpsRequests';

type Movie = {
	id: number;
	poster_url: string;
	title_pt_br: string;
	genres: number[];
};

type MoviesContextType = {
	movies: Movie[];
	setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

export const MoviesProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [movies, setMovies] = useState<Movie[]>([]);

	// useEffect(() => {
	// 	async function fetchMovies() {
	// 		const data = await getInitialMovies();
	// 		if (data && data.filmes) {
	// 			setMovies(data.filmes);
	// 		}
	// 	}
	// 	fetchMovies();
	// }, []);

	return (
		<MoviesContext.Provider value={{ movies, setMovies }}>
			{children}
		</MoviesContext.Provider>
	);
};

export function useMovies() {
	const context = useContext(MoviesContext);
	if (!context) {
		throw new Error('useMovies must be used within a MoviesProvider');
	}
	return context;
}
