# Server-Side Remote Experiment with Amplitude

This project implements a proper server-side remote experiment using Amplitude's Node.js SDK, following the [official documentation](https://amplitude.com/docs/sdks/experiment-sdks/experiment-node-js).

## Architecture

- **Backend**: Node.js server with Amplitude Experiment Node.js SDK
- **Frontend**: HTML/CSS/JS client that calls backend API
- **Experiment**: `test-sever-side-remote` with `control` and `treatment` variants
- **Tracking**: Automatic exposure tracking via server-side Amplitude Analytics

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

### 3. Access the Application

Open your browser to: `http://localhost:3000`

## How It Works

### Server-Side Remote Flow

1. **User clicks property** → Frontend sends request to `/api/experiment`
2. **Backend fetches variants** → Uses `Experiment.initializeRemote()` with server deployment key
3. **Backend tracks exposure** → Automatically sends `$exposure` event to Amplitude
4. **Backend returns variants** → Frontend applies styling based on variant
5. **Exposure data appears** → In Amplitude Experiment dashboard

### API Endpoints

- `GET /api/experiment` - Fetch experiment variants for a user
- `GET /api/health` - Health check endpoint
- `GET /` - Serve frontend application

### Environment Variables

```bash
PORT=3000  # Server port (optional, defaults to 3000)
```

## Configuration

### Deployment Keys
- **Server Key**: `server-J2Hw5SNQsPvvJFgOqjeQfecowTIoxD3X` (used by Node.js SDK)
- **Analytics Key**: `a3f7a8d1c910f8fabc60dd7e947438f1` (used for tracking)

### Experiment Details
- **Flag**: `test-sever-side-remote`
- **Variants**: `control` (blue buttons), `treatment` (red buttons)
- **Tracking**: Automatic exposure events via server-side Analytics SDK

## Troubleshooting

### Check Server Logs
The server logs will show:
- Experiment SDK initialization
- Variant fetch requests
- Exposure event tracking
- Any errors

### Check Network Requests
In browser dev tools, verify:
- Calls to `/api/experiment` are successful
- Variants are returned correctly
- No CORS errors

### Check Amplitude Dashboard
- Exposure events should appear in Experiment dashboard
- Events should have correct `flag_key` and `variant` values
- User properties should be populated correctly

## Files

- `server.js` - Node.js backend with Experiment SDK
- `package.json` - Dependencies and scripts
- `index.html` - Frontend HTML with API client
- `script.js` - Frontend JavaScript with experiment logic
- `style.css` - CSS styling