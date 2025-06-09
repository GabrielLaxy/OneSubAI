import json
import random

def fake_db_init():
    """
    Recebe uma lista de filmes do arquivo e retorna 8 filmes aleatórios com tmdb_rating > 8.
    """
    with open("C:\\Users\\Gabriel\\Documents\\OneSubAI\\backend\\local-db\\catalogo_teste.json", 'r', encoding='utf-8') as f:
        json_data = json.load(f)
    high_rated_movies = [movie for movie in json_data if movie.get("tmdb_rating", 0) > 8 and movie.get("vote_count", 0) > 10000]
    return random.sample(high_rated_movies, min(8, len(high_rated_movies)))

def fake_db_get_movie_by_id(movie_id):
    """
    Recebe um ID de filme e retorna o filme correspondente do arquivo.
    """
    with open("C:\\Users\\Gabriel\\Documents\\OneSubAI\\backend\\local-db\\catalogo_teste.json", 'r', encoding='utf-8') as f:
        json_data = json.load(f)
    for movie in json_data:
        if movie.get("id") == movie_id:
            return movie
    return None

def get_random_good_movie(ignorar_ids=None):
    """
    Retorna um filme aleatório com tmdb_rating > 8 que não está em ignorar_ids.
    """
    if ignorar_ids is None:
        ignorar_ids = set()
    with open("C:\\Users\\Gabriel\\Documents\\OneSubAI\\backend\\local-db\\catalogo_teste.json", 'r', encoding='utf-8') as f:
        json_data = json.load(f)
    high_rated_movies = [
        movie for movie in json_data
        if movie.get("tmdb_rating", 0) > 8
        and movie.get("vote_count", 0) > 15000
        and movie.get("id") not in ignorar_ids  # <-- filtro para não repetir
    ]
    return random.choice(high_rated_movies) if high_rated_movies else None

def get_description_by_id(movie_id):
    """
    Retorna a descrição de um filme pelo ID, buscando em descricoes.json.
    """
    try:
        with open("C:\\Users\\Gabriel\\Documents\\OneSubAI\\backend\\local-db\\overviews.json", 'r', encoding='utf-8') as f:
            descricoes = json.load(f)
        for item in descricoes:
            if item.get("id") == movie_id:
                return item.get("overview_pt_br") or item.get("overview", "Descrição não disponível.")
        return "Descrição não encontrada."
    except Exception as e:
        return f"Erro ao buscar descrição: {e}"