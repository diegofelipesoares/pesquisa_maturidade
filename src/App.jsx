import { useState } from 'react';
import deskinho from '../src/img/Deskinho_bandeira.png';
import './App.css';

function App() {
  // Mapeamento das coordenadorias e suas respectivas seções
  const coordenadorias = {
    STI: ["AGC", "NESC", "NEPC", "NECI"],
    COAI: ["SEAI", "SECID", "SEIBIO", "SESAM", "SINAPS", "SESERV"],
    COINF: ["NATCOINF", "SEAU", "SDCIBER", "SESAP", "SEMOP", "SEBD", "SESOP"],
    CSELE: ["SEINT", "SECAD", "SECINP", "SETOT"],
    COTEL: ["SEGITEC", "SGCD", "SEVIN", "SEUE", "STUE"],
    COPP: ["NATPJE", "SEAJU", "SAOPE", "SESIP"],
    CSADM: ["CERES", "CRONOS", "JUPYTER", "LUNA", "MARTE", "MERCURIO", "NETUNO", "SATURNO", "TERRA", "URANO", "VENUS"],
  };
  // Perguntas do questionario
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
  // Opções de resposta do questionario
  const opcoes = [
    "1 – Ruim",
    "2 – Regular",
    "3 – Adequado",
    "4 – Satisfeito",
    "5 – Muito Satisfeito"
  ];

  // Estado para controlar o índice da pergunta atual, as respostas, se foi enviado e se o cadastro foi concluído
  const [indiceAtual, setIndiceAtual] = useState(0);
  // Estado para armazenar as respostas
  const [respostas, setRespostas] = useState([]);
  // Estado para controlar se as respostas foram enviadas
  const [enviado, setEnviado] = useState(false);
  // Estado para controlar se o cadastro foi concluído
  const [cadastroConcluido, setCadastroConcluido] = useState(false);
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    login: "",
    coordenadoria: "",
    secao: "",
  });
  // Estado para armazenar as seções disponíveis com base na coordenadoria selecionada
  const [secoesDisponiveis, setSecoesDisponiveis] = useState([]);

  // Função para responder a pergunta atual e avançar para a próxima
  const responder = (resposta) => {
    setRespostas([...respostas, resposta]);
    setIndiceAtual(indiceAtual + 1);
  };

  // Função para enviar as respostas para o servidor
  // (substitua a URL pelo endpoint correto do servidor)
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

  // Cálculo do progresso da pesquisa 0 a 100%
  const progresso = (indiceAtual / perguntas.length) * 100;

  // Função para lidar com a mudança nos campos do formulário
  // Atualiza o estado do formulário com os dados inseridos pelo usuário
  // e atualiza as seções disponíveis com base na coordenadoria selecionada
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Atualiza as seções disponíveis ao alterar a coordenadoria
    if (name === "coordenadoria") {
      setSecoesDisponiveis(coordenadorias[value] || []);
      setFormData({ ...formData, [name]: value, secao: "" }); // Reseta a seção ao mudar a coordenadoria
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Função para lidar com o envio do formulário de cadastro
  const handleCadastro = (e) => {
    e.preventDefault();
    console.log("Dados cadastrados:", formData);
    setCadastroConcluido(true); // Avança para as perguntas
  };

  // Renderização do componente
  return (
    <div className="app-container">
      {/* Cabeçalho com logo e título */}
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

      {/* Formulário de cadastro ou perguntas */}
      {!cadastroConcluido ? (
        <div className="cadastro-container">
          <h2>Cadastro</h2>
          <form onSubmit={handleCadastro}>
            <div>
              <label htmlFor="login">Login:</label>
              <input
                type="text"
                id="login"
                name="login"
                value={formData.login}
                onChange={handleChange}
                placeholder="nome.sobrenome"
              />
            </div>
            {/* Campo de coordenadoria */}
            <div>
              <label htmlFor="coordenadoria">Coordenadoria: *</label>
              <select
                id="coordenadoria"
                name="coordenadoria"
                value={formData.coordenadoria}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                {/* Gera as opções de coordenadoria dinamicamente */}
                {Object.keys(coordenadorias).map((coordenadoria) => (
                  <option key={coordenadoria} value={coordenadoria}>
                    {coordenadoria}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo de seção */}
            {/* As seções disponíveis são atualizadas com base na coordenadoria selecionada */}
            <div>
              <label htmlFor="secao">Seção: *</label>
              <select
                id="secao"
                name="secao"
                value={formData.secao}
                onChange={handleChange}
                required
                disabled={!formData.coordenadoria} // Desabilita se nenhuma coordenadoria for selecionada
              >
                <option value="">Selecione</option>
                {/* Gera as opções de seção dinamicamente com base na coordenadoria */}
                {secoesDisponiveis.map((secao) => (
                  <option key={secao} value={secao}>
                    {secao}
                  </option>
                ))}
              </select>
            </div>
            {/* Botão para enviar o formulário */}
            <button type="submit">Iniciar Pesquisa</button>
          </form>
        </div>
      ) : (
        // Se o cadastro foi concluído, exibe as perguntas
        <>
          <p className="intro-text">
            A análise de maturidade do processo de gerenciamento de conhecimento tem como objetivo
            avaliar o estágio atual e a eficácia do processo de captura, compartilhamento e uso do
            conhecimento dentro do TSE. Essa análise permite identificar pontos fortes, lacunas e
            oportunidades de melhoria, orientando ações para otimizar o uso do conhecimento, aumentar a
            colaboração entre equipes e melhorar a tomada de decisão, além de contribuir para o
            alinhamento do processo com os objetivos estratégicos da organização e a melhoria contínua
            da gestão do conhecimento.
          </p>
          {/* Barra de progresso */}
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progresso}%` }}>
              <span className="progress-text">{Math.round(progresso)}%</span>
            </div>
          </div>
          {/* Exibe a pergunta atual e as opções de resposta */}
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
              {/* Exibe o número da pergunta atual */}
              <p style={{ marginTop: '20px', color: '#666' }}>
                Pergunta {indiceAtual + 1} de {perguntas.length}
              </p>
            </div>
          ) : (
            // Se todas as perguntas foram respondidas, exibe o resumo
            // e o botão para enviar as respostas
            <div className="resumo">
              <div className="container_botao_enviar">
                {!enviado ? (
                  <button className="botao-enviar" onClick={enviarRespostas}>
                    Enviar Respostas
                  </button>
                ) : (
                  // Mensagem de sucesso após o envio
                  <p className="sucesso">Respostas enviadas com sucesso!</p>
                )}
              </div>
              {/* Resumo das respostas */}
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
        </>
      )}
    </div>
  );
}

export default App;