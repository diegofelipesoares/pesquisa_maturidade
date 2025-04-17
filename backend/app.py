# -*- coding: utf-8 -*-
# Importações necessárias para o funcionamento do Flask, SQLAlchemy e CORS
from flask import Flask, request, jsonify  # Flask para criar o servidor, request para acessar dados da requisição, jsonify para retornar JSON
from flask_sqlalchemy import SQLAlchemy  # SQLAlchemy para gerenciar o banco de dados
from flask_cors import CORS  # CORS para permitir requisições de diferentes origens (Cross-Origin Resource Sharing)

# Inicialização da aplicação Flask
app = Flask(__name__)

# Configuração do banco de dados PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://pesquisa_user:270588@localhost/pesquisa_maturidade'  # URI de conexão com o banco de dados
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Desativa notificações de alterações no SQLAlchemy para melhorar a performance

# Inicialização do SQLAlchemy para gerenciar o banco de dados
db = SQLAlchemy(app)

# Habilitar CORS para todas as rotas da aplicação
CORS(app)

# Modelos do banco de dados
# Modelo para a tabela "User", que armazena informações dos usuários
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ID único para cada usuário
    login = db.Column(db.String(50), nullable=True)  # Login do usuário (pode ser nulo para respostas anônimas)
    coordenadoria = db.Column(db.String(50), nullable=False)  # Coordenadoria do usuário (campo obrigatório)
    secao = db.Column(db.String(50), nullable=False)  # Seção do usuário (campo obrigatório)

# Modelo para a tabela "Response", que armazena as respostas da pesquisa
class Response(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ID único para cada resposta
    user_id = db.Column(db.String(50), nullable=True)  # Login do usuário que respondeu (pode ser nulo para respostas anônimas)
    coordenadoria = db.Column(db.String(50), nullable=False)  # Coordenadoria associada à resposta
    secao = db.Column(db.String(50), nullable=False)  # Seção associada à resposta
    pergunta = db.Column(db.String(255), nullable=False)  # Pergunta respondida
    resposta = db.Column(db.String(255), nullable=False)  # Resposta fornecida

# Rota principal para verificar se o servidor está funcionando
@app.route('/')
def home():
    return "Bem-vindo ao servidor Flask! As rotas disponíveis são: /cadastrar e /responder"

# Rota para cadastrar usuários
@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    # Obtém os dados enviados na requisição
    data = request.json
    # Cria um novo usuário com os dados fornecidos
    user = User(login=data['login'], coordenadoria=data['coordenadoria'], secao=data['secao'])
    # Adiciona o usuário ao banco de dados
    db.session.add(user)
    db.session.commit()  # Salva as alterações no banco de dados
    # Retorna uma mensagem de sucesso
    return jsonify({'message': 'Cadastro realizado com sucesso!'})

# Rota para salvar respostas da pesquisa
@app.route('/enviar-respostas', methods=['POST'])
def enviar_respostas():
    # Obtém os dados enviados na requisição
    data = request.json

    # Verifica se os dados do usuário estão presentes
    user_data = data.get('user')
    # Define a coordenadoria e a seção com base nos dados do usuário ou nos dados enviados diretamente
    coordenadoria = user_data['coordenadoria'] if user_data else data.get('coordenadoria')
    secao = user_data['secao'] if user_data else data.get('secao')

    # Se os dados do usuário estiverem presentes, verifica se o usuário já existe no banco de dados
    if user_data:
        user = User.query.filter_by(login=user_data['login']).first()  # Busca o usuário pelo login
        if not user:
            # Se o usuário não existir, cria um novo usuário
            user = User(
                login=user_data['login'],
                coordenadoria=user_data['coordenadoria'],
                secao=user_data['secao']
            )
            db.session.add(user)  # Adiciona o novo usuário ao banco de dados
            db.session.commit()  # Salva as alterações no banco de dados

    # Salva as respostas no banco de dados
    for resposta in data['respostas']:
        response = Response(
            user_id=user.login if user_data else None,  # Associa o login do usuário ou deixa como None para respostas anônimas
            coordenadoria=coordenadoria,  # Coordenadoria associada à resposta
            secao=secao,  # Seção associada à resposta
            pergunta=resposta['pergunta'],  # Pergunta respondida
            resposta=resposta['resposta']  # Resposta fornecida
        )
        db.session.add(response)  # Adiciona a resposta ao banco de dados

    db.session.commit()  # Salva todas as respostas no banco de dados
    # Retorna uma mensagem de sucesso
    return jsonify({'message': 'Respostas e dados do usuário salvos com sucesso!'})

# Inicia o servidor Flask no modo de depuração
if __name__ == '__main__':
    app.run(debug=True)