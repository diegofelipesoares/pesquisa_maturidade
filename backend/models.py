from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(50), nullable=False)
    coordenadoria = db.Column(db.String(50), nullable=False)
    secao = db.Column(db.String(50), nullable=False)

class Response(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    pergunta = db.Column(db.String(255), nullable=False)
    resposta = db.Column(db.String(255), nullable=False)