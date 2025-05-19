from typing import Dict, List

class CatalogoRepository:
    def __init__(self, db_connection)   -> None:
        self.__collection_name = "catalogo"
        self.__db_connection = db_connection

    def insert_document(self, document: Dict) -> Dict:
        collection = self.__db_connection.get_collection(self.__collection_name )
        collection.insert_one(document)
        return document
    
    def insert_list_of_documents(self, list_of_documents: List[Dict]) -> List[Dict]:
        collection = self.__db_connection.get_collection(self.__collection_name)
        collection.insert_many(list_of_documents)
        return list_of_documents
    
    def select_many(self, filter) -> List[Dict]:
        collection = self.__db_connection.get_collection(self.__collection_name)
        data = collection.find(
            filter,
            {"image_path": 1}
        )

        response = []
        for elem in data: response.append(elem)
        return response 
    
    def select_one(self, filter) -> Dict:
        collection = self.__db_connection.get_collection(self.__collection_name)
        response = collection.find_one(filter, {"_id": 0})
        return response
    
    def select_if_property_exists(self) -> None:
        collection = self.__db_connection.get_collection(self.__collection_name)
        data = collection.find({ "cpf": { "$exists": True } })
        for elem in data: print(elem)

    def select_many_order(self, filter):
        collection = self.__db_connection.get_collection(self.__collection_name)
        data = collection.find(
            filter, 
            {"_id": 1} # Opcoes de retorno
        ).sort([("_id", 1)])

        for elem in data: print(elem)

    def edit_registry(self,filter, name) -> None:
        collection = self.__db_connection.get_collection(self.__collection_name)
        data = collection.update_one(
            filter, 
            { "$set": { "nome": name } } # Campo de edição
        )
        print(data.modified_count)

    # def edit_many_increment(self, filter, num) -> None:
    #     collection = self.__db_connection.get_collection(self.__collection_name)
    #     data = collection.update_many(
    #         filter, 
    #         { "$inc": { "idade": num } }
    #     )
    #     print(data.modified_count)

    def delete_registry(self, filter) -> None:
        collection = self.__db_connection.get_collection(self.__collection_name)
        data = collection.delete_one(filter)
        print(data.deleted_count)