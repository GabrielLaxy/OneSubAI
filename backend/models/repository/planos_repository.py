from typing import Dict, List

class PlanosRepository:
    def __init__(self, db_connection)   -> None:
        self.__collection_name = "planos"
        self.__db_connection = db_connection

    def get_collection(self):
        return self.__db_connection[self.__collection_name]

    def insert_document(self, document: Dict) -> Dict:
        collection = self.get_collection()
        result = collection.insert_one(document)
        document["_id"] = result.inserted_id
        return document

    def insert_list_of_documents(self, list_of_documents: List[Dict]) -> List[Dict]:
        collection = self.get_collection()
        result = collection.insert_many(list_of_documents)
        for doc, _id in zip(list_of_documents, result.inserted_ids):
            doc["_id"] = _id
        return list_of_documents

    def select_many(self, filter: Dict, projection: Dict = None) -> List[Dict]:
        collection = self.get_collection()
        data = collection.find(filter, projection or {})
        return list(data)

    def edit_registry(self, filter: Dict, update_fields: Dict) -> int:
        collection = self.get_collection()
        result = collection.update_one(filter, {"$set": update_fields})
        return result.modified_count

    def edit_many_increment(self, filter: Dict, field: str, value: int) -> int:
        collection = self.get_collection()
        result = collection.update_many(filter, {"$inc": {field: value}})
        return result.modified_count

    def delete_registry(self, filter: Dict) -> int:
        collection = self.get_collection()
        result = collection.delete_one(filter)
        return result.deleted_count

    def select_all(self) -> List[Dict]:
        collection = self.get_collection()
        data = collection.find({}, {"_id": 0})
        return list(data)