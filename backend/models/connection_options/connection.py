from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
import os

class DBConnectionHandler:
    def __init__(self) -> None:
        self.__connection_string = os.getenv("MONGO_URI")
        self.__database_name = os.getenv("DB_NAME")
        self.__client = None
        self.__db_connection = None

    def connect_to_db(self):
        self.__client = MongoClient(self.__connection_string)
        self.__db_connection = self.__client[self.__database_name]

    def get_db_connection(self):
        return self.__db_connection

    def get_db_client(self):
        return self.__client