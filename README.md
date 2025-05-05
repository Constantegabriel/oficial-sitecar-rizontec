
# Rizon Tec - Sistema de Gestão de Veículos

Sistema para gestão de inventário de veículos, com funcionalidades de cadastro, edição, venda e troca de veículos.

## Configuração do Supabase

Para que a aplicação funcione em múltiplos dispositivos e salve os dados em nuvem, é necessário configurar o Supabase:

1. Crie uma conta no [Supabase](https://supabase.com/)
2. Crie um novo projeto
3. Obtenha as credenciais de URL e chave anônima do seu projeto:
   - Vá em Project Settings > API
   - Copie a URL do projeto e a anon key (chave anônima)
4. Crie um novo arquivo chamado `.env.local` na pasta raiz do projeto (mesma pasta do README.md) e adicione suas credenciais:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

5. No SQL Editor do Supabase, execute o script SQL localizado em `src/supabase/schema.sql` para criar as tabelas necessárias e funções RPC.
6. Reinicie a aplicação para que as alterações tenham efeito.

### Resolução de problemas comuns

- Se você ver a mensagem "Modo offline ativado", verifique se:
  - Criou o arquivo `.env.local` (não .env)
  - As credenciais estão corretas
  - A URL do Supabase começa com https://
- Se você ver a mensagem "SQL não executado", execute o script SQL no editor do Supabase

### Modo Offline

Caso não configure o Supabase, a aplicação funcionará em modo offline, salvando os dados apenas localmente no navegador.

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## Recursos

- Gestão de inventário de veículos
- Upload de imagens para o Supabase Storage
- Sincronização em tempo real entre dispositivos
- Controle de vendas e trocas
- Dashboard administrativo
