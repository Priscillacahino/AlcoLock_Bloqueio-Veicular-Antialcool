# Privacidade e segurança — AlcoLock

## Escopo

O AlcoLock poderá tratar dados pessoais e contextuais. Este documento registra princípios para estudos e protótipos; não substitui análise jurídica ou de segurança para um produto real.

## Dados potencialmente envolvidos

- cadastro do usuário;
- telefone;
- contatos de confiança;
- geolocalização;
- eventos do aplicativo;
- status de testes;
- dados de sensores;
- identificadores do dispositivo;
- histórico técnico.

## Princípios

### Minimização
Coletar somente o necessário.

### Finalidade
Definir por que cada dado existe.

### Transparência
Explicar ao usuário o que é coletado e quando.

### Controle
Permitir configuração de permissões compatíveis com a finalidade.

### Retenção
Não manter histórico indefinidamente sem necessidade.

### Segurança
Proteger dados em trânsito e em armazenamento.

## Localização

A localização deve ser tratada com cuidado especial.

No conceito atual:
- compartilhamento deve ocorrer em fluxos claros;
- o usuário deve saber com quem o local será compartilhado;
- contatos prioritários não devem receber rastreamento permanente por padrão;
- a retenção deve ser limitada;
- registros de consentimento/permissão devem ser avaliados.

## Dados de sensores

Resultados de sensores podem ser altamente sensíveis no contexto de uso.

O sistema não deve:
- transformar uma leitura inconclusiva em acusação;
- divulgar resultados para terceiros sem finalidade definida;
- armazenar detalhes desnecessários;
- usar dados para finalidades incompatíveis sem nova análise.

## Segurança da aplicação

Itens futuros:
- autenticação;
- autorização;
- criptografia;
- proteção de credenciais;
- logs mínimos;
- proteção contra alteração de eventos;
- segregação entre dados de usuários;
- tratamento seguro de erros;
- revisão de dependências.

## LGPD

A Lei nº 13.709/2018 (LGPD) regula o tratamento de dados pessoais no Brasil.

Antes de um produto real, será necessário definir, entre outros pontos:
- papéis de controlador/operador;
- finalidades;
- bases legais adequadas;
- direitos do titular;
- retenção;
- compartilhamentos;
- medidas de segurança;
- eventual relatório de impacto, quando aplicável.

Referência oficial:
https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm
