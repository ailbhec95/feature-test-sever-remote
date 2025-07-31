const express = require('express');
const cors = require('cors');
const path = require('path');
const { Experiment } = require('@amplitude/experiment-node-server');
const { init, track } = require('@amplitude/analytics-node');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize Amplitude Analytics for exposure tracking
init('a3f7a8d1c910f8fabc60dd7e947438f1');

// Initialize Amplitude Experiment Server SDK for remote evaluation
const experiment = Experiment.initializeRemote('server-J2Hw5SNQsPvvJFgOqjeQfecowTIoxD3X', {
    // Optimized timeouts for server environment (per documentation)
    fetchTimeoutMillis: 500,
    fetchRetries: 1,
    fetchRetryBackoffMinMillis: 0,
    fetchRetryTimeoutMillis: 500,
    debug: true
});

console.log('✅ Amplitude Experiment Server SDK initialized');

// API endpoint to fetch experiment variants
app.get('/api/experiment', async (req, res) => {
    try {
        const user = {
            user_id: req.query.user_id || null,
            device_id: req.query.device_id || null,
            user_properties: req.query.user_properties ? JSON.parse(req.query.user_properties) : {}
        };

        console.log('🔍 Fetching variants for user:', user);

        // Fetch variants using server-side remote evaluation
        const variants = await experiment.fetchV2(user);
        
        console.log('✅ Server-side remote variants fetched:', variants);

        // Track exposure event using Amplitude Analytics
        const flagVariant = variants['test-sever-side-remote'];
        if (flagVariant) {
            track('$exposure', {
                flag_key: 'test-sever-side-remote',
                variant: flagVariant.value
            }, {
                user_id: user.user_id,
                device_id: user.device_id,
                user_properties: user.user_properties
            });
            
            console.log('📊 Exposure event tracked:', {
                flag_key: 'test-sever-side-remote',
                variant: flagVariant.value,
                user: user
            });
        }

        res.json({
            success: true,
            variants: variants,
            user: user
        });

    } catch (error) {
        console.error('❌ Error fetching experiment variants:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            // Return fallback variant
            variants: {
                'test-sever-side-remote': { value: 'control' }
            }
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'amplitude-experiment-server' 
    });
});

// Serve static files (HTML, CSS, JS)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server-side remote experiment server running on http://localhost:${PORT}`);
    console.log(`📊 Experiment API available at http://localhost:${PORT}/api/experiment`);
});