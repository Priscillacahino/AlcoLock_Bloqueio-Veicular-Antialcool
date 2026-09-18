# AlcoLock - Requisitos funcionais, não funcionais e regras de negócio

> Especificação proposta a partir do conceito atualmente documentado no projeto. Itens devem ser
> marcados como implementados somente quando houver evidência técnica e teste correspondente.

## Requisitos funcionais (RF)

| ID | Requisito |
|---|---|
| RF01 | Permitir cadastro e identificação do usuário/condutor. |
| RF02 | Permitir cadastro, edição, exclusão e priorização de contatos de confiança. |
| RF03 | Gerenciar consentimentos e permissões de localização e comunicação. |
| RF04 | Detectar/receber o estado de ocupação do banco do motorista e a presença do condutor, quando o hardware existir. |
| RF05 | Coletar leituras dos sensores de álcool, contexto ambiental e qualidade da amostra. |
| RF06 | Executar fusão de sinais e produzir uma decisão rastreável. |
| RF07 | Classificar a validação em APROVADO, NÃO APROVADO, INCONCLUSIVO ou SENSOR INDISPONÍVEL. |
| RF08 | Impedir o início da condução quando não existir aprovação válida. |
| RF09 | Exibir ao usuário uma explicação clara e não acusatória do estado da validação. |
| RF10 | Oferecer fluxo de ajuda após bloqueio: ligação, mensagem e contato prioritário. |
| RF11 | Compartilhar a localização somente quando houver permissão e dentro do fluxo previsto. |
| RF12 | Registrar evento mínimo de validação, falha, bloqueio e liberação para auditoria. |
| RF13 | Permitir fluxo de motorista substituto. |
| RF14 | Exigir nova validação do motorista substituto antes de liberar a partida. |
| RF15 | Disponibilizar histórico ao usuário dentro dos limites de privacidade e retenção. |
| RF16 | Disponibilizar modo de simulação para testes acadêmicos sem atuar em veículo real. |
| RF17 | Disponibilizar diagnóstico do estado dos sensores e de sua calibração. |
| RF18 | Permitir modo de manutenção controlado, autenticado e auditável, sem servir como atalho ao bloqueio normal. |

## Requisitos não funcionais (RNF)

| ID | Requisito |
|---|---|
| RNF01 | Segurança funcional: o sistema não deve desligar abruptamente um veículo em movimento. |
| RNF02 | Fail-safe: sinais conflitantes ou falha de sensor devem resultar em estado seguro e explícito, nunca em acusação automática. |
| RNF03 | Confiabilidade: registrar qualidade da amostra, integridade do sensor e versão da lógica de decisão. |
| RNF04 | Segurança da informação: autenticação, criptografia, menor privilégio e proteção de credenciais. |
| RNF05 | Privacidade/LGPD: minimização, finalidade, transparência, retenção limitada e controle de compartilhamento. |
| RNF06 | Usabilidade: mensagens compreensíveis, não julgadoras e orientadas a ação. |
| RNF07 | Acessibilidade: interfaces compatíveis com boas práticas de contraste, leitura, foco e navegação assistida. |
| RNF08 | Desempenho: o tempo de decisão deverá ter meta mensurável definida após prototipação e testes de sensores. |
| RNF09 | Auditabilidade: decisões críticas devem ser rastreáveis sem coleta excessiva de dados pessoais. |
| RNF10 | Manutenibilidade: sensores, regras de decisão, UX e comunicações devem ser módulos desacoplados. |
| RNF11 | Testabilidade: o sistema deve aceitar sinais simulados e cenários reprodutíveis. |
| RNF12 | Resiliência: definir comportamento seguro para perda de rede, localização, energia ou comunicação. |
| RNF13 | Interoperabilidade: integrações automotivas e IoT devem usar interfaces documentadas e limites de responsabilidade. |
| RNF14 | Conformidade: qualquer uso real depende de engenharia automotiva, validação, segurança funcional, regulação e homologação aplicáveis. |

## Regras de negócio (RN)

| ID | Regra |
|---|---|
| RN01 | A liberação da partida exige uma validação APROVADO vigente para o condutor atual. |
| RN02 | NÃO APROVADO, INCONCLUSIVO ou SENSOR INDISPONÍVEL não podem ser convertidos automaticamente em APROVADO. |
| RN03 | Sinais conflitantes devem gerar INCONCLUSIVO, e não uma conclusão de embriaguez. |
| RN04 | Falha técnica nunca deve ser apresentada ao usuário como confirmação de consumo de álcool. |
| RN05 | Motorista substituto deve realizar sua própria validação. |
| RN06 | O sistema não deve desligar o motor/powertrain de forma abrupta durante o deslocamento. |
| RN07 | Localização só pode ser compartilhada conforme permissões e finalidade previamente informadas. |
| RN08 | O resultado de álcool não deve ser compartilhado com contatos de confiança por padrão; a mensagem deve priorizar pedido de ajuda. |
| RN09 | Registros devem conter somente o mínimo necessário e seguir política definida de retenção e eliminação. |
| RN10 | Opções de ajuda permanecem acessíveis após o bloqueio. |
| RN11 | Alterações na lógica de decisão e calibração precisam ser versionadas e auditáveis. |
| RN12 | Tentativas repetidas e possíveis contornos do sistema devem ser registrados e tratados por controles antiabuso. |
| RN13 | Nenhum recurso deve ser descrito como implementado sem código/evidência e teste correspondente. |
| RN14 | O protótipo acadêmico deve permanecer isolado da atuação real no veículo até cumprir gates formais de segurança e homologação. |
| RN15 | Mensagens ao usuário devem comunicar estado de validação, não emitir diagnóstico, julgamento moral ou acusação. |
