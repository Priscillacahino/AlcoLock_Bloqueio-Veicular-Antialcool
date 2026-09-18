# ðŸš— AlcoLock â€” Bloqueio Veicular Preventivo por DetecÃ§Ã£o de Ãlcool

> **Projeto acadÃªmico e experimental, desenvolvido com finalidade de aprendizagem.**
>
> O AlcoLock nÃ£o Ã© um sistema automotivo homologado, certificado ou pronto para instalaÃ§Ã£o em veÃ­culos reais.

## ðŸ“Œ VisÃ£o geral

O **AlcoLock** Ã© um conceito de sistema preventivo de seguranÃ§a veicular pensado para reduzir o risco de conduÃ§Ã£o por uma pessoa que nÃ£o seja aprovada na validaÃ§Ã£o de Ã¡lcool antes do inÃ­cio do deslocamento.

A proposta vai alÃ©m de simplesmente detectar Ã¡lcool e bloquear o veÃ­culo. O projeto tambÃ©m estuda como **sensores, software, experiÃªncia do usuÃ¡rio, localizaÃ§Ã£o e uma rede de contatos de confianÃ§a** podem trabalhar juntos para ajudar o motorista a encontrar uma alternativa segura.

A ideia central Ã©:

```text
detectar risco
      â†“
impedir o inÃ­cio da conduÃ§Ã£o
      â†“
explicar o que aconteceu
      â†“
oferecer alternativas seguras
      â†“
localizar um motorista substituto
      â†“
realizar nova validaÃ§Ã£o
      â†“
liberar o veÃ­culo somente apÃ³s aprovaÃ§Ã£o
```

---

# ðŸ’¡ Origem da ideia e pesquisa posterior

O AlcoLock nasceu como uma **ideia prÃ³pria de projeto de aprendizagem**, a partir da reflexÃ£o sobre como reduzir o risco de uma pessoa iniciar a conduÃ§Ã£o de um veÃ­culo apÃ³s consumir Ã¡lcool.

A concepÃ§Ã£o inicial do projeto surgiu **antes de eu ter conhecimento de pesquisas e iniciativas jÃ¡ existentes sobre detecÃ§Ã£o passiva de Ã¡lcool em veÃ­culos**.

Somente depois de comeÃ§ar a desenvolver e pesquisar formas tecnicamente possÃ­veis de implementar a ideia â€” incluindo sensores de ar, sensores por contato, identificaÃ§Ã£o do motorista e alternativas para reduzir falsos positivos â€” tomei conhecimento de programas e estudos que investigam problemas semelhantes.

Essas referÃªncias passaram entÃ£o a ser utilizadas para:

- compreender melhor a viabilidade tÃ©cnica de determinados conceitos;
- identificar limitaÃ§Ãµes que eu ainda nÃ£o havia considerado;
- comparar diferentes formas de detecÃ§Ã£o;
- melhorar a documentaÃ§Ã£o acadÃªmica do projeto;
- evitar apresentar como inÃ©dita uma tecnologia que jÃ¡ possui pesquisa anterior.

A existÃªncia dessas pesquisas **nÃ£o foi a origem da concepÃ§Ã£o do AlcoLock**.

O projeto nÃ£o utiliza cÃ³digo, arquivos, layouts, protÃ³tipos ou documentaÃ§Ã£o interna de terceiros como base para sua concepÃ§Ã£o inicial. As fontes pÃºblicas citadas na documentaÃ§Ã£o sÃ£o utilizadas como **referÃªncias tÃ©cnicas e bibliogrÃ¡ficas posteriores**, para contextualizar tecnologias relacionadas e apoiar o processo de aprendizagem.

> Este registro tem finalidade de transparÃªncia sobre a evoluÃ§Ã£o do projeto. Ele nÃ£o representa, por si sÃ³, uma anÃ¡lise jurÃ­dica de originalidade, autoria, patenteabilidade ou propriedade intelectual.

Mais detalhes em [`docs/origem-e-pesquisa.md`](docs/origem-e-pesquisa.md).


---

## ðŸŽ¯ Problema

Uma soluÃ§Ã£o baseada exclusivamente em Ã¡lcool presente no ar da cabine pode enfrentar situaÃ§Ãµes de ambiguidade.

Exemplos:

- outros ocupantes do veÃ­culo tambÃ©m podem ter consumido Ã¡lcool;
- o ambiente pode conter interferÃªncias;
- Ã© necessÃ¡rio aumentar a confianÃ§a de que a leitura estÃ¡ associada ao motorista;
- leituras inconclusivas ou falsos positivos precisam ser tratados de forma segura;
- apenas bloquear o veÃ­culo nÃ£o resolve a necessidade de o usuÃ¡rio retornar com seguranÃ§a.

Por isso, o AlcoLock estuda uma arquitetura baseada em **mÃºltiplas etapas de validaÃ§Ã£o e recuperaÃ§Ã£o segura da jornada**.

---

## ðŸ’¡ Conceito da soluÃ§Ã£o

Antes de permitir o inÃ­cio do deslocamento, o sistema deverÃ¡ verificar as condiÃ§Ãµes do motorista.

### Fluxo conceitual

```text
Motorista assume a posiÃ§Ã£o de conduÃ§Ã£o
               â”‚
               â–¼
       ValidaÃ§Ã£o do condutor
               â”‚
               â–¼
        Leitura dos sensores
               â”‚
               â–¼
          AnÃ¡lise do teste
               â”‚
        â”Œâ”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”
        â”‚             â”‚
     Aprovado     NÃ£o aprovado
        â”‚             â”‚
        â–¼             â–¼
   VeÃ­culo pode    Bloqueio
 iniciar jornada       â”‚
                       â–¼
               ExplicaÃ§Ã£o clara
                       â”‚
                       â–¼
             Alternativas seguras
```

> O projeto prioriza **impedir o inÃ­cio de uma conduÃ§Ã£o considerada insegura**. NÃ£o faz parte do conceito desligar abruptamente um motor com o veÃ­culo em movimento.

---

## ðŸ§ª EstratÃ©gias de detecÃ§Ã£o estudadas

### 1. DetecÃ§Ã£o pelo ar

Sensores de Ã¡lcool no ar podem ser utilizados em protÃ³tipos acadÃªmicos para estudar presenÃ§a e concentraÃ§Ã£o de vapores.

Entretanto, uma leitura de cabine isolada pode nÃ£o ser suficiente para determinar com confianÃ§a qual ocupante originou a amostra.

Por isso, esse tipo de sensor deve ser tratado como **uma fonte de informaÃ§Ã£o**, e nÃ£o necessariamente como a Ãºnica responsÃ¡vel pela decisÃ£o.

### 2. DetecÃ§Ã£o por toque

Outra linha estudada pelo projeto Ã© a possibilidade de utilizar sensores de contato em componentes usados diretamente pelo motorista, como volante, botÃ£o de partida ou outro ponto de interaÃ§Ã£o.

Existem pesquisas automotivas sobre **espectroscopia de tecido**, utilizando luz infravermelha para estimar Ã¡lcool presente abaixo da superfÃ­cie da pele.

No AlcoLock, essa tecnologia Ã© tratada como **referÃªncia de pesquisa e possibilidade de evoluÃ§Ã£o futura**, e nÃ£o como funcionalidade atualmente implementada ou validada.

### 3. Sensor passivo integrado Ã  cabeceira do banco

Uma nova linha de pesquisa do AlcoLock considera a utilizaÃ§Ã£o da **cabeceira do banco do motorista como ponto de coleta passiva do ar expirado**.

A proposta nÃ£o Ã© medir Ã¡lcool diretamente pela pele do pescoÃ§o. O conceito Ã© posicionar entradas de ar ou sensores na regiÃ£o da cabeceira, prÃ³xima Ã  cabeÃ§a do condutor, para analisar o ar expirado naturalmente durante a respiraÃ§Ã£o.

Em um estudo conceitual, esse mÃ³dulo poderia combinar:

- detecÃ§Ã£o de COâ‚‚, como indicador de presenÃ§a de respiraÃ§Ã£o humana;
- detecÃ§Ã£o de etanol no ar;
- temperatura e umidade;
- qualidade e estabilidade da amostra;
- ocupaÃ§Ã£o do banco do motorista;
- posiÃ§Ã£o aproximada do condutor.

Exemplo:

```text
          Motorista
        nariz / boca
             â†“
      ar expirado normal
             â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Cabeceira do motorista  â”‚
â”‚                         â”‚
â”‚ entrada de ar           â”‚
â”‚ COâ‚‚                     â”‚
â”‚ etanol                  â”‚
â”‚ temperatura/umidade     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
             â†“
      anÃ¡lise do sinal
```

A hipÃ³tese Ã© que a proximidade com o motorista possa ajudar a reduzir a influÃªncia de passageiros ou de Ã¡lcool presente em outras regiÃµes da cabine.

Entretanto, essa possibilidade precisa ser validada experimentalmente. Fluxo de ar, ventilaÃ§Ã£o, posiÃ§Ã£o da cabeÃ§a, distÃ¢ncia, janelas abertas, ar-condicionado e movimentaÃ§Ã£o dos ocupantes podem alterar significativamente uma leitura.

Por isso, a cabeceira deve ser tratada como **uma possÃ­vel fonte adicional de dados**, e nÃ£o como prova isolada de consumo de Ã¡lcool.

### 4. FusÃ£o de sensores

Uma evoluÃ§Ã£o possÃ­vel Ã© combinar diferentes sinais para aumentar a confiabilidade da decisÃ£o.

Exemplo conceitual:

```text
ocupaÃ§Ã£o do banco
        +
sensor passivo na cabeceira
(COâ‚‚ + etanol + qualidade)
        +
sensor de contato no volante
        +
sensor ambiental da cabine
        +
consistÃªncia temporal
        â†“
motor de decisÃ£o
```

Exemplos de interpretaÃ§Ã£o:

```text
Cabeceira:      COâ‚‚ + etanol detectados
Volante:        leitura compatÃ­vel
Cabine geral:   Ã¡lcool baixo

â†’ sinais convergentes associados ao motorista
```

```text
Cabeceira:      leitura baixa/inconclusiva
Volante:        leitura baixa
Cabine geral:   Ã¡lcool elevado

â†’ possÃ­vel interferÃªncia ambiental ou de outro ocupante
â†’ nÃ£o concluir automaticamente que o motorista ingeriu Ã¡lcool
```

O objetivo da fusÃ£o nÃ£o Ã© produzir uma acusaÃ§Ã£o automÃ¡tica, mas melhorar a qualidade da decisÃ£o e permitir estados como `INCONCLUSIVO` quando os sinais forem conflitantes.

---

## ðŸ” Bloqueio preventivo

Caso o motorista nÃ£o seja aprovado:

- o veÃ­culo permanece impossibilitado de iniciar a conduÃ§Ã£o;
- o sistema informa claramente que a validaÃ§Ã£o nÃ£o foi aprovada;
- o usuÃ¡rio recebe opÃ§Ãµes de ajuda;
- outro motorista poderÃ¡ ser chamado;
- o novo motorista deverÃ¡ realizar sua prÃ³pria validaÃ§Ã£o;
- somente uma validaÃ§Ã£o aprovada poderÃ¡ prosseguir para a liberaÃ§Ã£o.

### Resultado inconclusivo

Uma leitura inconclusiva **nÃ£o deve ser apresentada como confirmaÃ§Ã£o de embriaguez**.

O sistema deverÃ¡ diferenciar pelo menos:

- `APROVADO`
- `NÃƒO APROVADO`
- `TESTE INCONCLUSIVO`
- `SENSOR INDISPONÃVEL`

Isso evita transformar uma falha tÃ©cnica em uma afirmaÃ§Ã£o incorreta sobre o usuÃ¡rio.

---

## ðŸ“ RecuperaÃ§Ã£o segura da jornada

Bloquear o veÃ­culo resolve apenas parte do problema.

Depois de impedir a conduÃ§Ã£o, o usuÃ¡rio ainda precisa encontrar uma alternativa segura.

Por isso, o AlcoLock prevÃª uma **rede de contatos prioritÃ¡rios** previamente cadastrados.

Quando ocorrer um bloqueio, o sistema poderÃ¡ oferecer:

- ðŸ“ž ligaÃ§Ã£o para contato de confianÃ§a;
- ðŸ’¬ envio de SMS ou mensagem compatÃ­vel com a plataforma;
- ðŸ“ compartilhamento da localizaÃ§Ã£o do veÃ­culo mediante configuraÃ§Ã£o e consentimento;
- ðŸš— solicitaÃ§Ã£o para que outro motorista vÃ¡ atÃ© o local;
- ðŸ”„ novo teste quando o motorista substituto chegar.

### Exemplo de mensagem

> NÃ£o estou em condiÃ§Ãµes de prosseguir como motorista neste momento. Preciso de ajuda para retornar com seguranÃ§a. Minha localizaÃ§Ã£o poderÃ¡ ser compartilhada conforme as permissÃµes configuradas no aplicativo.

A redaÃ§Ã£o final das mensagens deverÃ¡ ser validada em testes de UX/CX para ser clara, respeitosa e nÃ£o julgadora.

---

# ðŸ§­ Jornada completa

```text
Tentativa de iniciar a conduÃ§Ã£o
              â”‚
              â–¼
      IdentificaÃ§Ã£o/validaÃ§Ã£o
              â”‚
              â–¼
       Leitura dos sensores
              â”‚
         â”Œâ”€â”€â”€â”€â”´â”€â”€â”€â”€â”
         â”‚         â”‚
     Aprovado   NÃ£o aprovado
         â”‚         â”‚
         â–¼         â–¼
     LiberaÃ§Ã£o   Bloqueio
                   â”‚
                   â–¼
            ExplicaÃ§Ã£o ao usuÃ¡rio
                   â”‚
                   â–¼
             OpÃ§Ãµes de ajuda
                   â”‚
       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
       â–¼           â–¼           â–¼
    LigaÃ§Ã£o      Mensagem   LocalizaÃ§Ã£o
       â”‚           â”‚           â”‚
       â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                   â”‚
                   â–¼
        Motorista substituto chega
                   â”‚
                   â–¼
              Novo teste
                   â”‚
             â”Œâ”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”
             â–¼           â–¼
         Aprovado    NÃ£o aprovado
             â”‚
             â–¼
          LiberaÃ§Ã£o
```

---

# ðŸ¤ Customer Experience (CX)

CX tem papel relevante no AlcoLock porque um sistema de seguranÃ§a nÃ£o precisa apenas tomar uma decisÃ£o tÃ©cnica: ele precisa fazer com que o usuÃ¡rio **entenda o que ocorreu, saiba o que fazer e consiga concluir a situaÃ§Ã£o com seguranÃ§a**.

## AtuaÃ§Ã£o de CX no projeto

- mapear a jornada antes, durante e depois de um bloqueio;
- identificar pontos de atrito;
- desenhar mensagens compreensÃ­veis;
- evitar linguagem acusatÃ³ria ou constrangedora;
- estruturar o fluxo de recuperaÃ§Ã£o;
- reduzir confusÃ£o em resultados inconclusivos;
- projetar acessibilidade;
- realizar testes de usabilidade;
- analisar confianÃ§a e compreensÃ£o do sistema;
- estudar tratamento de falsos positivos;
- transformar feedback em melhorias de produto.

A pergunta de CX nÃ£o Ã© apenas:

> **â€œO sensor funcionou?â€**

TambÃ©m Ã©:

> **â€œO usuÃ¡rio compreendeu a decisÃ£o, encontrou ajuda e conseguiu encerrar a jornada de forma segura?â€**

---

# ðŸ¤ Customer Success (CS)

No contexto do AlcoLock, Customer Success pode acompanhar se o usuÃ¡rio consegue configurar e utilizar corretamente os recursos que tornam o sistema Ãºtil.

PossÃ­veis responsabilidades:

- onboarding;
- configuraÃ§Ã£o inicial;
- cadastro de contatos prioritÃ¡rios;
- orientaÃ§Ã£o sobre permissÃµes de localizaÃ§Ã£o;
- educaÃ§Ã£o sobre funcionamento e limitaÃ§Ãµes;
- apoio em falhas e leituras inconclusivas;
- acompanhamento de dÃºvidas recorrentes;
- coleta estruturada de feedback;
- anÃ¡lise da adoÃ§Ã£o dos recursos de seguranÃ§a;
- documentaÃ§Ã£o e base de conhecimento.

Em um cenÃ¡rio futuro envolvendo frotas, locadoras, empresas ou instituiÃ§Ãµes, CS tambÃ©m poderia acompanhar implantaÃ§Ã£o, adesÃ£o, suporte, indicadores e melhoria contÃ­nua.

---

# ðŸ“Š Indicadores de CX/CS

Em protÃ³tipos e testes simulados, podem ser avaliados:

- taxa de conclusÃ£o do onboarding;
- percentual de usuÃ¡rios que configuram contatos de confianÃ§a;
- taxa de sucesso na execuÃ§Ã£o das tarefas;
- tempo para compreender um bloqueio;
- tempo para encontrar a opÃ§Ã£o de ajuda;
- percentual de testes inconclusivos;
- ocorrÃªncia de falsos positivos em ambiente controlado;
- quantidade mÃ©dia de tentativas necessÃ¡rias;
- taxa de sucesso no fluxo de motorista substituto;
- principais motivos de abandono;
- principais solicitaÃ§Ãµes de suporte;
- CES (Customer Effort Score) em testes de usabilidade;
- CSAT apÃ³s simulaÃ§Ãµes nÃ£o crÃ­ticas.

> MÃ©tricas de experiÃªncia devem ser utilizadas para melhorar **seguranÃ§a, clareza e confiabilidade**, e nÃ£o para incentivar o usuÃ¡rio a contornar um bloqueio.

---

# ðŸ”’ Privacidade e LGPD

O projeto poderÃ¡ envolver informaÃ§Ãµes como:

- identificaÃ§Ã£o do usuÃ¡rio;
- contatos de confianÃ§a;
- localizaÃ§Ã£o;
- eventos do veÃ­culo;
- resultados dos sensores;
- registros de tentativas e validaÃ§Ãµes.

Por isso, privacidade deve fazer parte do projeto desde a concepÃ§Ã£o.

PrincÃ­pios propostos:

- minimizaÃ§Ã£o de dados;
- finalidade definida;
- transparÃªncia;
- controle de permissÃµes;
- retenÃ§Ã£o limitada;
- proteÃ§Ã£o dos dados armazenados;
- autenticaÃ§Ã£o;
- registros de auditoria quando necessÃ¡rios;
- compartilhamento de localizaÃ§Ã£o somente dentro de fluxos previstos;
- revisÃ£o da base legal adequada antes de qualquer implementaÃ§Ã£o real.

Veja: [`docs/privacidade-seguranca.md`](docs/privacidade-seguranca.md).

---

# âš ï¸ SeguranÃ§a funcional

O AlcoLock Ã© atualmente um projeto de estudo.

Qualquer integraÃ§Ã£o futura com um veÃ­culo real exigiria conhecimentos e validaÃ§Ãµes que vÃ£o alÃ©m de software de aplicaÃ§Ã£o, incluindo:

- engenharia automotiva;
- seguranÃ§a funcional;
- confiabilidade de hardware;
- redundÃ¢ncia;
- testes ambientais;
- calibraÃ§Ã£o;
- requisitos regulatÃ³rios;
- tratamento de falhas;
- anÃ¡lise de riscos;
- homologaÃ§Ã£o.

NÃ£o deve ser presumido que um protÃ³tipo acadÃªmico esteja apto a controlar um veÃ­culo real.

---

# ðŸ§± Arquitetura conceitual

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚       Motorista           â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
              â”‚
              â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Camada de identificaÃ§Ã£o   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
              â”‚
              â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Camada de sensores        â”‚
â”‚ ar / toque / contexto     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
              â”‚
              â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Motor de decisÃ£o          â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
              â”‚
       â”Œâ”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”
       â–¼             â–¼
   Aprovado      NÃ£o aprovado
       â”‚             â”‚
       â–¼             â–¼
   LiberaÃ§Ã£o      Bloqueio
                     â”‚
                     â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Camada de assistÃªncia     â”‚
â”‚ contatos / localizaÃ§Ã£o    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
              â”‚
              â–¼
      Novo motorista/teste
```

Detalhes em [`docs/arquitetura-conceitual.md`](docs/arquitetura-conceitual.md).

---

# ðŸ§ª EstratÃ©gia de validaÃ§Ã£o

O desenvolvimento acadÃªmico pode avanÃ§ar em etapas:

1. validar problema e jornada;
2. criar fluxos e wireframes;
3. criar protÃ³tipo navegÃ¡vel;
4. realizar testes de usabilidade;
5. simular eventos de sensores;
6. registrar estados e decisÃµes;
7. criar protÃ³tipo fÃ­sico isolado do veÃ­culo;
8. medir falhas e leituras inconclusivas;
9. revisar privacidade;
10. documentar limitaÃ§Ãµes e aprendizados.

Nenhuma dessas etapas pressupÃµe instalaÃ§Ã£o em veÃ­culo real.

---


---

# ðŸ–¥ï¸ ProtÃ³tipo inicial

O AlcoLock jÃ¡ possui um **protÃ³tipo inicial em desenvolvimento**, criado para explorar a experiÃªncia do usuÃ¡rio, os fluxos de validaÃ§Ã£o e as funcionalidades previstas para o sistema.

Nesta fase, o protÃ³tipo representa uma versÃ£o preliminar e poderÃ¡ sofrer alteraÃ§Ãµes conforme avancem os estudos tÃ©cnicos, os testes de usabilidade, a anÃ¡lise de sensores e as decisÃµes de UX/CX.

<p align="center">
  <img
    src="./docs/imagens/alcolock_showcase_readme.png"
    alt="ProtÃ³tipo inicial do AlcoLock"
    width="900"
  />
</p>

### O que esta versÃ£o busca demonstrar

- fluxo inicial de interaÃ§Ã£o com o sistema;
- conceito de validaÃ§Ã£o do motorista;
- bloqueio preventivo da conduÃ§Ã£o;
- orientaÃ§Ã£o ao usuÃ¡rio apÃ³s uma nÃ£o aprovaÃ§Ã£o;
- base para acionamento de contatos de confianÃ§a;
- apoio Ã  localizaÃ§Ã£o e recuperaÃ§Ã£o segura da jornada;
- aplicaÃ§Ã£o de UX e Customer Experience;
- estrutura inicial para futuras integraÃ§Ãµes com sensores;
- evoluÃ§Ã£o da experiÃªncia antes da implementaÃ§Ã£o de hardware real.

> ðŸš§ **Status:** protÃ³tipo em desenvolvimento. As telas, fluxos e funcionalidades ainda poderÃ£o sofrer alteraÃ§Ãµes conforme o projeto evoluir.

O protÃ³tipo nÃ£o representa um sistema automotivo homologado ou pronto para instalaÃ§Ã£o em veÃ­culos reais. Ele Ã© utilizado como ferramenta de aprendizagem, validaÃ§Ã£o de fluxos e desenvolvimento conceitual do AlcoLock.

# ðŸ”® Roadmap

## Fase 1 â€” DefiniÃ§Ã£o
- [x] problema e objetivo do projeto;
- [x] conceito de bloqueio preventivo;
- [x] motorista substituto;
- [x] contatos prioritÃ¡rios;
- [x] papel de CX/CS;
- [ ] personas e cenÃ¡rios;
- [ ] requisitos funcionais e nÃ£o funcionais.

## Fase 2 â€” UX/CX
- [ ] fluxo completo;
- [ ] wireframes;
- [ ] protÃ³tipo de alta fidelidade;
- [ ] acessibilidade;
- [ ] testes de usabilidade;
- [ ] revisÃ£o das mensagens.

## Fase 3 â€” Software
- [ ] cadastro de usuÃ¡rio;
- [ ] contatos de confianÃ§a;
- [ ] permissÃµes de localizaÃ§Ã£o;
- [ ] estados de validaÃ§Ã£o;
- [ ] simulaÃ§Ã£o de bloqueio;
- [ ] histÃ³rico de eventos;
- [ ] fluxo do motorista substituto.

## Fase 4 â€” ProtÃ³tipo IoT
- [ ] definiÃ§Ã£o do hardware experimental;
- [ ] leitura de sensor em bancada;
- [ ] calibraÃ§Ã£o experimental;
- [ ] integraÃ§Ã£o com aplicaÃ§Ã£o;
- [ ] registro de telemetria;
- [ ] testes controlados.

## Fase 5 â€” ValidaÃ§Ã£o
- [ ] testes de falsos positivos;
- [ ] testes de falsos negativos;
- [ ] testes de leituras inconclusivas;
- [ ] testes de falha de sensor;
- [ ] revisÃ£o de privacidade/LGPD;
- [ ] documentaÃ§Ã£o dos resultados.

Veja o roadmap detalhado em [`docs/roadmap.md`](docs/roadmap.md).

---

# ðŸ“ Estrutura documental

```text
AlcoLock/
â”œâ”€â”€ README.md
â””â”€â”€ docs/
    â”œâ”€â”€ arquitetura-conceitual.md
    â”œâ”€â”€ cx-cs.md
    â”œâ”€â”€ privacidade-seguranca.md
    â”œâ”€â”€ roadmap.md
    â”œâ”€â”€ testes-validacao.md
    â”œâ”€â”€ referencias.md
    â””â”€â”€ origem-e-pesquisa.md
```

A estrutura de cÃ³digo existente pode permanecer separada desta documentaÃ§Ã£o.

---

# ðŸŽ“ Objetivos de aprendizagem

O projeto permite estudar a integraÃ§Ã£o entre:

- desenvolvimento de software;
- IoT e sensores;
- anÃ¡lise de requisitos;
- UX/UI;
- Customer Experience;
- Customer Success;
- dados;
- seguranÃ§a;
- privacidade;
- documentaÃ§Ã£o tÃ©cnica;
- testes e validaÃ§Ã£o.

O foco nÃ£o Ã© apresentar o AlcoLock como produto pronto, mas **documentar a evoluÃ§Ã£o de uma ideia multidisciplinar, os problemas encontrados, as decisÃµes tomadas e os aprendizados obtidos**.

---

# ðŸ“š DocumentaÃ§Ã£o

- [Arquitetura conceitual](docs/arquitetura-conceitual.md)
- [CX e CS](docs/cx-cs.md)
- [Privacidade e seguranÃ§a](docs/privacidade-seguranca.md)
- [Roadmap](docs/roadmap.md)
- [Testes e validaÃ§Ã£o](docs/testes-validacao.md)
- [ReferÃªncias](docs/referencias.md)
- [Origem da ideia e pesquisa](docs/origem-e-pesquisa.md)

---

# ðŸ“Œ Status

**Em desenvolvimento â€” projeto acadÃªmico/de aprendizagem.**

As funcionalidades descritas representam uma combinaÃ§Ã£o de:

- conceitos definidos;
- recursos planejados;
- hipÃ³teses de pesquisa;
- possÃ­veis evoluÃ§Ãµes.

Cada item deverÃ¡ ser marcado como implementado somente apÃ³s existir evidÃªncia no projeto.

---

## ðŸ‘©â€ðŸ’» Autoria

Projeto desenvolvido por **Priscilla Cahino** como parte de estudos e desenvolvimento de competÃªncias em tecnologia, experiÃªncia do usuÃ¡rio, dados, processos e seguranÃ§a.


---

## Ã°Å¸â€œÅ  Pesquisa ampliada - acidentes e embriaguez em JoÃƒÂ£o Pessoa (2026)

A pesquisa documental foi revisada para nÃƒÂ£o depender apenas do termo **sinistro**. TambÃƒÂ©m foram consultados acidentes, colisÃƒÂµes, atropelamentos, batidas e capotamentos associados a teste positivo, sinais de embriaguez, recusa ao etilÃƒÂ´metro, autuaÃƒÂ§ÃƒÂ£o formal ou conclusÃƒÂ£o de investigaÃƒÂ§ÃƒÂ£o policial.

No perÃƒÂ­odo de **01/01/2026 a 18/09/2026**, foram localizados **5 acidentes em JoÃƒÂ£o Pessoa** com evidÃƒÂªncia pÃƒÂºblica suficiente para a base principal. As fontes registram pelo menos **4 pessoas feridas e 1 morte** nesses cinco eventos. HÃƒÂ¡ ainda um caso de suspeita circunstancial mantido separadamente, sem entrar nos totais principais.

> Os nÃƒÂºmeros representam ocorrÃƒÂªncias publicamente verificÃƒÂ¡veis encontradas no levantamento, e nÃƒÂ£o um censo oficial. Embriaguez confirmada e causalidade do acidente sÃƒÂ£o campos separados na base.

- [Pesquisa ampliada](docs/pesquisa_ampliada_acidentes_embriaguez_joao_pessoa_2026.md)
- [Base de ocorrÃƒÂªncias](data/ocorrencias_ampliadas_joao_pessoa_alcool_2026.csv)
- [RelatÃƒÂ³rio tÃƒÂ©cnico em PDF](docs/AlcoLock_Relatorio_Tecnico_Pesquisa_Ampliada_2026.pdf)

![OcorrÃƒÂªncias ampliadas por mÃƒÂªs](docs/assets/grafico_ocorrencias_ampliadas_mes.png)


