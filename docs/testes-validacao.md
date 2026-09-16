# Testes e validação — AlcoLock

## Objetivo

Definir testes acadêmicos sem confundir protótipo com equipamento de medição certificado.

## 1. Testes de software

### Estados
Verificar:
- APROVADO;
- NÃO_APROVADO;
- INCONCLUSIVO;
- SENSOR_INDISPONÍVEL;
- AGUARDANDO_NOVO_MOTORISTA.

### Fluxos
- aprovação direta;
- bloqueio;
- contato prioritário;
- compartilhamento de localização;
- novo motorista;
- segundo resultado não aprovado;
- falha de conexão;
- cancelamento.

## 2. Testes de usabilidade

Tarefas:
1. cadastrar contato;
2. entender resultado;
3. pedir ajuda;
4. compartilhar localização;
5. iniciar fluxo de novo motorista.

Medir:
- conclusão;
- tempo;
- erros;
- dúvidas;
- esforço percebido.

## 3. Testes do sensor em bancada

Registrar:
- modelo do sensor;
- condições de teste;
- tempo de aquecimento;
- número da amostra;
- resultado bruto;
- ruído;
- falhas;
- repetibilidade.

Nunca apresentar o sensor acadêmico como instrumento clínico ou legalmente certificado.

## 4. Matriz básica de risco

| Situação | Risco | Tratamento no protótipo |
|---|---|---|
| Falso positivo | bloqueio indevido | informar estado, permitir fluxo previsto de nova validação e registrar ocorrência |
| Falso negativo | risco de liberação indevida | estudar redundância e limites; não alegar segurança real |
| Sensor offline | ausência de leitura | estado SENSOR_INDISPONÍVEL |
| Leitura instável | decisão incorreta | estado INCONCLUSIVO |
| Sem internet | falha na assistência | prever contatos/recursos compatíveis com funcionamento offline quando possível |
| GPS indisponível | localização ausente | informar claramente e não enviar posição antiga como atual |
| Novo motorista reprovado | condução insegura | manter estado de bloqueio conceitual |

## 5. Evidências

Para cada recurso concluído, guardar:
- captura de tela;
- vídeo curto;
- caso de teste;
- resultado esperado;
- resultado obtido;
- versão.

Isso facilita a evolução do GitHub e do portfólio.
