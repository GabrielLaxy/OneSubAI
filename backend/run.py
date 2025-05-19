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

# passageiro = {
#     "userId": "4",
#     "nome": "Gabriel",
#     "image_path": "/images/gabriel.jpg",
#     "face_descriptor": [
#         0.443,
#         0.653,
#         0.764,
#         0.342
#     ],
#     "data_registro": {
#         "$date": "2024-10-18T19:00:00.000Z"
#     }
# }

# passageiros_repository.insert_document(passageiro)

# list_of_documents = [
#     {"userId": "5",
#     "nome": "João",
#     "image_path": "/images/joão.jpg",
#     "face_descriptor": [
#         0.010,
#         0.243,
#         0.545,
#         0.342
#     ],
#     "data_registro": {
#         "$date": "2024-10-18T19:00:00.000Z"
#     }},
#     {"userId": "6",
#     "nome": "Maria",
#     "image_path": "/images/maria.jpg",
#     "face_descriptor": [
#         0.342,
#         0.543,
#         0.231,
#         0.934
#     ],
#     "data_registro": {
#         "$date": "2024-10-18T19:00:00.000Z"
#     }},
#     {
#     "userId": "7",
#     "nome": "Julia",
#     "image_path": "/images/julia.jpg",
#     "face_descriptor": [
#         0.234,
#         0.123,
#         0.012,
#         0.342
#     ],
#     "data_registro": {
#         "$date": "2024-10-18T19:00:00.000Z"
#     }}
# ]

# passageiros_repository.insert_list_of_documents(list_of_documents)

# response = passageiros_repository.select_many({"nome": "Taynah"})
# print(response)

# response2 = passageiros_repository.select_one({"nome": "Taynah"})
# print(response2)

# passageiros_repository.select_if_property_exists()

# passageiros = [
#     {"userId": "9",
#     "nome": "Carlos",
#     "cpf": "521.123.321-38",
#     "image_path": "/images/carlos.jpg",
#     "face_descriptor": [
#         0.443,
#         0.653,
#         0.764,
#         0.342
#     ],
#     "data_registro": {
#         "$date": "2024-10-18T19:00:00.000Z"
#     },
#     "passou": "não"
#     },
#     {"userId": "10",
#     "nome": "Luana",
#     "cpf": "432.013.123-32",
#     "image_path": "/images/luana.jpg",
#     "face_descriptor": [
#         0.443,
#         0.653,
#         0.764,
#         0.342
#     ],
#     "data_registro": {
#         "$date": "2024-10-18T19:00:00.000Z"
#     },
#     "passou": "sim"
#     },
#     {"userId": "11",
#     "nome": "José",
#     "cpf": "213.254.321-38",
#     "image_path": "/images/josé.jpg",
#     "face_descriptor": [
#         0.443,
#         0.653,
#         0.764,
#         0.342
#     ],
#     "data_registro": {
#         "$date": "2024-10-18T19:00:00.000Z"
#     },
#     "passou": "sim"
#     }
# ]

# passageiros_repository.insert_list_of_documents(passageiros)

# passageiros_repository.select_if_property_exists()

# passageiros_repository.select_many_order({"passou": "sim"})

# passageiros_repository.edit_registry({"nome": "Taynah"}, "Taynah Saito")

# passageiro = {
#     "userId": "12",
#     "nome": "Mario",
#     "image_path": "/images/mario.jpg",
#     "idade": 18,
#     "face_descriptor": [
#         0.443,
#         0.653,
#         0.764,
#         0.342
#     ],
#     "data_registro": {
#         "$date": "2024-10-18T19:00:00.000Z"
#     }
# }

# passageiros_repository.insert_document(passageiro)


# passageiros_repository.edit_many_increment({"nome": "Mario"}, 3)

# funcionario = {
#     "userId": "1",
#     "nome": "Eduardo",
#     "email": "edurene@gmail.com",
#     "data_registro": {
#         "$date": "2024-11-04T19:23:00.000Z"
#     }
# }

# funcionarios_repository.insert_document(funcionario)
# funcionarios_repository.delete_registry({"nome": "Eduardo"})

# funcionarios = [
#     {"userId": "1",
#     "nome": "João",
#     "rg": "12.123.321-1",
#     "email": "joao@metrosp.com",
#     "data_registro": {
#         "$date": "2024-11-04T19:30:00.000Z"
#     },
#     },
#     {"userId": "2",
#     "nome": "Carlos",
#     "rg": "12.013.123-2",
#     "email": "carlos@metrosp.com",
#     "data_registro": {
#         "$date": "2024-10-18T19:00:00.000Z"
#     },
#     },
# ]

# funcionarios_repository.insert_list_of_documents(funcionarios)
# funcionarios_repository.select_many_order({"nome": "João"})

# usuario = {
#     "userId": "1",
#     "nome": "Taynah",
#     "login": "taynah.saito@gmail.com",
#     "senha_hash": "xxxx",
#     "plano_id":
#     ["1",
#     "2",
#     ],
# }

# usuarios_repository.insert_document(usuario)

catalogo_generos_repository.edit_registry({"Animação": 1}, 3)
