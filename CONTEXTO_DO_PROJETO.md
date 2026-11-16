# 🚀 Beyond the Mission — Contexto Completo do Projeto

> **"Abandoned but not Forgotten"** *(Abandonados, mas não Esquecidos)*  
> Uma experiência web tridimensional e interativa dedicada à arqueologia espacial, explorando os artefatos históricos da NASA preservados na Terra, na Lua, em Marte e no silêncio do espaço profundo.

---

## 📑 Sumário

1. [Visão Geral & Filosofia do Projeto](#1-visão-geral--filosofia-do-projeto)
2. [O Conceito de Arqueologia Espacial](#2-o-conceito-de-arqueologia-espacial)
3. [Corpos Celestes Modelados](#3-corpos-celestes-modelados)
   - [Terra — O Ponto de Origem](#terra--o-ponto-de-origem)
   - [Lua — O Arquivo Silencioso](#lua--o-arquivo-silencioso)
   - [Marte — A Fronteira dos Rovers](#marte--a-fronteira-dos-rovers)
4. [Os 5 Artefatos Históricos da NASA em Detalhes](#4-os-5-artefatos-históricos-da-nasa-em-detalhes)
   - [1. J002E3 · Terceiro Estágio S-IVB (Apollo 12)](#1-j002e3--terceiro-estágio-s-ivb-apollo-12)
   - [2. Retrorefletor a Laser LRRR (Apollo 11, 14 e 15)](#2-retrorefletor-a-laser-lrrr-apollo-11-14-e-15)
   - [3. Módulo Lunar "Snoopy" (Apollo 10 · LM-4)](#3-módulo-lunar-snoopy-apollo-10--lm-4)
   - [4. Rover Opportunity (MER-B)](#4-rover-opportunity-mer-b)
   - [5. Helicóptero Ingenuity (Mars 2020)](#5-helicóptero-ingenuity-mars-2020)
5. [Arquitetura de Software & Stack Tecnológica](#5-arquitetura-de-software--stack-tecnológica)
6. [Soluções de Engenharia & Inovações Técnicas](#6-soluções-de-engenharia--inovações-técnicas)
   - [Matemática Orbital Sem Colisão (120°)](#matemática-orbital-sem-colisão-120)
   - [Efeito Hiperespaço / Salto em Velocidade da Luz](#efeito-hiperespaço--salto-em-velocidade-da-luz)
   - [Normalização Geométrica Automática de Modelos GLB](#normalização-geométrica-automática-de-modelos-glb)
   - [Shaders GLSL Customizados: Atmosfera Fresnel & Nebulosa Procedural](#shaders-glsl-customizados-atmosfera-fresnel--nebulosa-procedural)
   - [Projeção Esférica de Pins de Superfície (Lat/Lon → Vector3)](#projeção-esférica-de-pins-de-superfície-latlon--vector3)
   - [Motor de Áudio Procedural Sintetizado (Web Audio API)](#motor-de-áudio-procedural-sintetizado-web-audio-api)
   - [Carregamento com Geometria Calibrada com a Identidade Visual](#carregamento-com-geometria-calibrada-com-a-identidade-visual)
   - [Acessibilidade & Fallbacks Resilientes](#acessibilidade--fallbacks-resilientes)
7. [Experiência do Usuário (UX/UI)](#7-experiência-do-usuário-uxui)
8. [Estrutura de Diretórios](#8-estrutura-de-diretórios)
9. [Conclusão & Impacto Educacional](#9-conclusão--impacto-educacional)

---

## 1. Visão Geral & Filosofia do Projeto

**Beyond the Mission** nasceu com o propósito de transformar a forma como a história da astronáutica e da exploração espacial é comunicada ao público. Frequentemente, museus e plataformas digitais limitam o registro de missões espaciais a tabelas estáticas, fotos bidimensionais de arquivo ou longos artigos de texto desprovidos de escala geográfica ou dimensional.

Em contrapartida, **Beyond the Mission** oferece uma experiência tridimensional imersiva e interativa que coloca o usuário no controle de uma maquete astronômica em tempo real, abrangendo o corredor interplanetário **Terra–Lua–Marte**.

### O que o projeto resolve e propõe:
- **Espacialidade Real:** Mostra *onde* os artefatos estão de fato localizados — seja fixados em coordenadas geográficas reais de crateras lunares e marcianas, seja à deriva em órbitas caóticas no espaço profundo ou em pontos de equilíbrio gravitacional (pontos de Lagrange).
- **Inspeção Detalhada em 3D:** Permite orbitar e inspecionar livremente modelos 3D fiéis de naves, rovers, instrumentos científicos e estágios de foguetes com rotação de 360°, controle de atitude e iluminação dinâmica baseada na posição do Sol.
- **Divulgação Científica Rigorosa:** Acompanha cada astro e equipamento com uma telemetria detalhada, especificações técnicas de engenharia, histórico documentado da missão e avaliação do impacto científico para a humanidade.

---

## 2. O Conceito de Arqueologia Espacial

A arqueologia clássica estuda vestígios materiais para reconstruir a história das civilizações antigas. Com o avanço das últimas seis décadas de era espacial, surgiu uma nova fronteira científica: a **Arqueologia Espacial** (ou Arqueologia Orbital).

Desde o lançamento da Sputnik e o início do programa Apollo, dezenas de veículos e artefatos foram enviados ao espaço. Ao cumprirem seus objetivos primários:
- Alguns queimaram na reentrada atmosférica terrestre;
- Alguns foram deliberadamente impactados contra a superfície de outros corpos;
- **Mas outros permaneceram intactos:** pousados no vácuo protetor da Lua, enterrados nas tempestades de poeira de Marte ou vagando silenciosamente em órbitas solares ao longo de milhões de quilômetros.

O projeto **Beyond the Mission** resgata esses monumentos silenciosos da engenharia humana, demonstrando que eles não são mero "lixo espacial", mas relíquias históricas fundamentais que continuam ensinando a astrofísica contemporânea.

---

## 3. Corpos Celestes Modelados

O projeto modela e renderiza dinamicamente os três corpos celestes centrais da jornada humana no Sistema Solar interior:

### Terra — O Ponto de Origem
- **Identificação:** Planeta Telúrico a 1,00 UA (Unidade Astronômica) do Sol.
- **Papel na Experiência:** Ponto de partida de todas as expedições humanas. Ponto focal das redes de rastreamento terrestre (*Deep Space Network* — DSN) e observatórios que monitoram o cosmos.
- **Tratamento Visual 3D:**
  - Modelo texturizado de alta resolução com relevo e oceanos.
  - Inclinação axial de aproximadamente **23,5°** (`axialTilt: 0.41 rad`).
  - Velocidade suave de rotação sideral em repouso.
  - **Shader Atmosférico Ativo:** Efeito Rayleigh com camada difusa em tom azul-celeste (`#38BDF8`), intensidade regulada e máscara de crepúsculo calculada pelo produto escalar com a luz solar.

### Lua — O Arquivo Silencioso
- **Identificação:** Satélite natural da Terra a uma distância média de 384.400 km.
- **Papel na Experiência:** Primeiro destino extraterrestre visitado por seres humanos. Desprovida de atmosfera, vento e atividade tectônica ativa, atua como uma "cápsula do tempo" que preserva pegadas, ferramentas e estruturas há mais de meio século.
- **Tratamento Visual 3D:**
  - Modelo detalhado das terras altas e mares lunares (*maria*).
  - Rotação sincronizada e inclinação axial calibrada (`axialTilt: 0.11 rad`).
  - **Ausência de Atmosfera:** O halo atmosférico é desativado propositalmente (`enabled: false`), preservando a borda nítida e escura contra o vácuo espacial.
  - Material PBR ajustado com alta rugosidade (`roughness: 0.94`) e metalicidade nula, reproduzindo a absorção e reflexão difusa do regolito lunar.

### Marte — A Fronteira dos Rovers
- **Identificação:** Quarto planeta a partir do Sol (~1,52 UA), conhecido como o Planeta Vermelho.
- **Papel na Experiência:** Cemitério e laboratório de dezenas de missões robóticas da humanidade, caracterizado por cânions monumentais, vulcões extintos e vastas tempestades globais de poeira de óxido de ferro.
- **Tratamento Visual 3D:**
  - Superfície com calotas polares e relevo de crateras.
  - Inclinação axial de **25,19°** (`axialTilt: 0.44 rad`).
  - **Shader de Atmosfera Rarefeita:** Halo fino e delicado com tonalidade alaranjada/terracota (`#E07A5F` e `#9A3412`) com potência de Fresnel de `4.1`, capturando a natureza tênue de sua camada de dióxido de carbono ($CO_2$).

---

## 4. Os 5 Artefatos Históricos da NASA em Detalhes

O núcleo da narrativa do projeto se apoia em cinco equipamentos icônicos, selecionados por sua singularidade histórica, técnica e arqueológica:

```
                          [ CORREDOR TERRA-LUA-MARTE ]
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
     [TERRA]                         [LUA]                         [MARTE]
        │                              │                              │
  • J002E3 (S-IVB)              • LRRR (Laser)               • Rover Opportunity
   (Órbita caótica L1)           (Mare Tranquillitatis)       (Meridiani Planum)
                                • Módulo "Snoopy"            • Helicóptero Ingenuity
                                 (Órbita Solar)               (Cratera Jezero)
```

---

### 1. J002E3 · Terceiro Estágio S-IVB (Apollo 12)
* **Localização na Aplicação:** Espaço Profundo (Corredor Orbital Terra–Lua / Órbita Solar).
* **Posicionamento:** À deriva no vácuo (`placementType: 'deep-space'`), orbitando próximo ao ponto de Lagrange L1.
* **Ano / Missão:** Lançado em 14 de novembro de 1969 · Redescoberto em setembro de 2002.
* **Ficha Técnica:**
  - *Dimensões:* 17,8 metros de comprimento por 6,60 metros de diâmetro.
  - *Massa Seca:* ~9.559 kg.
  - *Propulsão:* 1 motor Rocketdyne J-2 movido a hidrogênio líquido ($LH_2$) e oxigênio líquido ($LOX$).
  - *Marcador Químico:* Tinta térmica branca de Dióxido de Titânio ($TiO_2$).
* **A História:**  
  O estágio S-IVB (número de série S-IVB-507) realizou a queima de injeção translunar da Apollo 12. O plano operacional da NASA previa que os propulsores restantes gastassem o combustível para lançar o foguete descartado em uma órbita solar segura e distante. Contudo, uma queima mais longa dos motores de recalque colocou o estágio em uma órbita quase-ressonante instável com o sistema Terra-Lua.
  
  O objeto desapareceu por **33 anos**. Em setembro de 2002, o astrônomo amador Bill Yeung descobriu um corpo luminoso acelerando em órbita da Terra e o classificou como o asteroide "J002E3". O pânico inicial sobre um asteroide recém-capturado foi desfeito quando cientistas da Universidade do Arizona mediram seu espectro de reflexão eletromagnética: a assinatura espectral coincidia perfeitamente com a tinta branca de dióxido de titânio usada pela NASA no programa Apollo. O velho foguete de 1969 havia feito uma breve visita à Terra antes de ser ejetado novamente para o espaço solar em 2003.
* **Importância Científica:**  
  Consolidou a disciplina da arqueologia orbital e o estudo da dinâmica de corpos capturados temporariamente pela gravidade de três corpos (Terra, Lua e Sol).

---

### 2. Retrorefletor a Laser LRRR (Apollo 11, 14 e 15)
* **Localização na Aplicação:** Lua · Superfície lunar na *Base da Tranquilidade* (`surfaceLatLon: [12, 68]`).
* **Posicionamento:** Ancorado diretamente na malha do astro (`placementType: 'body-surface'`), girando solidariamente com o satélite.
* **Ano / Missão:** 20 de julho de 1969 (Apollo 11) – Presente.
* **Ficha Técnica:**
  - *Matriz Óptica:* 100 prismas triédricos (*corner-cubes*) dispostos em matriz 10 × 10.
  - *Material:* Sílica fundida de alta pureza (Quartzo).
  - *Dimensões:* Painel de alumínio usinado de 46 cm × 46 cm.
  - *Consumo Energético:* **0 Watts** (100% passivo, sem baterias ou cabos).
* **A História:**  
  Instalado por Neil Armstrong e Buzz Aldrin durante as primeiras horas da caminhada lunar da Apollo 11. Devido à ausência total de componentes elétricos ou mecânicos sujeitos a desgaste, o equipamento sobreviveu a mais de 55 anos exposto à radiação cósmica implacável e a oscilações térmicas lunares que variam de $-170^\circ\text{C}$ durante a noite a $+120^\circ\text{C}$ ao meio-dia solar.
* **Importância Científica:**  
  É o experimento ativo mais duradouro de toda a história espacial humana. Diariamente, observatórios terrestres (como o Observatório McDonald no Texas e o Observatório Côte d'Azur na França) disparam feixes pulsados de laser de alta energia em direção aos prismas e cronometram o tempo de voo dos fótons de ida e volta. Esse experimento permitiu provar que **a Lua se afasta da Terra a uma taxa de 3,8 centímetros por ano**, medir com precisão a precessão do núcleo lunar e realizar os testes mais rigorosos já feitos da Teoria da Relatividade Geral de Albert Einstein.

---

### 3. Módulo Lunar "Snoopy" (Apollo 10 · LM-4)
* **Localização na Aplicação:** Espaço Profundo (Órbita Heliocêntrica interplanetária).
* **Posicionamento:** À deriva no vácuo interplanetário (`placementType: 'deep-space'`).
* **Ano / Missão:** Maio de 1969 · Apollo 10 (LM-4) · Rastreado em 2019.
* **Ficha Técnica:**
  - *Designação:* Grumman LM-4 "Snoopy" (Estágio de Subida).
  - *Massa Operacional:* ~2.150 kg (sem propelente).
  - *Aproximação Lunar Realizada:* 14,4 km da superfície (47.400 pés).
  - *Isolamento Térmico:* Mylar aluminizado e filme de poliimida Kapton dourado.
* **A História:**  
  Dois meses antes do pouso da Apollo 11, os astronautas Thomas Stafford e Eugene Cernan pilotaram o LM-4 "Snoopy" até a incrível distância de apenas 14,4 km da superfície lunar, realizando o ensaio geral definitivo de separação, manobra orbital e acoplamento. 
  
  Após a tripulação retornar em segurança ao Módulo de Comando "Charlie Brown", o estágio de subida do Snoopy não foi arremessado contra a Lua (como nos voos posteriores para calibração sismológica): seus motores hipergólicos foram disparados até o esgotamento para enviá-lo a uma órbita ao redor do Sol. Tornou-se **a única espaçonave tripulada humana da história a vagar inteira, intacta e desabitada pelo espaço heliocêntrico**. Em 2019, 50 anos após o lançamento, uma equipe internacional de astrônomos liderada por Nick Howes confirmou o rastreamento de sua órbita com 98% de certeza.
* **Importância Científica:**  
  Um marco pioneiro da robótica orbital e o símbolo máximo da preparação meticulosa que permitiu o pouso histórico do ser humano em outro mundo.

---

### 4. Rover Opportunity (MER-B)
* **Localização na Aplicação:** Marte · Superfície em *Meridiani Planum* (`surfaceLatLon: [-8, 52]`).
* **Posicionamento:** Ancorado na malha marciana (`placementType: 'body-surface'`).
* **Ano / Missão:** 2004 – 2018 (Operou por 14 anos e 138 dias; declarado encerrado em 2019).
* **Ficha Técnica:**
  - *Vida Útil Projetada:* 90 sóis (dias marcianos) e 1.000 metros de travessia.
  - *Vida Útil Real:* **5.352 sóis** e **45,16 km** percorridos (recorde absoluto de rodagem fora da Terra).
  - *Massa:* 185 kg.
  - *Mobiliário Científico:* Suspensão *rocker-bogie* de 6 rodas, mastro de câmeras panorâmicas (Pancam/Navcam) a 1,5 m de altura e braço articulado com broca de abrasão (RAT).
* **A História:**  
  Pousou na cratera Eagle em janeiro de 2004. Superou a expectativa de projeto em mais de **55 vezes**, sobrevivendo a invernos brutais e contando com a ação periódica de "eventos de limpeza" (redemoinhos de poeira marcianos que sopravam a poeira dos seus painéis solares). 
  
  Em junho de 2018, uma tempestade global catastrófica cobriu o planeta inteiro, reduzindo a luz solar em mais de 99% ($Tau > 10,8$). Suas baterias descarregaram completamente e o rover silenciou no Vale da Perseverança. A NASA enviou mais de mil comandos de rádio de emergência até a despedida oficial em fevereiro de 2019.
* **Importância Científica:**  
  Descobriu as famosas esférulas minerais ricas em hematita ("mirtilos de Marte") e veios de sulfato de cálcio, fornecendo a primeira prova irrefutável de que Marte possuiu água líquida neutra e abundante em seu passado, alterando para sempre a astrobiologia.

---

### 5. Helicóptero Ingenuity (Mars 2020)
* **Localização na Aplicação:** Marte · Superfície na *Cratera Jezero* (`surfaceLatLon: [26, 92]`).
* **Posicionamento:** Ancorado na malha marciana (`placementType: 'body-surface'`).
* **Ano / Missão:** 2021 – 2024 (72 voos realizados).
* **Ficha Técnica:**
  - *Massa Total:* 1,8 kg na Terra (~680 g na gravidade marciana).
  - *Rotores:* Coaxiais contrarrotativos de fibra de carbono com 1,20 m de envergadura girando a **2.537 RPM**.
  - *Tempo Total de Voo Acumulado:* 128,8 minutos ao longo de 17,0 km.
  - *Computação:* Aviônica embarcada em processador Qualcomm Snapdragon com algoritmos autônomos de fluxo óptico.
* **A História:**  
  Chegou acoplado à barriga do rover Perseverance em fevereiro de 2021. Em 19 de abril de 2021, efetuou o **primeiro voo motorizado e controlado em outro planeta** na história da humanidade. Para homenagear o marco, a NASA colocou um fragmento do tecido da asa do *Flyer* de 1903 dos irmãos Wright sob o painel solar do helicóptero.
  
  Criado apenas como demonstração tecnológica de risco para 5 voos de 30 dias, o Ingenuity operou por quase 3 anos como batedor aéreo avançado, sobrevoando dunas inacessíveis e mapeando rotas seguras para o Perseverance. Em 18 de janeiro de 2024, durante o voo 72 em uma região de dunas sem textura visual para os sensores de navegação, sofreu um pouso duro que danificou as pontas das pás de fibra de carbono, encerrando suas operações de voo em "Valinor Hills".
* **Importância Científica:**  
  Provou empiricamente a viabilidade do voo aerodinâmico em uma atmosfera rarefeita com menos de 1% da densidade atmosférica da Terra, abrindo caminho para futuras aeronaves marcianas e para a missão *Dragonfly* rumo à lua Titã de Saturno.

---

## 5. Arquitetura de Software & Stack Tecnológica

O sistema foi concebido com uma arquitetura moderna, modular e de alto desempenho gráfico no navegador, dispensando plugins externos:

```
┌────────────────────────────────────────────────────────┐
│                   App.tsx (Root Hub)                   │
├──────────────────────────┬─────────────────────────────┤
│   Canvas 3D (WebGL)      │     Interface UI (HUD)      │
│   • SpaceExperienceCanvas│     • HeaderHud             │
│   • CelestialBodyActor   │     • DestinationInfoPanel  │
│   • ArtifactSceneActors  │     • LoadingScreen         │
│   • HyperspaceTransition │     • WebGLFallbackScreen   │
│   • StarfieldAndNebula   │     • ArtifactCartoonIcons  │
│   • SpaceLighting        │                             │
├──────────────────────────┴─────────────────────────────┤
│                      State & Utils                     │
│  • modelPreloader (GLB/Box3)                           │
│  • orbitalTransitionMath (120° Trig Matrix)           │
│  • soundEffects (Web Audio API Synthesizer)           │
│  • Configs: celestialBodies.ts | spaceArtifacts.ts     │
└────────────────────────────────────────────────────────┘
```

### Componentes da Stack:
- **Core Frontend:** React 18.3 com TypeScript 5.6 (tipagem estrita em toda a telemetria, coordenadas e estados orbitais).
- **Bundler & Build Tool:** Vite 6 (inicialização instantânea com HMR veloz).
- **Motor Gráfico 3D:** Three.js r170 acoplado ao React Three Fiber (`@react-three/fiber` v8) e `@react-three/drei` v9.
- **Estilização & Design System:** Tailwind CSS v3 com paleta espacial profunda (`#02040A`, `#050C1A`, `#38BDF8`), tipografia geométrica e desfoques de vidro (*backdrop-blur*).
- **Ícones & Vetores:** `lucide-react` complementado por um set autoral de ícones SVG cartoonizados em `ArtifactCartoonIcons.tsx`.
- **Motor de Áudio:** Sintetizador analógico procedural construído nativamente com a **Web Audio API** do navegador.

---

## 6. Soluções de Engenharia & Inovações Técnicas

### Matemática Orbital Sem Colisão (120°)
Uma das decisões de engenharia mais elegantes do projeto reside em como os três corpos celestes (Terra, Lua, Marte) transitam na tela. Em vez de simplesmente ocultar ou teleportar os objetos, foi implementado um modelo trigonométrico contínuo:
- Os três astros formam um triângulo equilátero orbital separado por arcos de 120° ($\frac{2\pi}{3}$ radianos).
- Três posições cardeais de visualização (*slots*): `center` (primeiro plano, $+Z$), `left` (recuado à esquerda, $-Z$) e `right` (recuado à direita, $-Z$).
- Quando o usuário clica em um destino, os três planetas transladam em sincronia ao longo de uma elipse inclinada no plano $X$-$Z$. O planeta selecionado avança suavemente para a frente da câmera, o anterior recua pela lateral e o terceiro contorna pelo fundo no eixo $-Z$, **garantindo matematicamente que nenhum planeta colida ou traspasse a malha do outro**.

### Efeito Hiperespaço / Salto em Velocidade da Luz
Inspirado no visual *hyperdrive* de ficção científica clássica:
- Utiliza um `THREE.InstancedMesh` com mais de 500 partículas em linhas hiper-alongadas (*speed streaks*).
- O ciclo de viagem é dividido em fases: `acceleration` $\rightarrow$ `cruise` $\rightarrow$ `arrival` $\rightarrow$ `idle`.
- Durante a aceleração, a câmera sofre uma leve contração de campo de visão (FOV), as linhas estelares se esticam na direção do observador e um túnel cônico de luz azulada expande seu brilho, culminando em uma desaceleração elástica no destino ou no modelo do artefato escolhido.

### Normalização Geométrica Automática de Modelos GLB
Na modelagem 3D, diferentes arquivos `.glb` chegam com escalas díspares (alguns modelados em centímetros, outros em metros ou quilômetros) e pontos de pivô descentralizados.
- O utilitário `src/utils/modelPreloader.ts` calcula a caixa delimitadora (`THREE.Box3`) de cada malha carregada.
- O pivô é automaticamente transladado para que o centro de massa coincida rigorosamente com a origem `(0, 0, 0)`.
- O raio geométrico máximo é calculado e normalizado para valor unitário ($1.0$), permitindo que as propriedades `foregroundRadius`, `backgroundRadius` e `inspectRadius` definidas nas configurações controlem com precisão cirúrgica o tamanho relativo em cena.

### Shaders GLSL Customizados: Atmosfera Fresnel & Nebulosa Procedural
- **Atmosfera Planetária (`AtmosphereHalo.tsx`):**  
  Um shader GLSL customizado calcula o termo Fresnel ($\text{pow}(1.0 - \vec{N} \cdot \vec{V}, \text{power})$), concentrando o brilho atmosférico na borda visível (limbo do planeta). Além disso, calcula o produto escalar com o vetor da luz solar distante (`SUN_SCENE_CONFIG.keyLightPosition`), iluminando apenas o hemisfério diurno e criando uma faixa de crepúsculo realista no terminador.
- **Campo Estelar e Nebulosa (`StarfieldAndNebula.tsx`):**  
  Em vez de carregar mapas de textura de céu dezenas de megabytes mais pesados, a nebulosa cósmica é gerada proceduralmente na GPU com ruído trigonométrico em tempo de execução, oferecendo resolução infinita e custo mínimo de memória RAM/VRAM.

### Projeção Esférica de Pins de Superfície (Lat/Lon → Vector3)
Os artefatos que repousam em solo marciano ou lunar (como o LRRR, Opportunity e Ingenuity) possuem coordenadas planetárias reais.
- A função `latLonToVector3(lat, lon, radius)` converte latitude e longitude geográficas em coordenadas cartesianas tridimensionais esféricas:
  $$x = r \cdot \sin(\phi) \cdot \cos(\theta)$$
  $$y = r \cdot \cos(\phi)$$
  $$z = r \cdot \sin(\phi) \cdot \sin(\theta)$$
  onde $\phi = 90^\circ - \text{lat}$ e $\theta = \text{lon}$.
- Os marcadores HTML em 3D (`ArtifactPinMarker`) são inseridos como filhos diretos do grupo giratório do astro, fazendo com que o pin gire perfeitamente alinhado com o terreno quando o usuário arrasta o planeta.

### Motor de Áudio Procedural Sintetizado (Web Audio API)
O projeto prescinde do download de arquivos `.mp3` ou `.wav` pesados para a experiência sonora:
- O módulo `soundEffects.ts` instancia um grafo de nós de áudio em tempo de execução (`AudioContext`, `OscillatorNode`, `GainNode`, `BiquadFilterNode`).
- **Som Ambiente Espacial:** Dois osciladores analógicos (um senoidal na nota Lá1 a 55 Hz e um triangular na nota Mi2 a 82,41 Hz) filtrados por passa-baixa a 160 Hz geram um zumbido cósmico relaxante de fundo.
- **Feedback Sonoro de Ações:** Modulações de frequência sintéticas geram pings de sonar ao pairar sobre planetas, acordes de transição hiperespacial em subida de tom (*pitch sweep*) e cliques táteis de interface.
- **Acessibilidade Sonora:** O áudio inicia **estritamente mudo** por padrão, respeitando as políticas modernas de navegadores e a conveniência do usuário, sendo ativado somente após clique explícito no botão do HUD.

### Carregamento com Geometria Calibrada com a Identidade Visual
A tela de carregamento (`LoadingScreen.tsx`) não exibe uma barra de progresso convencional:
- O logotipo da missão (`logo.png`) possui uma elipse orbital inclinada e anéis orbitais concêntricos em torno da tipografia "BEYOND".
- O componente foi calibrado com coordenadas e raios exatos (`ORBIT_CX: 948`, `ORBIT_CY: 409`, `ORBIT_RX: 342`, `ORBIT_RY: 68`, ângulo de $-26,8^\circ$).
- Durante o pré-carregamento assíncrono dos modelos 3D, um ponto luminoso de plasma e um traço de laser correm ao redor do anel orbital em tempo real, atingindo a órbita fechada ao alcançar 100% dos dados carregados.

### Acessibilidade & Fallbacks Resilientes
- **Sensibilidade a Movimento (`prefers-reduced-motion`):** O sistema monitora a preferência do sistema operacional do usuário. Caso o modo de movimento reduzido esteja ativado, o túnel hiperespacial e as transições bruscas são desativados, substituindo-os por transições suaves de fade e tempos reduzidos.
- **Resiliência a Falhas de WebGL:** Caso a placa de vídeo ou o navegador não suportem WebGL2/WebGL, o sistema captura a exceção e renderiza uma tela informativa de contingência (`WebGLFallbackScreen`), além de possuir esferas procedurais com relevo de ruído procedural caso algum arquivo `.glb` sofra falha de rede.

---

## 7. Experiência do Usuário (UX/UI)

A interface foi projetada como uma cabine de comando espacial futurista e minimalista:

1. **Header HUD (Topo da Tela):**
   - Logotipo oficial do projeto.
   - Navegador de seleção rápida de corpos celestes (`Terra`, `Lua`, `Marte`) com indicador de destino atual e botões com atalhos de clique.
   - Controles de som (ativar/desativar sintetizador) e indicação do modo de movimento.
2. **Viewport 3D Central:**
   - Controle livre de órbita do usuário: arraste com mouse ou toque na tela para rotacionar o astro ou o artefato em 360°.
   - Efeito parallax sutil que reage suavemente à movimentação do cursor.
   - Pins 3D clicáveis flutuando no espaço ou fixados na superfície com badges animados e ícones estilizados.
3. **Painel de Informações Inferior / Lateral (`DestinationInfoPanel`):**
   - **Modo Exploração de Astro:** Mostra o resumo científico do corpo celeste, sua classificação, gravidade na superfície, raio médio e missão associada, além de botão para restaurar o ângulo de rotação inicial.
   - **Modo Inspeção de Artefato 3D:** Substitui o painel por uma estação de trabalho completa com três abas:
     - 📋 **Visão Geral:** Ficha técnica completa, status atual, massa, dimensões e localização orbital/geográfica.
     - 📜 **História:** Relato aprofundado do lançamento, do drama operacional da missão e das circunstâncias em que o artefato foi deixado ou redescoberto.
     - 🔬 **Importância:** Análise do legado científico, impacto astronômico e lições para as próximas gerações de exploradores.

---

## 8. Estrutura de Diretórios

```text
beyond_the_mission/
├── 3d_models/                           # Modelos 3D originais em formato GLB
│   ├── Earth_1_12756.glb                # Modelo esférico texturizado da Terra
│   ├── moon_small.glb                   # Modelo detalhado da Lua
│   ├── 24881_Mars_1_6792.glb            # Modelo geológico de Marte
│   ├── j002e3_s_ivb.glb                 # Terceiro estágio do Saturn V (Apollo 12)
│   ├── apollo_lrrr.glb                  # Retrorefletor a laser lunar
│   ├── apollo_lunar_module.glb          # Módulo Lunar Snoopy (LM-4)
│   ├── opportunity_rover.glb            # Rover geológico Opportunity
│   └── ingenuity_helicopter.glb         # Helicóptero marciano Ingenuity
│
├── public/                              # Ativos estáticos públicos e favicons
│   ├── logo-header.png                  # Versão horizontal do logo para a HUD
│   └── ...
│
├── src/
│   ├── App.tsx                          # Orquestrador central de estado e navegação
│   ├── main.tsx                         # Entrada React 18 e montagem no DOM
│   ├── index.css                        # Configurações globais de Tailwind e fontes
│   │
│   ├── components/
│   │   ├── scene/                       # Núcleo de renderização gráfica 3D (Three.js/R3F)
│   │   │   ├── SpaceExperienceCanvas.tsx# Canvas Three.js com câmera e render loops
│   │   │   ├── CelestialBodyActor.tsx   # Atores celestes (Terra, Lua, Marte) e malhas
│   │   │   ├── ArtifactSceneActors.tsx  # Pins na superfície, pins no vácuo e foco de inspeção
│   │   │   ├── HyperspaceTransition.tsx # Sistema de partículas e túnel de velocidade da luz
│   │   │   ├── ExplorationControls.tsx  # Manipulação de arrasto, inércia e rotação 360°
│   │   │   ├── AtmosphereHalo.tsx       # Shader GLSL de dispersão Fresnel atmosférica
│   │   │   ├── StarfieldAndNebula.tsx   # Shader GLSL de estrelas e nebulosa procedural
│   │   │   ├── SpaceLighting.tsx        # Iluminação estelar coordenada com o Sol
│   │   │   └── FallbackCelestialSphere.tsx # Malhas esféricas procedurais de segurança
│   │   │
│   │   └── ui/                          # Interface de usuário (HUD e Janelas)
│   │       ├── HeaderHud.tsx            # Barra de comando superior e seletores
│   │       ├── DestinationInfoPanel.tsx # Ficha técnica, abas de história e especificações
│   │       ├── ArtifactCartoonIcons.tsx # Ilustrações SVG vetoriais customizadas dos artefatos
│   │       ├── LoadingScreen.tsx        # Tela de carregamento com anéis sincronizados ao logo
│   │       └── WebGLFallbackScreen.tsx  # Tela de fallback para dispositivos sem WebGL
│   │
│   ├── config/                          # Dados estáticos e calibrações científicas
│   │   ├── celestialBodies.ts           # Dimensões, materiais, shaders e dados dos planetas
│   │   └── spaceArtifacts.ts            # Metadados, coordenadas, especificações dos 5 artefatos
│   │
│   ├── types/
│   │   └── experience.ts                # Definições TypeScript dos modelos, slots e estados
│   │
│   └── utils/
│       ├── modelPreloader.ts            # Pré-carregamento assíncrono e normalização Box3
│       ├── orbitalTransitionMath.ts     # Cinemática e trigonometria da órbita a 120°
│       └── soundEffects.ts              # Síntese sonora em tempo real via Web Audio API
│
├── package.json                         # Dependências do ecossistema e scripts de build
├── vite.config.ts                       # Configuração de build, compilação e plugins do Vite
├── tailwind.config.js                   # Tema customizado de cores, fontes e sombras
└── tsconfig.json                        # Configuração do compilador TypeScript
```

---

## 9. Conclusão & Impacto Educacional

O projeto **Beyond the Mission** sintetiza a interseção entre **ciência aeroespacial, computação gráfica contemporânea e experiência interativa de design**.

Ao resgatar as histórias de relíquias como o estágio **J002E3**, os prismas do **LRRR**, a solidão do módulo **Snoopy**, a incansável travessia do rover **Opportunity** e os voos pioneiros do **Ingenuity**, a plataforma cumpre com precisão o lema que a inspirou:

> *As máquinas humanas que desbravaram o cosmos podem ter sido deixadas para trás no cumprimento de suas jornadas, mas seu pioneirismo jamais será esquecido.*
