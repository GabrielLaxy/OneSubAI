from typing import Dict, List
from pymongo.errors import PyMongoError

class UsuariosRepository:
    def __init__(self, db_connection)   -> None:
        self.__collection_name = "usuarios"
        self.__db_connection = db_connection

#cadastrar usuario
    def insert_user(self, user_data: Dict) -> Dict:
        collection = self.__db_connection.get_collection(self.__collection_name)

        try:
            # verifica se o email já existe
            existing_user = collection.find_one({"email": user_data.get("email")})
            if existing_user:
                raise ValueError("Este email já está cadastrado.")

            user_doc = {
                "email": user_data["email"],
                "nome": user_data["nome"],
                "senha": user_data["senha"]
            }
            result = collection.insert_one(user_doc)
            user_doc["_id"] = result.inserted_id
            return user_doc

        except PyMongoError as e:
            print(f"Erro ao inserir usuário: {e}")
            raise
        except KeyError as e:
            raise ValueError(f"Campo obrigatório ausente: {e}")

    def select_many(self, filter) -> List[Dict]:
        collection = self.__db_connection.get_collection(self.__collection_name)
        data = collection.find(
            filter,
            {"nome": 1}
        )

        response = []
        for elem in data: response.append(elem)
        return response
    
    def select_one(self, filter) -> Dict:
        collection = self.__db_connection.get_collection(self.__collection_name)
        response = collection.find_one(filter, {"senha": 0})
        return response
    
    def select_if_property_exists(self, filter) -> None:
        collection = self.__db_connection.get_collection(self.__collection_name)
        data = collection.find({filter})
        for elem in data: print(elem)

    def select_many_order(self, filter):
        collection = self.__db_connection.get_collection(self.__collection_name)
        data = collection.find(
            filter,
            {"_id": 0}
        ).sort([("_id", 1)])

        for elem in data: print(elem)


# editar conta do usuario
    def edit_registry(self, filter: dict, updates: dict) -> None:
        collection = self.__db_connection.get_collection(self.__collection_name)
        result = collection.update_one(
            filter,
            { "$set": updates }
        )

# editar varios registros de conta de usuario
    # def edit_many_increment(self, filter, num) -> None:
    #     collection = self.__db_connection.get_collection(self.__collection_name)
    #     data = collection.update_many(
    #         filter, #Filtro
    #         { "$inc": { "idade": num } }
    #     )
    #     print(data.modified_count)


# deletar um registro de usuario
    def delete_registry(self, filter) -> None:
        collection = self.__db_connection.get_collection(self.__collection_name)
        data = collection.delete_one(filter)
        print(data.deleted_count)