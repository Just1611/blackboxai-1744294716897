const fetch = require('node-fetch');

class CloneService {
    constructor(token) {
        this.token = token;
        this.headers = {
            'Authorization': token,
            'Content-Type': 'application/json'
        };
    }

    async fetchWithAuth(url, options = {}) {
        const response = await fetch(`https://discord.com/api/v9${url}`, {
            ...options,
            headers: this.headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Falha ao aceder à API do Discord');
        }

        return response.json();
    }

    async clearExistingChannels(guildId) {
        try {
            // Fetch all channels in destination server
            const channels = await this.fetchWithAuth(`/guilds/${guildId}/channels`);
            
            // Delete all channels
            for (const channel of channels) {
                try {
                    await this.fetchWithAuth(`/channels/${channel.id}`, {
                        method: 'DELETE'
                    });
                    // Add delay to avoid rate limits
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    console.error(`Falha ao apagar canal ${channel.name}:`, error);
                }
            }
        } catch (error) {
            throw new Error(`Falha ao limpar canais existentes: ${error.message}`);
        }
    }

    async cloneServer(sourceId, destId) {
        try {
            const summary = {
                categories: 0,
                textChannels: 0,
                voiceChannels: 0,
                announceChannels: 0,
                forumChannels: 0,
                stageChannels: 0,
                emojis: 0,
                errors: []
            };

            // Clear existing channels first
            await this.clearExistingChannels(destId);

            // Fetch all visible channels from source server
            const sourceChannels = await this.fetchWithAuth(`/guilds/${sourceId}/channels`);
            
            // Get server information for additional settings
            const sourceGuild = await this.fetchWithAuth(`/guilds/${sourceId}`);
            
            // Organize channels by type
            const categories = sourceChannels.filter(channel => channel.type === 4);
            const textChannels = sourceChannels.filter(channel => channel.type === 0);
            const voiceChannels = sourceChannels.filter(channel => channel.type === 2);
            const announceChannels = sourceChannels.filter(channel => channel.type === 5);
            const forumChannels = sourceChannels.filter(channel => channel.type === 15);
            const stageChannels = sourceChannels.filter(channel => channel.type === 13);
            
            // Create categories first
            const categoryMap = new Map();
            
            // Clone categories
            for (const category of categories) {
                try {
                    const newCategory = await this.fetchWithAuth(`/guilds/${destId}/channels`, {
                        method: 'POST',
                        body: JSON.stringify({
                            name: category.name,
                            type: 4,
                            position: category.position,
                            permission_overwrites: category.permission_overwrites
                        })
                    });
                    categoryMap.set(category.id, newCategory.id);
                    summary.categories++;
                } catch (error) {
                    summary.errors.push(`Falha ao criar categoria: ${category.name}`);
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Clone text channels
            for (const channel of textChannels) {
                try {
                    await this.fetchWithAuth(`/guilds/${destId}/channels`, {
                        method: 'POST',
                        body: JSON.stringify({
                            name: channel.name,
                            type: 0,
                            topic: channel.topic,
                            nsfw: channel.nsfw,
                            rate_limit_per_user: channel.rate_limit_per_user,
                            parent_id: channel.parent_id ? categoryMap.get(channel.parent_id) : null,
                            position: channel.position,
                            permission_overwrites: channel.permission_overwrites
                        })
                    });
                    summary.textChannels++;
                } catch (error) {
                    summary.errors.push(`Falha ao criar canal de texto: ${channel.name}`);
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Clone announcement channels
            for (const channel of announceChannels) {
                try {
                    await this.fetchWithAuth(`/guilds/${destId}/channels`, {
                        method: 'POST',
                        body: JSON.stringify({
                            name: channel.name,
                            type: 5,
                            topic: channel.topic,
                            parent_id: channel.parent_id ? categoryMap.get(channel.parent_id) : null,
                            position: channel.position,
                            permission_overwrites: channel.permission_overwrites
                        })
                    });
                    summary.announceChannels++;
                } catch (error) {
                    summary.errors.push(`Falha ao criar canal de anúncios: ${channel.name}`);
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Clone voice channels
            for (const channel of voiceChannels) {
                try {
                    await this.fetchWithAuth(`/guilds/${destId}/channels`, {
                        method: 'POST',
                        body: JSON.stringify({
                            name: channel.name,
                            type: 2,
                            bitrate: channel.bitrate,
                            user_limit: channel.user_limit,
                            parent_id: channel.parent_id ? categoryMap.get(channel.parent_id) : null,
                            position: channel.position,
                            permission_overwrites: channel.permission_overwrites,
                            rtc_region: channel.rtc_region,
                            video_quality_mode: channel.video_quality_mode
                        })
                    });
                    summary.voiceChannels++;
                } catch (error) {
                    summary.errors.push(`Falha ao criar canal de voz: ${channel.name}`);
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Clone forum channels
            for (const channel of forumChannels) {
                try {
                    await this.fetchWithAuth(`/guilds/${destId}/channels`, {
                        method: 'POST',
                        body: JSON.stringify({
                            name: channel.name,
                            type: 15,
                            topic: channel.topic,
                            parent_id: channel.parent_id ? categoryMap.get(channel.parent_id) : null,
                            position: channel.position,
                            permission_overwrites: channel.permission_overwrites,
                            available_tags: channel.available_tags,
                            default_reaction_emoji: channel.default_reaction_emoji,
                            default_thread_rate_limit_per_user: channel.default_thread_rate_limit_per_user
                        })
                    });
                    summary.forumChannels++;
                } catch (error) {
                    summary.errors.push(`Falha ao criar canal de fórum: ${channel.name}`);
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Clone stage channels
            for (const channel of stageChannels) {
                try {
                    await this.fetchWithAuth(`/guilds/${destId}/channels`, {
                        method: 'POST',
                        body: JSON.stringify({
                            name: channel.name,
                            type: 13,
                            bitrate: channel.bitrate,
                            user_limit: channel.user_limit,
                            parent_id: channel.parent_id ? categoryMap.get(channel.parent_id) : null,
                            position: channel.position,
                            permission_overwrites: channel.permission_overwrites,
                            rtc_region: channel.rtc_region
                        })
                    });
                    summary.stageChannels++;
                } catch (error) {
                    summary.errors.push(`Falha ao criar canal de palco: ${channel.name}`);
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Try to clone emojis
            try {
                const sourceEmojis = await this.fetchWithAuth(`/guilds/${sourceId}/emojis`);
                for (const emoji of sourceEmojis) {
                    try {
                        const emojiData = await this.getEmojiData(emoji.id);
                        if (emojiData) {
                            await this.fetchWithAuth(`/guilds/${destId}/emojis`, {
                                method: 'POST',
                                body: JSON.stringify({
                                    name: emoji.name,
                                    image: emojiData
                                })
                            });
                            summary.emojis++;
                        }
                    } catch (error) {
                        summary.errors.push(`Falha ao clonar emoji: ${emoji.name}`);
                    }
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } catch (error) {
                summary.errors.push('Falha ao aceder aos emojis');
            }

            return summary;
        } catch (error) {
            throw new Error(`Falha ao clonar servidor: ${error.message}`);
        }
    }

    async getEmojiData(emojiId) {
        try {
            const response = await fetch(`https://cdn.discordapp.com/emojis/${emojiId}.png`);
            if (!response.ok) return null;
            const buffer = await response.buffer();
            return `data:image/png;base64,${buffer.toString('base64')}`;
        } catch (error) {
            return null;
        }
    }
}

module.exports = { CloneService };
