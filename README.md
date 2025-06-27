# dl-video-api

A robust, container-ready REST API for extracting video metadata and download links from popular social media platforms, built with Node.js, Express, and TypeScript.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Docker & Deployment](#docker--deployment)
- [Development Guidelines](#development-guidelines)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Unified API** for extracting video metadata and download links from:
  - YouTube
  - TikTok
  - Facebook
  - Instagram
  - Twitter
  - Twitch
- **General endpoint** for other video sources
- **Email sending** endpoint (for contact or notifications)
- **Swagger documentation** at `/doc`
- **CORS enabled** for all origins
- **Production-ready**: Dockerfile and docker-compose included
- **TypeScript** for type safety and maintainability

---

## Architecture

```
dl-video-api/
├── src/
│   ├── controllers/   # Route handlers for each platform
│   ├── models/        # TypeScript interfaces for API responses
│   ├── routes/        # API route definitions
│   └── utils/         # Utility functions (e.g., URL parsing)
├── Dockerfile         # Multi-stage build for production
├── docker-compose.yml # Compose file for local or production deployment
├── swagger_output.json# Auto-generated Swagger docs
├── Jenkinsfile        # CI/CD pipeline (Jenkins)
├── package.json       # NPM scripts and dependencies
└── tsconfig.json      # TypeScript configuration
```

- **Entry Point:** `src/index.ts` initializes Express, sets up middleware, routes, and Swagger UI.
- **Controllers:** Each platform (YouTube, TikTok, etc.) has its own controller for handling extraction logic.
- **Utils:** Common helpers, e.g., domain extraction.
- **Swagger:** API documentation auto-generated and served at `/doc`.

---

## API Endpoints

All endpoints accept `POST` requests with a JSON body containing a `postUrl` field.

| Endpoint             | Description                        |
|----------------------|------------------------------------|
| `/api/gen/dl`        | General video extraction           |
| `/api/yt/dl`         | YouTube video extraction           |
| `/api/tik/dl`        | TikTok video extraction            |
| `/api/tik2/dl`       | TikTok fallback (streaming)        |
| `/api/fb/dl`         | Facebook video extraction          |
| `/api/ins/dl`        | Instagram video extraction         |
| `/api/tw/dl`         | Twitter video extraction           |
| `/api/twitch/dl`     | Twitch video extraction            |
| `/api/send-email`    | Send an email (contact/notify)     |

**Example request:**
```json
POST /api/yt/dl
{
  "postUrl": "https://www.youtube.com/watch?v=example"
}
```

**Response:**
```json
{
  "thumb": "...",
  "channel": "...",
  "meta": {
    "duration": "...",
    "source": "...",
    "title": "...",
    "tags": ["..."],
    "categories": ["..."],
    "desc": "..."
  },
  "view_count": 12345,
  "formats": [
    {
      "name": "720p.mp4",
      "url": "...",
      "audio": true,
      "no_audio": false,
      "quality": 720,
      "ext": "mp4"
    }
  ]
}
```

---

## Setup & Installation

### Prerequisites

- Node.js 18+ (recommended)
- Python 3 (required for `youtube-dl-exec`)
- Docker (optional, for containerized deployment)

### Local Development

```bash
# Clone the repo
git clone https://github.com/zagaris/express-api.git
cd express-api

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start in development mode
npm run dev

# Or start the compiled server
npm start
```

### Environment Variables

Create a `.env` file for sensitive config (see `.env.example` if available):

```
PORT=8080
EMAIL_USER=your@email.com
EMAIL_PASSWORD=yourpassword
EMAIL_CC=cc@email.com
FRONT_END=https://yourfrontend.com
```

---

## Docker & Deployment

### Build and Run with Docker

```bash
# Build the image
docker build -t dl-video-api .

# Run the container
docker run -p 8003:8080 dl-video-api
```

### Using Docker Compose

```bash
docker-compose up --build
```

- The API will be available at `http://localhost:8003`
- Swagger docs at `http://localhost:8003/doc`

---

## Usage

- **Swagger UI:** Visit `/doc` for interactive API documentation.
- **CORS:** All origins are allowed by default.
- **Error Handling:** All endpoints return `500` on failure, with error logs in the server console.

---

## Development Guidelines

- Use `npm run dev` for hot-reloading with `nodemon`.
- Lint your code with ESLint (`eslint .`).
- TypeScript is enforced for all source files.
- Add new platforms by creating a new controller and route.

---

## Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

---

## License

[ISC](LICENSE) 