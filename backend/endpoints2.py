import os
import sys
from fastapi import FastAPI, HTTPException, Request
import uvicorn
from pydantic import BaseModel
from typing import List, Dict

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.recomendation.main import *
from backend.state.session_store import registrar_avaliacao, obter_estado, resetar_usuario
from backend.recomendation.models import Avaliacao, RecomendacaoResponse
from backend.models.repository.usuarios_repository import UsuariosRepository
from backend.models.repository.catalogo_repository import CatalogoRepository
from backend.models.repository.catalogo_overview_repository import CatalogoOverviewRepository
from backend.models.repository.planos_repository import PlanosRepository
from backend.models.connection_options.connection import DBConnectionHandler


db_handle = DBConnectionHandler()
db_handle.connect_to_db()
db_connection = db_handle.get_db_connection()

app = FastAPI()

usuarios_repo = UsuariosRepository(db_connection)
catalogo_repo = CatalogoRepository(db_connection)
planos_repo = PlanosRepository(db_connection)

overview_repo = CatalogoOverviewRepository(db_connection)

catalogo_global = catalogo_repo.select_all()

filmes = carregar_filmes(catalogo_global)
vetores, ids = gerar_vetores(filmes)

class AvaliarPayload(BaseModel):
    user_id: str
    movie_id: int
    avaliacao: int

class FilmeAleatorioBomPayload(BaseModel):
    user_id: str

class UserIdPayload(BaseModel):
    user_id: str

class MovieIdPayload(BaseModel):
    movie_id: int

class UpdatePlanosPayload(BaseModel):
    email: str
    planos: List[Dict]

@app.post("/avaliar")
def avaliar_filme(payload: AvaliarPayload):
    user_id = payload.user_id
    movie_id = payload.movie_id
    avaliacao = payload.avaliacao

    print(f"✅ {movie_id}")

    if avaliacao not in [-1, 0, 1]:
        raise HTTPException(status_code=400, detail="Avaliação inválida")


    
    if avaliacao == 1:
        registrar_avaliacao(user_id, movie_id, "like")
    elif avaliacao == -1:
        registrar_avaliacao(user_id, movie_id, "dislike")
    elif avaliacao == 0:
        registrar_avaliacao(user_id, movie_id, "skip")

    return {"status": "ok"}


@app.post("/recomendar_parcial")
def recomendar_parcial(payload: UserIdPayload):
    user_id = payload.user_id
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
        filme = catalogo_repo.select_movie_by_id(filme_id)
        
        dados["avaliados"].add(filme_id)
        print(f"⭐ {dados['avaliados']}")  

    if filme:
        print(f"🔵 {filme['id']}")
    return {"recomendados": filme}


@app.post("/recomendar_final")
def recomendar_final(payload: UserIdPayload):
    user_id = payload.user_id
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
        filme = catalogo_repo.select_movie_by_id(filme_id)
        dados["avaliados"].add(filme_id)

    return {"recomendados": [filme] if filme else []}

@app.post("/filmes_iniciais")
def filmes_iniciais(payload: dict):
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id não fornecido")
    filmes = catalogo_repo.select_random_high_rated_movies() 
    dados = obter_estado(user_id)
    enviados = set(f["id"] for f in filmes)
    dados.setdefault("enviados", set()).update(enviados)
    
    dados["filmes_iniciais"] = filmes
    
    dados["avaliados"].update(enviados)
    print(f"⭐ {dados['avaliados']}")  
    return {"filmes": filmes}

@app.post("/filme_por_id")
def filme_por_id(payload: dict):
    movie_id = payload.get("movie_id")
    if not movie_id:
        raise HTTPException(status_code=400, detail="ID do filme não fornecido")

    filme = catalogo_repo.select_movie_by_id(movie_id)
    if not filme:
        raise HTTPException(status_code=404, detail="Filme não encontrado")

    return {"filme": filme}

@app.post("/filme_aleatorio_bom")
def filme_aleatorio_bom(payload: FilmeAleatorioBomPayload):
    user_id = payload.user_id
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id não fornecido")
    dados = obter_estado(user_id)
    ignorar_ids = set(dados["avaliados"])
    if "enviados" in dados:
        ignorar_ids.update(dados["enviados"])
    filme = catalogo_repo.get_random_good_movie(ignorar_ids=ignorar_ids)
    if not filme:
        raise HTTPException(status_code=404, detail="Nenhum filme bom encontrado")
    dados["avaliados"].add(filme["id"])
    print(f"⭐ {dados['avaliados']}") 
    return {"filme": filme}

@app.post("/descricao_por_id")
def descricao_por_id(payload: MovieIdPayload):
    movie_id = payload.movie_id
    descricao = overview_repo.get_description_by_id(movie_id)
    return {"descricao": descricao}

@app.post("/register")
def register(payload: dict):
    username = payload.get("username")
    email = payload.get("email")
    password = payload.get("password")

    if not username or not email or not password:
        raise HTTPException(status_code=400, detail="Dados de cadastro incompletos")

    try:
        user_data = {
            "nome": username,
            "email": email,
            "senha": password
        }
        user = usuarios_repo.insert_user(user_data)
        return {"message": "Usuário cadastrado com sucesso", "user": {"nome": user["nome"], "email": user["email"]}}
    except ValueError as ve:
        raise HTTPException(status_code=409, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao cadastrar usuário")

@app.post("/login")
def login(payload: dict):
    email = payload.get("email")
    password = payload.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email e senha são obrigatórios")

    user = usuarios_repo.select_one({"email": email, "senha": password})
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    if "_id" in user:
        user["_id"] = str(user["_id"])

    return {
        "success": True,
        "message": "Login realizado com sucesso",
        "user": user
    }

@app.get("/planos")
def get_planos():
    planos = planos_repo.select_all()
    return planos

@app.post("/update_planos")
def update_planos(payload: UpdatePlanosPayload):
    email = payload.email
    planos = payload.planos

    if not email or planos is None:
        raise HTTPException(status_code=400, detail="Email e planos são obrigatórios")

    try:
        usuarios_repo.edit_registry({"email": email}, {"planos": planos})
        return {"success": True, "message": "Planos atualizados com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar planos: {e}")


if __name__ == "__main__":
    uvicorn.run("endpoints2:app", reload=True, port=8080)
