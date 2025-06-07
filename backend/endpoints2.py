import os
import sys
from fastapi import FastAPI, HTTPException
import uvicorn
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.recomendation.main import *
from backend.state.session_store import registrar_avaliacao, obter_estado, resetar_usuario
from backend.recomendation.models import Avaliacao, RecomendacaoResponse
from backend.fake_db import fake_db_init, fake_db_get_movie_by_id, get_random_good_movie

app = FastAPI()

filmes = carregar_filmes("C:\\Users\\Gabriel\\Documents\\OneSubAI\\backend\\local-db\\limpo.json")
vetores, ids = gerar_vetores(filmes)

@app.post("/avaliar")
def avaliar_filme(payload: dict):
    user_id = payload.get("user_id")
    movie_id = payload.get("movie_id")
    avaliacao = payload.get("avaliacao")

    print(f"✅ {payload.get('movie_id')}")

    if avaliacao not in [-1, 0, 1]:
        raise HTTPException(status_code=400, detail="Avaliação inválida")


    # Removido: adicionar aos avaliados aqui
    if avaliacao == 1:
        registrar_avaliacao(user_id, movie_id, "like")
    elif avaliacao == -1:
        registrar_avaliacao(user_id, movie_id, "dislike")
    elif avaliacao == 0:
        registrar_avaliacao(user_id, movie_id, "skip")

    return {"status": "ok"}


@app.post("/recomendar_parcial")
def recomendar_parcial(payload: dict):
    user_id = payload.get("user_id")
    dados = obter_estado(user_id)
    perfil = construir_perfil_usuario(
        list(dados["likes"]), list(dados["dislikes"]), vetores, ids
    )

    recomendados = recomendar(
        perfil,
        vetores,
        ids,
        filmes,
        ignorar_ids=list(dados["avaliados"]),
        top_n=1,
    )

    filme = None
    if recomendados and len(recomendados) > 0:
        filme_id = recomendados[0]
        filme = fake_db_get_movie_by_id(filme_id)
        # Adiciona o filme à lista de avaliados assim que for recomendado
        dados["avaliados"].add(filme_id)
        print(f"⭐ {dados['avaliados']}")  # <-- Adicione esta linha

    if filme:
        print(f"🔵 {filme['id']}")
    return {"recomendados": filme}


@app.post("/recomendar_final")
def recomendar_final(payload: dict):
    user_id = payload.get("user_id")
    dados = obter_estado(user_id)
    perfil = construir_perfil_usuario(
        list(dados["likes"]), list(dados["dislikes"]), vetores, ids
    )

    recomendados = recomendar(
        perfil,
        vetores,
        ids,
        filmes,
        ignorar_ids=list(dados["avaliados"]),
        top_n=5,
    )
    return {"recomendados": recomendados}

@app.post("/filmes_iniciais")
def filmes_iniciais(payload: dict):
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id não fornecido")
    filmes = fake_db_init()
    dados = obter_estado(user_id)
    enviados = set(f["id"] for f in filmes)
    dados.setdefault("enviados", set()).update(enviados)
    # Armazena os filmes enviados no estado do usuário
    dados["filmes_iniciais"] = filmes
    # Adiciona todos os filmes iniciais aos avaliados
    dados["avaliados"].update(enviados)
    print(f"⭐ {dados['avaliados']}")  # <-- Adicione esta linha
    return {"filmes": filmes}

@app.post("/filme_por_id")
def filme_por_id(payload: dict):
    movie_id = payload.get("movie_id")
    if not movie_id:
        raise HTTPException(status_code=400, detail="ID do filme não fornecido")

    filme = fake_db_get_movie_by_id(movie_id)
    if not filme:
        raise HTTPException(status_code=404, detail="Filme não encontrado")

    return {"filme": filme}

@app.post("/filme_aleatorio_bom")
def filme_aleatorio_bom(payload: dict):
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id não fornecido")
    dados = obter_estado(user_id)
    ignorar_ids = set(dados["avaliados"])
    if "enviados" in dados:
        ignorar_ids.update(dados["enviados"])
    filme = get_random_good_movie(ignorar_ids=ignorar_ids)
    if not filme:
        raise HTTPException(status_code=404, detail="Nenhum filme bom encontrado")
    # Adiciona o filme aleatório bom aos avaliados
    dados["avaliados"].add(filme["id"])
    print(f"⭐ {dados['avaliados']}")  # <-- Adicione esta linha
    return {"filme": filme}


if __name__ == "__main__":
    uvicorn.run("endpoints2:app", reload=True, port=8080)
