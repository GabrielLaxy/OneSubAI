const BASE_URL =
	'https://2e54-2804-14c-bf3a-8061-5113-7ce7-1e33-6488.ngrok-free.app';

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
		const data = await res.json();
		console.log('✅', data);
		return await data;
	} catch (error) {
		console.error('Erro no getFinalRecommendation:', error);
		return null;
	}
}

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
		return data;
	} catch (error) {
		console.error('Erro no getRandomMovie:', error);
		return null;
	}
}

export async function getMovieDescriptionById(movie_id: number) {
	try {
		const res = await fetch(BASE_URL + '/descricao_por_id', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ movie_id }),
		});
		if (!res.ok) {
			throw new Error('Erro ao buscar descrição do filme');
		}
		const data = await res.json();
		console.log('⭐', data);
		return data;
	} catch (error) {
		console.error('Erro no getMovieDescriptionById:', error);
		return null;
	}
}

export async function loginRequest(email: string, password: string) {
	try {
		const res = await fetch(BASE_URL + '/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});
		if (!res.ok) {
			throw new Error('Credenciais inválidas');
		}
		const data = await res.json();
		return data; 
	} catch (error) {
		console.error('Erro no loginRequest:', error);
		return null;
	}
}

export async function registerRequest(
	username: string,
	email: string,
	password: string
) {
	try {
		const res = await fetch(BASE_URL + '/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, email, password }),
		});
		if (!res.ok) {
			throw new Error('Erro ao cadastrar usuário');
		}
		const data = await res.json();
		return data; 
	} catch (error) {
		console.error('Erro no registerRequest:', error);
		return null;
	}
}
