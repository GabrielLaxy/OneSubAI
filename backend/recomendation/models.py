from pydantic import BaseModel
from typing import List, Optional

class Avaliacao(BaseModel):
    user_id: str
    movie_id: int
    avaliacao: int  

class RecomendacaoResponse(BaseModel):
    recomendados: List[int]

class Filme(BaseModel):
    id: int
    title_pt_br: str
    genres: List[int]
    providers: List[int]
    keywords: List[str]
    directors: List[str]
    actors: List[str]
    tmdb_rating: float
