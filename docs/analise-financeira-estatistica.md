# Análise financeira e estatística — AlcoLock

> Documento complementar de estudo. Os valores reais ainda não foram cotados e não devem ser inferidos a partir deste arquivo.

## 1. Objetivo

A análise financeira do AlcoLock serve para responder uma pergunta simples: **quanto custaria desenvolver, testar, manter e eventualmente operar um sistema desse tipo, e quais variáveis mais influenciam esse custo?**

Nesta fase, o projeto continua acadêmico. Por isso, a documentação trabalha com **categorias, fórmulas e cenários**, sem inventar preços de sensores, homologação ou desenvolvimento.

## 2. Estrutura de custos

### CAPEX — investimento inicial

| Grupo | Exemplos | Situação atual |
|---|---|---|
| Protótipo físico | sensores, microcontrolador, alimentação, gabinete e bancada | a cotar |
| Integração | chicotes, interfaces, módulos e instrumentação | a cotar |
| Desenvolvimento | software, UX, documentação e testes | Projeto acadêmico |
| Validação | calibração, ensaios controlados e equipamentos de referência | Não medido |
| Engenharia/homologação | segurança funcional, testes automotivos e certificações | Fora do escopo atual |

### OPEX — custos recorrentes

| Grupo | Exemplos | Situação atual |
|---|---|---|
| Manutenção | substituição e recalibração de sensores | Futuro |
| Suporte | atendimento, diagnóstico e atualização | Futuro |
| Conectividade | SMS, dados móveis ou comunicação com aplicativo | Futuro |
| Infraestrutura digital | API, banco, telemetria e armazenamento | Futuro/opcional |
| Observabilidade | logs técnicos e métricas operacionais | Futuro/opcional |

## 3. Custo Total de Propriedade (TCO)

O indicador principal proposto é o TCO:

```text
TCO = investimento inicial + custos operacionais + manutenção + reposições + suporte
```

Para estudos de frota:

```text
Custo médio por veículo = TCO do período / quantidade de veículos
```

Para um protótipo que registre testes:

```text
Custo por validação útil = custo operacional do período / quantidade de validações válidas
```

Essas fórmulas permitem comparar alternativas sem assumir que a tecnologia mais barata na compra será a mais barata ao longo do uso.

## 4. Cenários de comparação

A análise deve comparar ao menos três cenários quando existirem cotações reais:

| Cenário | Característica | Uso |
|---|---|---|
| Enxuto | menor quantidade de sensores e integração mínima | validar conceito |
| Intermediário | redundância moderada e melhor instrumentação | protótipo avançado |
| Completo | múltiplos sensores, telemetria e requisitos automotivos | estudo futuro, não implementado |

O objetivo não é escolher agora um “vencedor”, mas observar **qual item faz o custo crescer e qual benefício técnico ele pretende entregar**.

## 5. Estatística e probabilidades

As probabilidades só devem ser calculadas quando houver uma base de testes adequada. A pesquisa de ocorrências públicas de João Pessoa é útil para contextualizar o problema, mas **não possui uma população de exposição que permita calcular a probabilidade de um acidente ou a eficácia do AlcoLock**.

Quando houver ensaios controlados, acompanhar:

- taxa de validações aprovadas;
- taxa de validações não aprovadas;
- percentual de resultados inconclusivos;
- percentual de sensor indisponível;
- falsos positivos;
- falsos negativos;
- quantidade média de repetições por teste;
- falhas por sensor e por período;
- tempo médio de recuperação após falha.

Fórmulas básicas:

```text
Taxa de falha = número de falhas / número total de testes

Taxa de inconclusivos = testes inconclusivos / testes totais

Custo esperado de um risco = probabilidade do evento × impacto financeiro do evento
```

Quando existirem vários riscos:

```text
Custo esperado total = Σ (probabilidade do risco i × impacto financeiro do risco i)
```

Exemplos de eventos para futura modelagem: falha do sensor, necessidade de repetição, troca prematura de componente, falso bloqueio, indisponibilidade de comunicação e manutenção não programada.

> **Importante:** sem amostra suficiente, as probabilidades devem permanecer como “não medidas”. Não utilizar percentuais inventados apenas para completar gráficos.

## 6. Receitas e viabilidade comercial — somente hipótese futura

O AlcoLock não é apresentado hoje como negócio ou produto comercial. Caso esse estudo seja feito no futuro, podem ser avaliados modelos como:

- venda/integração de hardware;
- licenciamento de software;
- serviço para frotas;
- manutenção e suporte;
- assinatura de plataforma de monitoramento, se houver infraestrutura digital.

Somente nessa etapa faria sentido calcular margem, ponto de equilíbrio e retorno do investimento.

```text
Margem unitária = preço hipotético - custo variável unitário

Ponto de equilíbrio = custos fixos / margem unitária
```

## 7. Sensibilidade financeira

As variáveis com maior potencial de impacto devem ser testadas individualmente:

- preço dos sensores;
- quantidade de sensores por veículo;
- frequência de calibração;
- taxa de substituição de componentes;
- horas de engenharia;
- volume de veículos;
- custo de conectividade;
- volume de telemetria armazenada;
- exigências de validação/homologação.

Uma planilha futura pode variar essas entradas e mostrar como o TCO muda. Isso é mais útil do que fixar agora números sem cotação.

## 8. Onde FinOps pode agregar

**FinOps não é o foco financeiro principal do AlcoLock neste momento.** A análise atual é essencialmente contábil, econômica e de risco do projeto.

FinOps passa a fazer sentido se uma versão futura utilizar nuvem para API, telemetria, armazenamento, alertas ou dashboards. Nesse cenário, pode agregar com:

- orçamento e alertas de gasto de nuvem;
- identificação de custo por veículo, cliente ou ambiente;
- custo por evento/telemetria;
- retenção adequada de logs;
- escolha de serviços e capacidade;
- comparação entre custo e valor gerado pela infraestrutura digital.

Assim, FinOps entra **como camada complementar de governança da infraestrutura digital futura**, sem alterar o objetivo atual do protótipo.

## 9. Próximos dados a coletar

1. cotação de componentes para um protótipo de bancada;
2. estimativa de horas de desenvolvimento e integração;
3. custo de instrumentos de referência/calibração;
4. número de testes controlados realizados;
5. quantidade de resultados válidos, inconclusivos e falhas;
6. vida útil observada dos componentes;
7. eventual custo de conectividade ou nuvem, caso seja adotada.

Com esses dados, os cálculos deixam de ser apenas modelo e passam a representar o projeto de forma mensurável.
