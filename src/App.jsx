// App.jsx
import { useState } from 'react';
import deskinho from '../src/img/Deskinho_bandeira.png';
import './App.css';

function App() {
  const perguntas = [
    "1. Como avalia o processo de gerenciamento de conhecimento em relação à sua formalização e documentação?",
    "2. Como avalia o fluxo definido para criação, compartilhamento e gerenciamento do conhecimento?",
    "3. Como avalia a integração do processo de gerenciamento de conhecimento com outros processos (ex: Gerenciamento de Incidentes, Gerenciamento de Problemas, etc)?",
    "4. Como avalia o registro e armazenamento do conhecimento gerado a partir de incidentes e problemas para futuras consultas?",
    "5. Como avalia os incentivos da liderança da área para que os membros da equipe registrem conhecimento e lições aprendidas?",
    "6. Como avalia o acesso e compartilhamento do conhecimento gerado a todos que necessitam utilizá-lo?",
    "7. Como avalia o processo para revisar e atualizar o conhecimento regularmente?",
    "8. Como avalia a interação e o nível de colaboração entre as equipes de atendimento na execução do processo de gerenciamento de conhecimento?",
    "9. Como avalia a disponibilização do conhecimento (ex: FAQs, artigos de base de conhecimento, tutoriais)?",
    "10. Como avalia a efetividade do uso do conhecimento para resolver incidentes e problemas mais rapidamente?",
    "11. Como avalia o ciclo de melhoria contínua do processo de Gerenciamento de conhecimento?",
    "12. Como avalia a frequência de treinamentos sobre boas práticas e operação do processo de gerenciamento de conhecimento?"
  ];

  const opcoes = [
    "1 – Ruim",
    "2 – Regular",
    "3 – Adequado",
    "4 – Satisfeito",
    "5 – Muito Satisfeito"
  ];

  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [enviado, setEnviado] = useState(false);

  const responder = (resposta) => {
    setRespostas([...respostas, resposta]);
    setIndiceAtual(indiceAtual + 1);
  };

  const enviarRespostas = async () => {
    try {
      const response = await fetch('http://localhost:5000/enviar-respostas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respostas })
      });
      if (response.ok) {
        setEnviado(true);
      }
    } catch (error) {
      console.error('Erro ao enviar respostas:', error);
    }
  };

  const progresso = (indiceAtual / perguntas.length) * 100;

  return (
    <div className="app-container">
      <div className="logo-container">
        <a href="https://vitejs.dev" target="_blank">
          <img src={deskinho} className="logo" alt="Vite logo" />
        </a>
        <div>
          <h1>Análise de Maturidade ITIL </h1>
          <h2>Processo de Gerenciamento do Conhecimento</h2>
          <h3>SESERV - TSE - #8800</h3>
        </div>
      </div>


      <p className="intro-text">
        A análise de maturidade do processo de gerenciamento de conhecimento tem como objetivo
        avaliar o estágio atual e a eficácia do processo de captura, compartilhamento e uso do
        conhecimento dentro do TSE. Essa análise permite identificar pontos fortes, lacunas e
        oportunidades de melhoria, orientando ações para otimizar o uso do conhecimento, aumentar a
        colaboração entre equipes e melhorar a tomada de decisão, além de contribuir para o
        alinhamento do processo com os objetivos estratégicos da organização e a melhoria contínua
        da gestão do conhecimento.
      </p>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${progresso}%` }}></div>
      </div>

      {indiceAtual < perguntas.length ? (
        <div>
          <h2>{perguntas[indiceAtual]}</h2>
          <div className="opcoes-container">
            {opcoes.map((opcao, i) => (
              <button key={i} onClick={() => responder(opcao)} className="botao-resposta">
                {opcao}
              </button>
            ))}
          </div>
          <p style={{ marginTop: '20px', color: '#666' }}>
            Pergunta {indiceAtual + 1} de {perguntas.length}
          </p>
        </div>
      ) : (
        <div className="resumo">
          <div className='container_botao_enviar'>
            {!enviado ? (
              <button className="botao-enviar" onClick={enviarRespostas}>
                Enviar Respostas
              </button>
            ) : (
              <p className="sucesso">Respostas enviadas com sucesso!</p>
            )}
          </div>
          <p>Veja abaixo suas respostas:</p>
          <ul>
            {perguntas.map((pergunta, i) => (
              <li key={i}>
                <strong>{pergunta}</strong>
                <br />
                Resposta: {respostas[i]}
              </li>
            ))}
          </ul>
          
        </div>
      )}
    </div>
  );
}

export default App;
