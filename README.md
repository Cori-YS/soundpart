# Soundpart

API REST para dividir ficheiros de áudio em várias partes iguais. Cada parte é exportada em MP3 e devolvida num ficheiro ZIP.

Construída com [NestJS](https://nestjs.com/) e [FFmpeg](https://ffmpeg.org/).

## Requisitos

- [Node.js](https://nodejs.org/) 20+
- [FFmpeg](https://ffmpeg.org/download.html) instalado e disponível no `PATH`

```bash
# Fedora
sudo dnf install ffmpeg

# Debian/Ubuntu
sudo apt install ffmpeg

# macOS
brew install ffmpeg
```

## Instalação

```bash
npm install
```

## Executar

```bash
# desenvolvimento (com hot-reload)
npm run start:dev

# produção
npm run build
npm run start:prod
```

Por defeito o servidor arranca na porta `3000`. Para alterar:

```bash
PORT=8080 npm run start:dev
```

## Documentação da API

Com o servidor a correr, a documentação interativa Swagger fica disponível em:

```
http://localhost:3000/api
```

## Endpoints

### `POST /split`

Divide um ficheiro de áudio em `N` partes de duração igual.

**Content-Type:** `multipart/form-data`

| Campo   | Tipo    | Obrigatório | Descrição                                      |
|---------|---------|-------------|------------------------------------------------|
| `audio` | ficheiro | sim        | Ficheiro de áudio (`audio/*`)                  |
| `parts` | inteiro  | sim        | Número de partes (mínimo `2`)                  |

**Resposta:** `200 OK` — ficheiro ZIP (`application/zip`) com as partes em MP3.

**Erros:** `400 Bad Request` — ficheiro inválido, tipo MIME incorreto ou `parts` inválido.

#### Exemplo com cURL

```bash
curl -X POST http://localhost:3000/split \
  -F "audio=@/caminho/para/musica.mp3" \
  -F "parts=3" \
  -o audio-parts.zip
```

O ZIP contém ficheiros com o formato `{nome}-part-1.mp3`, `{nome}-part-2.mp3`, etc.

## Testes

```bash
# testes unitários
npm run test

# testes e2e
npm run test:e2e

# cobertura
npm run test:cov
```

## Estrutura do projeto

```
src/
├── audio/
│   ├── controllers/   # rotas HTTP
│   ├── dtos/          # validação de pedidos
│   └── services/      # lógica de processamento de áudio
├── shared/utils/      # utilitários partilhados
├── app.module.ts
└── main.ts
```

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
