# Coragem e Gentileza

Aplicacao Next.js da ONG Coragem e Gentileza.

## Deploy na Vercel

Este projeto esta preparado para deploy na Vercel com:

- `Node.js 22.x` definido em `package.json`
- `framework` definido como `nextjs`
- `installCommand` fixado em `npm ci`
- `buildCommand` fixado em `npm run build`

## Passo importante

Como o app esta dentro da pasta `ong-app`, na Vercel o projeto deve apontar o `Root Directory` para:

```txt
ong-app
```

Sem isso, a Vercel vai tentar construir a raiz do repositorio e nao encontrara o app Next.js corretamente.

## Build settings esperadas

Depois de conectar o repositorio na Vercel:

1. Abra o projeto
2. Entre em `Settings > Build and Deployment`
3. Confirme `Root Directory = ong-app`
4. Confirme `Node.js Version = 22.x` ou deixe a Vercel respeitar o `engines.node`
5. Faça um novo deploy

## Scripts

```bash
npm run dev
npm run build
npm run start
```
