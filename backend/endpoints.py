import asyncio
import os
import sys
from typing import List

import uvicorn
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.connection_options.connection import DBConnectionHandler
from models.repository.usuarios_repository import UsuariosRepository
from models.repository.planos_repository import PlanosRepository
from models.repository.catalogo_repository import CatalogoRepository
from models.repository.catalogo_generos_repository import CatalogoGenerosRepository
from models.repository.catalogo_overview_repository import CatalogoOverviewRepository

db_handle = DBConnectionHandler()
db_handle.connect_to_db()
db_connection = db_handle.get_db_connection()

usuarios_repository = UsuariosRepository(db_connection)
planos_repository = PlanosRepository(db_connection)
catalogo_repository = CatalogoRepository(db_connection)
catalogo_generos_repository = CatalogoGenerosRepository(db_connection)
catalogo_overview_repository = CatalogoOverviewRepository(db_connection)

app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# clients: List[WebSocket] = []

# state = {"image": None}

# status = {"status": None}


class LoginRequest(BaseModel):
    login: str
    senha: str


class CadastroUsuarioRequest(BaseModel):
    nome: str
    plano_id: str
    login: str
    senha_hash: str
    rosto: str


# class CadastroPlanoRequest(BaseModel):
#     nome: str
#     funcional: str
#     senha: str


class ManipularRegistrosRequest(BaseModel):
    nome: str
    login: str
    senha_hash: str
    plano_id: int


# class ManipularFotoRequest(BaseModel):
#     rg: str
#     rosto: str


class DeletarRegistroRequest(BaseModel):
    rg: str


class DeletarRegistroUsuarioRequest(BaseModel):
    funcional: str


class EditarRegistroUsuarioRequest(BaseModel):
    login: str
    senha_hash: str


# class ImageRequest(BaseModel):
#     image: str


# class StatusRequest(BaseModel):
#     status: bool


@app.post("/login")
async def login(request: LoginRequest):
    filter = {"login": request.login, "senha": request.senha}
    try:
        usuario = funcionarios_repository.select_one(filter)

        if usuario:
            return {"success": True, "nome": usuario.get("nome")}

        raise HTTPException(status_code=401, detail="Dados inválidos")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao realizar login: {str(e)}")


@app.post("/cadastro-usuario")
async def cadastrar_usuario(request: CadastroUsuarioRequest):
    try:
        if request.login != "":
            if usuarios_repository.if_usuario_exists(request.login):
                raise HTTPException(status_code=400, detail="E-mail já cadastrado.")

        # if passageiros_repository.if_rg_exists(request.rg):
        #     raise HTTPException(status_code=400, detail="RG já cadastrado.")
        # document = request.model_dump()
        # result = passageiros_repository.insert_document(document)

        if "_id" in result:
            result["_id"] = str(result["_id"])

        return {"success": True, "data": result}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro ao cadastrar usuário: {str(e)}"
        )


# @app.post("/cadastro-plano")
# async def cadastrar_plano(request: CadastroPlanoRequest):
#     try:
#         if funcionarios_repository.if_funcional_exists(request.funcional):
#             raise HTTPException(status_code=400, detail="Funcional já cadastrado.")

#         document = request.model_dump()
#         result = funcionarios_repository.insert_document(document)
#         if "_id" in result:
#             result["_id"] = str(result["_id"])
#         return {"success": True, "data": result}
#     except Exception as e:
#         raise HTTPException(
#             status_code=500, detail=f"Erro ao cadastrar funcionário: {str(e)}"
#         )


@app.post("/lista-catalogo")
async def retorna_catalogo():
    try:
        catalogo = catalogo_repository.select_many_order()
        return {"success": True, "data": catalogo}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro ao listar catalogo: {str(e)}"
        )


@app.post("/lista-planos")
async def retorna_planos():
    try:
        plano = planos_repository.select_many()
        return {"success": True, "data": plano}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro ao listar planos: {str(e)}"
        )


# @app.post("/numero-de-passageiros")
# async def numero_de_passageiros():
#     try:
#         numero_de_passageiros = passageiros_repository.count_users()
#         return {"success": True, "total": numero_de_passageiros}
#     except Exception as e:
#         raise HTTPException(
#             status_code=500, detail=f"Erro ao contar passageiros: {str(e)}"
#         )


@app.post("/atualizar-foto")
async def atualizar_foto(request: ManipularFotoRequest):
    filter = {"login": request.login}
    try:
        modified_count = passageiros_repository.edit_photo(filter, request.rosto)
        if modified_count == 0:
            raise HTTPException(status_code=404, detail="Registro não encontrado")
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar foto: {str(e)}")


@app.post("/editar-usuario")
async def editar_usuario(request: ManipularRegistrosRequest):
    filter = {"login": request.login}
    try:
        if usuarios_repository.if_usuario_exists(request.usuario):
            raise HTTPException(status_code=400, detail="E-mail já cadastrado.")

        modified_count = usuarios_repository.edit_registry(
            filter, request.nome, request.login, request.senha_hash, request.plano_id
        )
        if modified_count == 0:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return {"success": True}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro ao editar usuário: {str(e)}"
        )


@app.post("/trocar-senha")
async def trocar_senha(request: EditarRegistroFuncionarioRequest):
    filter = {"login": request.login}
    try:
        modified_count = usuarios_repository.edit_registry_password(
            filter, request.senha_hash
        )
        if modified_count == 0:
            raise HTTPException(status_code=404, detail="Registro não encontrado")
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao trocar senha: {str(e)}")


@app.post("/deletar-registro")
async def deletar_registro(request: DeletarRegistroRequest):
    filter = {"rg": request.rg}
    try:
        deleted_count = passageiros_repository.delete_registry(filter)
        if deleted_count == 0:
            raise HTTPException(status_code=404, detail="Registro não encontrado")
        return {"success": True}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro ao deletar registro: {str(e)}"
        )


@app.post("/deletar-registro-usuario")
async def deletar_registro(request: DeletarRegistroFuncionarioRequest):
    filter = {"login": request.login}
    try:
        deleted_count = funcionarios_repository.delete_registry(filter)
        if deleted_count == 0:
            raise HTTPException(status_code=404, detail="Registro não encontrado")
        return {"success": True}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro ao deletar registro: {str(e)}"
        )


# reconhecimento facial


# @app.post("/busca-foto")
# async def busca_foto():
#     try:
#         rostos = passageiros_repository.get_all_faces()
#         if not rostos:
#             raise HTTPException(status_code=404, detail="Nenhuma foto encontrada")
#         return {"success": True, "data": rostos}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Erro ao buscar fotos: {str(e)}")


# @app.post("/envia-foto")
# async def envia_foto(request: ImageRequest):
#     try:
#         state["image"] = request.image
#         return {"success": True, "message": "Imagem armazenada com sucesso"}
#     except Exception as e:
#         raise HTTPException(
#             status_code=500, detail=f"Erro ao armazenar imagem: {str(e)}"
#         )


# @app.get("/verifica-foto")
# async def verifica_foto():
#     if state["image"] is None:
#         return {"update": False, "image": None}

#     image = state["image"]
#     state["image"] = None
#     return {"update": True, "image": image}


# @app.post("/send-status")
# async def send_status(request: StatusRequest):
#     try:
#         status = request.status  
#         state["status"] = status 
#         return {"status": status}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Erro ao enviar status: {str(e)}")


# @app.get("/status")
# async def get_status():
#     if state["status"] is True:
#         return {"status": True}
#     elif state["status"] is False:
#         return {"status": False}
#     else:
#         return {"status": None}


# if __name__ == "__main__":
#     uvicorn.run("endpoints:app", reload=True)