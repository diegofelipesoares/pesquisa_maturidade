# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

# Configuração do banco de dados PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://pesquisa_user:270588@localhost/pesquisa_maturidade'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Habilitar CORS para todas as rotas
CORS(app)

# Modelos do banco de dados
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(50), nullable=True)
    coordenadoria = db.Column(db.String(50), nullable=False)
    secao = db.Column(db.String(50), nullable=False)

class Response(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=True)  # Pode ser nulo para respostas anônimas
    coordenadoria = db.Column(db.String(50), nullable=False)  # Coordenadoria associada à resposta
    secao = db.Column(db.String(50), nullable=False)  # Seção associada à resposta
    pergunta = db.Column(db.String(255), nullable=False)
    resposta = db.Column(db.String(255), nullable=False)

@app.route('/')
def home():
    return "Bem-vindo ao servidor Flask! As rotas disponíveis são: /cadastrar e /responder"

# Rota para cadastrar usuários
@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    data = request.json
    user = User(login=data['login'], coordenadoria=data['coordenadoria'], secao=data['secao'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Cadastro realizado com sucesso!'})

# Rota para salvar respostas
@app.route('/enviar-respostas', methods=['POST'])
def enviar_respostas():
    data = request.json

    # Verificar se os dados do usuário estão presentes
    user_data = data.get('user')
    coordenadoria = user_data['coordenadoria'] if user_data else data.get('coordenadoria')
    secao = user_data['secao'] if user_data else data.get('secao')

    if user_data:
        # Verificar se o usuário já existe no banco de dados
        user = User.query.filter_by(login=user_data['login']).first()
        if not user:
            # Criar um novo usuário se ele não existir
            user = User(
                login=user_data['login'],
                coordenadoria=user_data['coordenadoria'],
                secao=user_data['secao']
            )
            db.session.add(user)
            db.session.commit()  # Salvar o usuário no banco de dados

    # Salvar as respostas no banco de dados
    for resposta in data['respostas']:
        response = Response(
            user_id=user.login if user_data else None,  # Associar o login do usuário ou deixar como None
            coordenadoria=coordenadoria,
            secao=secao,
            pergunta=resposta['pergunta'],
            resposta=resposta['resposta']
        )
        db.session.add(response)

    db.session.commit()  # Salvar as respostas no banco de dados
    return jsonify({'message': 'Respostas e dados do usuário salvos com sucesso!'})

if __name__ == '__main__':
    app.run(debug=True)