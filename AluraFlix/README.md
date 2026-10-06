# AluraFlix

Catálogo de vídeos feito com **React e JavaScript**, usando Vite e CSS responsivo.

## Como executar

Instale o Node.js 22.12+ (ou 24 LTS) com npm. Na pasta do projeto:

```bash
npm install
npm run dev
```

Abra o endereço informado pelo Vite. Para gerar a versão de produção, execute `npm run build`; para visualizá-la, `npm run preview`.

Também é possível usar pnpm: `pnpm install`, `pnpm dev` e `pnpm build`.

## Funcionalidades

- Catálogo separado em Front-end, Back-end e Mobile.
- Busca e filtros por categoria.
- Reprodução de vídeos do YouTube em uma janela modal.
- Cadastro, edição e exclusão com confirmação.
- Persistência da coleção no localStorage do navegador.
- Layout responsivo e diálogos acessíveis por teclado.

## Estrutura

- `src/main.jsx`: componentes, catálogo inicial e estado da aplicação.
- `src/styles.css`: estilos e ilustrações criadas em CSS.
- `index.html`: entrada da aplicação.

Os vídeos iniciais são exemplos externos em inglês. Sua reprodução depende da disponibilidade no YouTube e de permissão para incorporação. A coleção é salva apenas no navegador atual; não há servidor, login ou sincronização. Fontes externas usam Google Fonts, com fontes alternativas locais.
