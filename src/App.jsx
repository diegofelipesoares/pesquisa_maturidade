import { useState } from 'react'; // Importa o hook useState para gerenciar estados no componente
import deskinho from '../src/img/Deskinho_bandeira.png'; // Importa a imagem do logo
import './App.css'; // Importa o arquivo de estilos CSS

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

  // Estados do componente
  const [indiceAtual, setIndiceAtual] = useState(0); // Índice da pergunta atual
  const [respostas, setRespostas] = useState([]); // Respostas fornecidas pelo usuário
  const [enviado, setEnviado] = useState(false); // Indica se as respostas foram enviadas
  const [cadastroConcluido, setCadastroConcluido] = useState(false); // Indica se o cadastro foi concluído
  const [formData, setFormData] = useState({ // Dados do formulário de cadastro
    login: "",
    coordenadoria: "",
    secao: "",
  });
  const [secoesDisponiveis, setSecoesDisponiveis] = useState([]); // Seções disponíveis com base na coordenadoria selecionada


  // Função para responder a pergunta atual e avançar para a próxima
  const responder = (resposta) => {
    setRespostas([
      ...respostas,
      { pergunta: perguntas[indiceAtual], resposta } // Adiciona a resposta à lista de respostas
    ]);
    setIndiceAtual((prev) => prev + 1); // Atualiza o índice da pergunta
  };

  // Função para voltar à pergunta anterior
  const voltarPergunta = () => {
    if (indiceAtual > 0) {
      setIndiceAtual(indiceAtual - 1); // Volta para a pergunta anterior
      setRespostas(respostas.slice(0, -1)); // Remove a última resposta
    }
  };

  // API Flask - Função para enviar as respostas para o servidor
  // (substitua a URL pelo endpoint correto do servidor)
  const enviarRespostas = async () => {
    // Verifica se o cadastro foi concluído
    if (!cadastroConcluido) {
      console.error("O cadastro não foi concluído. Não é possível enviar as respostas.");
      return; // Interrompe a execução da função
    }
  
    // Define o payload (dados a serem enviados para o servidor)
    const payload = {
      user: {
        login: formData.login, // Login do usuário (opcional)
        coordenadoria: formData.coordenadoria, // Coordenadoria selecionada pelo usuário
        secao: formData.secao // Seção selecionada pelo usuário
      },
      respostas // Array contendo as respostas do questionário
    };
  
    try {
      // Faz uma requisição HTTP para o endpoint do servidor
      const response = await fetch('http://localhost:5000/enviar-respostas', {
        method: 'POST', // Método HTTP POST para enviar dados
        headers: { 'Content-Type': 'application/json' }, // Define o tipo de conteúdo como JSON
        body: JSON.stringify(payload) // Converte o payload para uma string JSON antes de enviar
      });
  
      // Verifica se a resposta do servidor foi bem-sucedida (status HTTP 200-299)
      if (response.ok) {
        setEnviado(true); // Atualiza o estado para indicar que as respostas foram enviadas com sucesso
      }
    } catch (error) {
      // Captura e exibe erros que possam ocorrer durante a requisição
      console.error('Erro ao enviar respostas:', error);
    }
  };
  
  // Função para refazer a pesquisa
  const refazerPesquisa = () => {
    setIndiceAtual(0); // Volta para a primeira pergunta
    setRespostas([]); // Limpa as respostas
    //setCadastroConcluido(false); // Retorna para a tela de cadastro, se necessário
  };

  const reiniciarPesquisa = () => {
    setIndiceAtual(0); // Volta para a primeira pergunta
    setRespostas([]); // Limpa as respostas
    setCadastroConcluido(false); // Retorna para a tela de cadastro
    setFormData({ login: "", coordenadoria: "", secao: "" }); // Limpa os dados do formulário
    setEnviado(false); // Redefine o estado de envio para permitir o envio de novas respostas
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
          <img src={deskinho} className="logo" alt="Vite logo" />
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
              <label htmlFor="login">Login: (campo não obrigatório)</label>
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
            <div className="perguntas-container">
              <h2>{perguntas[indiceAtual]}</h2>
              <div className="opcoes-container">
              {opcoes.map((opcao, i) => (
                <button
                  key={`${indiceAtual}-${i}`} // Chave única baseada na pergunta atual
                  onClick={(e) => {
                    e.target.classList.add("clicado"); // Adiciona a classe "clicado"
                    setTimeout(() => e.target.classList.remove("clicado"), 300); // Remove a classe após 300ms
                    responder(opcao); // Chama a função para avançar a pergunta
                    e.target.blur(); // Remove o foco do botão após o clique
                  }}
                  className="botao-resposta"
                >
                  {opcao}
                </button>
              ))}
              </div>
              <div className="rodape-perguntas">
                {/* Exibe o número da pergunta atual */}
                <p style={{ marginTop: '20px', color: '#666' }}>
                  Pergunta {indiceAtual + 1} de {perguntas.length}
                </p>
                {/* Botão para voltar à pergunta anterior */}
                {indiceAtual > 0 && (
                    <button onClick={voltarPergunta} className="botao-voltar">
                      Voltar
                    </button>
                )}
              </div>
              
            </div>
          ) : (
            // Se todas as perguntas foram respondidas, exibe o resumo
            // e o botão para enviar as respostas
            <div className="resumo">
              <div className="container_botao_enviar">
                {!enviado ? (
                <>
                  <button className="botao-enviar" onClick={enviarRespostas}>
                    Enviar Respostas
                  </button>
                  <button className="botao-refazer" onClick={refazerPesquisa}>
                    Refazer Questionário
                  </button>
                </>
                ) : (
                  // Mensagem de sucesso após o envio
                  <div className="mensagem-sucesso">
                    <p className="sucesso">Respostas enviadas com sucesso!</p>
                    <div className="botoes-finalizacao">
                      {/* Botão para finalizar */}
                      <button className="botao-finalizar" onClick={reiniciarPesquisa}>
                        Finalizar
                      </button>
                      {/* Botão para resultados parciais */}
                      <a
                        href="http://127.0.0.1:8050" // URL do BI com os gráficos
                        target="_blank" // Abre em uma nova aba
                        rel="noopener noreferrer" // Boa prática de segurança
                        className="botao-resultados"
                      >
                        Resultados Parciais
                      </a>
                    </div>
                  </div>
                )}
              </div>
              {/* Resumo das respostas */}
              <p>Veja abaixo suas respostas:</p>
              <ul>
                {perguntas.map((pergunta, i) => (
                  <li key={i}>
                    <strong>{pergunta}</strong>
                    <br />
                    Resposta: {respostas[i]?.resposta || "Sem resposta"} {/* Acessa a propriedade 'resposta' */}
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