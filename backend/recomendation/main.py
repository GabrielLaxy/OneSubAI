import json
import random
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


GENRE_IDS = {
"Animação": 1,
  "Aventura": 2,
  "Família": 3,
  "Comédia": 4,
  "Ação": 5,
  "Ficção científica": 6,
  "Drama": 7,
  "Fantasia": 8,
  "Romance": 9,
  "Terror": 10,
  "Thriller": 11,
  "Crime": 12,
  "Faroeste": 13,
  "Mistério": 14,
  "Música": 15,
  "História": 16,
  "Guerra": 17,
  "Cinema TV": 18,
  "Documentário": 19
}
PROVIDER_IDS = {
    1: "Netflix", 2: "Amazon Prime Video", 3: "Max", 4: "Disney+", 5: "Globoplay"
}


def carregar_filmes(path_to_json):
    with open(path_to_json, encoding='utf-8') as f:
        return json.load(f)

def gerar_vetores(filmes, peso_generos=2.0, peso_providers=0.0, peso_texto=1.5):
    textos = [
        " ".join(f.get("keywords", []) + f.get("directors", []) + f.get("actors", []))
        for f in filmes
    ]
    tfidf = TfidfVectorizer(max_features=5000)
    tfidf_matrix = tfidf.fit_transform(textos).toarray()

    vetores = []
    ids = []
    for i, f in enumerate(filmes):
        bin_genres = [0] * len(GENRE_IDS)
        for gid in f.get("genres", []):
            if gid in GENRE_IDS:
                bin_genres[gid - 1] = 1
        # Aplica peso nos gêneros
        bin_genres = [g * peso_generos for g in bin_genres]

        bin_providers = [0] * len(PROVIDER_IDS)
        for pid in f.get("providers", []):
            if pid in PROVIDER_IDS:
                bin_providers[pid - 1] = 1
        # Aplica peso nos provedores
        bin_providers = [p * peso_providers for p in bin_providers]

        # Aplica peso no texto
        texto_vetor = list(tfidf_matrix[i] * peso_texto)

        vetor = bin_genres + bin_providers + texto_vetor
        vetores.append(vetor)
        ids.append(f["id"])
    return np.array(vetores), ids

def construir_perfil_usuario(likes, dislikes, vetores, ids, alpha=1.0, beta=0.5):
    like_idxs = [ids.index(i) for i in likes if i in ids]
    dislike_idxs = [ids.index(i) for i in dislikes if i in ids]

    if not like_idxs and not dislike_idxs:
        return None

    perfil = np.zeros_like(vetores[0], dtype=float)
    if like_idxs:
        perfil += alpha * np.mean(vetores[like_idxs], axis=0)
    if dislike_idxs:
        perfil -= beta * np.mean(vetores[dislike_idxs], axis=0)

    return perfil

def recomendar(perfil, vetores, ids, filmes, providers_ativos=None, top_n=1, ignorar_ids=None):
    if perfil is None:
        return []
    if ignorar_ids is None:
        ignorar_ids = []

    sims = cosine_similarity([perfil], vetores)[0]
    recomendados = []
    for i in np.argsort(sims)[::-1]:
        f = filmes[i]
        if (
            not f.get("genres") and
            not f.get("directors") and
            not f.get("actors") and
            not f.get("keywords")
        ):
            continue
        if f["id"] in ignorar_ids:
            continue
        if providers_ativos:
            if not any(p in providers_ativos for p in f["providers"]):
                continue
        recomendados.append(f["id"])
        if len(recomendados) >= top_n:
            break
    return recomendados