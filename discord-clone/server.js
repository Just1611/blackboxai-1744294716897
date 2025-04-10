const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');
const { CloneService } = require('./services/cloneService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper function to extract server ID from invite link
async function getServerIdFromInvite(invite) {
    try {
        const inviteCode = invite.match(/(?:discord\.gg\/|discord\.com\/invite\/)([a-zA-Z0-9-]+)/)?.[1];
        if (!inviteCode) return null;

        const response = await fetch(`https://discord.com/api/v9/invites/${inviteCode}?with_counts=true`);
        const data = await response.json();
        return data.guild?.id;
    } catch (error) {
        console.error('Failed to resolve invite:', error);
        return null;
    }
}

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/clone', (req, res) => {
    res.render('clone');
});

app.post('/clone', async (req, res) => {
    try {
        let { botToken: userToken, sourceServerId, destServerId } = req.body;
        
        // Validate inputs
        if (!userToken) {
            throw new Error('User token is required.');
        }

        // Handle invite links
        if (sourceServerId.includes('discord.gg/') || sourceServerId.includes('discord.com/invite/')) {
            const resolvedId = await getServerIdFromInvite(sourceServerId);
            if (!resolvedId) {
                throw new Error('Invalid or expired invite link for source server.');
            }
            sourceServerId = resolvedId;
        }

        if (destServerId.includes('discord.gg/') || destServerId.includes('discord.com/invite/')) {
            const resolvedId = await getServerIdFromInvite(destServerId);
            if (!resolvedId) {
                throw new Error('Invalid or expired invite link for destination server.');
            }
            destServerId = resolvedId;
        }

        // Validate server IDs
        const serverIdRegex = /^[0-9]{17,20}$/;
        if (!serverIdRegex.test(sourceServerId) || !serverIdRegex.test(destServerId)) {
            throw new Error('Invalid server ID format.');
        }

        // Initialize cloning service
        const cloneService = new CloneService(userToken);
        
        // Attempt to clone the server
        const result = await cloneService.cloneServer(sourceServerId, destServerId);

        // Add helpful messages based on results
        if (result.errors.length === 0) {
            result.errors.push('Note: Only publicly visible channels and content were cloned.');
        }

        // Add warnings based on results
        const totalChannels = result.textChannels + result.voiceChannels + 
                            result.announceChannels + result.forumChannels + 
                            result.stageChannels;

        if (totalChannels === 0) {
            result.errors.push('No channels were cloned. Make sure you have access to the source server.');
        }

        if (totalChannels > 15) {
            result.errors.push('Large server detected. Some items might take longer to appear due to Discord\'s rate limits.');
        }

        if (result.emojis === 0) {
            result.errors.push('No emojis were cloned. This might be due to permission restrictions.');
        }

        res.render('result', { 
            success: true, 
            result: {
                ...result,
                errors: result.errors.map(error => {
                    // Make error messages more user-friendly
                    if (error.includes('Missing Access')) {
                        return 'Some content couldn\'t be accessed. This is normal for private channels.';
                    }
                    if (error.includes('rate limit')) {
                        return 'Hit Discord\'s rate limit. Wait a few minutes before cloning more content.';
                    }
                    return error;
                })
            }
        });
    } catch (error) {
        console.error('Cloning error:', error);

        // Handle specific error cases
        let errorMessage = error.message;
        if (error.message.includes('Invalid token')) {
            errorMessage = 'Invalid user token. Please check your token and try again.';
        } else if (error.message.includes('Missing Access')) {
            errorMessage = 'Unable to access one or both servers. Make sure you are a member of both servers.';
        } else if (error.message.includes('Unknown Guild')) {
            errorMessage = 'One or both server IDs are invalid. Please check and try again.';
        } else if (error.message.includes('rate limit')) {
            errorMessage = 'Discord rate limit reached. Please wait a few minutes and try again.';
        }

        res.render('result', { 
            success: false, 
            error: errorMessage
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
