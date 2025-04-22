import psycopg2
import sqlalchemy
from sqlalchemy import create_engine

import pandas as pd

#fazendo a conexão com a base de dados do postgre
#link de conexão: 'postgresql://username:password@localhost:5432/mydatabase
engine = create_engine('postgresql://pesquisa_user:270588@localhost/pesquisa_maturidade')

#df vem de dateframe
#pd vem da biblioteca pandas
df = pd.read_sql('SELECT * FROM resposta', con=engine, index_col='id')