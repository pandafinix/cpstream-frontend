# CPStream Frontend

CPStream is a competitive-programming focused livestreaming platform where programmers can stream problem-solving sessions, contest practice, upsolving, and live coding discussions using OBS and LiveKit.

This repository contains the **Next.js frontend** for CPStream. It connects with a Spring Boot backend that handles stream metadata, LiveKit ingress generation, viewer tokens, chat APIs, Redis-based chat rate limiting, follow/block features, and webhook-driven live status updates.

---

## Features

* Live streaming with LiveKit
* OBS support through RTMP ingress
* Streamer dashboard for managing stream details
* Generate connection flow for OBS `serverUrl` and `streamKey`
* Public home page showing live streams first
* Stream watch page with video player and chat
* Live badge and live status updates using LiveKit webhooks
* Thumbnail upload from local device using UploadThing
* CP-focused stream metadata:

  * Platform
  * Difficulty
  * Programming language
* Chat system for stream viewers
* Redis-backed chat spam/rate limiting
* Chat settings:

  * Enable/disable chat
  * Slow chat support
  * Followers-only chat support
* Follow and block system
* Search page for discovering streamers
* Clerk authentication
* Responsive UI with collapsible sidebar and chat layout
* Dark themed interface built with Tailwind CSS

---

## Tech Stack

### Frontend

* Next.js 14
* React
* TypeScript
* Tailwind CSS
* Clerk Authentication
* LiveKit Client SDK
* UploadThing
* Zustand

### Backend Integration

* Spring Boot
* PostgreSQL
* Redis
* LiveKit Server SDK
* OBS RTMP Ingress
* Webhook-based live status sync

---

## System Architecture

```txt
OBS
 ↓ RTMP
LiveKit Ingress
 ↓
LiveKit Room
 ↓ webhook
Spring Boot Backend
 ↓
PostgreSQL / Redis
 ↓
Next.js Frontend
```

The frontend communicates with the backend for:

* user sync
* stream metadata
* live stream listing
* viewer token generation
* ingress generation
* chat messages
* chat settings
* follow/block actions

---

## Live Streaming Flow

1. Streamer logs in using Clerk.
2. Streamer opens the creator dashboard.
3. Streamer generates a LiveKit connection.
4. Backend creates an RTMP ingress using LiveKit.
5. Streamer copies the generated `serverUrl` and `streamKey` into OBS.
6. OBS sends the stream to LiveKit.
7. LiveKit sends webhook events to the backend.
8. Backend updates the stream live status.
9. Frontend displays the stream as live.
10. Viewers open the stream page and watch using a LiveKit viewer token.

---

## Thumbnail Upload Flow

Streamers can upload a thumbnail from their local device. The frontend handles the upload flow using UploadThing and stores the uploaded thumbnail URL with the stream metadata.

The thumbnail is displayed on:

* home page stream cards
* search results
* stream preview sections

---

## Project Structure

```txt
app/              Next.js app router pages and layouts
actions/          Server actions and API interaction helpers
components/       Reusable UI and stream player components
hooks/            Custom React hooks
lib/              Service functions and utilities
store/            Zustand state stores
public/           Static assets
prisma/           Prisma schema retained from the initial frontend setup
```

---

## Environment Variables

Create a `.env` file in the project root using `.env.example` as reference.

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

DATABASE_URL=

LIVEKIT_API_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_WS_URL=

NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

Do not commit real environment variables. Keep secrets only in `.env`.

---

## Local Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app:

```txt
http://localhost:3000
```

---

## Backend Requirement

The frontend expects the CPStream backend to be running.

Default backend URL:

```txt
http://localhost:8080
```

The backend handles:

* PostgreSQL persistence
* Redis chat rate limiting
* LiveKit ingress creation
* LiveKit viewer token generation
* LiveKit webhook handling
* stream metadata updates
* chat APIs
* follow/block APIs
* user sync APIs

---

## Available Scripts

Run the development server:

```bash
npm run dev
```

Build the production app:

```bash
npm run build
```

Start the production build:

```bash
npm run start
```

Run lint checks:

```bash
npm run lint
```

---

## Security Notes

Public stream APIs must never expose sensitive streaming credentials such as:

```txt
streamKey
serverUrl
ingressId
```

These values should only be visible inside the authenticated streamer dashboard.

The public stream listing should only expose safe metadata such as:

* stream title
* thumbnail
* username
* live status
* platform
* difficulty
* language
* chat settings

---

## Deployment Notes

For production deployment:

1. Deploy the Spring Boot backend.
2. Deploy PostgreSQL and Redis.
3. Set the deployed backend URL in the frontend environment variables:

```env
NEXT_PUBLIC_BACKEND_URL=
```

4. Configure the LiveKit webhook to point to the deployed backend webhook endpoint.
5. Add frontend environment variables in the hosting platform.
6. Build and deploy the Next.js frontend.

Example production backend URL:

```txt
https://cpstream-backend.example.com
```

Example LiveKit webhook URL:

```txt
https://cpstream-backend.example.com/api/livekit/webhook
```

---

## Current Status

* LiveKit streaming tested successfully
* OBS connection tested successfully
* Live badge tested successfully
* Chat tested successfully
* Redis chat rate limiting tested successfully
* Thumbnail upload from local device tested
* Public stream key exposure fixed
* Environment files protected from Git commits

---

## About CPStream

CPStream is built for competitive programmers who want to stream problem-solving, upsolving, contest practice, and live coding sessions in a focused environment designed around programming platforms, difficulty levels, and language-based discovery.
