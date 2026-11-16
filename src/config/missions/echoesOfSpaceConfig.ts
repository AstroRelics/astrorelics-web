import type { EchoesSignalConfig, EchoesSignalId } from '../../types/echoesMission';
import type { Language } from '../../utils/i18n';

export const ECHOES_OPENING_PREMISE = {
  title: 'Beyond the Mission: Ecos do Espaço',
  subtitle: 'Investigação de Arquivos Espaciais Incompletos (5–8 min)',
  systemHeader: 'TERMINAL DE ARQUIVO ESPACIAL // REGISTROS INCOMPLETOS',
  openingQuote:
    '“Três sinais foram encontrados nos arquivos da exploração espacial. Um objeto sem identidade. Um equipamento que responde sem energia. Um explorador que ficou em silêncio. Investigue os vestígios e reconstrua suas histórias.”',
  firstActionLabel: 'Investigar primeiro sinal',
  finalConclusionQuote:
    '“Você encontrou três objetos. Reconstruiu três histórias. O que deixamos no espaço continua contando quem somos — e até onde conseguimos chegar.”',
  fictionalFramingNote:
    'Nota de Transparência: O "Sistema de Arquivos Incompletos" é uma construção narrativa interativa baseada em missões reais documentadas pela NASA, JPL, CNEOS e ILRS.',
};

export const ECHOES_OPENING_PREMISE_EN = {
  title: 'Beyond the Mission: Echoes of Space',
  subtitle: 'Interactive Space Archive Investigation (5–8 min)',
  systemHeader: 'SPACE ARCHIVE TERMINAL // INCOMPLETE RECORDS',
  openingQuote:
    '“Three signals were found in the space exploration archives. An object without identity. A device that replies without power. An explorer that fell silent. Investigate the traces and reconstruct their stories.”',
  firstActionLabel: 'Investigate first signal',
  finalConclusionQuote:
    '“You found three objects. Reconstructed three stories. What we leave in space keeps telling who we are — and how far we can reach.”',
  fictionalFramingNote:
    'Transparency Note: The "Incomplete Archive System" is a narrative framing device based on real missions documented by NASA, JPL, CNEOS, and ILRS.',
};

export function getEchoesPremise(lang: Language) {
  return lang === 'en' ? ECHOES_OPENING_PREMISE_EN : ECHOES_OPENING_PREMISE;
}

export const ECHOES_SIGNAL_ORDER: EchoesSignalId[] = [
  'j002e3',
  'lrrr',
  'opportunity',
];

export const ECHOES_SIGNALS: Record<EchoesSignalId, EchoesSignalConfig> = {
  // ===========================================================================
  // 1. INVESTIGAÇÃO DO J002E3 — “O VISITANTE SEM NOME” (PT)
  // ===========================================================================
  j002e3: {
    id: 'j002e3',
    signalCode: 'SINAL #01 · ÓRBITA PROFUNDA',
    unidentifiedTitle: 'O Visitante sem Nome',
    unidentifiedLocation: 'Objeto em órbita temporária entre Terra e Lua',
    reconstructedTitle: 'J002E3 — Estágio S-IVB da Apollo 12',
    reconstructedMission: 'Apollo 12 (AS-507 · Saturn V S-IVB-507)',
    reconstructedYear: 'Lançado em 1969 · Redescoberto em 2002',
    legacySentence:
      'Um objeto confundido com um asteroide guardava vestígios de uma viagem humana.',
    legacyMatchId: 'legacy_j002e3',
    legacyMatchLabel:
      'Uma história recuperada pela identificação de seus vestígios.',
    centralQuestion:
      'Estamos olhando para um asteroide ou para algo que saiu da Terra?',
    relatedBodyId: 'earth',
    relatedArtifactId: 'j002e3_s_ivb',
    accentColor: '#F59E0B',
    introArchiveMessage:
      'Arquivo #01 aberto: Em setembro de 2002, astrônomos detectaram um corpo desconhecido capturado temporariamente ao redor da Terra. Gire o modelo 3D e procure os 3 pontos luminosos discretos (ou use o botão de revelar pistas).',
    hotspots: [
      {
        id: 'j002_hull',
        signalId: 'j002e3',
        indexNumber: 1,
        label: 'A estrutura cilíndrica',
        shortLabel: 'Estrutura cilíndrica',
        position3D: [0.05, 0.22, 0.55],
        targetRotation: [0.1, 0.4],
        observation:
          '“O formato apresenta uma regularidade incomum para uma rocha.”',
        archiveReaction:
          'Pista 1/3 registrada: Formato de tubo perfeitamente redondo e anéis metálicos não existem em pedras naturais.',
        evidenceTitle: 'Formato Cilíndrico Perfeito',
        evidenceDetail:
          'Corpo em forma de cilindro com anéis e divisórias típicas de um tanque construído.',
      },
      {
        id: 'j002_propulsion',
        signalId: 'j002e3',
        indexNumber: 2,
        label: 'Parte da estrutura de propulsão',
        shortLabel: 'Estrutura de propulsão',
        position3D: [-0.42, -0.35, 0.25],
        targetRotation: [-0.35, 2.2],
        observation:
          '“Esta estrutura parece ter sido construída para produzir impulso.”',
        archiveReaction:
          'Pista 2/3 registrada: Saída em formato de sino na parte traseira, igual a um motor de foguete.',
        evidenceTitle: 'Motor de Impulso (Propulsão)',
        evidenceDetail:
          'Peça traseira em formato de sino feita para soltar gases e empurrar o veículo no espaço.',
      },
      {
        id: 'j002_coating',
        signalId: 'j002e3',
        indexNumber: 3,
        label: 'Vestígios de revestimento branco',
        shortLabel: 'Revestimento branco',
        position3D: [0.38, 0.08, -0.42],
        targetRotation: [0.22, -1.6],
        observation:
          '“A superfície reflete a luz solar com um padrão diferente de minerais comuns. Analisador de revestimento liberado.”',
        archiveReaction:
          'Pista 3/3 registrada: Amostra de cor coletada! Use o analisador simplificado na próxima etapa.',
        evidenceTitle: 'Vestígios de Pintura Branca',
        evidenceDetail:
          'Camada de tinta branca protetora desgastada após décadas sob o Sol no espaço.',
        triggersAnalyzer: true,
      },
    ],
    experimentTitle: 'Analisador Simplificado — Comparação de Superfície',
    experimentInstruction:
      'Compare a leitura de luz encontrada no revestimento branco do objeto com as duas referências visuais abaixo e escolha qual combina com o padrão observado.',
    experimentEducationalNote:
      'Nota Educativa: Esta análise é uma representação educativa simplificada. Na descoberta real de 2002, cientistas compararam o brilho do objeto com a tinta branca usada pela NASA nos foguetes Saturn V.',
    interpretationPrompt: 'Qual origem é mais compatível com as evidências?',
    hypotheses: [
      {
        id: 'hyp_asteroid',
        label: 'Asteroide próximo da Terra capturado pela gravidade',
        description:
          'Uma rocha espacial natural que passou perto da Terra e da Lua.',
        isCorrect: false,
        specificGuidance:
          'Observe novamente a estrutura de propulsão. O que ela sugere sobre a origem deste objeto?',
      },
      {
        id: 'hyp_comet',
        label: 'Fragmento congelado de um cometa antigo',
        description:
          'Um bloco de gelo e poeira refletindo a luz do Sol.',
        isCorrect: false,
        specificGuidance:
          'Observe novamente a estrutura de propulsão e a leitura do analisador. O padrão combina com rocha/gelo ou com o revestimento de um foguete?',
      },
      {
        id: 'hyp_human_stage',
        label: 'Equipamento de origem humana (estágio de foguete)',
        description:
          'Uma peça cilíndrica de foguete com motor e pintura branca lançada da Terra.',
        isCorrect: true,
        specificGuidance: '',
      },
    ],
    narrativeReward:
      '“Um objeto confundido com um asteroide guardava vestígios de uma viagem humana.”',
    historicalRevealSummary:
      'Descoberto em setembro de 2002 pelo astrônomo Bill Yeung e inicialmente chamado de asteroide J002E3, o objeto revelou ser o terceiro estágio (S-IVB) do foguete Saturn V da missão Apollo 12, lançada em novembro de 1969. Após 33 anos girando ao redor do Sol, ele voltou a visitar brevemente a Terra antes de seguir viagem pelo espaço em 2003.',
    hintsByStep: {
      locate_clues: {
        regionHint:
          'Dica (Região): Gire o modelo 3D e procure 3 pequenos pontos brilhantes: no meio do cilindro, no motor traseiro e na lateral branca.',
        actionHint:
          'Dica (Ação): Clique nos 3 pontos luminosos sobre o modelo 3D ou acione o botão "Mostrar lista de pistas" para vê-los em texto.',
        directHint:
          'Orientação Direta: Inspecione "A estrutura cilíndrica", "Parte da estrutura de propulsão" e "Vestígios de revestimento branco".',
      },
      experiment: {
        regionHint:
          'Dica (Região): Observe a altura das barras coloridas na caixa "Amostra Coletada" no topo.',
        actionHint:
          'Dica (Ação): Compare essas barras altas com os dois cartões abaixo (Material Rochoso vs. Revestimento de Foguete).',
        directHint:
          'Orientação Direta: Selecione "Referência B: Revestimento de Foguete", que tem o mesmo padrão alto da amostra.',
      },
      interpret: {
        regionHint:
          'Dica (Região): Veja as 3 evidências reunidas (formato de cilindro, motor de propulsão e tinta de foguete).',
        actionHint:
          'Dica (Ação): Escolha a hipótese que une todas essas pistas.',
        directHint:
          'Orientação Direta: Selecione "Equipamento de origem humana (estágio de foguete)".',
      },
    },
  },

  // ===========================================================================
  // 2. INVESTIGAÇÃO LUNAR — “A RESPOSTA SEM BATERIA” (PT)
  // ===========================================================================
  lrrr: {
    id: 'lrrr',
    signalCode: 'SINAL #02 · SUPERFÍCIE LUNAR',
    unidentifiedTitle: 'A Resposta sem Bateria',
    unidentifiedLocation: 'Mar da Tranquilidade, Lua',
    reconstructedTitle: 'Retrorefletor Lunar (LRRR)',
    reconstructedMission: 'Apollo 11 (1969) · Experimento de Reflexão a Laser',
    reconstructedYear: 'Instalado em 1969 · Ativo até hoje',
    legacySentence:
      'Nem toda resposta precisa de uma voz. Este equipamento continua útil ao devolver a luz que recebe.',
    legacyMatchId: 'legacy_lrrr',
    legacyMatchLabel:
      'Um equipamento que continua contribuindo para a ciência.',
    centralQuestion:
      'Como um equipamento deixado na Lua pode responder sem usar eletricidade?',
    relatedBodyId: 'moon',
    relatedArtifactId: 'apollo_lrrr',
    accentColor: '#38BDF8',
    introArchiveMessage:
      'Arquivo #02 aberto: Deixado na Lua em 1969, este objeto não tem bateria nem fios, mas cientistas na Terra continuam recebendo respostas dele. Encontre os 3 pontos luminosos no modelo 3D.',
    hotspots: [
      {
        id: 'lrrr_prisms',
        signalId: 'lrrr',
        indexNumber: 1,
        label: 'Os prismas espelhados',
        shortLabel: 'Prismas espelhados',
        position3D: [0.0, 0.25, 0.38],
        targetRotation: [0.35, 0.0],
        observation:
          '“A bandeja possui 100 pequenos espelhos especiais em formato de canto que devolvem qualquer luz exatamente para o lugar de onde ela veio.”',
        archiveReaction:
          'Pista 1/3 registrada: Espelhos especiais (prismas) refletem a luz de volta para a origem.',
        evidenceTitle: '100 Prismas Espelhados',
        evidenceDetail:
          'Pequenos blocos de vidro especial que funcionam como espelhos perfeitos.',
      },
      {
        id: 'lrrr_frame',
        signalId: 'lrrr',
        indexNumber: 2,
        label: 'A estrutura apontada para a Terra',
        shortLabel: 'Estrutura inclinada',
        position3D: [-0.38, -0.05, 0.22],
        targetRotation: [0.1, 0.85],
        observation:
          '“O suporte metálico mantém a bandeja inclinada na direção exata onde a Terra fica no céu da Lua.”',
        archiveReaction:
          'Pista 2/3 registrada: Posição fixa apontada para a Terra, sem precisar de motores.',
        evidenceTitle: 'Suporte Apontado para a Terra',
        evidenceDetail:
          'Painel deixado inclinado pelos astronautas olhando diretamente para o nosso planeta.',
      },
      {
        id: 'lrrr_power',
        signalId: 'lrrr',
        indexNumber: 3,
        label: 'Ausência de bateria ou cabos elétricos',
        shortLabel: 'Sem bateria',
        position3D: [0.36, -0.18, -0.25],
        targetRotation: [-0.15, -2.1],
        observation:
          '“Não existe nenhuma bateria, painel solar, tomada ou fio elétrico neste equipamento.”',
        archiveReaction:
          'Pista 3/3 registrada: Funciona sem nenhuma eletricidade! Experimento de pulso de luz liberado.',
        evidenceTitle: 'Sem Bateria nem Eletricidade',
        evidenceDetail:
          'O aparelho não produz energia própria nem possui peças eletrônicas.',
      },
    ],
    experimentTitle: 'Experiência: Enviar um Pulso de Laser da Terra',
    experimentInstruction:
      'Use os dois controles simples abaixo para apontar o feixe de luz da estação na Terra até a região do refletor na Lua e clique em "Enviar pulso".',
    experimentEducationalNote:
      'Nota Educativa: A distância real (~384.400 km), o tempo de viagem da luz (~2,5 segundos ida e volta) e o tamanho dos objetos foram adaptados para visualização.',
    interpretationPrompt: 'De onde veio a energia da luz que retornou?',
    hypotheses: [
      {
        id: 'hyp_lrrr_battery',
        label: 'De uma bateria no equipamento',
        description:
          'Uma pilha guardada dentro do aparelho que acende uma luz na Lua.',
        isCorrect: false,
        specificGuidance:
          'Lembre-se da terceira pista encontrada no modelo 3D: o equipamento não possui bateria nem fios elétricos.',
      },
      {
        id: 'hyp_lrrr_earth_light',
        label: 'A luz enviada da Terra (refletida pelos prismas)',
        description:
          'O equipamento apenas devolve a própria luz do laser que saiu da Terra.',
        isCorrect: true,
        specificGuidance: '',
      },
      {
        id: 'hyp_lrrr_transmitter',
        label: 'De um transmissor lunar de rádio',
        description:
          'Uma antena na Lua que cria um sinal novo.',
        isCorrect: false,
        specificGuidance:
          'Observe os 100 prismas espelhados que você inspecionou: eles funcionam como espelhos que devolvem a luz recebida.',
      },
    ],
    narrativeReward:
      '“Nem toda resposta precisa de uma voz. Este equipamento continua útil ao devolver a luz que recebe.”',
    historicalRevealSummary:
      'Deixado na Lua pelos astronautas da Apollo 11 em 1969, o Retrorefletor Lunar funciona como um espelho de alta precisão. Como ele apenas devolve a luz do laser disparado da Terra, não precisa de bateria e continua funcionando há mais de 55 anos. Medindo o tempo que a luz leva para ir e voltar (~2,5 segundos), os cientistas medem a distância exata entre a Terra e a Lua.',
    hintsByStep: {
      locate_clues: {
        regionHint:
          'Dica (Região): Procure os 3 pontos luminosos na grade de espelhos no topo, na lateral do suporte e na parte de trás.',
        actionHint:
          'Dica (Ação): Clique nos 3 marcadores brilhantes no modelo 3D ou use o botão "Mostrar lista de pistas".',
        directHint:
          'Orientação Direta: Inspecione "Os prismas espelhados", "A estrutura apontada para a Terra" e "Ausência de bateria".',
      },
      experiment: {
        regionHint:
          'Dica (Região): Olhe no desenho onde está o quadrado azul do Refletor na Lua e onde o círculo amarelo da sua mira está apontando.',
        actionHint:
          'Dica (Ação): Mexa nos dois controles até colocar o círculo amarelo dentro da área tracejada azul na Lua e aperte "Enviar pulso".',
        directHint:
          'Orientação Direta: Ajuste a Direção perto de 65° e a Altura perto de 40° e clique em "Enviar pulso".',
      },
      interpret: {
        regionHint:
          'Dica (Região): Veja no desenho como a linha verde sai da Terra, bate no espelho da Lua e volta para a Terra.',
        actionHint:
          'Dica (Ação): Escolha a resposta que explica que a luz veio da própria Terra.',
        directHint:
          'Orientação Direta: Selecione "A luz enviada da Terra (refletida pelos prismas)".',
      },
    },
  },

  // ===========================================================================
  // 3. INVESTIGAÇÃO DO OPPORTUNITY — “O ÚLTIMO SILÊNCIO” (PT)
  // ===========================================================================
  opportunity: {
    id: 'opportunity',
    signalCode: 'SINAL #03 · PLANÍCIE MARCIANA',
    unidentifiedTitle: 'O Último Silêncio',
    unidentifiedLocation: 'Vale da Perseverança, Marte',
    reconstructedTitle: 'Rover Opportunity',
    reconstructedMission: 'Missão Mars Exploration Rover (NASA)',
    reconstructedYear: '2004 – 2018 (Quase 15 anos em Marte)',
    legacySentence:
      'O último silêncio foi apenas o fim de uma jornada que já havia ido muito além do esperado.',
    legacyMatchId: 'legacy_opportunity',
    legacyMatchLabel:
      'Uma missão que superou sua duração planejada.',
    centralQuestion:
      'O que interrompeu a jornada de um explorador que havia superado tantas expectativas?',
    relatedBodyId: 'mars',
    relatedArtifactId: 'opportunity_rover',
    accentColor: '#10B981',
    introArchiveMessage:
      'Arquivo #03 aberto: Planejado para funcionar por apenas 3 meses (90 dias marcianos), este robô explorou Marte por quase 15 anos até ficar em silêncio em 2018. Inspecione os 3 pontos luminosos no modelo 3D.',
    hotspots: [
      {
        id: 'opp_panels',
        signalId: 'opportunity',
        indexNumber: 1,
        label: 'Painéis solares',
        shortLabel: 'Painéis solares',
        position3D: [0.0, 0.16, 0.35],
        targetRotation: [0.42, 0.2],
        observation:
          '“As grandes asas abertas do robô são painéis solares. Ele dependia totalmente da luz do Sol para recarregar sua bateria e não congelar.”',
        archiveReaction:
          'Pista 1/3 registrada: O robô precisava receber luz solar nos painéis para ter energia.',
        evidenceTitle: 'Dependência da Luz Solar',
        evidenceDetail:
          'Os painéis solares precisavam da luz do Sol para produzir toda a energia do robô.',
      },
      {
        id: 'opp_wheels',
        signalId: 'opportunity',
        indexNumber: 2,
        label: 'Rodas e marcas de exploração',
        shortLabel: 'Rodas e exploração',
        position3D: [-0.45, -0.32, 0.28],
        targetRotation: [-0.12, 0.9],
        observation:
          '“As seis rodas mostram marcas de mais de 45 quilômetros rodados por crateras e planícies durante quase 15 anos.”',
        archiveReaction:
          'Pista 2/3 registrada: O robô durou muito mais do que os 90 dias planejados no início.',
        evidenceTitle: '45 km de Longa Exploração',
        evidenceDetail:
          'As rodas trabalharam por quase 15 anos, superando em mais de 55 vezes o tempo previsto.',
      },
      {
        id: 'opp_antenna',
        signalId: 'opportunity',
        indexNumber: 3,
        label: 'Antena de comunicação',
        shortLabel: 'Antena de comunicação',
        position3D: [0.18, 0.42, -0.15],
        targetRotation: [0.25, -0.75],
        observation:
          '“O último registro enviado pela antena em junho de 2018 mostrava o céu escurecendo rápido durante uma enorme tempestade de poeira.”',
        archiveReaction:
          'Pista 3/3 registrada: Todos os fragmentos reunidos! Simulador de poeira e sequência liberado.',
        evidenceTitle: 'Silêncio na Tempestade de Poeira (2018)',
        evidenceDetail:
          'A comunicação parou quando uma tempestade de poeira cobriu todo o planeta Marte.',
      },
    ],
    experimentTitle: 'Ordem dos Acontecimentos e Simulador de Poeira',
    experimentInstruction:
      '1) Coloque os três cartões na ordem certa em que tudo aconteceu (usando "Mover antes" e "Mover depois" ou arrastando). 2) Depois, mova o controle de Quantidade de Poeira para ver o que acontece com a luz e a energia.',
    experimentEducationalNote:
      'Nota Educativa: O controle de poeira é uma simulação qualitativa para mostrar como a poeira no ar bloqueia a luz do Sol e reduz a bateria.',
    interpretationPrompt: 'Qual sequência explica o silêncio do rover?',
    hypotheses: [
      {
        id: 'hyp_opp_dust_chain',
        label:
          'A poeira na atmosfera aumentou → menos luz chegou aos painéis → a energia caiu e a comunicação parou',
        description:
          'A grande tempestade de poeira escondeu o Sol e impediu o robô de recarregar sua bateria.',
        isCorrect: true,
        specificGuidance: '',
      },
      {
        id: 'hyp_opp_wheel_break',
        label:
          'Uma roda presa em uma pedra desligou a antena de rádio imediatamente',
        description:
          'Um problema nas rodas teria interrompido o sinal.',
        isCorrect: false,
        specificGuidance:
          'Observe o experimento de poeira e os painéis solares: mesmo parado, o robô continuaria enviando sinais se houvesse luz do Sol nos painéis.',
      },
      {
        id: 'hyp_opp_90_days',
        label:
          'Um relógio automático desligou o robô após completar 90 dias em Marte',
        description:
          'O robô teria parado sozinho ao fim do prazo inicial de 3 meses.',
        isCorrect: false,
        specificGuidance:
          'Veja a pista das rodas: o Opportunity continuou explorando Marte por quase 15 anos depois do prazo inicial.',
      },
    ],
    narrativeReward:
      '“O último silêncio foi apenas o fim de uma jornada que já havia ido muito além do esperado.”',
    historicalRevealSummary:
      'Enviado a Marte em janeiro de 2004 com a meta de funcionar por apenas 90 dias marcianos (cerca de 3 meses), o Opportunity surpreendeu o mundo ao explorar o planeta por quase 15 anos (5.111 dias marcianos) e percorrer 45 quilômetros. Em junho de 2018, uma gigantesca tempestade de poeira cobriu Marte inteiro e bloqueou a luz do Sol, deixando o robô sem energia para se comunicar.',
    timelineMilestones: [
      {
        id: 'ms_2004_landing',
        solOrDate: 'Dia Marciano 1 · Jan 2004',
        title: 'Pouso na Cratera Eagle',
        shortSummary: 'Chegada a Marte e primeiras descobertas de água.',
        expandedDetail:
          'Logo após pousar, o Opportunity encontrou pequenas bolinhas de ferro nas rochas que provaram que água líquida já correu em Marte.',
      },
      {
        id: 'ms_planned_90',
        solOrDate: 'Dia Marciano 90 · Abr 2004 (Meta Planejada)',
        title: 'Fim dos 90 Dias Planejados',
        shortSummary: 'Meta original de 3 meses cumprida — e o robô seguiu em frente!',
        expandedDetail:
          'Os engenheiros achavam que a poeira cobriria os painéis em 90 dias. Porém, ventos limparam os painéis várias vezes ao longo dos anos, permitindo continuar a viagem.',
        isPlannedBenchmark: true,
      },
      {
        id: 'ms_victoria_endeavour',
        solOrDate: '2006 a 2011 · A Grande Travessia',
        title: 'Viagem até a Cratera Endeavour',
        shortSummary: 'Mais de 20 km cruzando o deserto marciano.',
        expandedDetail:
          'Na borda da enorme Cratera Endeavour, o robô encontrou barro antigo formado em água doce e limpa.',
      },
      {
        id: 'ms_5111_silence',
        solOrDate: 'Dia Marciano 5.111 · Jun 2018 (55× o tempo previsto)',
        title: 'Tempestade Global e o Último Silêncio',
        shortSummary: '45,16 km percorridos antes de a poeira cobrir o Sol.',
        expandedDetail:
          'Após durar mais de 55 vezes o tempo planejado, uma tempestade de poeira cobriu todo o planeta em junho de 2018, encerrando sua histórica jornada.',
      },
    ],
    hintsByStep: {
      locate_clues: {
        regionHint:
          'Dica (Região): Procure os 3 pontos luminosos nas asas abertas (painéis), nas rodas de baixo e na antena no alto do robô.',
        actionHint:
          'Dica (Ação): Clique nos 3 pontos brilhantes sobre o modelo 3D ou use o botão "Mostrar lista de pistas".',
        directHint:
          'Orientação Direta: Inspecione "Painéis solares", "Rodas e marcas de exploração" e "Antena de comunicação".',
      },
      experiment: {
        regionHint:
          'Dica (Região): Veja os 3 cartões de texto e o controle deslizante "Quantidade de Poeira" logo abaixo.',
        actionHint:
          'Dica (Ação): Coloque os cartões na ordem lógica (1º Poeira aumenta, 2º Menos luz, 3º Energia cai) e arraste a barra de poeira para a direita.',
        directHint:
          'Orientação Direta: Ordene: 1º "A poeira na atmosfera aumenta", 2º "Menos luz alcança os painéis", 3º "A energia disponível cai..." e mova a barra de poeira acima de 70%.',
      },
      interpret: {
        regionHint:
          'Dica (Região): Lembre-se do que aconteceu com a luz e a bateria quando você aumentou a poeira no simulador.',
        actionHint:
          'Dica (Ação): Escolha a resposta que mostra essa mesma sequência.',
        directHint:
          'Orientação Direta: Selecione "A poeira na atmosfera aumentou → menos luz chegou aos painéis → a energia caiu e a comunicação parou".',
      },
    },
  },
};

export const ECHOES_SIGNALS_EN: Record<EchoesSignalId, EchoesSignalConfig> = {
  j002e3: {
    ...ECHOES_SIGNALS.j002e3,
    signalCode: 'SIGNAL #01 · DEEP ORBIT',
    unidentifiedTitle: 'The Nameless Visitor',
    unidentifiedLocation: 'Object in temporary orbit between Earth and Moon',
    reconstructedTitle: 'J002E3 — Apollo 12 S-IVB Rocket Stage',
    reconstructedMission: 'Apollo 12 (Saturn V S-IVB-507)',
    reconstructedYear: 'Launched 1969 · Rediscovered 2002',
    legacySentence:
      'An object mistaken for an asteroid held traces of a human journey.',
    legacyMatchLabel:
      'A story recovered by identifying its physical traces.',
    centralQuestion:
      'Are we looking at an asteroid or something that came from Earth?',
    introArchiveMessage:
      'File #01 open: In September 2002, astronomers spotted an unknown object temporarily captured around Earth. Rotate the 3D model and look for 3 discreet glowing points (or click the button to reveal clues).',
    hotspots: [
      {
        ...ECHOES_SIGNALS.j002e3.hotspots[0],
        label: 'The cylindrical body',
        shortLabel: 'Cylindrical body',
        observation:
          '“The shape shows an unusual regularity for a natural rock.”',
        archiveReaction:
          'Clue 1/3 logged: A smooth cylinder with metal rings does not form naturally in space rocks.',
        evidenceTitle: 'Smooth Cylindrical Shape',
        evidenceDetail:
          'Tube-shaped hull with rings and panels matching a manufactured tank.',
      },
      {
        ...ECHOES_SIGNALS.j002e3.hotspots[1],
        label: 'Part of the propulsion structure',
        shortLabel: 'Propulsion nozzle',
        observation:
          '“This structure appears to have been built to produce thrust.”',
        archiveReaction:
          'Clue 2/3 logged: Bell-shaped engine nozzle at the rear, built like a rocket thruster.',
        evidenceTitle: 'Rocket Propulsion Nozzle',
        evidenceDetail:
          'Rear bell-shaped thruster designed to push a vehicle through space.',
      },
      {
        ...ECHOES_SIGNALS.j002e3.hotspots[2],
        label: 'Traces of white coating',
        shortLabel: 'White coating',
        observation:
          '“The surface reflects sunlight in a pattern unlike common minerals. Coating analyzer unlocked.”',
        archiveReaction:
          'Clue 3/3 logged: Surface reading collected! Compare the coating in the simplified analyzer.',
        evidenceTitle: 'White Rocket Paint Traces',
        evidenceDetail:
          'Weathered white protective paint after decades exposed to sunlight in space.',
      },
    ],
    experimentTitle: 'Simplified Coating Analyzer — Surface Comparison',
    experimentInstruction:
      'Compare the light reading from the object’s white coating with the two visual references below and select the one that matches the observed pattern.',
    experimentEducationalNote:
      'Educational Note: This is a simplified educational representation. In 2002, scientists matched the object’s reflected light to the white titanium-dioxide paint used on NASA Saturn V rockets.',
    interpretationPrompt: 'Which origin best matches the evidence?',
    hypotheses: [
      {
        id: 'hyp_asteroid',
        label: 'Near-Earth asteroid captured by gravity',
        description: 'A natural space rock passing near the Earth–Moon system.',
        isCorrect: false,
        specificGuidance:
          'Look closely at the propulsion structure again. What does it suggest about where this object came from?',
      },
      {
        id: 'hyp_comet',
        label: 'Frozen fragment of an ancient comet',
        description: 'A block of ice and dust reflecting sunlight.',
        isCorrect: false,
        specificGuidance:
          'Look again at the propulsion nozzle and the coating analyzer. Does the pattern match rock/ice or rocket paint?',
      },
      {
        id: 'hyp_human_stage',
        label: 'Human-made equipment (rocket stage)',
        description: 'A cylindrical rocket stage with an engine and white paint launched from Earth.',
        isCorrect: true,
        specificGuidance: '',
      },
    ],
    narrativeReward:
      '“An object mistaken for an asteroid held traces of a human journey.”',
    historicalRevealSummary:
      'Spotted in September 2002 by astronomer Bill Yeung and first given the asteroid name J002E3, orbit and light checks proved it was actually the S-IVB third stage of the Apollo 12 Saturn V rocket launched in November 1969. After 33 years orbiting the Sun, it briefly returned to Earth’s neighborhood before heading back into deep space in 2003.',
    hintsByStep: {
      locate_clues: {
        regionHint:
          'Hint (Region): Rotate the 3D model and look for 3 small glowing points: on the main cylinder, the rear engine bell, and the white side wall.',
        actionHint:
          'Hint (Action): Click the 3 glowing markers on the 3D model or press "Show clue list" to view them as buttons.',
        directHint:
          'Direct Guidance: Inspect "The cylindrical body", "Part of the propulsion structure", and "Traces of white coating".',
      },
      experiment: {
        regionHint:
          'Hint (Region): Look at the tall colored bars in the "Collected Sample" box at the top.',
        actionHint:
          'Hint (Action): Compare those tall bars with the two reference cards below (Rocky Material vs. Rocket Coating).',
        directHint:
          'Direct Guidance: Select "Reference B: Rocket Coating", which matches the high reflection pattern.',
      },
      interpret: {
        regionHint:
          'Hint (Region): Review the 3 clues in your Evidence Panel (cylinder shape, engine nozzle, and rocket paint).',
        actionHint:
          'Hint (Action): Pick the hypothesis that explains both the thruster and the paint.',
        directHint:
          'Direct Guidance: Select "Human-made equipment (rocket stage)".',
      },
    },
  },

  lrrr: {
    ...ECHOES_SIGNALS.lrrr,
    signalCode: 'SIGNAL #02 · LUNAR SURFACE',
    unidentifiedTitle: 'The Battery-Free Reply',
    unidentifiedLocation: 'Sea of Tranquility, Moon',
    reconstructedTitle: 'Lunar Laser Retroreflector (LRRR)',
    reconstructedMission: 'Apollo 11 (1969) · Lunar Laser Ranging Experiment',
    reconstructedYear: 'Placed in 1969 · Still active today',
    legacySentence:
      'Not every reply needs a voice. This device remains useful by returning the light it receives.',
    legacyMatchLabel:
      'A piece of equipment that continues contributing to science.',
    centralQuestion:
      'How can equipment left on the Moon reply without using electricity?',
    introArchiveMessage:
      'File #02 open: Left on the Moon in 1969, this device has no battery or wires, yet scientists on Earth still receive signals from it. Find the 3 glowing points on the 3D model.',
    hotspots: [
      {
        ...ECHOES_SIGNALS.lrrr.hotspots[0],
        label: 'The mirrored glass prisms',
        shortLabel: 'Mirrored prisms',
        observation:
          '“The tray holds 100 small corner-shaped mirrors that bounce any light beam straight back toward where it came from.”',
        archiveReaction:
          'Clue 1/3 logged: Special corner mirrors reflect light straight back to its source.',
        evidenceTitle: '100 Corner-Cube Mirrors',
        evidenceDetail:
          'Small special glass prisms that act as precision mirrors.',
      },
      {
        ...ECHOES_SIGNALS.lrrr.hotspots[1],
        label: 'The frame angled toward Earth',
        shortLabel: 'Angled frame',
        observation:
          '“The metal stand keeps the mirror tray permanently tilted toward the spot where Earth hangs in the lunar sky.”',
        archiveReaction:
          'Clue 2/3 logged: Fixed mechanical tilt aimed at Earth, needing no motors.',
        evidenceTitle: 'Stand Aimed at Earth',
        evidenceDetail:
          'Passive stand tilted by the astronauts to face our planet.',
      },
      {
        ...ECHOES_SIGNALS.lrrr.hotspots[2],
        label: 'Absence of batteries or power cables',
        shortLabel: 'No battery',
        observation:
          '“There are no batteries, solar panels, plugs, or electronic circuits anywhere on this device.”',
        archiveReaction:
          'Clue 3/3 logged: Works without any electricity! Earth laser pulse experiment unlocked.',
        evidenceTitle: 'No Battery or Electronics',
        evidenceDetail:
          'The device generates no power of its own and has no electronic parts.',
      },
    ],
    experimentTitle: 'Experiment: Send a Laser Pulse from Earth',
    experimentInstruction:
      'Use the two simple controls below to aim the laser beam from the Earth station toward the reflector region on the Moon, then press "Send pulse".',
    experimentEducationalNote:
      'Educational Note: Distance (~384,400 km), light travel time (~2.56 s round-trip), and visual scale have been adapted for interactive viewing.',
    interpretationPrompt: 'Where did the energy of the returning light come from?',
    hypotheses: [
      {
        id: 'hyp_lrrr_battery',
        label: 'From a battery inside the equipment',
        description: 'A hidden battery on the Moon that powers a lamp.',
        isCorrect: false,
        specificGuidance:
          'Check the third clue from your inspection: the equipment has no batteries or electrical wires.',
      },
      {
        id: 'hyp_lrrr_earth_light',
        label: 'From the light sent from Earth (reflected by the prisms)',
        description: 'The prisms simply bounce back the laser light fired from Earth.',
        isCorrect: true,
        specificGuidance: '',
      },
      {
        id: 'hyp_lrrr_transmitter',
        label: 'From an automatic lunar radio transmitter',
        description: 'An antenna on the Moon generating a brand-new signal.',
        isCorrect: false,
        specificGuidance:
          'Look at the 100 mirrored prisms you inspected: they work like mirrors bouncing back received light.',
      },
    ],
    narrativeReward:
      '“Not every reply needs a voice. This device remains useful by returning the light it receives.”',
    historicalRevealSummary:
      'Placed on the Moon by Apollo 11 astronauts in 1969, the Lunar Retroreflector works like a precision mirror. Because it simply bounces back laser pulses sent from observatories on Earth, it needs no power and still works over 55 years later. Timing the ~2.5-second round trip lets scientists measure the Earth–Moon distance down to millimeters.',
    hintsByStep: {
      locate_clues: {
        regionHint:
          'Hint (Region): Look for the 3 glowing points on the top mirror grid, the tilted side frame, and the back.',
        actionHint:
          'Hint (Action): Click the 3 glowing points on the 3D model or click "Show clue list".',
        directHint:
          'Direct Guidance: Inspect "The mirrored glass prisms", "The frame angled toward Earth", and "Absence of batteries".',
      },
      experiment: {
        regionHint:
          'Hint (Region): Look at the blue target circle on the Moon and the yellow aiming ring in the diagram.',
        actionHint:
          'Hint (Action): Adjust both sliders until the yellow ring lines up inside the blue target zone on the Moon, then press "Send pulse".',
        directHint:
          'Direct Guidance: Set Direction near 65° and Elevation near 40°, then click "Send pulse".',
      },
      interpret: {
        regionHint:
          'Hint (Region): Watch how the green beam leaves Earth, hits the lunar mirrors, and bounces back.',
        actionHint:
          'Hint (Action): Choose the answer explaining that the light came from Earth itself.',
        directHint:
          'Direct Guidance: Select "From the light sent from Earth (reflected by the prisms)".',
      },
    },
  },

  opportunity: {
    ...ECHOES_SIGNALS.opportunity,
    signalCode: 'SIGNAL #03 · MARTIAN PLAINS',
    unidentifiedTitle: 'The Final Silence',
    unidentifiedLocation: 'Perseverance Valley, Mars',
    reconstructedTitle: 'Opportunity Rover',
    reconstructedMission: 'Mars Exploration Rover Mission (NASA)',
    reconstructedYear: '2004 – 2018 (Nearly 15 years on Mars)',
    legacySentence:
      'The final silence was only the end of a journey that had already gone far beyond expectations.',
    legacyMatchLabel:
      'A mission that far exceeded its planned duration.',
    centralQuestion:
      'What stopped the journey of an explorer that had surpassed so many expectations?',
    introArchiveMessage:
      'File #03 open: Built to last just 3 months (90 Martian days), this rover explored Mars for nearly 15 years before falling silent in 2018. Inspect the 3 glowing points on the 3D model.',
    hotspots: [
      {
        ...ECHOES_SIGNALS.opportunity.hotspots[0],
        label: 'Solar panels',
        shortLabel: 'Solar panels',
        observation:
          '“The wide flat wings are solar panels. The rover relied entirely on sunlight to charge its batteries and stay warm.”',
        archiveReaction:
          'Clue 1/3 logged: The rover needed sunlight reaching its panels to generate electricity.',
        evidenceTitle: 'Reliance on Sunlight',
        evidenceDetail:
          'Solar panels required sunlight to produce all power for the rover.',
      },
      {
        ...ECHOES_SIGNALS.opportunity.hotspots[1],
        label: 'Wheels and exploration tracks',
        shortLabel: 'Wheels & tracks',
        observation:
          '“The six wheels carry wear from driving over 45 kilometers across craters and plains for nearly 15 years.”',
        archiveReaction:
          'Clue 2/3 logged: The rover operated far longer than its original 90-day plan.',
        evidenceTitle: '45 km of Long Exploration',
        evidenceDetail:
          'Its wheels drove for nearly 15 years, lasting over 55 times longer than planned.',
      },
      {
        ...ECHOES_SIGNALS.opportunity.hotspots[2],
        label: 'Communication antenna',
        shortLabel: 'Antenna',
        observation:
          '“The last status record sent in June 2018 showed the sky rapidly darkening during a planet-wide dust storm.”',
        archiveReaction:
          'Clue 3/3 logged: All records recovered! Event sequence and dust simulator unlocked.',
        evidenceTitle: 'Silence During 2018 Global Dust Storm',
        evidenceDetail:
          'Contact stopped when a giant dust storm blanketed Mars.',
      },
    ],
    experimentTitle: 'Order of Events & Dust Simulator',
    experimentInstruction:
      '1) Put the three records in the order they happened (using "Move earlier" / "Move later" or dragging). 2) Then slide the Dust Amount control to see how dust affects light and power.',
    experimentEducationalNote:
      'Educational Note: The dust slider is a qualitative simulation showing how airborne dust blocks sunlight and drains available power.',
    interpretationPrompt: 'Which sequence explains the rover’s silence?',
    hypotheses: [
      {
        id: 'hyp_opp_dust_chain',
        label:
          'Dust in the atmosphere increases → less light reaches the panels → available power drops and communication stops',
        description:
          'The planet-wide dust storm blocked the Sun and prevented the rover from recharging.',
        isCorrect: true,
        specificGuidance: '',
      },
      {
        id: 'hyp_opp_wheel_break',
        label:
          'A wheel snagged on a rock and immediately switched off the radio antenna',
        description: 'A mechanical wheel issue shut down the transmitter.',
        isCorrect: false,
        specificGuidance:
          'Check the dust simulator and solar panel clue: even standing still, a solar rover can communicate as long as sunlight reaches its panels.',
      },
      {
        id: 'hyp_opp_90_days',
        label:
          'An automatic timer turned the rover off after 90 days on Mars',
        description: 'The rover shut itself down at the end of its initial 3-month schedule.',
        isCorrect: false,
        specificGuidance:
          'Review the wheels clue: Opportunity kept exploring Mars for nearly 15 years past its initial 90-day goal.',
      },
    ],
    narrativeReward:
      '“The final silence was only the end of a journey that had already gone far beyond expectations.”',
    historicalRevealSummary:
      'Landing on Mars in January 2004 with a planned mission of just 90 Martian days (about 3 months), Opportunity amazed the world by exploring for nearly 15 years (5,111 Martian days) and driving 45 kilometers. In June 2018, a massive global dust storm encircled Mars and blocked out the Sun, leaving the rover without power to communicate.',
    timelineMilestones: [
      {
        id: 'ms_2004_landing',
        solOrDate: 'Martian Day 1 · Jan 2004',
        title: 'Landing in Eagle Crater',
        shortSummary: 'Arrival on Mars and first evidence of ancient water.',
        expandedDetail:
          'Shortly after landing, Opportunity discovered tiny iron spheres ("blueberries") that proved liquid water once soaked Martian rocks.',
      },
      {
        id: 'ms_planned_90',
        solOrDate: 'Martian Day 90 · Apr 2004 (Planned Goal)',
        title: 'End of Planned 90-Day Mission',
        shortSummary: 'Original 3-month goal completed — and the rover kept going!',
        expandedDetail:
          'Engineers expected dust on the solar panels to end the mission in ~90 days. Instead, gusts of Martian wind periodically swept the panels clean, granting years of bonus exploration.',
        isPlannedBenchmark: true,
      },
      {
        id: 'ms_victoria_endeavour',
        solOrDate: '2006 to 2011 · The Great Trek',
        title: 'Journey to Endeavour Crater',
        shortSummary: 'Driving over 20 km across the Martian plains.',
        expandedDetail:
          'Along the rim of vast Endeavour Crater, Opportunity discovered ancient clay formed in calm, non-acidic fresh water.',
      },
      {
        id: 'ms_5111_silence',
        solOrDate: 'Martian Day 5,111 · Jun 2018 (55× planned life)',
        title: 'Global Dust Storm & Final Silence',
        shortSummary: '45.16 km driven before dust blotted out the Sun.',
        expandedDetail:
          'After lasting more than 55 times its designed lifespan, a planet-wide dust storm darkened the sky in June 2018, bringing its historic journey to a close.',
      },
    ],
    hintsByStep: {
      locate_clues: {
        regionHint:
          'Hint (Region): Look for the 3 glowing points on the flat solar wings, the lower wheels, and the top antenna.',
        actionHint:
          'Hint (Action): Click the 3 glowing points on the 3D model or click "Show clue list".',
        directHint:
          'Direct Guidance: Inspect "Solar panels", "Wheels and exploration tracks", and "Communication antenna".',
      },
      experiment: {
        regionHint:
          'Hint (Region): Look at the 3 event cards and the "Dust Amount" slider right below them.',
        actionHint:
          'Hint (Action): Order the cards from cause to effect (1st Dust increases, 2nd Less light, 3rd Power drops) and slide the dust bar to the right.',
        directHint:
          'Direct Guidance: Order: 1st "Dust in the atmosphere increases.", 2nd "Less light reaches the panels.", 3rd "Available power drops..." and move the dust slider above 70%.',
      },
      interpret: {
        regionHint:
          'Hint (Region): Remember what happened to light and battery power when you increased the dust slider.',
        actionHint:
          'Hint (Action): Pick the answer that describes that exact chain of events.',
        directHint:
          'Direct Guidance: Select "Dust in the atmosphere increases → less light reaches the panels → available power drops and communication stops".',
      },
    },
  },
};

export function getEchoesSignals(
  lang: Language
): Record<EchoesSignalId, EchoesSignalConfig> {
  return lang === 'en' ? ECHOES_SIGNALS_EN : ECHOES_SIGNALS;
}

export interface OpportunityDustCard {
  id: string;
  correctOrder: 1 | 2 | 3;
  text: string;
}

export const OPPORTUNITY_INITIAL_UNORDERED_CARDS: OpportunityDustCard[] = [
  {
    id: 'card_light',
    correctOrder: 2,
    text: 'Menos luz alcança os painéis.',
  },
  {
    id: 'card_energy',
    correctOrder: 3,
    text: 'A energia disponível cai e a comunicação é interrompida.',
  },
  {
    id: 'card_dust',
    correctOrder: 1,
    text: 'A poeira na atmosfera aumenta.',
  },
];

export const OPPORTUNITY_INITIAL_UNORDERED_CARDS_EN: OpportunityDustCard[] = [
  {
    id: 'card_light',
    correctOrder: 2,
    text: 'Less light reaches the panels.',
  },
  {
    id: 'card_energy',
    correctOrder: 3,
    text: 'Available power drops and communication stops.',
  },
  {
    id: 'card_dust',
    correctOrder: 1,
    text: 'Dust in the atmosphere increases.',
  },
];

export function getOpportunityDustCards(lang: Language): OpportunityDustCard[] {
  return lang === 'en'
    ? OPPORTUNITY_INITIAL_UNORDERED_CARDS_EN
    : OPPORTUNITY_INITIAL_UNORDERED_CARDS;
}

export const SCIENTIFIC_CREDITS_AND_SOURCES = {
  documentedFacts: [
    'J002E3: Descoberto em 3 de setembro de 2002 por Bill Yeung e identificado pelo JPL/CNEOS e Universidade do Arizona (Jorgensen et al., 2003) como o estágio S-IVB-507 da Apollo 12 através de análise de órbita e da tinta branca do foguete.',
    'Retrorefletor Lunar (LRRR): Instalado pela Apollo 11 em 21 de julho de 1969 no Mar da Tranquilidade com 100 prismas de vidro de sílica. Continua funcionando sem eletricidade até hoje (dados: NASA / ILRS).',
    'Rover Opportunity (MER-B): Pousou em Marte em 25 de janeiro de 2004 para uma missão de 90 dias marcianos. Operou por 5.111 dias marcianos (45,16 km) até perder contato em 10 de junho de 2018 em uma tempestade global de poeira (dados: NASA / JPL).',
  ],
  educationalSimplifications: [
    'Analisador de Revestimento (J002E3): Representação visual simplificada do brilho da superfície.',
    'Pulso de Laser (LRRR): Distância, ângulos e tempo de viagem da luz (~2,56 s) adaptados para interação na tela.',
    'Simulador de Poeira (Opportunity): Simulação qualitativa de como a poeira bloqueia a luz solar e reduz a energia.',
  ],
  fictionalElements: [
    'O "Sistema de Arquivos Incompletos" e a abertura com "Três Sinais Misteriosos" fazem parte da narrativa interativa para guiar a investigação.',
  ],
  modelCredits: [
    'Modelos 3D GLB baseados no acervo público NASA 3D Resources (nasa3d.arc.nasa.gov) e NASA/JPL-Caltech.',
  ],
};

export const SCIENTIFIC_CREDITS_AND_SOURCES_EN = {
  documentedFacts: [
    'J002E3: Discovered on September 3, 2002 by Bill Yeung and identified by JPL/CNEOS and the University of Arizona (Jorgensen et al., 2003) as the Apollo 12 S-IVB-507 rocket stage through orbit tracking and white rocket paint analysis.',
    'Lunar Retroreflector (LRRR): Placed by Apollo 11 on July 21, 1969 in the Sea of Tranquility with 100 fused-silica prisms. Continues operating passively without power today (data: NASA / ILRS).',
    'Opportunity Rover (MER-B): Landed on Mars on January 25, 2004 for a planned 90-day mission. Operated for 5,111 Martian days (45.16 km) until losing contact on June 10, 2018 during a global dust storm (data: NASA / JPL).',
  ],
  educationalSimplifications: [
    'Coating Analyzer (J002E3): Simplified visual comparison of surface light reflection.',
    'Laser Pulse (LRRR): Distance, angles, and light travel time (~2.56 s) adapted for on-screen interaction.',
    'Dust Simulator (Opportunity): Qualitative simulation of how atmospheric dust blocks sunlight and lowers battery power.',
  ],
  fictionalElements: [
    'The "Incomplete Space Archive System" and initial "Three Mystery Signals" framing are fictional narrative elements created to guide discovery.',
  ],
  modelCredits: [
    '3D GLB models based on public NASA 3D Resources (nasa3d.arc.nasa.gov) and NASA/JPL-Caltech.',
  ],
};

export function getScientificCredits(lang: Language) {
  return lang === 'en'
    ? SCIENTIFIC_CREDITS_AND_SOURCES_EN
    : SCIENTIFIC_CREDITS_AND_SOURCES;
}
