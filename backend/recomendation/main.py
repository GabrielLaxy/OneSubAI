import json
import random
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


GENRE_IDS = {
    1: "Ação", 2: "Comédia", 3: "Drama", 4: "Ficção Científica",
    5: "Romance", 6: "Terror", 7: "Mistério", 8: "Documentário"
}
PROVIDER_IDS = {
    1: "Netflix", 2: "Amazon Prime Video", 3: "Max", 4: "Disney+", 5: "Globoplay"
}


def carregar_filmes(path_to_json):
    with open(path_to_json, encoding='utf-8') as f:
        return json.load(f)

def gerar_vetores(filmes):
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

        bin_providers = [0] * len(PROVIDER_IDS)
        for pid in f.get("providers", []):
            if pid in PROVIDER_IDS:
                bin_providers[pid - 1] = 1

        vetor = bin_genres + bin_providers + list(tfidf_matrix[i])
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
        if f["id"] in ignorar_ids:
            continue
        if providers_ativos:
            if not any(p in providers_ativos for p in f["providers"]):
                continue
        recomendados.append(f["id"])
        if len(recomendados) >= top_n:
            break
    return recomendados


def avaliar_filme(filme):
    print(f"\n🎬 Filme: {filme['title_pt_br']}")
    print(f"📺 Plataformas: {', '.join(PROVIDER_IDS[p] for p in filme['providers'])}")
    print("Você já viu esse filme?")
    print("[1] Gostei | [0] Não gostei | [2] Nunca vi")
    while True:
        resp = input("> ").strip()
        if resp in ["0", "1", "2"]:
            return int(resp)
        print("Entrada inválida. Digite 1 para Like, 0 para Dislike ou 2 para Nunca vi.")

def escolher_aleatorio_por_nota(filmes, nota_min, usados):
    candidatos = [f for f in filmes if f.get("tmdb_rating", 0) > nota_min and f["id"] not in usados]
    return random.choice(candidatos) if candidatos else None

def main():
    filmes = carregar_filmes("../local-db/limpo.json")
    vetores, ids = gerar_vetores(filmes)
    providers_ativos = [1, 2, 4]  

    fila = []
    usados = set()
    filmes_qualificados = [f for f in filmes if f.get("tmdb_rating", 0) > 8]
    while len(fila) < 6:
        f = random.choice(filmes_qualificados)
        if f["id"] not in usados:
            fila.append(f)
            usados.add(f["id"])

    likes = []
    dislikes = []
    avaliacoes = 0

    while avaliacoes < 8 and fila:
        filme = fila.pop(0)
        resp = avaliar_filme(filme)

        if resp == 1:
            likes.append(filme["id"])
            avaliacoes += 1
        elif resp == 0:
            dislikes.append(filme["id"])
            avaliacoes += 1
        elif resp == 2:
            
            novo = escolher_aleatorio_por_nota(filmes, 8.5, usados)
            if novo:
                fila.append(novo)
                usados.add(novo["id"])
            print("🔁 Filme pulado. Adicionando outro à fila...")
            continue

        
        if avaliacoes % 2 == 0 and avaliacoes > 0:
            perfil = construir_perfil_usuario(likes, dislikes, vetores, ids)
            novos = recomendar(perfil, vetores, ids, filmes,
                               providers_ativos=providers_ativos,
                               top_n=1,
                               ignorar_ids=likes + dislikes + list(usados))
            if novos:
                novo_id = novos[0]
                novo_filme = next(f for f in filmes if f["id"] == novo_id)
                fila.append(novo_filme)
                usados.add(novo_id)
                print(f"\n📥 Novo filme recomendado: {novo_filme['title_pt_br']}")

    
    print("\n✅ Avaliações concluídas. Suas recomendações finais são:")
    perfil_final = construir_perfil_usuario(likes, dislikes, vetores, ids)
    finais = recomendar(perfil_final, vetores, ids, filmes,
                        providers_ativos=providers_ativos,
                        top_n=5,
                        ignorar_ids=likes + dislikes)
    for rec_id in finais:
        filme = next(f for f in filmes if f["id"] == rec_id)
        provedores = ", ".join(PROVIDER_IDS[p] for p in filme["providers"])
        print(f"- {filme['title_pt_br']} [{provedores}]")

if __name__ == "__main__":
    main()
