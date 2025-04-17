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
    login = db.Column(db.String(50), nullable=False)
    coordenadoria = db.Column(db.String(50), nullable=False)
    secao = db.Column(db.String(50), nullable=False)

class Response(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=True)  # Alterado para String
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
    for resposta in data['respostas']:
        response = Response(user_id=data['user_id'], pergunta=resposta['pergunta'], resposta=resposta['resposta'])
        db.session.add(response)
    db.session.commit()
    return jsonify({'message': 'Respostas salvas com sucesso!'})

if __name__ == '__main__':
    app.run(debug=True)