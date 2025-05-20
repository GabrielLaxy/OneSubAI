import json
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# === CONFIGURAÇÕES FIXAS ===
GENRE_IDS = {
    1: "Ação",
    2: "Comédia",
    3: "Drama",
    4: "Ficção Científica",
    5: "Romance",
    6: "Terror",
    7: "Mistério",
    8: "Documentário"
}

PROVIDER_IDS = {
    1: "Netflix",
    2: "Amazon Prime Video",
    3: "Max",
    4: "Disney+",
    5: "Globoplay"
}

# === 1. CARREGAMENTO DOS FILMES ===
def carregar_filmes(path_to_json):
    """
    Carrega os filmes a partir de um arquivo JSON local.
    """
    with open(path_to_json, encoding='utf-8') as f:
        filmes = json.load(f)
    return filmes

# === 2. GERAÇÃO DOS VETORES HÍBRIDOS ===
def gerar_vetores(filmes):
    """
    Gera os vetores combinando: gêneros + provedores + TF-IDF de atores/diretores/keywords
    """
    textos = [
        " ".join(f.get("keywords", []) + f.get("directors", []) + f.get("actors", []))
        for f in filmes
    ]
    tfidf = TfidfVectorizer(max_features=5000)
    tfidf_matrix = tfidf.fit_transform(textos)  # matriz esparsa (economiza RAM)

    vetores = []
    ids = []

    for i, f in enumerate(filmes):
        # binarizar gêneros
        bin_genres = [0] * len(GENRE_IDS)
        for gid in f.get("genres", []):
            if gid in GENRE_IDS:
                bin_genres[gid - 1] = 1

        # binarizar provedores
        bin_providers = [0] * len(PROVIDER_IDS)
        for pid in f.get("providers", []):
            if pid in PROVIDER_IDS:
                bin_providers[pid - 1] = 1

        # concatenar vetores binários com vetor TF-IDF denso
        vetor_textual = tfidf_matrix[i].toarray()[0]  # converte só a linha necessária
        vetor_final = bin_genres + bin_providers + list(vetor_textual)

        vetores.append(vetor_final)
        ids.append(f["id"])

    return np.array(vetores), ids

# === 3. CONSTRÓI PERFIL DO USUÁRIO ===
def construir_perfil_usuario(filmes_curtidos_ids, vetores, ids):
    """
    Constrói o vetor médio do usuário com base nos filmes curtidos.
    """
    idxs = [ids.index(i) for i in filmes_curtidos_ids if i in ids]
    if not idxs:
        return None
    return np.mean([vetores[i] for i in idxs], axis=0)

# === 4. RECOMENDAÇÃO ===
def recomendar(perfil, vetores, ids, filmes, providers_ativos=None, top_n=5):
    """
    Retorna uma lista com os IDs dos filmes mais similares ao perfil do usuário.
    """
    if perfil is None:
        return []

    sims = cosine_similarity([perfil], vetores)[0]
    recomendados = []
    vistos = set()

    for i in np.argsort(sims)[::-1]:
        f = filmes[i]
        if f["id"] in vistos:
            continue

        if providers_ativos:
            # filtra só filmes que tenham pelo menos um provider ativo
            if not any(pid in providers_ativos for pid in f.get("providers", [])):
                continue

        recomendados.append(f["id"])
        vistos.add(f["id"])

        if len(recomendados) >= top_n:
            break

    return recomendados

# === EXEMPLO DE USO ===
# if __name__ == "__main__":
#     # Substitua com o caminho do seu JSON local
#     filmes = carregar_filmes("../local-db/limpo.json")

#     vetores, ids = gerar_vetores(filmes)

#     # Filmes curtidos pelo usuário (exemplo com 2 IDs)
#     perfil = construir_perfil_usuario([268238, 268238], vetores, ids)

#     # Recomendação com filtro por plataforma (ex: Disney+)
#     recs = recomendar(perfil, vetores, ids, filmes, providers_ativos=[4], top_n=5)

#     print("Filmes recomendados (IDs):", recs)
#     for r in recs:
#         f = next(f for f in filmes if f["id"] == r)
#         print(f"- {f['title_pt_br']} ({[PROVIDER_IDS[p] for p in f['providers']]})")

import random

def menu_simulacao_interativa():
    # Carrega filmes e configurações
    filmes = carregar_filmes("../local-db/limpo.json")
    vetores, ids = gerar_vetores(filmes)

    # Seleciona 3 plataformas aleatórias como "ativas"
    plataformas_ativas = random.sample(list(PROVIDER_IDS.keys()), 3)
    print("\n💡 Plataformas ativas (assinaturas):")
    for pid in plataformas_ativas:
        print(f"- {PROVIDER_IDS[pid]}")

    # Filtra filmes que estejam disponíveis nessas plataformas
    filmes_disponiveis = [
        f for f in filmes
        if any(p in plataformas_ativas for p in f.get("providers", []))
    ]

    # Seleciona 5 filmes aleatórios para mostrar ao usuário
    filmes_iniciais = random.sample(filmes_disponiveis, 5)
    print("\n🎬 Avalie os filmes abaixo (1 = início da fila):")

    curtidos_ids = []

    for i, f in enumerate(filmes_iniciais, 1):
        plataformas = [PROVIDER_IDS[p] for p in f["providers"] if p in PROVIDER_IDS]
        print(f"\n{i}. {f['title_pt_br']} ({', '.join(plataformas)})")
        print("Responda: [like] [dislike] [skip]")
        resposta = input(">>> ").strip().lower()
        if resposta == "like":
            curtidos_ids.append(f["id"])

    # Cria perfil e recomendações com base nos likes
    perfil = construir_perfil_usuario(curtidos_ids, vetores, ids)
    recomendacoes = recomendar(perfil, vetores, ids, filmes, providers_ativos=plataformas_ativas, top_n=5)

    print("\nRecomendações baseadas no seu gosto:")
    if not recomendacoes:
        print("Nenhuma recomendação encontrada. Tente curtir mais filmes.")
    else:
        for rid in recomendacoes:
            f = next(f for f in filmes if f["id"] == rid)
            plataformas = [PROVIDER_IDS[p] for p in f["providers"] if p in PROVIDER_IDS]
            print(f"- {f['title_pt_br']} ({', '.join(plataformas)})")


# Executa a simulação
if __name__ == "__main__":
    menu_simulacao_interativa()

