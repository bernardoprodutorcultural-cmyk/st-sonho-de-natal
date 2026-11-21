# ST Solutions · Sistema de gestão do 39º Sonho de Natal (Canela/RS)

Site estático (um `index.html`) com banco de dados, login e anexos no Firebase.
Vários acessos simultâneos, dados em tempo real para toda a equipe.

## Arquivos
- `index.html` — o sistema completo (painel, contratados, financeiro, programação, riders, documentos, ocorrências, relatórios, edital, usuários)
- `backend.js` — ligação com o Firebase (Auth, Firestore, Storage)
- `firebase-config.js` — **o único arquivo que você edita**: cole aqui a configuração do seu projeto Firebase
- `firestore.rules` — regras de segurança do banco (quem lê e quem escreve)
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
2. Envie estes arquivos para o repositório (`index.html`, `backend.js`, `firebase-config.js`).
3. Em **Settings › Pages › Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, pasta `/ (root)`. Salvar.
4. Em 1–2 minutos o site responde em `https://SEU-USUARIO.github.io/st-sonho-de-natal/`.

## Papéis
- **admin**: tudo, inclusive a aba Usuários.
- **editor**: cadastra, paga, anexa, registra chamados e multas.
- **leitura**: só consulta.

Só entra quem tiver o e-mail cadastrado em `usuarios`. Remover o documento corta o acesso.

## Custos
Franquia gratuita do Firebase: 50 mil leituras/dia, 20 mil gravações/dia, 1 GB no Firestore, 5 GB no Storage.
Uma equipe de 5 a 10 pessoas neste contrato fica muito abaixo disso.
