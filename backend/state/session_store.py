from collections import defaultdict

usuarios = defaultdict(lambda: {
    "likes": set(),
    "dislikes": set(),
    "skip": set(),
    "avaliados": set(),
})

def registrar_avaliacao(user_id, movie_id, tipo):
    u = usuarios[user_id]
    u["avaliados"].add(movie_id)
    print(f"⭐ aki {u['avaliados']}") 
    if tipo == "like":
        u["likes"].add(movie_id)
    elif tipo == "dislike":
        u["dislikes"].add(movie_id)
    elif tipo == "skip":
        u["skip"].add(movie_id)

def obter_estado(user_id):
    return usuarios[user_id]

def resetar_usuario(user_id):
    usuarios[user_id] = {
        "likes": set(),
        "dislikes": set(),
        "skip": set(),
        "avaliados": set(),
    }
