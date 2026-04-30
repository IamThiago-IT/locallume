# LocalLume 🌟

> **Local Development Domains Made Simple**

LocalLume is a modern web interface for managing local development domains, SSL certificates, and proxy configurations. Transform your `localhost:3000` into beautiful, memorable domain names like `myapp.local` with automatic HTTPS support.

![LocalLume Dashboard](https://img.shields.io/badge/Status-Development-orange?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan?style=flat-square)

## ✨ Features

### 🔍 **Automatic Process Detection**
- **Zero Configuration**: Automatically detects running development servers
- **Framework Recognition**: Identifies Node.js, Python, React, Vue, and more
- **Smart Domain Generation**: Creates `appname.local` domains instantly

### 🛡️ **SSL Certificate Management**
- **One-Click HTTPS**: Generate SSL certificates for any local domain
- **Root CA Integration**: Install trusted certificate authority
- **Browser Trust**: Seamless HTTPS experience in all browsers

### 🌐 **Custom Domain Support**
- **Flexible Routing**: Map any domain to localhost ports or external URLs
- **Hosts File Management**: Automatic `/etc/hosts` or Windows hosts updates
- **SSL Toggle**: Enable/disable HTTPS per domain

### ⚡ **Proxy & Service Management**
- **Reverse Proxy**: Route external traffic to local services
- **Windows Service**: Run as background service with auto-start
- **Traffic Inspection**: Monitor and debug network requests

### 🎨 **Modern Interface**
- **Dark/Light Themes**: Automatic system theme detection
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Live status monitoring
- **Intuitive UX**: Clean, professional interface

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Administrator privileges** (for hosts file and certificates)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/IamThiago-IT/locallume.git
   cd locallume
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🐳 Docker Deployment

### Production Build

Build and run with Docker Compose:

```bash
# Build and start production container
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

The application will be available at `http://localhost:3000`.

### Development with Docker

For development with hot reload:

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Or run in background
docker-compose -f docker-compose.dev.yml up -d --build
```

### Manual Docker Commands

```bash
# Build production image
docker build -t locallume .

# Run production container
docker run -p 3000:3000 locallume

# Build development image
docker build -f Dockerfile.dev -t locallume-dev .

# Run development container with volume mounting
docker run -p 3000:3000 -v $(pwd):/app locallume-dev
```

## 📖 Usage Guide

### Adding Your First Domain

1. **Automatic Detection**: LocalLume scans for running processes
2. **Custom Domains**: Click "Add Domain" to create custom mappings
3. **SSL Setup**: Generate certificates for HTTPS support

### Certificate Installation

For full HTTPS support, install the Root Certificate Authority:

1. Open Certificate Management in LocalLume
2. Click "Install CA Certificate"
3. Follow browser-specific instructions
4. Restart your browser

### Windows Service Setup

Run LocalLume as a background service:

1. Open Service Management
2. Click "Install Service"
3. Run the generated script as Administrator
4. Service starts automatically on boot

## 🏗️ Architecture

```
LocalLume/
├── Frontend (Next.js + TypeScript)
│   ├── Components (shadcn/ui)
│   ├── Hooks (Custom business logic)
│   └── Themes (Dark/Light mode)
├── Certificate Management
│   ├── Root CA Generation
│   ├── Domain Certificates
│   └── Trust Installation
├── Process Detection
│   ├── Port Scanning
│   ├── Framework Recognition
│   └── Auto Domain Creation
└── System Integration
    ├── Hosts File Management
    ├── Windows Services
    └── Proxy Configuration
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Themes**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Fonts**: [Geist](https://vercel.com/font) font family
- **Container**: [Docker](https://www.docker.com/) + Docker Compose

## 📦 Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Docker
docker-compose up --build              # Production build and run
docker-compose -f docker-compose.dev.yml up --build  # Development with hot reload
docker-compose down                    # Stop all containers
```

## � Deployment

### Docker Deployment (Recommended)

For production deployment:

```bash
# Build and deploy
docker-compose up -d --build

# View logs
docker-compose logs -f locallume

# Update deployment
docker-compose pull && docker-compose up -d
```

### Traditional Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file for production:

```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Health Check

The application includes a health check endpoint at `/api/health` for load balancers and monitoring.

## �🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Development settings
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

### Custom Domains

Domains are stored locally and can be:
- **Auto-detected**: Based on running processes
- **Custom**: Manually configured mappings
- **External**: Proxy to remote services

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn](https://github.com/shadcn-ui/ui) for the amazing UI components
- [Vercel](https://vercel.com/) for Next.js and deployment
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/IamThiago-IT/locallume/issues)
- **Discussions**: [GitHub Discussions](https://github.com/IamThiago-IT/locallume/discussions)
- **Documentation**: [Wiki](https://github.com/IamThiago-IT/locallume/wiki)

---

**Made with ❤️ for developers, by developers**

Transform your local development experience with beautiful domains and seamless HTTPS. No more `localhost:3000` - welcome to the future of local development! 🚀
