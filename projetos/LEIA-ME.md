# Fichas de edital

Cada projeto do sistema da Alternativa Cultural segue o próprio edital. A ficha é o arquivo `projetos/<id>.json`.
Ela define o teto, os itens da proposta, as regras, os prazos, os documentos e os módulos do painel.

O **39º Sonho de Natal** (id `sonho-natal-2026`) é o projeto de origem. A ficha dele fica dentro do `index.html`,
e os dados dele continuam nas coleções da raiz do Firestore. Os projetos novos guardam os dados em
`projetos/<id>/contratados`, `projetos/<id>/pagamentos`, `projetos/<id>/ocorrencias` e `projetos/<id>/config`.
Os anexos ficam em `projetos/<id>/anexos/` no Storage.

## Como entra um projeto novo
1. Os documentos (edital, TR, memorial, proposta, planilhas) são enviados ao Claude no Projeto "ST Alternativa Cultural".
2. O Claude monta a ficha a partir deles e grava no Projeto um dossiê com as exigências, os prazos e os riscos, para revisão.
3. Com o ok, a ficha é publicada aqui (`projetos/<id>.json`), e o id entra em `registro.json`.
4. O administrador libera a equipe na aba **Usuários**: projeto por projeto, com as áreas e com ou sem valores.

O id usa só letras minúsculas, números e hífen (ex.: `natal-luz-2027`) e não muda depois de criado, porque é o caminho dos dados no banco.

## Campos da ficha (ver `_modelo.json`)
| Campo | O que é |
|---|---|
| `nome`, `curto` | Nome no painel e nome curto (chips, acessos) |
| `status` | `preparacao`, `execucao` ou `encerrado` |
| `contratante`, `orgao`, `orgaoFrase` | Quem contratou; sigla; e a sigla com artigo para frases ("a SECULT") |
| `contrato`, `local`, `relatorio` | Modalidade e número; cidade; cabeçalho dos relatórios |
| `teto`, `aliquota` | Valor homologado e impostos estimados (0,125 = 12,5%) |
| `vigencia` | `ini` e `fim` (AAAA-MM-DD). Também define os meses do gráfico de pagamentos |
| `modulos` | Telas ligadas: `painel`, `contratados`, `financeiro`, `programacao`, `riders`, `documentos`, `ocorrencias`, `relatorios`, `edital` |
| `setores` | Grupos do orçamento (`k`, `n`; cor opcional) |
| `funcs` | Itens da proposta. `lim`: `qtd` (soma das diárias/horas ≤ `q`), `count` (até `max` contratações), `art` (cachês, usa `artistico`), `sem` (fora da proposta). `sub: true` marca item subcontratável |
| `artistico` | Verba (`verba`), mínimo e máximo de cachês, `rouanet` (cachês fora do contrato), `item` e `media`. A função artística precisa ter `k: "artista"` |
| `subcontratacao` | Teto de subcontratação (`pct`) |
| `docs` | Documentos exigidos: `k`, `n`, `d` (detalhe), `pz` (prazo), `r` (risco) |
| `multas` | `ref` (item do TR), `tetoPct`, `diasMax` e `itens` (`pct`, `dia` para multa diária, `h` para prazo de chamado, `livre` para glosa) |
| `ocorrencias` | `prazos` dos chamados (`h`, `n`, `pct` da multa) e `locais` |
| `rider` | Checklist técnico: `funcs` (itens de rider), `cols` (2 locais), `itens` ([requisito, local 1, local 2]), `info`, `titulo`, `descricao` |
| `nfs` | Parcelas das notas fiscais: `[["NF 1", 0.2], ...]` |
| `regras`, `pendencias` | Cartões da aba Edital (`t`, `d`, `chip`, `nivel`: `lo`, `md` ou `hi`) |
| `textos` | Textos próprios para os blocos que variam (`d_programacao`, `t_riders`, `d_riders`, `pill_documentos`, `d_ocorrencias`, `pill_ocorrencias`, `nota_planilha`, `edital_regras`) |

Se uma ficha não tem `artistico`, a Programação some. Sem `rider`, os Riders somem. Sem `ocorrencias`, as Ocorrências somem.
