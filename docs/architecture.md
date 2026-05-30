# Arquitetura

LocalLume segue uma divisão simples entre regras puras, estado de UI e componentes de apresentação.

## Camadas

- `src/lib`: regras de domínio puras e funções determinísticas.
- `src/hooks`: estado, efeitos e integração com o navegador.
- `src/components`: composição de interface e interação do usuário.
- `src/app`: entrada da aplicação e layout global.

## Regras

- A lógica de negócio deve ficar em `src/lib` sempre que puder ser testada sem React.
- Hooks podem orquestrar estado, mas não devem concentrar regra de negócio complexa.
- Componentes devem consumir helpers e hooks, não reimplementar regra de domínio.
- Tipos compartilhados devem viver próximos da regra que os usa.

## Organização atual

- `src/lib/platform.ts`: detecção de plataforma e flags derivadas.
- `src/lib/platform-copy.ts`: copy adaptado por plataforma.
- `src/lib/domains.ts`: criação, alternância e remoção de domínios.
- `src/lib/certificates.ts`: criação e remoção de certificados.
- `src/hooks/use-platform.ts`: leitura do navegador e adaptação para a UI.
- `src/hooks/use-domains.ts`: estado de domínios customizados.
- `src/hooks/use-certificates.ts`: estado de certificados e CA.
- `src/hooks/use-proxy.ts`: estado do proxy reverso.
- `src/hooks/use-service.ts`: estado do serviço do sistema.

## Próximos passos recomendados

1. Extrair os modelos de domínio para arquivos de tipos compartilhados quando começarem a ser usados por múltiplas áreas.
2. Mover regras mais ricas de composição da tela para um `feature` ou `view model` dedicado, se a UI começar a crescer demais.
3. Quando houver integração real com SO, separar uma camada `platform/*` por sistema operacional para encapsular comandos e paths.