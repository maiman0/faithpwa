# Migration: From Vercel to Cloud-Native Deployment

## Overview

FAITH PWA has been migrated from its previous Vercel-based deployment to a fully containerized, cloud-native architecture.

Rather than relying on platform-specific features such as Vercel rewrites, the application is now packaged as a Docker container that can be deployed consistently across different environments.

This migration improves portability, simplifies deployment, and ensures future development is no longer tied to a single hosting provider.

---

# What Changed?

## Previous Architecture

```
Developer
      │
      ▼
Expo Web Build
      │
      ▼
Vercel
      │
      ├── Static Hosting
      └── vercel.json → PHP Backend
```

The previous deployment relied on:

- Vercel static hosting
- `vercel.json` rewrites
- Platform-specific deployment configuration

Although functional, the deployment was dependent on Vercel.

---

## Current Architecture

```
Developer
      │
      ▼
Docker Image
      │
      ▼
nginx
      │
      ├── Static Web Assets
      ├── SPA Routing
      └── API Proxy
              │
              ▼
         PHP Backend
```

The application is now self-contained within a Docker image.

The container includes:

- Expo Router web export
- nginx web server
- SPA routing
- API proxy configuration

The same image can be deployed locally, on Dokploy, AWS EC2, or any Docker-compatible platform.

---

# Why This Migration?

The migration provides several long-term benefits.

## Platform Independence

The application is no longer tied to Vercel.

Supported deployment targets include:

- Dokploy
- AWS EC2
- Docker Compose
- Any Docker-compatible VPS

---

## Consistent Deployments

The exact same Docker image is used throughout the entire deployment lifecycle.

```
Development
        │
        ▼
Docker Image
        │
        ├── Local Testing
        ├── Staging
        └── Production
```

This removes environment-specific differences between local and production deployments.

---

## Built-in API Proxy

API routing is now managed internally by nginx.

Benefits include:

- No platform-specific rewrite rules
- No frontend CORS configuration
- Easier maintenance
- Portable deployment

---

# Repository

The project has been migrated to the company GitHub repository with the complete commit history preserved.

| Item | Value |
|------|-------|
| Repository | `https://github.com/maiman0/faithpwa` |
| Branch | `main` |
| History | Complete |
| Status | Ready for handover |

Repository includes:

- Complete application source code
- Dockerfile
- docker-compose.yml
- nginx configuration
- Environment template
- Documentation

---

# Manager Handover Guide

If continuing development or deploying the application, the recommended workflow is:

## 1. Clone the Repository

```bash
git clone https://github.com/maiman0/faithpwa.git
cd faithpwa
```

---

## 2. Review Documentation

Read the following files:

- README.md
- ABOUT.md
- FEATURES.md
- CHANGELOG.md
- DEPLOYMENT.md

---

## 3. Configure Environment

Copy the environment template.

```bash
cp .env.example .env
```

Configure:

- `EXPO_PUBLIC_API_URL`
- `BACKEND_URL`

---

## 4. Run Locally

```bash
docker compose up --build
```

The application should be available through the local Docker environment.

---

## 5. Production Deployment

Choose one of the supported platforms.

### Option A — Dokploy (Recommended)

- Create a new Application
- Connect the GitHub repository
- Select the `main` branch
- Build using the Dockerfile
- Configure environment variables
- Enable HTTPS
- Deploy

### Option B — AWS EC2

- Launch an EC2 instance with Docker
- Clone the repository
- Build the Docker image
- Run the container
- Configure a reverse proxy or load balancer
- Attach the production domain

---

# Current Status

## Completed

- ✅ Repository migrated
- ✅ Complete Git history preserved
- ✅ Dockerized application
- ✅ nginx configuration completed
- ✅ API proxy migrated from Vercel
- ✅ Local deployment verified
- ✅ Documentation completed

---

## Remaining Work

No further application development is required for deployment.

The remaining tasks are infrastructure-related:

- Provision a VPS or AWS EC2 instance
- Configure environment variables
- Configure DNS
- Enable HTTPS
- Deploy the Docker container

---

# Outcome

FAITH PWA is now deployment-ready and no longer depends on Vercel.

Any developer with access to the GitHub repository can clone the project, run it locally, or deploy it to a Docker-compatible hosting platform using the provided documentation and configuration.