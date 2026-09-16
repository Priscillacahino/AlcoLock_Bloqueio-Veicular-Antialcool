# Arquitetura conceitual — AlcoLock

## Objetivo

Este documento descreve uma arquitetura **conceitual e acadêmica**. Ele não constitui especificação para instalação ou modificação de um veículo real.

## Componentes

### 1. Camada de identificação
Responsável por estabelecer quem está na posição de condução.

Possíveis estudos:
- presença no banco;
- sessão autenticada no aplicativo;
- identificação biométrica futura;
- associação entre teste e sessão atual.

### 2. Camada de sensores
Responsável por receber medições.

Possíveis fontes:
- sensor experimental de álcool no ar;
- sensor passivo integrado à cabeceira do motorista;
- detecção de CO₂ associada à respiração;
- sensor de contato no volante;
- sensor ambiental da cabine;
- sensor de ocupação do banco;
- estado do hardware;
- qualidade/confiança da leitura.

### 3. Motor de decisão
Não deve trabalhar apenas com `sim/não`.

Estados recomendados:
- APROVADO;
- NÃO_APROVADO;
- INCONCLUSIVO;
- SENSOR_INDISPONÍVEL;
- AGUARDANDO_NOVO_MOTORISTA.

### 4. Camada de bloqueio simulado
Durante a fase acadêmica, representar o bloqueio em software ou bancada.

Não utilizar o protótipo para controlar sistemas críticos de um veículo real sem engenharia, validação e homologação adequadas.

### 5. Camada de assistência
Após um resultado não aprovado:
- mostrar explicação;
- listar contatos de confiança;
- permitir ligação/mensagem;
- permitir compartilhamento de localização;
- acompanhar a chegada de um substituto;
- iniciar uma nova sessão de teste.

### 6. Telemetria acadêmica
Registrar somente o necessário para estudar funcionamento e experiência.

Exemplos:
- timestamp;
- tipo de evento;
- estado do teste;
- duração do fluxo;
- erro técnico;
- versão do protótipo.

Evitar armazenar informações desnecessárias.

## Diagrama

```text
[Motorista]
    |
    v
[Identificação]
    |
    v
[Sensores] -----> [Qualidade da leitura]
    |                    |
    +---------+----------+
              v
       [Motor de decisão]
          /         \
         v           v
    [Aprovado]   [Não aprovado/
         |        inconclusivo]
         v           |
 [Liberação          v
  simulada]     [Assistência]
                     |
                     v
              [Novo motorista]
                     |
                     v
                 [Novo teste]
```


## Sensor passivo na cabeceira

Uma hipótese de evolução é incorporar um módulo de análise do ar na cabeceira do banco do motorista.

O objetivo seria coletar o ar expirado naturalmente pelo condutor, sem exigir que ele sopre diretamente em um bocal.

Possíveis sinais:

- CO₂;
- etanol;
- temperatura;
- umidade;
- qualidade da amostra;
- estabilidade temporal.

A presença de CO₂ pode ajudar a indicar que a amostra está associada à respiração humana, enquanto outros sensores e o contexto do banco ajudam a estimar se a origem é realmente o motorista.

```text
         cabeça do motorista
                 |
                 v
        [Cabeceira / entrada]
          |      |      |
         CO₂   etanol  T/U
          \      |      /
           \     |     /
            [qualidade]
                 |
                 v
         [Motor de decisão]
```

### Limitações a estudar

- ar-condicionado;
- janelas abertas;
- posição da cabeça;
- altura do motorista;
- inclinação do banco;
- movimentação;
- passageiros próximos;
- álcool derramado na cabine;
- atraso de resposta;
- necessidade de fluxo de ar controlado.

A cabeceira não deve atuar isoladamente como prova de consumo.

## Fusão multissensor

A arquitetura conceitual passa a considerar a combinação de:

```text
ocupação do banco
      +
cabeceira (CO₂ + etanol)
      +
volante/contato
      +
ambiente da cabine
      +
qualidade e consistência temporal
      ↓
motor de decisão
```

Quando os sinais divergirem, o estado preferencial deve ser `INCONCLUSIVO`, seguido pelo fluxo de nova validação previsto no projeto.


## Requisitos não funcionais a estudar

- confiabilidade;
- disponibilidade;
- acessibilidade;
- privacidade;
- auditabilidade;
- baixa latência;
- clareza dos estados;
- tolerância a falhas;
- segurança contra uso indevido;
- minimização de dados.

## Regra de segurança do projeto

O AlcoLock deve priorizar prevenção **antes do início do deslocamento**.

O conceito não prevê corte abrupto de motor em veículo em movimento.
