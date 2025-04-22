import dash
from dash import dcc, html, Input, Output
import dash_bootstrap_components as dbc
import plotly.express as px
import plotly.graph_objects as go
from sqlalchemy import create_engine
import pandas as pd
from flask import Flask

# ======= Conexão com o Banco de Dados ======= #
engine = create_engine('postgresql://pesquisa_user:270588@localhost/pesquisa_maturidade')

# Carregar os dados da tabela "response"
df = pd.read_sql('SELECT * FROM response', con=engine)

# Extrair o valor numérico das respostas
df['resposta_num'] = df['resposta'].str.extract(r'(\d)').astype(int)
print(df.columns)

# Calcular a média das respostas por coordenadoria, seção e geral
media_geral = df['resposta_num'].mean()

# Média por coordenadoria
media_por_coordenadoria = df.groupby('coordenadoria')['resposta_num'].mean().reset_index()

# Média por seção
media_por_secao = df.groupby('secao')['resposta_num'].mean().reset_index()

# Função para mapear os níveis de maturidade
def calcular_nivel(media):
    if media < 2:
        return "Inicial"
    elif media < 3:
        return "Repetível"
    elif media < 4:
        return "Definido"
    elif media < 4.6:
        return "Gerenciado"
    else:
        return "Otimizado"

# Aplicar a função para calcular os níveis
media_por_coordenadoria['nivel_maturidade'] = media_por_coordenadoria['resposta_num'].apply(calcular_nivel)
media_por_secao['nivel_maturidade'] = media_por_secao['resposta_num'].apply(calcular_nivel)

# ======= APP ======= #
FONT_AWESOME = "https://use.fontawesome.com/releases/v6.4.0/css/all.css"
server = Flask(__name__)
app = dash.Dash(__name__, external_stylesheets=[FONT_AWESOME, dbc.themes.ZEPHYR], server=server, suppress_callback_exceptions=True)

# ======= Layout ======= #
app.layout = html.Div([
    html.H1("Dashboard de Maturidade do Processo de Conhecimento", style={'textAlign': 'center'}),

    # Seção de resultados gerais
    html.Div([
        html.H2("Resultado Geral"),
        dcc.Graph(
            id='grafico-geral',
            config={'displayModeBar': False}
        )
    ], style={'marginBottom': '50px'}),

    # Seção de resultados por coordenadoria
    html.Div([
        html.H2("Resultado por Coordenadoria"),
        dcc.Graph(
            id='grafico-coordenadoria',
            config={'displayModeBar': False}
        )
    ], style={'marginBottom': '50px'}),

    # Seção de resultados por seção
    html.Div([
        html.H2("Resultado por Seção"),
        dcc.Graph(
            id='grafico-secao',
            config={'displayModeBar': False}
        )
    ], style={'marginBottom': '50px'}),

    # Seção de resultados individuais
    html.Div([
        html.H2("Resultado Individual"),
        dcc.Dropdown(
            id='dropdown-usuario',
            options=[{'label': user_id, 'value': user_id} for user_id in df['user_id'].unique()],
            placeholder="Selecione um usuário"
        ),
        dcc.Graph(
            id='grafico-individual',
            config={'displayModeBar': False}
        )
    ])
])

# ======= Callbacks ======= #

# Callback para o gráfico geral
@app.callback(
    Output('grafico-geral', 'figure'),
    Input('dropdown-usuario', 'value')
)
def atualizar_grafico_geral(usuario):
    # Recarregar os dados do banco de dados
    df = pd.read_sql('SELECT * FROM response', con=engine)
    df['resposta_num'] = df['resposta'].str.extract(r'(\d)').astype(int)
    media_geral = df['resposta_num'].mean()

    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=media_geral,
        title={'text': "Média Geral de Maturidade"},
        gauge={
            'axis': {'range': [1, 5]},
            'steps': [
                {'range': [1, 2], 'color': "red"},
                {'range': [2, 3], 'color': "orange"},
                {'range': [3, 4], 'color': "yellow"},
                {'range': [4, 5], 'color': "green"}
            ]
        }
    ))
    return fig

# Callback para o gráfico por coordenadoria
@app.callback(
    Output('grafico-coordenadoria', 'figure'),
    Input('dropdown-usuario', 'value')
)
def atualizar_grafico_coordenadoria(usuario):
    # Recarregar os dados do banco de dados
    df = pd.read_sql('SELECT * FROM response', con=engine)
    df['resposta_num'] = df['resposta'].str.extract(r'(\d)').astype(int)
    media_por_coordenadoria = df.groupby('coordenadoria')['resposta_num'].mean().reset_index()
    media_por_coordenadoria['nivel_maturidade'] = media_por_coordenadoria['resposta_num'].apply(calcular_nivel)

    fig = px.bar(
        media_por_coordenadoria,
        x='coordenadoria',
        y='resposta_num',
        color='nivel_maturidade',
        title="Maturidade por Coordenadoria",
        labels={'resposta_num': 'Média das Respostas'}
    )
    return fig

# Callback para o gráfico por seção
@app.callback(
    Output('grafico-secao', 'figure'),
    Input('dropdown-usuario', 'value')
)
def atualizar_grafico_secao(usuario):
    # Recarregar os dados do banco de dados
    df = pd.read_sql('SELECT * FROM response', con=engine)
    df['resposta_num'] = df['resposta'].str.extract(r'(\d)').astype(int)
    media_por_secao = df.groupby('secao')['resposta_num'].mean().reset_index()
    media_por_secao['nivel_maturidade'] = media_por_secao['resposta_num'].apply(calcular_nivel)

    fig = px.bar(
        media_por_secao,
        x='secao',
        y='resposta_num',
        color='nivel_maturidade',
        title="Maturidade por Seção",
        labels={'resposta_num': 'Média das Respostas'}
    )
    return fig

# Callback para o gráfico individual
@app.callback(
    Output('grafico-individual', 'figure'),
    Input('dropdown-usuario', 'value')
)
def atualizar_grafico_individual(usuario):
    # Recarregar os dados do banco de dados
    df = pd.read_sql('SELECT * FROM response', con=engine)
    df['resposta_num'] = df['resposta'].str.extract(r'(\d)').astype(int)

    if usuario:
        dados_usuario = df[df['user_id'] == usuario]
        fig = px.bar(
            dados_usuario,
            x='pergunta',
            y='resposta_num',
            title=f"Respostas do Usuário: {usuario}",
            labels={'resposta_num': 'Resposta'}
        )
    else:
        fig = go.Figure()
    return fig

# ======= Run Server ======= #
if __name__ == '__main__':
    app.run(debug=True)