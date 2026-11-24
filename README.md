# Alternativa Cultural · Sistema de gestão de projetos

Ferramenta exclusiva da **Alternativa Cultural | Produção de Eventos**: o controle interno de uma empresa que executa contratos de licitação.
A tela inicial é o painel geral da empresa, com um card por projeto. Cada projeto abre um painel próprio, montado a partir da **ficha do edital** dele
(teto, itens da proposta, regras, prazos, documentos exigidos e módulos), com planilhas separadas e acessos por área.
O **39º Sonho de Natal (Canela/RS)** é o projeto de origem. Os projetos novos entram pela pasta `projetos/` (ver `projetos/LEIA-ME.md`).

Site estático (um `index.html`) com banco de dados, login e anexos no Firebase. Plataforma: sistema ST Solutions.
Vários acessos simultâneos, dados em tempo real para toda a equipe.

## Arquivos
- `index.html` — o sistema completo (projetos, painel, contratados, financeiro, programação, riders, documentos, ocorrências, relatórios, edital, usuários)
- `assets/brand/` — logos vetoriais da Alternativa Cultural (horizontal, vertical, símbolo; cor, monocromática, negativa e para fundo escuro)
- `assets/fonts/` — fontes Montserrat e Source Sans 3 (licença OFL), servidas pelo próprio site
- `backend.js` — ligação com o Firebase (Auth, Firestore, Storage)
- `firebase-config.js` — **o único arquivo que você edita**: cole aqui a configuração do seu projeto Firebase
- `projetos/` — fichas de edital dos projetos novos (`registro.json`, `<id>.json`, modelo e instruções)
- `firestore.rules` — regras de segurança do banco (quem lê e quem escreve, por projeto e por área)
- `storage.rules` — regras de segurança dos anexos

## Implantação (uma vez, cerca de 15 minutos)

### 1. Criar o projeto no Firebase
1. Acesse https://console.firebase.google.com e clique em **Adicionar projeto** (ex.: `st-sonho-de-natal`). Pode desligar o Google Analytics.
2. No menu **Criação › Authentication › Começar**, ative o método **E-mail/senha**.
3. No menu **Criação › Firestore Database › Criar banco de dados**: modo **produção**, local `southamerica-east1 (São Paulo)`.
4. Na aba **Regras** do Firestore, apague tudo, cole o conteúdo de `firestore.rules` e clique em **Publicar**.
5. (Anexos) No menu **Criação › Storage › Começar**: crie o bucket. Na aba **Regras**, cole `storage.rules` e publique.
   O Storage exige o plano **Blaze** (cartão cadastrado; a franquia gratuita cobre este contrato). Se não quiser, pule: o sistema funciona sem anexos.
6. Engrenagem **Configurações do projeto › Geral › Seus apps › ícone `</>` (Web)**: dê um apelido (ex.: `site`), não marque Hosting, clique em **Registrar app**. Copie o bloco `firebaseConfig`.
7. Cole os valores em `firebase-config.js` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).
8. Em **Authentication › Configurações › Domínios autorizados**, adicione o domínio onde o site vai ficar (ex.: `SEU-USUARIO.github.io`).

### 2. Criar o primeiro administrador
1. No Firestore, clique em **Iniciar coleção**: ID `usuarios`.
2. ID do documento: **seu e-mail em minúsculas** (ex.: `bernardo@exemplo.com`).
3. Campos: `papel` (string) = `admin` · `nome` (string) = seu nome. Salvar.
4. Abra o site, clique em **Criar minha conta** com esse e-mail e uma senha. Pronto: você entra como administrador e cadastra os demais na aba **Usuários**.

### 3. Publicar o site (GitHub Pages)
1. Crie um repositório **público** no GitHub (ex.: `st-sonho-de-natal`).
2. Envie estes arquivos para o repositório (`index.html`, `backend.js`, `firebase-config.js` e a pasta `assets/` inteira).
3. Em **Settings › Pages › Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, pasta `/ (root)`. Salvar.
4. Em 1–2 minutos o site responde em `https://SEU-USUARIO.github.io/st-sonho-de-natal/`.

## Acessos
- **Administrador**: todos os projetos, inclusive a aba Usuários.
- **Equipe**: acesso liberado projeto a projeto, na aba Usuários:
  - **Edita** ou **Só consulta**;
  - as **áreas** que vê (Painel, Contratados, Financeiro, Programação, Riders, Documentos, Ocorrências, Relatórios) ou todas;
  - **Vê valores financeiros** ou não. Sem valores, pagamentos e planilha de custo não são carregados e os valores aparecem como R$ •••. Painel, Financeiro e Relatórios exigem valores.
- Os papéis antigos `editor` e `leitura` continuam valendo só para o 39º Sonho de Natal, com todas as áreas. Ao editar a pessoa na aba Usuários, ela passa para o formato novo.

As regras do Firestore e do Storage aplicam essas permissões no servidor: cada projeto fica isolado no próprio caminho do banco.
Depois de qualquer mudança em `firestore.rules` ou `storage.rules`, cole o arquivo de novo no console do Firebase e clique em **Publicar**.

Só entra quem tiver o e-mail cadastrado em `usuarios`. Remover o documento corta o acesso.

## Custos
Franquia gratuita do Firebase: 50 mil leituras/dia, 20 mil gravações/dia, 1 GB no Firestore, 5 GB no Storage.
Uma equipe de 5 a 10 pessoas por contrato, com alguns contratos ao mesmo tempo, fica muito abaixo disso.
