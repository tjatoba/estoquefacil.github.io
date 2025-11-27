# Estoque Fácil - MVP

Gerenciamento de estoque descomplicado para pequenos e médios negócios.

## Visão Geral

MVP do **Estoque Fácil** com controle de materiais em trânsito, baixa para estoque principal usando **Preço Médio Ponderado (PMP)**, registro de saídas, fechamento mensal e persistência via `localStorage`. Implementado em HTML/CSS/JS (Vanilla) com arquitetura **MVC** simplificada.

### Navegação por Rotas (Hash)

- `#tela-login` e `#tela-cadastro` (apenas quando deslogado)
- `#inclusao-material`, `#gestao-terceiros`, `#saida-material`, `#fechamento-mensal` (apenas quando logado)

Somente a seção ativa fica visível; as demais são ocultadas com a classe `hidden`. A navbar exibe apenas as telas do app quando logado, junto ao status “Logado: nome/email” e botão “Sair”.

## Arquitetura (MVC)

Facilitando a manutenabilidade e escalabilidade do código, optamos por implementar uma arquitetura simplificada.

- **Model**: Estado e regras de negócio. Representa o estado da aplicação e a lógica de negócio, persistência(carrega/salva dados), aplica fórmulas, consolida fechamento, valida credenciais.
  - `models/state.js`: persistência do estado (transito, estoquePrincipal, histórico).
  - `models/estoque.js`: lógica de PMP (baixa), saída por PMP e fechamento.
  - `models/auth.js`: usuários, login/logout, validação de credenciais.

- **View**: Interface com o usuário. Manipula o DOM: lê inputs, renderiza tabelas/saídas, mostra mensagens. Não contém regras de negócio — só apresenta e coleta dados.
Emite eventos (ex.: transito:updated, estoque:updated) para o Controller reagir.
  - Ex.: `inclusaoView.js` (cálculos dinâmicos e submit), `transitoView.js` (lista e dar baixa), `saidaView.js` (custo de saída), `fechamentoView.js` (tabela + CSV), `cadastroView.js` (validações), `loginView.js` (login + redirect).

- **Controller**: Conecta View ↔ Model: recebe ações da View, chama o Model, atualiza a View. Aplica regras transversais: autenticação, guarda de rotas, status na navbar. Decide navegação padrão e visibilidade de seções.
  - `controllers/mainController.js`: inicializa Models/Views, controla visibilidade das seções e links.

- **Entrypoint & Routing**:
  - `main.js`: inicia o app e controla exibição por `hash`, respeitando auth.

- **Utils**:
  - `utils/format.js`: formatação de moeda e parsing numérico.

## Principais funcionalidades

- Inclusão: cálculo automático de valor líquido e preço médio da nota.
- Trânsito: registrar e “Dar baixa” com atualização do PMP.
- Saída: custo calculado com PMP.
- Fechamento: consolidação com exportação CSV.
- Autenticação: cadastro, login/logout, guarda de rotas, status na navbar.

## Fórmulas PMP

```text
Novo Peso Total = Peso Total Antigo + Peso Líquido da Nota
Novo Valor Total Líquido = Valor Total Líquido Antigo + Valor Líquido da Nota
Novo Preço Médio Ponderado = Novo Valor Total Líquido / Novo Peso Total
```

## Como Executar

Para servir módulos ES6 corretamente:

```sh
python3 -m http.server 5500
open http://localhost:5500
```

## Validações e UX

- Cadastro: CNPJ 14 dígitos, e-mails válidos e iguais, senha ≥ 6; limpa campos após tentativa com e-mail já existente.
- Login: validado contra usuários cadastrados (localStorage).
- Visual: tema em verdes, coluna única, botões centrais; navbar sem links de Login/Cadastro.

## Notas recentes

- Removidos links de Login/Cadastro da navbar; acesso por seções dedicadas.
- Navbar mostra “Logado: nome/email” e “Sair” apenas autenticado.
- Roteamento respeita auth: telas do app ocultas quando deslogado.
- Cadastro limpa após alerta de duplicidade; sucesso preenche login.
- Login validado contra registros salvos.

## Licença

Consulte `LICENSE`.
