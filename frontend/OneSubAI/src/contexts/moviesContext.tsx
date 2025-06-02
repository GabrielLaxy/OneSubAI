import React, { createContext, useContext, useState } from 'react';
import moviesData from '../../assets/filmesTeste.json';

type Movie = {
  id: number;
  poster: string;
  title: string;
  genres: string[];
};

type MoviesContextType = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

export const MoviesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>(moviesData);

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