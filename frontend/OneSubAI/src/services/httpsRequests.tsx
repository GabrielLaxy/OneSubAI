const BASE_URL =
	'https://95e3-2804-14c-bf3a-8061-684a-aafa-6be1-977e.ngrok-free.app';

// Envia avaliação de filme
export async function postMovieResponse(
	user_id: string,
	movie_id: number,
	avaliacao: 1 | -1 | 0
) {
	try {
		const res = await fetch(BASE_URL + '/avaliar', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ user_id, movie_id, avaliacao }),
		});
		if (!res.ok) {
			throw new Error('Erro ao enviar avaliação');
		}
		return await res.json();
	} catch (error) {
		console.error('Erro no postMovieResponse:', error);
		return null;
	}
}

// Busca recomendação parcial (1 filme)
export async function getPartialRecommendation(user_id: string) {
	try {
		const res = await fetch(BASE_URL + '/recomendar_parcial', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ user_id }),
		});
		if (!res.ok) {
			throw new Error('Erro ao buscar recomendação parcial');
		}
		return await res.json();
	} catch (error) {
		console.error('Erro no getPartialRecommendation:', error);
		return null;
	}
}

// Busca recomendação final (top 5 filmes)
export async function getFinalRecommendation(user_id: string) {
	try {
		const res = await fetch(BASE_URL + '/recomendar_final', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ user_id }),
		});
		if (!res.ok) {
			throw new Error('Erro ao buscar recomendação final');
		}
		return await res.json();
	} catch (error) {
		console.error('Erro no getFinalRecommendation:', error);
		return null;
	}
}

// Busca filmes iniciais do backend
export async function getInitialMovies(user_id: string) {
	try {
		const res = await fetch(BASE_URL + '/filmes_iniciais', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ user_id }),
		});
		if (!res.ok) {
			throw new Error('Erro ao buscar filmes iniciais');
		}
		return await res.json();
	} catch (error) {
		console.error('Erro no getInitialMovies:', error);
		return null;
	}
}

export async function getMovieById(movie_id: number) {
	try {
		const res = await fetch(BASE_URL + '/filme_por_id', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ movie_id }),
		});
		if (!res.ok) {
			throw new Error('Erro ao buscar filme por ID');
		}
		const data = await res.json();
		console.log('Filme encontrado:', data);
		return data;
	} catch (error) {
		console.error('Erro no getMovieById:', error);
		return null;
	}
}

export async function getRandomMovie(user_id: string) {
	try {
		const res = await fetch(BASE_URL + '/filme_aleatorio_bom', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ user_id }),
		});
		if (!res.ok) {
			throw new Error('Erro ao buscar filme aleatório');
		}
		const data = await res.json();
		console.log('Filme aleatório encontrado:', data);
		return data;
	} catch (error) {
		console.error('Erro no getRandomMovie:', error);
		return null;
	}
}
