## Objetivo
Este arquivo define o padrão global de desenvolvimento a ser seguido por padrão.
Aplique apenas as regras pertinentes à stack, arquitetura e contexto do projeto atual.
Quando houver padrão já consolidado no repositório, preserve-o, desde que ele não conflite com princípios arquiteturais essenciais definidos aqui.

## Princípios gerais
- Priorize clareza, coesão, baixo acoplamento e facilidade de manutenção.
- Evite duplicação de regra, lógica espalhada e soluções improvisadas.
- Preserve a arquitetura existente quando ela estiver coerente com estes princípios.
- Em casos específicos, adapte o padrão quando houver necessidade real e justificativa técnica clara.
- Antes de implementar, identifique o contexto: frontend, backend, fullstack, correção pontual, refatoração ou nova feature.
- Quando a solicitação estiver ambígua, primeiro esclareça o contexto antes de tomar decisões estruturais.
- Não invente comportamento, validações, testes executados ou regras que não estejam evidentes.
- Não diga que algo está “pronto” ou “correto” sem base no código, nos testes ou na validação realizada.

## Expectativa de resposta e execução
- Explique decisões arquiteturais de forma objetiva.
- Ao alterar código, preserve nomes, convenções e estilo já adotados no projeto.
- Ao finalizar uma tarefa, informe:
  - o que foi alterado
  - por que foi alterado
  - riscos ou pontos de atenção
  - validações executadas
  - validações não executadas, quando houver
- Não adicionar dependências novas sem necessidade clara e sem justificar o motivo.
- Não criar abstrações por purismo.

---

## Regras globais de arquitetura

### Separação de responsabilidades
- Cada parte do sistema deve ter responsabilidade clara.
- Não misturar regra de negócio, orquestração, infraestrutura, UI e adaptação de framework no mesmo lugar.
- Sempre que um arquivo começar a acumular múltiplas responsabilidades, considerar extração e divisão.

### Regra de domínio
- O domínio deve ser dono de suas regras e contratos.
- Código compartilhado só deve subir de nível quando for realmente genérico e agnóstico de domínio.
- O que pertence a um domínio deve continuar próximo desse domínio.

### Organização por domínio
- Prefira organizar por domínio/feature e não por tipo técnico de arquivo, especialmente no frontend.
- Evite estruturas em que service, hook, type, component e regra ficam espalhados sem coesão.
- O objetivo é facilitar descoberta, manutenção, reuso correto e onboarding.

---

## Frontend — aplicar quando o projeto usar React, Next.js, TypeScript ou arquitetura similar

### Estrutura padrão
- Adotar arquitetura feature-first.
- Organizar o código a partir do domínio do negócio, e não pelo tipo técnico do arquivo.
- Tudo que pertence a uma funcionalidade deve ficar próximo:
  - services
  - hooks
  - components
  - types
  - index público da feature

### O que é global e o que é da feature
- `components/` compartilhados devem ser agnósticos de domínio.
- `types/` globais devem conter apenas tipos realmente globais.
- `services/` globais devem conter apenas serviços cross-domain ou utilitários realmente compartilhados.
- Não mover domínio para shared apenas para “reaproveitar”.

### Domain ownership
- Cada domínio é dono dos seus dados, services e contratos.
- Uma feature nunca deve acessar diretamente service interno de outra feature.
- Outras features devem consumir apenas o contrato público exportado pela feature dona do domínio.
- Tudo que for público deve ser exportado explicitamente no `index.ts` da feature.
- Não duplicar lógica de acesso à API em várias features.
- Cache não substitui ownership de domínio.

### Componentização e páginas
- Não criar páginas ou componentes monolíticos.
- Evitar concentrar em um único arquivo:
  - fetch
  - mutations
  - state local
  - lógica de formulário
  - componentes de UI
  - tabelas
  - feedback visual
- Separar responsabilidades sempre que isso melhorar leitura, manutenção e teste.

### use client
- Não usar `use client` por padrão.
- Usar apenas quando houver necessidade real de interatividade, estado no cliente, hooks de cliente ou APIs do navegador.
- Preferir Server Components quando fizer sentido.
- Não transformar páginas inteiras em client sem necessidade clara.

### Formulários
- Não misturar controle de formulário com múltiplas fontes de verdade sem necessidade.
- Evitar `react-hook-form` mal conectado com `useState` paralelo para os mesmos campos.
- Centralizar validação e fluxo de formulário de forma consistente.

### Tipagem
- Evitar `any`.
- Evitar duplicação e espalhamento de tipos sem critério.
- Não misturar tipos de domínio, DTOs e tipos de UI sem intenção clara.
- Tipos de domínio devem viver com o domínio.
- Tipos globais só devem existir quando forem realmente globais.

### Query/caching
- Usar padrão consistente para `queryKey`.
- Preferir invalidação específica a invalidação genérica excessiva.
- Não depender implicitamente do cache para governar arquitetura.
- A governança da API deve continuar no domínio correto.

### Renderização
- Não organizar a arquitetura principal por SSG vs SSR.
- Estratégia de renderização não deve fragmentar o domínio.
- Evitar duplicação de lógica por critério de renderização.

### Heurística de decisão no frontend
Antes de criar ou mover código, verificar:
1. Isso pertence claramente a uma feature/domínio?
2. Isso é realmente global ou apenas está sendo reutilizado agora?
3. Outra feature precisa consumir isso via contrato público?
4. Estou misturando UI, regra e acesso a dados no mesmo lugar?
5. Estou usando `use client` por necessidade real ou por conveniência?

---

## Backend — aplicar quando o projeto usar NestJS, Node.js, APIs ou arquitetura similar

### Arquitetura base
- Adotar Clean Architecture pragmática.
- Aplicar DDD leve quando fizer sentido.
- Tratar use cases como centro da aplicação.
- Separar claramente:
  - regra de negócio
  - orquestração
  - infraestrutura
  - framework

### Regra de dependência
- Respeitar a direção de dependência:
  - infra → domain → core
- Nunca permitir:
  - domain importar infra
  - use-case usar ORM diretamente
  - entidade conhecer HTTP, DTO ou framework
- PRs que violem essa separação devem ser tratados como problema arquitetural.

### core
- `core` deve conter apenas código genérico e transversal:
  - erros base
  - helpers puros
  - tipos realmente globais
  - abstrações base
- `core` não deve conter regra de negócio específica.

### domain/application
- Use case representa uma ação do sistema.
- Use case coordena entidades, serviços de domínio e repositórios.
- Use case não conhece HTTP.
- Use case não conhece banco.
- Use case não deve depender de implementação concreta quando puder depender de contrato.

### domain/enterprise
- Entidades e agregados representam regras do negócio.
- Entidades não dependem de framework.
- Quando houver comportamento, validação ou transição de estado, preferir classe.
- Quando for apenas estrutura de dados sem regra, interface pode ser suficiente.
- Se existe lógica protegendo o domínio, não deixar isso solto em controller ou service de infra.

### domain/interface
- Gateways, portas externas e contratos de integração devem viver em camada apropriada de domínio/interface.
- O domínio define contratos; a infraestrutura implementa.

### infra
- Infra fala com o mundo externo:
  - HTTP
  - banco
  - mensageria
  - jobs
  - auth
  - presenters
- Infra não decide regra de negócio.
- Controllers apenas adaptam entrada/saída e chamam o caso de uso.
- Cada endpoint deve chamar exatamente um use-case.

### DTOs e validação
- DTO HTTP serve para validação/adaptação da camada HTTP.
- DTO de aplicação representa intenção do sistema e não deve carregar detalhe de framework.
- Não misturar DTO HTTP com contrato de domínio.

### Repositórios
- Contratos de repositório devem ficar no domínio/aplicação.
- Implementações concretas devem ficar na infra.
- Use case depende do contrato, não da implementação.

### Read models, agregados e mappers
- Para leitura complexa sem regra de negócio, preferir read models/interfaces.
- Para regra cruzada entre entidades relacionadas, considerar agregado/classe de domínio.
- Criar mapper apenas quando houver ganho real de clareza, desacoplamento ou transformação.
- Não criar mapper por formalismo.

### Tratamento de erros
- Padronizar erros de domínio e caso de uso.
- Preferir tratamento centralizado via filter global quando a aplicação seguir esse padrão.
- Não espalhar tratamento inconsistente de erro pela aplicação.

### Heurística de decisão no backend
Antes de implementar, verificar:
1. Isso é regra de negócio ou detalhe de infraestrutura?
2. Isso deve viver em entidade, use-case, contrato ou infra?
3. Estou acoplando domain a framework, banco ou HTTP?
4. O controller está apenas adaptando a requisição?
5. O endpoint chama um único caso de uso?
6. Estou criando classe porque existe regra ou apenas por excesso de formalismo?

---

## Antipatterns a evitar

### Frontend
- componentes monolíticos
- páginas gigantes com múltiplas responsabilidades
- uso excessivo de `use client`
- duplicação de services
- acesso direto a service interno de outra feature
- lógica de API espalhada por vários lugares
- tipagem inconsistente
- `any` desnecessário
- tipos globais excessivos
- query keys sem padrão
- invalidação genérica e frágil
- arquitetura guiada por SSR/SSG em vez de domínio
- estrutura orientada a página em vez de domínio

### Backend
- regra de negócio em controller
- regra de negócio em repository/ORM
- domain importando infra
- use-case usando ORM diretamente
- entidade conhecendo DTO/HTTP
- endpoint orquestrando múltiplas regras sem use-case claro
- criação de abstração ou classe sem ganho real
- mapper desnecessário
- mistura de contratos de aplicação com contratos HTTP

---

## Critério de qualidade
Uma implementação boa deve:
- preservar a coesão do domínio
- reduzir acoplamento
- evitar duplicação
- ser fácil de localizar e entender
- facilitar manutenção futura
- respeitar a separação entre regra e detalhe técnico

## Critério de entrega
Antes de considerar uma tarefa concluída, verificar:
- a solução respeita a arquitetura do projeto?
- o código foi colocado na camada correta?
- houve preservação de contratos públicos e ownership de domínio?
- existem riscos de regressão ou acoplamento indevido?
- as validações relevantes foram executadas ou explicitamente reconhecidas como pendentes?