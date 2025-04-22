import dash
from dash import dcc, html, Input, Output, State, ctx
import dash_bootstrap_components as dbc 
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

import psycopg2
import sqlalchemy
from sqlalchemy import create_engine

import pandas as pd

#import from folders/theme changer
from dash_bootstrap_templates import ThemeChangerAIO

#fazendo a conexão com a base de dados do postgre
#link de conexão: 'postgresql://username:password@localhost:5432/mydatabase
engine = create_engine('postgresql://pesquisa_user:270588@localhost/pesquisa_maturidade')

#df vem de dateframe
#pd vem da biblioteca pandas
df = pd.read_sql('SELECT * FROM resposta', con=engine, index_col='id')

#======= APP ======= #
from flask import Flask

#icones
FONT_AWESOME = "https://use.fontawesome.com/releases/v6.4.0/css/all.css"

server = Flask(__name__)
app = dash.Dash(__name__, external_stylesheets=FONT_AWESOME, server=server, suppress_callback_exceptions=True)

# ======= Styles ======= #
tab_card = {'height': '100%' }

main_config = {
    "hovermode": 'x unified', #quando passar o mouse em cima do gráfico, ele mostra os dados de todas as linhas
    #mudando canfiguração da layout da legenda
    "legend": {"yanchor": "top",
               "y": 0.9,
               "xanchor": "left", 
               "x": 0.1,
               'title':{'text': None},
               'font': {'color': 'white'},
               'bgcolor':'rgba(0, 0, 0, 0.5)'},
    "margin": {"l": 0, "t": 0, "b": 0, "r": 0}
}

#templates são buscados no site bootswatch.com
template_theme1 = 'zephyr'
template_theme2 = 'solar'
url_theme1 = dbc.themes.ZEPHYR
url_theme2 = dbc.themes.SOLAR

