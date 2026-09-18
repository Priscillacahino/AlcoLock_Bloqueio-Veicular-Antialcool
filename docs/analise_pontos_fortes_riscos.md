# AlcoLock - Pontos fortes, limitações e riscos

## Pontos positivos
- Prevenção antes do início da condução, evitando a estratégia insegura de desligar o veículo em movimento.
- Uso conceitual de múltiplas fontes de sinal em vez de confiar em um único sensor.
- Estados explícitos de resultado inconclusivo e sensor indisponível.
- Jornada de recuperação após o bloqueio, com contatos de confiança e motorista substituto.
- Preocupação com UX/CX, linguagem não julgadora e clareza em situação potencialmente estressante.
- Privacidade e LGPD consideradas ainda na concepção.
- Limites acadêmicos e ausência de homologação explicitados no projeto.
- Arquitetura modular que permite evoluir software, sensores, dados e testes de forma independente.

## Pontos negativos / riscos
- Não há validação física documentada dos sensores, calibração ou precisão em ambiente automotivo real.
- Sensores passivos no ar/cabeceira sofrem interferência de ventilação, posição, passageiros, produtos com álcool e ambiente.
- Falsos positivos e falsos negativos são riscos centrais e ainda precisam de ensaios controlados.
- Não existe evidência de integração automotiva de nível de segurança funcional.
- Localização, histórico de eventos e resultados de sensor criam riscos relevantes de privacidade.
- Fluxo de motorista substituto precisa evitar troca simulada de condutor ou outras formas de contorno.
- Dependência de celular, rede, GPS e contatos pode falhar no momento de necessidade.
- Homologação, responsabilidade civil, cibersegurança veicular e regulamentação são barreiras relevantes.
- O escopo é multidisciplinar e pode crescer rapidamente sem critérios claros de MVP.
- A base local de acidentes com álcool publicamente verificável é pequena e sujeita a subnotificação; ela contextualiza o problema, mas não valida sozinha a eficácia da solução.

## Prioridades recomendadas
1. Formalizar requisitos, regras e matriz de rastreabilidade.
2. Criar simulador de estados e motor de decisão sem conexão com veículo real.
3. Definir modelo de dados mínimo e política de retenção.
4. Criar testes automatizados para aprovado/não aprovado/inconclusivo/falha.
5. Prototipar sensores em bancada e medir falso positivo/negativo.
6. Fazer testes de usabilidade do fluxo de bloqueio e recuperação.
7. Criar threat model e controles anti-circunvenção.
8. Somente depois avaliar integração automotiva com especialistas e processo de homologação.
