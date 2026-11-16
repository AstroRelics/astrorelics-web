import type { MissionDefinition } from '../../types/mission';
import type { Language } from '../../utils/i18n';

export const OPPORTUNITY_MISSION_PT: MissionDefinition = {
  id: 'opportunity_deep_journey',
  title: 'Opportunity – A Jornada Profunda',
  subtitle: 'Os Últimos Dias do Robô Explorador em Marte',
  missionBadge: 'ROVER OPPORTUNITY · NASA',
  locationLabel: 'Planície de Meridiani, Marte',
  yearLabel: '2004 – 2018 (Quase 15 anos em Marte)',
  relatedBodyId: 'mars',
  relatedArtifactId: 'opportunity_rover',
  accentColor: '#F59E0B',
  introBriefing:
    'O céu de Marte está escurecendo por causa de uma grande tempestade de poeira. A bateria do robô Opportunity está em 18% e suas peças já têm quase 15 anos de uso. Você está no comando para fazer a última descoberta sobre o passado de Marte em 4 passos simples.',
  initialTelemetry: {
    battery: 18,
    temperatureC: -42,
    scienceDataMb: 12,
  },
  paths: [
    {
      id: 'hematite',
      number: 1,
      title: 'Caminho 1: O Paredão das Bolinhas de Ferro',
      focusBadge: 'Descoberta: Água no Passado',
      description:
        'Use o braço mecânico do robô com cuidado para investigar pequenas esferas de ferro que se formaram quando Marte tinha água líquida.',
      accentColor: '#EF4444',
      startNodeId: '1.1',
      endingNumbers: [1, 2, 3],
    },
    {
      id: 'lakebed',
      number: 2,
      title: 'Caminho 2: O Antigo Rio Seco',
      focusBadge: 'Descoberta: Rios e Pedras',
      description:
        'Guie o robô pelo chão de areia fina e pelas pedras das margens para provar que antigas correntezas de água passaram por ali.',
      accentColor: '#38BDF8',
      startNodeId: '2.1',
      endingNumbers: [4, 5],
    },
    {
      id: 'crater',
      number: 3,
      title: 'Caminho 3: A Cratera e o Barro Subterrâneo',
      focusBadge: 'Descoberta: Condições para Vida',
      description:
        'Examine o solo branco de sal e cave a areia para descobrir se a água antiga de Marte era limpa e boa para abrigar vida simples.',
      accentColor: '#10B981',
      startNodeId: '3.1',
      endingNumbers: [6, 7],
    },
  ],
  nodes: {
    // =========================================================================
    // CAMINHO 1: O PAREDÃO DAS BOLINHAS DE FERRO (FOCO EM ÁGUA)
    // =========================================================================
    '1.1': {
      id: '1.1',
      pathId: 'hematite',
      stepNumber: 1,
      stepStageLabel: 'Passo 1: Como se aproximar da rocha',
      title: 'Passo 1.1: Chegando perto do paredão',
      narrative:
        'Você leva o robô até uma parede de rocha cheia de pequenas bolinhas escuras de ferro (apelidadas de "mirtilos"), que costumam surgir onde já existiu água. A bateria marca 18%.',
      environmentMood: 'normal',
      environmentBadge: 'Bateria em 18% · Alvo: Bolinhas de Ferro na Rocha',
      choices: [
        {
          code: 'A',
          label:
            'Esticar o braço mecânico bem na frente de uma bolinha da rocha para examiná-la de perto.',
          consequenceHint: 'Exige esforço do braço mecânico no frio · Avança para 1.2A',
          nextNodeId: '1.2A',
          telemetryDelta: {
            batteryDelta: -3,
            temperatureDeltaC: -4,
            scienceDataDeltaMb: 18,
          },
        },
        {
          code: 'B',
          label:
            'Usar o sensor de calor à distância para escanear toda a parede antes de encostar na pedra.',
          consequenceHint: 'Faz o computador do robô esquentar um pouco · Avança para 1.2B',
          nextNodeId: '1.2B',
          telemetryDelta: {
            batteryDelta: -2,
            temperatureDeltaC: 11,
            scienceDataDeltaMb: 24,
          },
        },
      ],
    },

    '1.2A': {
      id: '1.2A',
      pathId: 'hematite',
      stepNumber: 2,
      stepStageLabel: 'Passo 2: Usando as ferramentas e cuidando da bateria',
      title: 'Passo 1.2: Como lixar a superfície da rocha',
      subtitle: 'Você escolheu posicionar o braço mecânico de perto (1.2A)',
      narrative:
        'O braço do robô se estica fazendo um barulho metálico por causa do frio. Na ponta dele há uma pequena broca que serve para lixar a casca da pedra e ver o que tem dentro.',
      environmentMood: 'normal',
      environmentBadge: 'Braço posicionado · Broca pronta para uso',
      choices: [
        {
          code: 'A',
          label:
            'Ligar a broca na força máxima para lixar a pedra bem rápido (gasta mais bateria).',
          consequenceHint: 'Gasta mais energia (-6% bateria), mas abre um corte fundo · Avança para 1.3A',
          nextNodeId: '1.3A',
          telemetryDelta: {
            batteryDelta: -6,
            temperatureDeltaC: 4,
            scienceDataDeltaMb: 42,
          },
        },
        {
          code: 'B',
          label:
            'Ligar a broca bem devagar para poupar o motor antigo e economizar bateria.',
          consequenceHint: 'Gasta pouca energia (-3% bateria) e protege o motor · Avança para 1.3B',
          nextNodeId: '1.3B',
          telemetryDelta: {
            batteryDelta: -3,
            temperatureDeltaC: -2,
            scienceDataDeltaMb: 30,
          },
        },
      ],
    },

    '1.2B': {
      id: '1.2B',
      pathId: 'hematite',
      stepNumber: 2,
      stepStageLabel: 'Passo 2: Usando as ferramentas e cuidando da bateria',
      title: 'Passo 1.2: Cuidando do calor do computador',
      subtitle: 'Você escolheu escanear a parede à distância (1.2B)',
      narrative:
        'O sensor à distância encontra sinais claros de sais deixados por água antiga, mas o computador do robô começa a esquentar demais para processar tanta informação.',
      environmentMood: 'heat',
      environmentBadge: 'Computador Aquecendo · Sinais de Água Antiga Encontrados',
      choices: [
        {
          code: 'A',
          label:
            'Mudar a câmera para olhar a areia do chão e compará-la com a parede de pedra.',
          consequenceHint: 'Ajuda a esfriar o computador do robô · Avança para 1.3C',
          nextNodeId: '1.3C',
          telemetryDelta: {
            batteryDelta: -3,
            temperatureDeltaC: -9,
            scienceDataDeltaMb: 28,
          },
        },
        {
          code: 'B',
          label:
            'Continuar forçando o sensor para olhar fundo dentro da rachadura principal da rocha.',
          consequenceHint: 'Consome mais bateria, mas consegue imagens incríveis · Avança para 1.3B',
          nextNodeId: '1.3B',
          telemetryDelta: {
            batteryDelta: -5,
            temperatureDeltaC: 8,
            scienceDataDeltaMb: 45,
          },
        },
      ],
    },

    '1.3A': {
      id: '1.3A',
      pathId: 'hematite',
      stepNumber: 3,
      stepStageLabel: 'Passo 3: Enfrentando o clima de Marte',
      title: 'Passo 1.3: O vento traz poeira para os painéis',
      subtitle: 'Interior brilhante da rocha revelado pela broca (1.3A)',
      narrative:
        'A broca abriu a pedra e mostrou camadas formadas por água! Mas, de repente, uma rajada de vento joga poeira sobre os painéis solares do robô, fazendo a bateria perder mais 2%.',
      environmentMood: 'dust',
      environmentBadge: 'Vento com Poeira · Menos Luz nos Painéis (-2%)',
      choices: [
        {
          code: 'A',
          label:
            'Ligar o aquecedor interno para impedir que o frio congele a memória do computador.',
          consequenceHint: 'Protege a memória para o envio final · Avança para 1.4A',
          nextNodeId: '1.4A',
          telemetryDelta: {
            batteryDelta: -4,
            temperatureDeltaC: 10,
            scienceDataDeltaMb: 15,
          },
        },
        {
          code: 'B',
          label:
            'Desligar sistemas menos importantes e usar toda a energia que resta nas câmeras de análise.',
          consequenceHint: 'Garante a melhor leitura das rochas · Avança para 1.4B',
          nextNodeId: '1.4B',
          telemetryDelta: {
            batteryDelta: -2,
            temperatureDeltaC: -18,
            scienceDataDeltaMb: 36,
          },
        },
      ],
    },

    '1.3B': {
      id: '1.3B',
      pathId: 'hematite',
      stepNumber: 3,
      stepStageLabel: 'Passo 3: Enfrentando o clima de Marte',
      title: 'Passo 1.3: O vento traz poeira para os painéis',
      subtitle: 'Análise cuidadosa da rocha em andamento (1.3B)',
      narrative:
        'Enquanto os sensores confirmam marcas de água nas pedras, uma rajada de vento espalha poeira sobre os painéis solares, reduzindo a energia em mais 2%.',
      environmentMood: 'dust',
      environmentBadge: 'Vento com Poeira · Menos Luz nos Painéis (-2%)',
      choices: [
        {
          code: 'A',
          label:
            'Ligar o aquecedor interno para impedir que o frio congele a memória do computador.',
          consequenceHint: 'Mantém o computador seguro · Avança para 1.4A',
          nextNodeId: '1.4A',
          telemetryDelta: {
            batteryDelta: -4,
            temperatureDeltaC: 9,
            scienceDataDeltaMb: 16,
          },
        },
        {
          code: 'B',
          label:
            'Desligar sistemas menos importantes e usar toda a energia que resta nas câmeras de análise.',
          consequenceHint: 'Coleta ainda mais detalhes sobre a rocha · Avança para 1.4B',
          nextNodeId: '1.4B',
          telemetryDelta: {
            batteryDelta: -2,
            temperatureDeltaC: -16,
            scienceDataDeltaMb: 34,
          },
        },
      ],
    },

    '1.3C': {
      id: '1.3C',
      pathId: 'hematite',
      stepNumber: 3,
      stepStageLabel: 'Passo 3: Enfrentando o clima de Marte',
      title: 'Passo 1.3: O vento traz poeira para os painéis',
      subtitle: 'Comparação entre a areia e o paredão concluída (1.3C)',
      narrative:
        'A comparação entre a areia e a rocha mostra que este lugar já foi um lago raso! Nesse instante, um vento forte levanta poeira e faz a energia solar cair em 2%.',
      environmentMood: 'dust',
      environmentBadge: 'Vento com Poeira · Menos Luz nos Painéis (-2%)',
      choices: [
        {
          code: 'A',
          label:
            'Ligar o aquecedor interno para impedir que o frio congele a memória do computador.',
          consequenceHint: 'Mantém o computador aquecido para o fim · Avança para 1.4A',
          nextNodeId: '1.4A',
          telemetryDelta: {
            batteryDelta: -4,
            temperatureDeltaC: 9,
            scienceDataDeltaMb: 18,
          },
        },
        {
          code: 'B',
          label:
            'Desligar sistemas menos importantes e usar toda a energia que resta nas câmeras de análise.',
          consequenceHint: 'Foca toda a energia nas descobertas · Avança para 1.4B',
          nextNodeId: '1.4B',
          telemetryDelta: {
            batteryDelta: -2,
            temperatureDeltaC: -16,
            scienceDataDeltaMb: 35,
          },
        },
      ],
    },

    '1.4A': {
      id: '1.4A',
      pathId: 'hematite',
      stepNumber: 4,
      stepStageLabel: 'Passo 4: Como guardar ou enviar a descoberta',
      title: 'Passo 1.4: A Última Decisão no Paredão',
      subtitle: 'Computador aquecido · Últimos minutos de bateria (1.4A)',
      narrative:
        'Com a memória protegida do frio e pouquíssima bateria restante, você precisa escolher como deixar registrada essa grande prova de que Marte já teve água.',
      environmentMood: 'alert',
      environmentBadge: 'Bateria no Fim · Escolha Como Salvar a Descoberta',
      choices: [
        {
          code: 'A',
          label:
            'Reunir as provas sobre a água e enviar imediatamente pelo rádio principal em direção à Terra.',
          consequenceHint: 'Desbloqueia o FINAL 1: "O Eco no Deserto"',
          endingId: 'final_1',
          telemetryDelta: {
            batteryDelta: -5,
            scienceDataDeltaMb: 25,
          },
        },
        {
          code: 'B',
          label:
            'Gravar todos os detalhes do interior da rocha lixada na memória permanente do robô (que não apaga sem luz).',
          consequenceHint: 'Desbloqueia o FINAL 2: "Testemunha de Ferro"',
          endingId: 'final_2',
          telemetryDelta: {
            batteryDelta: -3,
            scienceDataDeltaMb: 30,
          },
        },
        {
          code: 'C',
          label:
            'Salvar o mapa de calor dos sais da água e deixar o robô entrar em repouso silencioso no frio.',
          consequenceHint: 'Desbloqueia o FINAL 3: "O Legado de Meridiani"',
          endingId: 'final_3',
          telemetryDelta: {
            batteryDelta: -1,
            temperatureTargetC: -78,
            scienceDataDeltaMb: 22,
          },
        },
      ],
    },

    '1.4B': {
      id: '1.4B',
      pathId: 'hematite',
      stepNumber: 4,
      stepStageLabel: 'Passo 4: Como guardar ou enviar a descoberta',
      title: 'Passo 1.4: A Última Decisão no Paredão',
      subtitle: 'Câmeras com imagens perfeitas · Frio intenso chegando (1.4B)',
      narrative:
        'As câmeras capturaram as imagens mais detalhadas da missão, mas o frio já está desligando os circuitos. Faça sua escolha final antes que a bateria acabe.',
      environmentMood: 'freeze',
      environmentBadge: 'Frio Intenso · Último Comando do Robô',
      choices: [
        {
          code: 'A',
          label:
            'Reunir as provas sobre a água e enviar imediatamente pelo rádio principal em direção à Terra.',
          consequenceHint: 'Desbloqueia o FINAL 1: "O Eco no Deserto"',
          endingId: 'final_1',
          telemetryDelta: {
            batteryDelta: -5,
            scienceDataDeltaMb: 25,
          },
        },
        {
          code: 'B',
          label:
            'Gravar todos os detalhes do interior da rocha lixada na memória permanente do robô (que não apaga sem luz).',
          consequenceHint: 'Desbloqueia o FINAL 2: "Testemunha de Ferro"',
          endingId: 'final_2',
          telemetryDelta: {
            batteryDelta: -3,
            scienceDataDeltaMb: 32,
          },
        },
        {
          code: 'C',
          label:
            'Salvar o mapa de calor dos sais da água e deixar o robô entrar em repouso silencioso no frio.',
          consequenceHint: 'Desbloqueia o FINAL 3: "O Legado de Meridiani"',
          endingId: 'final_3',
          telemetryDelta: {
            batteryDelta: -1,
            temperatureTargetC: -82,
            scienceDataDeltaMb: 28,
          },
        },
      ],
    },

    // =========================================================================
    // CAMINHO 2: O ANTIGO RIO SECO (FOCO EM RIOS E PEDRAS)
    // =========================================================================
    '2.1': {
      id: '2.1',
      pathId: 'lakebed',
      stepNumber: 1,
      stepStageLabel: 'Passo 1: Escolhendo por onde andar',
      title: 'Passo 2.1: A Trilha no Antigo Canal',
      narrative:
        'Você aponta a câmera do topo do robô para um longo caminho cheio de curvas que parece o fundo de um antigo rio seco. Ainda dá para ver as marquinhas de ondas na areia.',
      environmentMood: 'normal',
      environmentBadge: 'Câmera Principal Ativa · Bateria em 18% · Antigo Rio Seco',
      choices: [
        {
          code: 'A',
          label:
            'Entrar direto pelo meio do canal plano, onde as marcas de antigas ondas na areia são bem visíveis.',
          consequenceHint: 'Areia muito fofa, risco de as rodas patinarem · Avança para 2.2A',
          nextNodeId: '2.2A',
          telemetryDelta: {
            batteryDelta: -3,
            temperatureDeltaC: -3,
            scienceDataDeltaMb: 22,
          },
        },
        {
          code: 'B',
          label:
            'Ir pela beirada do canal, onde pedras maiores foram arrastadas pela água no passado.',
          consequenceHint: 'Chão mais duro e inclinado na margem · Avança para 2.2B',
          nextNodeId: '2.2B',
          telemetryDelta: {
            batteryDelta: -4,
            temperatureDeltaC: -2,
            scienceDataDeltaMb: 20,
          },
        },
      ],
    },

    '2.2A': {
      id: '2.2A',
      pathId: 'lakebed',
      stepNumber: 2,
      stepStageLabel: 'Passo 2: Usando as ferramentas e cuidando da bateria',
      title: 'Passo 2.2: Investigando o Fundo do Rio',
      subtitle: 'Você entrou pelo centro arenoso do canal (2.2A)',
      narrative:
        'As seis rodas afundam um pouco em uma areia fina como talco. Bem embaixo do robô estão as ondulações que a água formou há bilhões de anos.',
      environmentMood: 'normal',
      environmentBadge: 'Areia Fina como Talco · Cuidado com as Rodas',
      choices: [
        {
          code: 'A',
          label:
            'Usar a câmera de aumento (lupa) do braço para fotografar de pertinho os grãos de areia.',
          consequenceHint: 'Gasta pouca energia e tira fotos super nítidas · Avança para 2.3A',
          nextNodeId: '2.3A',
          telemetryDelta: {
            batteryDelta: -2,
            temperatureDeltaC: -4,
            scienceDataDeltaMb: 38,
          },
        },
        {
          code: 'B',
          label:
            'Tentar andar mais 2 metros para a frente em busca de pedrinhas arredondadas pela água.',
          consequenceHint: 'Exige mais força das rodas na areia · Avança para 2.3B',
          nextNodeId: '2.3B',
          telemetryDelta: {
            batteryDelta: -5,
            temperatureDeltaC: 3,
            scienceDataDeltaMb: 32,
          },
        },
      ],
    },

    '2.2B': {
      id: '2.2B',
      pathId: 'lakebed',
      stepNumber: 2,
      stepStageLabel: 'Passo 2: Usando as ferramentas e cuidando da bateria',
      title: 'Passo 2.2: Investigando a Margem de Pedras',
      subtitle: 'Você contornou pela beirada rochosa do canal (2.2B)',
      narrative:
        'As pedras maiores exigem bastante esforço das rodas do robô, mas deixam à mostra as camadas da margem que a água esculpiu no passado.',
      environmentMood: 'normal',
      environmentBadge: 'Terreno Inclinado · Marcas de Correnteza nas Pedras',
      choices: [
        {
          code: 'A',
          label:
            'Apontar o leitor de minerais para as camadas de pedra na beirada do canal.',
          consequenceHint: 'Mostra exatamente de que são feitas as camadas do rio · Avança para 2.3A',
          nextNodeId: '2.3A',
          telemetryDelta: {
            batteryDelta: -3,
            temperatureDeltaC: -5,
            scienceDataDeltaMb: 44,
          },
        },
        {
          code: 'B',
          label:
            'Subir um pequeno degrau de pedras para descobrir para qual lado a água do rio corria.',
          consequenceHint: 'Força o motor da roda dianteira direita · Avança para 2.3B',
          nextNodeId: '2.3B',
          telemetryDelta: {
            batteryDelta: -5,
            temperatureDeltaC: 4,
            scienceDataDeltaMb: 40,
          },
        },
      ],
    },

    '2.3A': {
      id: '2.3A',
      pathId: 'lakebed',
      stepNumber: 3,
      stepStageLabel: 'Passo 3: Enfrentando um problema mecânico',
      title: 'Passo 2.3: Problema na Roda da Frente',
      subtitle: 'Fotos dos grãos e camadas registradas com sucesso (2.3A)',
      narrative:
        'Ao virar o robô para apontar a antena para o céu, a roda dianteira direita (que já estava meio travada pelo tempo de uso) prende no chão duro e puxa muita energia da bateria.',
      environmentMood: 'alert',
      environmentBadge: 'Alerta nas Rodas · Roda Dianteira Direita Presa',
      choices: [
        {
          code: 'A',
          label:
            'Dar uma pequena marcha à ré automática para soltar a roda presa sem forçar o motor.',
          consequenceHint: 'Alivia o peso sobre a roda danificada · Avança para 2.4A',
          nextNodeId: '2.4A',
          telemetryDelta: {
            batteryDelta: -4,
            temperatureDeltaC: -6,
            scienceDataDeltaMb: 18,
          },
        },
        {
          code: 'B',
          label:
            'Deixar a roda travada como apoio e usar só as outras cinco rodas para firmar o robô no lugar.',
          consequenceHint: 'Firma o robô em uma posição segura para transmitir · Avança para 2.4B',
          nextNodeId: '2.4B',
          telemetryDelta: {
            batteryDelta: -3,
            temperatureDeltaC: -8,
            scienceDataDeltaMb: 24,
          },
        },
      ],
    },

    '2.3B': {
      id: '2.3B',
      pathId: 'lakebed',
      stepNumber: 3,
      stepStageLabel: 'Passo 3: Enfrentando um problema mecânico',
      title: 'Passo 2.3: Problema na Roda da Frente',
      subtitle: 'Pedrinhas arredondadas pela água encontradas (2.3B)',
      narrative:
        'O avanço mostrou pedrinhas lisinhas e redondas, iguais às de rios da Terra! Porém, a roda dianteira direita prende contra uma pedra e começa a gastar energia demais.',
      environmentMood: 'alert',
      environmentBadge: 'Alerta nas Rodas · Esforço Alto na Roda da Frente',
      choices: [
        {
          code: 'A',
          label:
            'Dar uma pequena marcha à ré automática para soltar a roda presa sem forçar o motor.',
          consequenceHint: 'Deixa o robô nivelado e seguro · Avança para 2.4A',
          nextNodeId: '2.4A',
          telemetryDelta: {
            batteryDelta: -4,
            temperatureDeltaC: -6,
            scienceDataDeltaMb: 20,
          },
        },
        {
          code: 'B',
          label:
            'Deixar a roda travada como apoio e usar só as outras cinco rodas para firmar o robô no lugar.',
          consequenceHint: 'Prepara a câmera para a foto final do rio · Avança para 2.4B',
          nextNodeId: '2.4B',
          telemetryDelta: {
            batteryDelta: -3,
            temperatureDeltaC: -8,
            scienceDataDeltaMb: 26,
          },
        },
      ],
    },

    '2.4A': {
      id: '2.4A',
      pathId: 'lakebed',
      stepNumber: 4,
      stepStageLabel: 'Passo 4: Como guardar ou enviar a descoberta',
      title: 'Passo 2.4: O Mapa Final do Antigo Rio',
      subtitle: 'Robô nivelado após a marcha à ré (2.4A)',
      narrative:
        'Com a roda destravada e o mapa completo do antigo rio pronto no computador, a bateria chega ao fim. Como você quer eternizar essa descoberta?',
      environmentMood: 'dust',
      environmentBadge: 'Bateria no Limite · Decisão Final no Canal',
      choices: [
        {
          code: 'A',
          label:
            'Juntar todo o mapa do rio antigo e deixá-lo salvo na memória de segurança do robô.',
          consequenceHint: 'Desbloqueia o FINAL 4: "O Arquivista dos Mundos"',
          endingId: 'final_4',
          telemetryDelta: {
            batteryDelta: -3,
            scienceDataDeltaMb: 34,
          },
        },
        {
          code: 'B',
          label:
            'Enviar a foto panorâmica do rio antigo pelo rádio para as sondas que passam no céu de Marte.',
          consequenceHint: 'Desbloqueia o FINAL 5: "A Corrente Eterna"',
          endingId: 'final_5',
          telemetryDelta: {
            batteryDelta: -5,
            scienceDataDeltaMb: 30,
          },
        },
      ],
    },

    '2.4B': {
      id: '2.4B',
      pathId: 'lakebed',
      stepNumber: 4,
      stepStageLabel: 'Passo 4: Como guardar ou enviar a descoberta',
      title: 'Passo 2.4: O Mapa Final do Antigo Rio',
      subtitle: 'Robô firme como um guardião no leito do rio (2.4B)',
      narrative:
        'Parado no meio do antigo canal, o Opportunity olha para o caminho por onde as águas correram bilhões de anos atrás. Escolha o último comando.',
      environmentMood: 'dust',
      environmentBadge: 'Guardião do Rio Seco · Último Comando',
      choices: [
        {
          code: 'A',
          label:
            'Juntar todo o mapa do rio antigo e deixá-lo salvo na memória de segurança do robô.',
          consequenceHint: 'Desbloqueia o FINAL 4: "O Arquivista dos Mundos"',
          endingId: 'final_4',
          telemetryDelta: {
            batteryDelta: -3,
            scienceDataDeltaMb: 36,
          },
        },
        {
          code: 'B',
          label:
            'Enviar a foto panorâmica do rio antigo pelo rádio para as sondas que passam no céu de Marte.',
          consequenceHint: 'Desbloqueia o FINAL 5: "A Corrente Eterna"',
          endingId: 'final_5',
          telemetryDelta: {
            batteryDelta: -5,
            scienceDataDeltaMb: 32,
          },
        },
      ],
    },

    // =========================================================================
    // CAMINHO 3: A CRATERA E O BARRO SUBTERRÂNEO (FOCO EM CONDIÇÕES PARA VIDA)
    // =========================================================================
    '3.1': {
      id: '3.1',
      pathId: 'crater',
      stepNumber: 1,
      stepStageLabel: 'Passo 1: O que investigar primeiro na cratera',
      title: 'Passo 3.1: A Cratera com Manchas de Sal',
      narrative:
        'Você leva o robô até uma cratera rasa onde o chão tem manchas brancas e amareladas de sal — deixadas quando uma antiga lagoa secou. Se já houve vida microscópica aqui, as pistas estão no chão.',
      environmentMood: 'normal',
      environmentBadge: 'Cratera Rasa · Marcas de Sal de Antiga Lagoa',
      choices: [
        {
          code: 'A',
          label:
            'Usar os sensores do braço para medir se essa água antiga era muito ácida ou salgada.',
          consequenceHint: 'Examina a camada branca da superfície · Avança para 3.2A',
          nextNodeId: '3.2A',
          telemetryDelta: {
            batteryDelta: -3,
            temperatureDeltaC: -5,
            scienceDataDeltaMb: 26,
          },
        },
        {
          code: 'B',
          label:
            'Girar uma roda traseira para cavar um pouco a poeira e ver a terra escondida logo abaixo.',
          consequenceHint: 'Abre uma pequena vala no chão · Avança para 3.2B',
          nextNodeId: '3.2B',
          telemetryDelta: {
            batteryDelta: -4,
            temperatureDeltaC: -3,
            scienceDataDeltaMb: 24,
          },
        },
      ],
    },

    '3.2A': {
      id: '3.2A',
      pathId: 'crater',
      stepNumber: 2,
      stepStageLabel: 'Passo 2: Usando as ferramentas e cuidando da bateria',
      title: 'Passo 3.2: Testando a Acidez da Água Antiga',
      subtitle: 'Você escolheu medir os sais da superfície (3.2A)',
      narrative:
        'Os sensores mostram que, quando essa lagoa estava secando, a água ficou bastante ácida (parecida com água com vinagre ou limão). Você precisa descobrir se micróbios resistentes conseguiriam viver ali.',
      environmentMood: 'normal',
      environmentBadge: 'Água Antiga Ácida Detectada · Testando Habitabilidade',
      choices: [
        {
          code: 'A',
          label:
            'Calcular no computador se a luz forte do Sol deixaria algum micróbio sobreviver nessa água.',
          consequenceHint: 'Usa o computador para simular o ambiente antigo · Avança para 3.3A',
          nextNodeId: '3.3A',
          telemetryDelta: {
            batteryDelta: -4,
            temperatureDeltaC: -8,
            scienceDataDeltaMb: 40,
          },
        },
        {
          code: 'B',
          label:
            'Fazer um segundo teste cuidadoso no solo para confirmar que não há substâncias venenosas para a vida.',
          consequenceHint: 'Confirma a qualidade química do solo · Avança para 3.3B',
          nextNodeId: '3.3B',
          telemetryDelta: {
            batteryDelta: -3,
            temperatureDeltaC: -10,
            scienceDataDeltaMb: 36,
          },
        },
      ],
    },

    '3.2B': {
      id: '3.2B',
      pathId: 'crater',
      stepNumber: 2,
      stepStageLabel: 'Passo 2: Usando as ferramentas e cuidando da bateria',
      title: 'Passo 3.2: A Descoberta do Barro de Água Doce',
      subtitle: 'Você escolheu cavar a areia com a roda traseira (3.2B)',
      narrative:
        'Ao cavar a poeira vermelha, a roda revela um barro cinzento (argila) que estava escondido do Sol há bilhões de anos! Esse tipo de argila só se forma quando existe água doce e calma.',
      environmentMood: 'normal',
      environmentBadge: 'Grande Descoberta · Argila de Água Doce Encontrada!',
      choices: [
        {
          code: 'A',
          label:
            'Apontar o sensor para o barro cinzento e confirmar se aquela água antiga era pura e sem acidez.',
          consequenceHint: 'Comprova que Marte teve água doce e suave · Avança para 3.3B',
          nextNodeId: '3.3B',
          telemetryDelta: {
            batteryDelta: -3,
            temperatureDeltaC: -9,
            scienceDataDeltaMb: 48,
          },
        },
        {
          code: 'B',
          label:
            'Encostar o braço na vala aberta para comparar a terra funda de água doce com o sal da superfície.',
          consequenceHint: 'Mostra como o clima de Marte mudou com o tempo · Avança para 3.3A',
          nextNodeId: '3.3A',
          telemetryDelta: {
            batteryDelta: -4,
            temperatureDeltaC: -11,
            scienceDataDeltaMb: 45,
          },
        },
      ],
    },

    '3.3A': {
      id: '3.3A',
      pathId: 'crater',
      stepNumber: 3,
      stepStageLabel: 'Passo 3: Enfrentando o frio extremo da noite',
      title: 'Passo 3.3: A Noite Congelante (-85°C)',
      subtitle: 'Testes do solo concluídos ao anoitecer (3.3A)',
      narrative:
        'A noite chega rápido em Marte e a temperatura despenca para congelantes -85°C! A energia da bateria começa a falhar por causa do frio intenso.',
      environmentMood: 'freeze',
      environmentBadge: 'Frio Extremo · Temperatura Caiu para -85°C',
      choices: [
        {
          code: 'A',
          label:
            'Ligar o modo de economia total: desligar o rádio agora para manter a memória aquecida.',
          consequenceHint: 'Protege os dados guardados no computador · Avança para 3.4A',
          nextNodeId: '3.4A',
          telemetryDelta: {
            batteryDelta: -3,
            temperatureTargetC: -68,
            scienceDataDeltaMb: 18,
          },
        },
        {
          code: 'B',
          label:
            'Tentar mandar um pacote rápido de rádio com os dados de vida antes que o frio congele o robô.',
          consequenceHint: 'Envio urgente sob frio de -85°C · Avança para 3.4B',
          nextNodeId: '3.4B',
          telemetryDelta: {
            batteryDelta: -5,
            temperatureTargetC: -85,
            scienceDataDeltaMb: 24,
          },
        },
      ],
    },

    '3.3B': {
      id: '3.3B',
      pathId: 'crater',
      stepNumber: 3,
      stepStageLabel: 'Passo 3: Enfrentando o frio extremo da noite',
      title: 'Passo 3.3: A Noite Congelante (-85°C)',
      subtitle: 'Provas de água limpa registradas na cratera (3.3B)',
      narrative:
        'Logo após confirmar que o barro subterrâneo se formou em água limpa, a noite marciana derruba a temperatura para -85°C. A bateria começa a oscilar.',
      environmentMood: 'freeze',
      environmentBadge: 'Frio Extremo · Temperatura Caiu para -85°C',
      choices: [
        {
          code: 'A',
          label:
            'Ligar o modo de economia total: desligar o rádio agora para manter a memória aquecida.',
          consequenceHint: 'Salva os arquivos sobre água doce na memória · Avança para 3.4A',
          nextNodeId: '3.4A',
          telemetryDelta: {
            batteryDelta: -3,
            temperatureTargetC: -68,
            scienceDataDeltaMb: 20,
          },
        },
        {
          code: 'B',
          label:
            'Tentar mandar um pacote rápido de rádio com os dados de vida antes que o frio congele o robô.',
          consequenceHint: 'Dispara o aviso da descoberta pelo rádio · Avança para 3.4B',
          nextNodeId: '3.4B',
          telemetryDelta: {
            batteryDelta: -5,
            temperatureTargetC: -85,
            scienceDataDeltaMb: 26,
          },
        },
      ],
    },

    '3.4A': {
      id: '3.4A',
      pathId: 'crater',
      stepNumber: 4,
      stepStageLabel: 'Passo 4: A conclusão sobre a vida em Marte',
      title: 'Passo 3.4: O Veredito sobre a Vida',
      subtitle: 'Memória protegida no silêncio da noite marciana (3.4A)',
      narrative:
        'No silêncio gelado de -85°C, o computador organiza a conclusão final da missão. Qual grande resposta sobre a possibilidade de vida antiga em Marte você vai registrar?',
      environmentMood: 'freeze',
      environmentBadge: 'Conclusão Final · Marte Pôde Abrigar Vida?',
      choices: [
        {
          code: 'A',
          label:
            'Registrar que as lagoas salgadas eram difíceis, mas podiam abrigar micróbios super-resistentes.',
          consequenceHint: 'Desbloqueia o FINAL 6: "O Limite da Vida"',
          endingId: 'final_6',
          telemetryDelta: {
            batteryDelta: -3,
            scienceDataDeltaMb: 32,
          },
        },
        {
          code: 'B',
          label:
            'Juntar a descoberta do barro subterrâneo para provar que Marte já teve água doce e acolhedora para a vida.',
          consequenceHint: 'Desbloqueia o FINAL 7: "A Promessa de Água Doce"',
          endingId: 'final_7',
          telemetryDelta: {
            batteryDelta: -4,
            scienceDataDeltaMb: 38,
          },
        },
      ],
    },

    '3.4B': {
      id: '3.4B',
      pathId: 'crater',
      stepNumber: 4,
      stepStageLabel: 'Passo 4: A conclusão sobre a vida em Marte',
      title: 'Passo 3.4: O Veredito sobre a Vida',
      subtitle: 'Último pulso de energia a -85°C (3.4B)',
      narrative:
        'Com o robô prestes a adormecer pelo frio intenso de -85°C, resta energia para uma única conclusão sobre a antiga água da cratera.',
      environmentMood: 'freeze',
      environmentBadge: 'Último Pulso a -85°C · Veredito Final',
      choices: [
        {
          code: 'A',
          label:
            'Registrar que as lagoas salgadas eram difíceis, mas podiam abrigar micróbios super-resistentes.',
          consequenceHint: 'Desbloqueia o FINAL 6: "O Limite da Vida"',
          endingId: 'final_6',
          telemetryDelta: {
            batteryDelta: -3,
            scienceDataDeltaMb: 34,
          },
        },
        {
          code: 'B',
          label:
            'Juntar a descoberta do barro subterrâneo para provar que Marte já teve água doce e acolhedora para a vida.',
          consequenceHint: 'Desbloqueia o FINAL 7: "A Promessa de Água Doce"',
          endingId: 'final_7',
          telemetryDelta: {
            batteryDelta: -4,
            scienceDataDeltaMb: 42,
          },
        },
      ],
    },
  },

  endingOrder: [
    'final_1',
    'final_2',
    'final_3',
    'final_4',
    'final_5',
    'final_6',
    'final_7',
  ],

  endings: {
    final_1: {
      id: 'final_1',
      number: 1,
      pathId: 'hematite',
      pathTitle: 'Caminho 1: O Paredão das Bolinhas de Ferro',
      title: 'O Eco no Deserto',
      subtitle: 'Prova de água abundante enviada para o espaço',
      epilogue:
        'A antena do Opportunity dispara um último sinal de rádio atravessando o céu carregado de poeira. A mensagem leva a prova definitiva de que aquelas pequenas bolinhas de ferro nasceram dentro de muita água líquida no passado de Marte. Antes de suas luzes se apagarem, o robô cumpre sua missão de contar essa história para a Terra.',
      scientificVerdict:
        'Comprovado: as pequenas esferas de ferro se formaram com ajuda de água líquida abundante no passado de Marte.',
      accentColor: '#EF4444',
    },
    final_2: {
      id: 'final_2',
      number: 2,
      pathId: 'hematite',
      pathTitle: 'Caminho 1: O Paredão das Bolinhas de Ferro',
      title: 'Testemunha de Ferro',
      subtitle: 'O segredo das rochas guardado como uma cápsula do tempo',
      epilogue:
        'Como a tempestade dificultava o sinal de rádio, o Opportunity gravou todas as imagens do interior da rocha lixada em sua memória permanente — que funciona como um cartão de memória que não apaga mesmo sem bateria. O robô se torna uma verdadeira cápsula do tempo esperando os futuros astronautas em Marte.',
      scientificVerdict:
        'Comprovado: o interior das bolinhas de ferro foi registrado e salvo permanentemente na memória do robô.',
      accentColor: '#F97316',
    },
    final_3: {
      id: 'final_3',
      number: 3,
      pathId: 'hematite',
      pathTitle: 'Caminho 1: O Paredão das Bolinhas de Ferro',
      title: 'O Legado de Meridiani',
      subtitle: 'Um monumento silencioso na planície vermelha',
      epilogue:
        'Após guardar o mapa completo dos sais deixados pela água, o Opportunity adormece em paz depois de quase 15 anos de trabalho (muito além dos 3 meses planejados). Seu braço mecânico permanece estendido diante da rocha como um monumento à curiosidade humana.',
      scientificVerdict:
        'Comprovado: o paredão rochoso guarda marcas claras de antigos lençóis de água em Marte.',
      accentColor: '#F59E0B',
    },
    final_4: {
      id: 'final_4',
      number: 4,
      pathId: 'lakebed',
      pathTitle: 'Caminho 2: O Antigo Rio Seco',
      title: 'O Arquivista dos Mundos',
      subtitle: 'O livro de história de como os rios de Marte secaram',
      epilogue:
        'Guardado na memória de segurança do robô, o mapa das camadas de areia e pedras conta, passo a passo, como os antigos rios de Marte foram secando ao longo de milhões de anos. O Opportunity descansa no canal como o grande contador da história do planeta.',
      scientificVerdict:
        'Comprovado: as camadas de areia e pedras revelam como o clima de Marte mudou de úmido para deserto.',
      accentColor: '#38BDF8',
    },
    final_5: {
      id: 'final_5',
      number: 5,
      pathId: 'lakebed',
      pathTitle: 'Caminho 2: O Antigo Rio Seco',
      title: 'A Corrente Eterna',
      subtitle: 'Fotos de antigas correntezas enviadas antes da bateria acabar',
      epilogue:
        'Com sua última gota de bateria, o Opportunity envia para as sondas no céu de Marte a imagem das ondulações na areia e das pedrinhas arredondadas pela água. Graças a ele, a humanidade pôde ver onde rios de verdade correram no Planeta Vermelho.',
      scientificVerdict:
        'Comprovado: ondas na areia e pedras arredondadas confirmam antigas correntezas de água na superfície.',
      accentColor: '#0EA5E9',
    },
    final_6: {
      id: 'final_6',
      number: 6,
      pathId: 'crater',
      pathTitle: 'Caminho 3: A Cratera e o Barro Subterrâneo',
      title: 'O Limite da Vida',
      subtitle: 'Um ambiente difícil, mas possível para micróbios resistentes',
      epilogue:
        'Sob o frio de -85°C, o Opportunity deixa registrada sua descoberta: mesmo quando as antigas lagoas de Marte estavam ficando salgadas e ácidas, elas ainda pareciam com lugares da Terra onde micróbios super-resistentes conseguem viver.',
      scientificVerdict:
        'Comprovado: as antigas lagoas salgadas de Marte tinham condições parecidas com ambientes habitáveis por micróbios resistentes na Terra.',
      accentColor: '#10B981',
    },
    final_7: {
      id: 'final_7',
      number: 7,
      pathId: 'crater',
      pathTitle: 'Caminho 3: A Cratera e o Barro Subterrâneo',
      title: 'A Promessa de Água Doce',
      subtitle: 'A descoberta de que Marte já teve água limpa e acolhedora',
      epilogue:
        'Ao comparar o barro cinzento escondido debaixo da terra com o sal da superfície, o Opportunity revela uma notícia incrível: muito antes de virar um deserto ácido, Marte teve lagos de água doce e calma — o lugar perfeito para a vida começar.',
      scientificVerdict:
        'Comprovado: o barro antigo encontrado abaixo da poeira se formou em água doce, limpa e favorável à vida.',
      accentColor: '#34D399',
    },
  },
};

export const OPPORTUNITY_MISSION_EN: MissionDefinition = {
  ...OPPORTUNITY_MISSION_PT,
  title: 'Opportunity – The Deep Journey',
  subtitle: 'The Explorer Robot’s Final Days on Mars',
  missionBadge: 'OPPORTUNITY ROVER · NASA',
  locationLabel: 'Meridiani Planum, Mars',
  yearLabel: '2004 – 2018 (Nearly 15 years on Mars)',
  introBriefing:
    'The Martian sky is growing dark from a massive dust storm. Opportunity’s battery is down to 18% and its parts have worked for nearly 15 years. You are in command to guide its final discovery about ancient water on Mars in 4 simple steps.',
  paths: [
    {
      id: 'hematite',
      number: 1,
      title: 'Path 1: The Wall of Iron Spheres',
      focusBadge: 'Discovery: Ancient Water',
      description:
        'Carefully use the robot’s mechanical arm to inspect tiny iron balls that formed when liquid water existed on Mars.',
      accentColor: '#EF4444',
      startNodeId: '1.1',
      endingNumbers: [1, 2, 3],
    },
    {
      id: 'lakebed',
      number: 2,
      title: 'Path 2: The Ancient Dry Riverbed',
      focusBadge: 'Discovery: Rivers & Rocks',
      description:
        'Drive the rover across fine sand and rocky banks to prove that ancient water currents once flowed through this channel.',
      accentColor: '#38BDF8',
      startNodeId: '2.1',
      endingNumbers: [4, 5],
    },
    {
      id: 'crater',
      number: 3,
      title: 'Path 3: The Crater & Underground Clay',
      focusBadge: 'Discovery: Conditions for Life',
      description:
        'Examine white salt deposits and dig beneath the red dust to find out if ancient Martian water was gentle enough for simple life.',
      accentColor: '#10B981',
      startNodeId: '3.1',
      endingNumbers: [6, 7],
    },
  ],
  nodes: {
    '1.1': {
      id: '1.1',
      pathId: 'hematite',
      stepNumber: 1,
      stepStageLabel: 'Step 1: How to approach the rock wall',
      title: 'Step 1.1: Approaching the Rock Wall',
      narrative:
        'You steer the rover toward a rock wall dotted with tiny dark iron spheres (nicknamed "blueberries"), which usually form where water once flowed. The battery reads 18%.',
      environmentMood: 'normal',
      environmentBadge: 'Battery at 18% · Target: Iron Spheres in the Rock',
      choices: [
        {
          code: 'A',
          label:
            'Reach out with the mechanical arm right in front of an iron sphere for a close-up look.',
          consequenceHint: 'Makes the cold arm motors work hard · Advances to 1.2A',
          nextNodeId: '1.2A',
          telemetryDelta: { batteryDelta: -3, temperatureDeltaC: -4, scienceDataDeltaMb: 18 },
        },
        {
          code: 'B',
          label:
            'Use the long-range heat sensor to scan the whole rock wall before touching it.',
          consequenceHint: 'Warms up the onboard computer · Advances to 1.2B',
          nextNodeId: '1.2B',
          telemetryDelta: { batteryDelta: -2, temperatureDeltaC: 11, scienceDataDeltaMb: 24 },
        },
      ],
    },
    '1.2A': {
      id: '1.2A',
      pathId: 'hematite',
      stepNumber: 2,
      stepStageLabel: 'Step 2: Using tools & managing battery',
      title: 'Step 1.2: Polishing the Rock Surface',
      subtitle: 'You positioned the mechanical arm for a close-up (1.2A)',
      narrative:
        'The robotic arm stretches out with a metallic creak in the cold. At its tip is a small rock-polishing drill designed to grind away the outer crust and see what lies inside.',
      environmentMood: 'normal',
      environmentBadge: 'Arm Positioned · Rock Drill Ready',
      choices: [
        {
          code: 'A',
          label:
            'Run the drill at full speed to grind the rock quickly (uses more battery).',
          consequenceHint: 'Uses more power (-6% battery) for a deep cut · Advances to 1.3A',
          nextNodeId: '1.3A',
          telemetryDelta: { batteryDelta: -6, temperatureDeltaC: 4, scienceDataDeltaMb: 42 },
        },
        {
          code: 'B',
          label:
            'Spin the drill slowly and gently to protect the aging motor and save battery.',
          consequenceHint: 'Uses less power (-3% battery) and spares the motor · Advances to 1.3B',
          nextNodeId: '1.3B',
          telemetryDelta: { batteryDelta: -3, temperatureDeltaC: -2, scienceDataDeltaMb: 30 },
        },
      ],
    },
    '1.2B': {
      id: '1.2B',
      pathId: 'hematite',
      stepNumber: 2,
      stepStageLabel: 'Step 2: Using tools & managing battery',
      title: 'Step 1.2: Managing Computer Heat',
      subtitle: 'You scanned the wall from a distance (1.2B)',
      narrative:
        'The heat sensor spots clear signs of water-left salts around the spheres, but the rover’s main computer is getting too warm while processing all that data.',
      environmentMood: 'heat',
      environmentBadge: 'Computer Warming Up · Signs of Ancient Water Found',
      choices: [
        {
          code: 'A',
          label:
            'Point the sensor down at the sandy ground to compare it with the rock wall.',
          consequenceHint: 'Lets the computer cool down safely · Advances to 1.3C',
          nextNodeId: '1.3C',
          telemetryDelta: { batteryDelta: -3, temperatureDeltaC: -9, scienceDataDeltaMb: 28 },
        },
        {
          code: 'B',
          label:
            'Keep pushing the sensor to scan deep inside the main crack in the rock.',
          consequenceHint: 'Uses extra power for high-detail readings · Advances to 1.3B',
          nextNodeId: '1.3B',
          telemetryDelta: { batteryDelta: -5, temperatureDeltaC: 8, scienceDataDeltaMb: 45 },
        },
      ],
    },
    '1.3A': {
      id: '1.3A',
      pathId: 'hematite',
      stepNumber: 3,
      stepStageLabel: 'Step 3: Facing the Martian weather',
      title: 'Step 1.3: Wind Blows Dust onto the Panels',
      subtitle: 'Inside of the iron sphere exposed by the drill (1.3A)',
      narrative:
        'The drill cut open the sphere and revealed rings formed by liquid water! Suddenly, a gust of Martian wind blows dust across the solar panels, dropping solar power by another 2%.',
      environmentMood: 'dust',
      environmentBadge: 'Dusty Wind Gust · Solar Power Drops (-2%)',
      choices: [
        {
          code: 'A',
          label:
            'Turn on the internal heater so the extreme cold doesn’t freeze the computer memory.',
          consequenceHint: 'Protects memory chips for the final step · Advances to 1.4A',
          nextNodeId: '1.4A',
          telemetryDelta: { batteryDelta: -4, temperatureDeltaC: 10, scienceDataDeltaMb: 15 },
        },
        {
          code: 'B',
          label:
            'Turn off secondary systems and send all remaining battery power to the analysis cameras.',
          consequenceHint: 'Maximizes the final rock reading · Advances to 1.4B',
          nextNodeId: '1.4B',
          telemetryDelta: { batteryDelta: -2, temperatureDeltaC: -18, scienceDataDeltaMb: 36 },
        },
      ],
    },
    '1.3B': {
      id: '1.3B',
      pathId: 'hematite',
      stepNumber: 3,
      stepStageLabel: 'Step 3: Facing the Martian weather',
      title: 'Step 1.3: Wind Blows Dust onto the Panels',
      subtitle: 'Detailed rock scan in progress (1.3B)',
      narrative:
        'While the sensors confirm water marks inside the rock, a sudden gust of wind coats the solar panels with dust, cutting power by 2%.',
      environmentMood: 'dust',
      environmentBadge: 'Dusty Wind Gust · Solar Power Drops (-2%)',
      choices: [
        {
          code: 'A',
          label:
            'Turn on the internal heater so the extreme cold doesn’t freeze the computer memory.',
          consequenceHint: 'Keeps the computer safe · Advances to 1.4A',
          nextNodeId: '1.4A',
          telemetryDelta: { batteryDelta: -4, temperatureDeltaC: 9, scienceDataDeltaMb: 16 },
        },
        {
          code: 'B',
          label:
            'Turn off secondary systems and send all remaining battery power to the analysis cameras.',
          consequenceHint: 'Captures extra rock details · Advances to 1.4B',
          nextNodeId: '1.4B',
          telemetryDelta: { batteryDelta: -2, temperatureDeltaC: -16, scienceDataDeltaMb: 34 },
        },
      ],
    },
    '1.3C': {
      id: '1.3C',
      pathId: 'hematite',
      stepNumber: 3,
      stepStageLabel: 'Step 3: Facing the Martian weather',
      title: 'Step 1.3: Wind Blows Dust onto the Panels',
      subtitle: 'Sand and rock comparison complete (1.3C)',
      narrative:
        'Comparing the sand and the rock proves this area was once a shallow lake! Just then, a gust of wind kicks up dust and reduces solar power by 2%.',
      environmentMood: 'dust',
      environmentBadge: 'Dusty Wind Gust · Solar Power Drops (-2%)',
      choices: [
        {
          code: 'A',
          label:
            'Turn on the internal heater so the extreme cold doesn’t freeze the computer memory.',
          consequenceHint: 'Keeps the processor warm · Advances to 1.4A',
          nextNodeId: '1.4A',
          telemetryDelta: { batteryDelta: -4, temperatureDeltaC: 9, scienceDataDeltaMb: 18 },
        },
        {
          code: 'B',
          label:
            'Turn off secondary systems and send all remaining battery power to the analysis cameras.',
          consequenceHint: 'Focuses all remaining power on science · Advances to 1.4B',
          nextNodeId: '1.4B',
          telemetryDelta: { batteryDelta: -2, temperatureDeltaC: -16, scienceDataDeltaMb: 35 },
        },
      ],
    },
    '1.4A': {
      id: '1.4A',
      pathId: 'hematite',
      stepNumber: 4,
      stepStageLabel: 'Step 4: How to save or send the discovery',
      title: 'Step 1.4: The Final Decision at the Wall',
      subtitle: 'Computer kept warm · Last minutes of battery (1.4A)',
      narrative:
        'With the memory protected from the cold and only a sliver of battery left, choose how to preserve this proof that Mars once had liquid water.',
      environmentMood: 'alert',
      environmentBadge: 'Critical Battery · Choose How to Save the Discovery',
      choices: [
        {
          code: 'A',
          label:
            'Package the water proof and beam it immediately through the main radio antenna toward Earth.',
          consequenceHint: 'Unlocks ENDING 1: "Echo in the Desert"',
          endingId: 'final_1',
          telemetryDelta: { batteryDelta: -5, scienceDataDeltaMb: 25 },
        },
        {
          code: 'B',
          label:
            'Save every detail of the polished rock inside the rover’s permanent memory (which keeps data even without power).',
          consequenceHint: 'Unlocks ENDING 2: "Iron Witness"',
          endingId: 'final_2',
          telemetryDelta: { batteryDelta: -3, scienceDataDeltaMb: 30 },
        },
        {
          code: 'C',
          label:
            'Store the heat map of the water salts and let the rover enter a peaceful sleep in the cold.',
          consequenceHint: 'Unlocks ENDING 3: "Legacy of Meridiani"',
          endingId: 'final_3',
          telemetryDelta: { batteryDelta: -1, temperatureTargetC: -78, scienceDataDeltaMb: 22 },
        },
      ],
    },
    '1.4B': {
      id: '1.4B',
      pathId: 'hematite',
      stepNumber: 4,
      stepStageLabel: 'Step 4: How to save or send the discovery',
      title: 'Step 1.4: The Final Decision at the Wall',
      subtitle: 'Crystal-clear camera data · Freezing cold setting in (1.4B)',
      narrative:
        'The cameras captured the clearest rock data of the mission, but freezing cold is reaching the circuit board. Make your final choice before power runs out.',
      environmentMood: 'freeze',
      environmentBadge: 'Freezing Cold · Final Rover Command',
      choices: [
        {
          code: 'A',
          label:
            'Package the water proof and beam it immediately through the main radio antenna toward Earth.',
          consequenceHint: 'Unlocks ENDING 1: "Echo in the Desert"',
          endingId: 'final_1',
          telemetryDelta: { batteryDelta: -5, scienceDataDeltaMb: 25 },
        },
        {
          code: 'B',
          label:
            'Save every detail of the polished rock inside the rover’s permanent memory (which keeps data even without power).',
          consequenceHint: 'Unlocks ENDING 2: "Iron Witness"',
          endingId: 'final_2',
          telemetryDelta: { batteryDelta: -3, scienceDataDeltaMb: 32 },
        },
        {
          code: 'C',
          label:
            'Store the heat map of the water salts and let the rover enter a peaceful sleep in the cold.',
          consequenceHint: 'Unlocks ENDING 3: "Legacy of Meridiani"',
          endingId: 'final_3',
          telemetryDelta: { batteryDelta: -1, temperatureTargetC: -82, scienceDataDeltaMb: 28 },
        },
      ],
    },
    '2.1': {
      id: '2.1',
      pathId: 'lakebed',
      stepNumber: 1,
      stepStageLabel: 'Step 1: Choosing where to drive',
      title: 'Step 2.1: Choosing the Trail in the Channel',
      narrative:
        'You point the top camera toward a winding channel that looks like an ancient dry riverbed. Fossilized water ripples are still visible in the ground.',
      environmentMood: 'normal',
      environmentBadge: 'Top Camera Active · Battery at 18% · Dry Riverbed',
      choices: [
        {
          code: 'A',
          label:
            'Drive straight into the flat middle of the riverbed where ancient water ripples are visible.',
          consequenceHint: 'Soft powdery sand, wheels might slip · Advances to 2.2A',
          nextNodeId: '2.2A',
          telemetryDelta: { batteryDelta: -3, temperatureDeltaC: -3, scienceDataDeltaMb: 22 },
        },
        {
          code: 'B',
          label:
            'Drive along the edge of the channel where heavier rocks were rolled by ancient currents.',
          consequenceHint: 'Firmer but tilted rocky bank · Advances to 2.2B',
          nextNodeId: '2.2B',
          telemetryDelta: { batteryDelta: -4, temperatureDeltaC: -2, scienceDataDeltaMb: 20 },
        },
      ],
    },
    '2.2A': {
      id: '2.2A',
      pathId: 'lakebed',
      stepNumber: 2,
      stepStageLabel: 'Step 2: Using tools & managing battery',
      title: 'Step 2.2: Inspecting the Riverbed Floor',
      subtitle: 'You entered the sandy middle of the channel (2.2A)',
      narrative:
        'The six wheels sink slightly into sand as fine as baby powder. Right underneath the rover are ripples shaped by flowing water billions of years ago.',
      environmentMood: 'normal',
      environmentBadge: 'Powdery Sand · Watch Wheel Traction',
      choices: [
        {
          code: 'A',
          label:
            'Use the magnifying camera on the arm to take close-up photos of individual sand grains.',
          consequenceHint: 'Uses very little power and gets sharp photos · Advances to 2.3A',
          nextNodeId: '2.3A',
          telemetryDelta: { batteryDelta: -2, temperatureDeltaC: -4, scienceDataDeltaMb: 38 },
        },
        {
          code: 'B',
          label:
            'Drive 2 meters further into the channel to look for water-rounded pebbles.',
          consequenceHint: 'Requires extra wheel power in soft sand · Advances to 2.3B',
          nextNodeId: '2.3B',
          telemetryDelta: { batteryDelta: -5, temperatureDeltaC: 3, scienceDataDeltaMb: 32 },
        },
      ],
    },
    '2.2B': {
      id: '2.2B',
      pathId: 'lakebed',
      stepNumber: 2,
      stepStageLabel: 'Step 2: Using tools & managing battery',
      title: 'Step 2.2: Inspecting the Rocky Bank',
      subtitle: 'You drove along the rocky edge of the channel (2.2B)',
      narrative:
        'Larger stones challenge the wheels, but they expose clear layers carved into the bank by flowing water.',
      environmentMood: 'normal',
      environmentBadge: 'Tilted Ground · River Layers Exposed',
      choices: [
        {
          code: 'A',
          label:
            'Point the mineral scanner at the wave-patterned rock layers on the bank.',
          consequenceHint: 'Reveals what the river layers are made of · Advances to 2.3A',
          nextNodeId: '2.3A',
          telemetryDelta: { batteryDelta: -3, temperatureDeltaC: -5, scienceDataDeltaMb: 44 },
        },
        {
          code: 'B',
          label:
            'Climb a small rocky step to measure which direction the ancient river flowed.',
          consequenceHint: 'Puts strain on the front-right wheel · Advances to 2.3B',
          nextNodeId: '2.3B',
          telemetryDelta: { batteryDelta: -5, temperatureDeltaC: 4, scienceDataDeltaMb: 40 },
        },
      ],
    },
    '2.3A': {
      id: '2.3A',
      pathId: 'lakebed',
      stepNumber: 3,
      stepStageLabel: 'Step 3: Handling a mechanical problem',
      title: 'Step 2.3: Front Wheel Trouble',
      subtitle: 'Sand grain and layer photos saved (2.3A)',
      narrative:
        'While turning the rover to aim its antenna, the front-right wheel (which has been stiff from years of driving) snags on hard ground and draws a spike of battery power.',
      environmentMood: 'alert',
      environmentBadge: 'Wheel Alert · Front-Right Wheel Snagged',
      choices: [
        {
          code: 'A',
          label:
            'Back up slightly in reverse to take pressure off the jammed wheel.',
          consequenceHint: 'Relieves strain on the wheel axle · Advances to 2.4A',
          nextNodeId: '2.4A',
          telemetryDelta: { batteryDelta: -4, temperatureDeltaC: -6, scienceDataDeltaMb: 18 },
        },
        {
          code: 'B',
          label:
            'Leave that wheel locked as an anchor and use the other five wheels to steady the rover.',
          consequenceHint: 'Locks the rover into a stable transmission spot · Advances to 2.4B',
          nextNodeId: '2.4B',
          telemetryDelta: { batteryDelta: -3, temperatureDeltaC: -8, scienceDataDeltaMb: 24 },
        },
      ],
    },
    '2.3B': {
      id: '2.3B',
      pathId: 'lakebed',
      stepNumber: 3,
      stepStageLabel: 'Step 3: Handling a mechanical problem',
      title: 'Step 2.3: Front Wheel Trouble',
      subtitle: 'Smooth river pebbles discovered (2.3B)',
      narrative:
        'Moving forward revealed smooth, rounded pebbles just like those in Earth’s rivers! However, the front-right wheel jams against a rock and drains extra power.',
      environmentMood: 'alert',
      environmentBadge: 'Wheel Alert · High Strain on Front Wheel',
      choices: [
        {
          code: 'A',
          label:
            'Back up slightly in reverse to take pressure off the jammed wheel.',
          consequenceHint: 'Levels the rover safely · Advances to 2.4A',
          nextNodeId: '2.4A',
          telemetryDelta: { batteryDelta: -4, temperatureDeltaC: -6, scienceDataDeltaMb: 20 },
        },
        {
          code: 'B',
          label:
            'Leave that wheel locked as an anchor and use the other five wheels to steady the rover.',
          consequenceHint: 'Angles the camera for a final river panorama · Advances to 2.4B',
          nextNodeId: '2.4B',
          telemetryDelta: { batteryDelta: -3, temperatureDeltaC: -8, scienceDataDeltaMb: 26 },
        },
      ],
    },
    '2.4A': {
      id: '2.4A',
      pathId: 'lakebed',
      stepNumber: 4,
      stepStageLabel: 'Step 4: How to save or send the discovery',
      title: 'Step 2.4: Closing the River Map',
      subtitle: 'Rover leveled after backing up (2.4A)',
      narrative:
        'With the wheel freed and the complete river map ready in memory, battery power hits its final limit. How will you preserve this geological story?',
      environmentMood: 'dust',
      environmentBadge: 'Battery at Limit · Final Riverbed Command',
      choices: [
        {
          code: 'A',
          label:
            'Save the complete 3D map of the ancient river inside the rover’s emergency backup memory.',
          consequenceHint: 'Unlocks ENDING 4: "Archivist of Worlds"',
          endingId: 'final_4',
          telemetryDelta: { batteryDelta: -3, scienceDataDeltaMb: 34 },
        },
        {
          code: 'B',
          label:
            'Transmit the high-resolution river panorama by radio to spacecraft orbiting above Mars.',
          consequenceHint: 'Unlocks ENDING 5: "The Eternal Current"',
          endingId: 'final_5',
          telemetryDelta: { batteryDelta: -5, scienceDataDeltaMb: 30 },
        },
      ],
    },
    '2.4B': {
      id: '2.4B',
      pathId: 'lakebed',
      stepNumber: 4,
      stepStageLabel: 'Step 4: How to save or send the discovery',
      title: 'Step 2.4: Closing the River Map',
      subtitle: 'Anchored like a sentinel in the dry river (2.4B)',
      narrative:
        'Resting firmly in the ancient channel, Opportunity gazes across the path where water flowed billions of years ago. Choose your final command.',
      environmentMood: 'dust',
      environmentBadge: 'River Sentinel · Final Command',
      choices: [
        {
          code: 'A',
          label:
            'Save the complete 3D map of the ancient river inside the rover’s emergency backup memory.',
          consequenceHint: 'Unlocks ENDING 4: "Archivist of Worlds"',
          endingId: 'final_4',
          telemetryDelta: { batteryDelta: -3, scienceDataDeltaMb: 36 },
        },
        {
          code: 'B',
          label:
            'Transmit the high-resolution river panorama by radio to spacecraft orbiting above Mars.',
          consequenceHint: 'Unlocks ENDING 5: "The Eternal Current"',
          endingId: 'final_5',
          telemetryDelta: { batteryDelta: -5, scienceDataDeltaMb: 32 },
        },
      ],
    },
    '3.1': {
      id: '3.1',
      pathId: 'crater',
      stepNumber: 1,
      stepStageLabel: 'Step 1: What to inspect first in the crater',
      title: 'Step 3.1: The Salt-Stained Crater',
      narrative:
        'You guide the rover into a shallow crater with white and yellow salt patches—left behind when an ancient pond evaporated. If microscopic life ever lived here, the clues are in this soil.',
      environmentMood: 'normal',
      environmentBadge: 'Shallow Crater · Ancient Pond Salt Patches',
      choices: [
        {
          code: 'A',
          label:
            'Use the arm sensors to test how acidic or salty that ancient water was.',
          consequenceHint: 'Tests the white salt crust on top · Advances to 3.2A',
          nextNodeId: '3.2A',
          telemetryDelta: { batteryDelta: -3, temperatureDeltaC: -5, scienceDataDeltaMb: 26 },
        },
        {
          code: 'B',
          label:
            'Spin a rear wheel to dig a small trench in the dust and uncover the soil hidden underneath.',
          consequenceHint: 'Digs a shallow trench in the ground · Advances to 3.2B',
          nextNodeId: '3.2B',
          telemetryDelta: { batteryDelta: -4, temperatureDeltaC: -3, scienceDataDeltaMb: 24 },
        },
      ],
    },
    '3.2A': {
      id: '3.2A',
      pathId: 'crater',
      stepNumber: 2,
      stepStageLabel: 'Step 2: Using tools & managing battery',
      title: 'Step 3.2: Testing the Ancient Water’s Acidity',
      subtitle: 'You tested the surface salts (3.2A)',
      narrative:
        'The sensors show that as the pond dried up, its water became quite acidic. You need to find out if hardy microbes could still survive in it.',
      environmentMood: 'normal',
      environmentBadge: 'Acidic Ancient Water Detected · Testing Habitability',
      choices: [
        {
          code: 'A',
          label:
            'Run a computer check to see if microbes could survive both the acidity and strong sunlight.',
          consequenceHint: 'Simulates ancient conditions on the computer · Advances to 3.3A',
          nextNodeId: '3.3A',
          telemetryDelta: { batteryDelta: -4, temperatureDeltaC: -8, scienceDataDeltaMb: 40 },
        },
        {
          code: 'B',
          label:
            'Run a careful double-check on the soil to confirm there are no toxic chemicals.',
          consequenceHint: 'Verifies soil safety for microbes · Advances to 3.3B',
          nextNodeId: '3.3B',
          telemetryDelta: { batteryDelta: -3, temperatureDeltaC: -10, scienceDataDeltaMb: 36 },
        },
      ],
    },
    '3.2B': {
      id: '3.2B',
      pathId: 'crater',
      stepNumber: 2,
      stepStageLabel: 'Step 2: Using tools & managing battery',
      title: 'Step 3.2: Discovering Freshwater Clay',
      subtitle: 'You dug a trench with the rear wheel (3.2B)',
      narrative:
        'Digging through the red dust reveals gray clay hidden from sunlight for billions of years! This kind of clay only forms in calm, fresh, non-acidic water.',
      environmentMood: 'normal',
      environmentBadge: 'Major Discovery · Freshwater Clay Uncovered!',
      choices: [
        {
          code: 'A',
          label:
            'Scan the gray clay to confirm that this ancient water was mild, clean, and non-acidic.',
          consequenceHint: 'Proves Mars once had gentle fresh water · Advances to 3.3B',
          nextNodeId: '3.3B',
          telemetryDelta: { batteryDelta: -3, temperatureDeltaC: -9, scienceDataDeltaMb: 48 },
        },
        {
          code: 'B',
          label:
            'Touch the arm sensor inside the trench to compare the deep freshwater clay with the salty top layer.',
          consequenceHint: 'Shows how Mars changed over time · Advances to 3.3A',
          nextNodeId: '3.3A',
          telemetryDelta: { batteryDelta: -4, temperatureDeltaC: -11, scienceDataDeltaMb: 45 },
        },
      ],
    },
    '3.3A': {
      id: '3.3A',
      pathId: 'crater',
      stepNumber: 3,
      stepStageLabel: 'Step 3: Facing the freezing Martian night',
      title: 'Step 3.3: The Freezing Night (-85°C)',
      subtitle: 'Soil tests completed at nightfall (3.3A)',
      narrative:
        'Night falls quickly on Mars and the temperature plunges to a bone-chilling -85°C! Main battery power begins to flicker in the extreme cold.',
      environmentMood: 'freeze',
      environmentBadge: 'Extreme Cold · Temperature Drops to -85°C',
      choices: [
        {
          code: 'A',
          label:
            'Turn on emergency power-saving mode: shut off the radio now to keep the computer memory warm.',
          consequenceHint: 'Protects the saved data inside memory · Advances to 3.4A',
          nextNodeId: '3.4A',
          telemetryDelta: { batteryDelta: -3, temperatureTargetC: -68, scienceDataDeltaMb: 18 },
        },
        {
          code: 'B',
          label:
            'Send one last quick radio packet with the life-habitability data before the rover freezes.',
          consequenceHint: 'Urgent radio burst at -85°C · Advances to 3.4B',
          nextNodeId: '3.4B',
          telemetryDelta: { batteryDelta: -5, temperatureTargetC: -85, scienceDataDeltaMb: 24 },
        },
      ],
    },
    '3.3B': {
      id: '3.3B',
      pathId: 'crater',
      stepNumber: 3,
      stepStageLabel: 'Step 3: Facing the freezing Martian night',
      title: 'Step 3.3: The Freezing Night (-85°C)',
      subtitle: 'Freshwater clay proof recorded (3.3B)',
      narrative:
        'Right after confirming the underground clay formed in gentle fresh water, the Martian night drops the temperature to -85°C. Power begins to waver.',
      environmentMood: 'freeze',
      environmentBadge: 'Extreme Cold · Temperature Drops to -85°C',
      choices: [
        {
          code: 'A',
          label:
            'Turn on emergency power-saving mode: shut off the radio now to keep the computer memory warm.',
          consequenceHint: 'Safeguards the freshwater files in memory · Advances to 3.4A',
          nextNodeId: '3.4A',
          telemetryDelta: { batteryDelta: -3, temperatureTargetC: -68, scienceDataDeltaMb: 20 },
        },
        {
          code: 'B',
          label:
            'Send one last quick radio packet with the life-habitability data before the rover freezes.',
          consequenceHint: 'Beams the discovery before freeze-up · Advances to 3.4B',
          nextNodeId: '3.4B',
          telemetryDelta: { batteryDelta: -5, temperatureTargetC: -85, scienceDataDeltaMb: 26 },
        },
      ],
    },
    '3.4A': {
      id: '3.4A',
      pathId: 'crater',
      stepNumber: 4,
      stepStageLabel: 'Step 4: The verdict on Martian habitability',
      title: 'Step 3.4: The Verdict on Ancient Life',
      subtitle: 'Memory kept warm in the silent Martian night (3.4A)',
      narrative:
        'In the freezing silence at -85°C, the computer prepares the mission’s final conclusion. Which discovery about ancient life on Mars will you record?',
      environmentMood: 'freeze',
      environmentBadge: 'Final Conclusion · Could Mars Have Hosted Life?',
      choices: [
        {
          code: 'A',
          label:
            'Record that the salty ponds were harsh, but could still support tough, acid-loving microbes.',
          consequenceHint: 'Unlocks ENDING 6: "The Edge of Life"',
          endingId: 'final_6',
          telemetryDelta: { batteryDelta: -3, scienceDataDeltaMb: 32 },
        },
        {
          code: 'B',
          label:
            'Combine the underground clay data to prove Mars once had gentle, fresh water welcoming to simple life.',
          consequenceHint: 'Unlocks ENDING 7: "The Promise of Fresh Water"',
          endingId: 'final_7',
          telemetryDelta: { batteryDelta: -4, scienceDataDeltaMb: 38 },
        },
      ],
    },
    '3.4B': {
      id: '3.4B',
      pathId: 'crater',
      stepNumber: 4,
      stepStageLabel: 'Step 4: The verdict on Martian habitability',
      title: 'Step 3.4: The Verdict on Ancient Life',
      subtitle: 'Final pulse of power at -85°C (3.4B)',
      narrative:
        'With the rover moments away from freezing at -85°C, you have enough power for one final conclusion about the crater’s ancient water.',
      environmentMood: 'freeze',
      environmentBadge: 'Final Pulse at -85°C · Final Verdict',
      choices: [
        {
          code: 'A',
          label:
            'Record that the salty ponds were harsh, but could still support tough, acid-loving microbes.',
          consequenceHint: 'Unlocks ENDING 6: "The Edge of Life"',
          endingId: 'final_6',
          telemetryDelta: { batteryDelta: -3, scienceDataDeltaMb: 34 },
        },
        {
          code: 'B',
          label:
            'Combine the underground clay data to prove Mars once had gentle, fresh water welcoming to simple life.',
          consequenceHint: 'Unlocks ENDING 7: "The Promise of Fresh Water"',
          endingId: 'final_7',
          telemetryDelta: { batteryDelta: -4, scienceDataDeltaMb: 42 },
        },
      ],
    },
  },
  endings: {
    final_1: {
      id: 'final_1',
      number: 1,
      pathId: 'hematite',
      pathTitle: 'Path 1: The Wall of Iron Spheres',
      title: 'Echo in the Desert',
      subtitle: 'Proof of abundant water beamed into space',
      epilogue:
        'Opportunity’s antenna fires one last radio signal through the dust-choked sky. The message carries clear proof that those tiny iron spheres grew inside abundant liquid water on ancient Mars. Before its lights go out forever, the rover fulfills its mission to share the story with Earth.',
      scientificVerdict:
        'Confirmed: the tiny iron spheres formed in abundant liquid water in Mars’s ancient past.',
      accentColor: '#EF4444',
    },
    final_2: {
      id: 'final_2',
      number: 2,
      pathId: 'hematite',
      pathTitle: 'Path 1: The Wall of Iron Spheres',
      title: 'Iron Witness',
      subtitle: 'The rock’s secret saved like a time capsule',
      epilogue:
        'Because the dust storm blocked radio signals, Opportunity saved every detail of the ground-open rock inside its permanent memory—like a memory card that never erases even without power. The rover becomes a time capsule waiting for future astronauts on Mars.',
      scientificVerdict:
        'Confirmed: the inner rings of the iron spheres were permanently saved in the rover’s memory.',
      accentColor: '#F97316',
    },
    final_3: {
      id: 'final_3',
      number: 3,
      pathId: 'hematite',
      pathTitle: 'Path 1: The Wall of Iron Spheres',
      title: 'Legacy of Meridiani',
      subtitle: 'A silent monument on the red plains',
      epilogue:
        'After saving the complete heat map of water salts, Opportunity rests in peace after nearly 15 years of exploration—far beyond its planned 3 months. Its robotic arm stays outstretched toward the rock as a monument to human curiosity.',
      scientificVerdict:
        'Confirmed: the rock wall preserves clear signatures of ancient groundwater on Mars.',
      accentColor: '#F59E0B',
    },
    final_4: {
      id: 'final_4',
      number: 4,
      pathId: 'lakebed',
      pathTitle: 'Path 2: The Ancient Dry Riverbed',
      title: 'Archivist of Worlds',
      subtitle: 'The storybook of how Mars’s rivers dried up',
      epilogue:
        'Locked safely in the rover’s backup memory, the map of sand and rock layers tells step by step how Mars’s ancient rivers slowly dried over millions of years. Opportunity rests in the channel as the great storyteller of the planet.',
      scientificVerdict:
        'Confirmed: sand and rock layers reveal how Mars shifted from a wet world to a desert.',
      accentColor: '#38BDF8',
    },
    final_5: {
      id: 'final_5',
      number: 5,
      pathId: 'lakebed',
      pathTitle: 'Path 2: The Ancient Dry Riverbed',
      title: 'The Eternal Current',
      subtitle: 'Photos of ancient water currents sent before battery depletion',
      epilogue:
        'With its last drop of battery power, Opportunity transmits to spacecraft orbiting Mars a panorama of sand ripples and water-rounded pebbles. Thanks to the rover, humanity can see where real rivers once flowed on the Red Planet.',
      scientificVerdict:
        'Confirmed: fossilized sand ripples and rounded pebbles prove ancient flowing rivers.',
      accentColor: '#0EA5E9',
    },
    final_6: {
      id: 'final_6',
      number: 6,
      pathId: 'crater',
      pathTitle: 'Path 3: The Crater & Underground Clay',
      title: 'The Edge of Life',
      subtitle: 'A tough environment, yet possible for hardy microbes',
      epilogue:
        'Under the -85°C freeze, Opportunity records its finding: even when Mars’s ancient ponds grew salty and acidic, they were still similar to places on Earth where tough microbes thrive.',
      scientificVerdict:
        'Confirmed: ancient salty ponds on Mars matched conditions where hardy microbes live on Earth.',
      accentColor: '#10B981',
    },
    final_7: {
      id: 'final_7',
      number: 7,
      pathId: 'crater',
      pathTitle: 'Path 3: The Crater & Underground Clay',
      title: 'The Promise of Fresh Water',
      subtitle: 'The discovery that Mars once had clean, welcoming water',
      epilogue:
        'By comparing the gray clay hidden underground with the salt on top, Opportunity reveals amazing news: long before becoming an arid desert, Mars had calm freshwater lakes—a welcoming place for simple life to begin.',
      scientificVerdict:
        'Confirmed: underground clay formed in calm, fresh, non-acidic water favorable for life.',
      accentColor: '#34D399',
    },
  },
};

export const OPPORTUNITY_MISSION = OPPORTUNITY_MISSION_PT;

export function getOpportunityMission(lang: Language): MissionDefinition {
  return lang === 'en' ? OPPORTUNITY_MISSION_EN : OPPORTUNITY_MISSION_PT;
}
