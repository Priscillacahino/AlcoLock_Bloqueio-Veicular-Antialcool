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
- sensor de contato;
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
