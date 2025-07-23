// HighscoreManager.js - Handles external highscore system integration

class HighscoreManager {
    constructor() {
        this.apiEndpoint = 'https://api.example.com/highscores'; // Replace with actual endpoint
        this.playerName = 'Anonymous';
        this.gameId = 'yoast-brick-breaker';
        this.apiKey = 'your-api-key-here'; // Replace with actual API key

        // For development/demo purposes, we'll simulate the API
        this.isDemoMode = true;

        console.log('HighscoreManager initialized');
    }

    setPlayerName(name) {
        this.playerName = name || 'Anonymous';
    }

    async submitScore(score, callback = null) {
        console.log(`Submitting score: ${score} for player: ${this.playerName}`);

        try {
            if (this.isDemoMode) {
                // Simulate API call for demo
                return await this.simulateAPICall(score, callback);
            } else {
                // Real API call
                return await this.realAPICall(score, callback);
            }
        } catch (error) {
            console.error('Error submitting score:', error);
            if (callback) {
                callback({
                    success: false,
                    message: 'Failed to submit score',
                    error: error.message
                });
            }
            return { success: false, error: error.message };
        }
    }

    async simulateAPICall(score, callback) {
        // Simulate network delay
        if (callback) callback({ status: 'submitting', message: 'Submitting score...' });

        await this.delay(1500); // 1.5 second delay

        // Simulate random success/failure for demo
        const isSuccess = Math.random() > 0.1; // 90% success rate

        if (isSuccess) {
            const rank = Math.floor(Math.random() * 100) + 1;
            const result = {
                success: true,
                message: `Score submitted! Rank #${rank}`,
                rank: rank,
                score: score,
                player: this.playerName
            };

            console.log('Score submission successful:', result);
            if (callback) callback(result);
            return result;
        } else {
            const result = {
                success: false,
                message: 'Server temporarily unavailable',
                error: 'Network timeout'
            };

            console.log('Score submission failed:', result);
            if (callback) callback(result);
            return result;
        }
    }

    async realAPICall(score, callback) {
        const payload = {
            player: this.playerName,
            score: score,
            game: this.gameId,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'X-Game-ID': this.gameId
            },
            body: JSON.stringify(payload)
        };

        if (callback) callback({ status: 'submitting', message: 'Submitting score...' });

        const response = await fetch(this.apiEndpoint, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (callback) {
            callback({
                success: true,
                message: result.message || 'Score submitted successfully!',
                rank: result.rank,
                score: score,
                player: this.playerName
            });
        }

        return result;
    }

    async getTopScores(limit = 10) {
        if (this.isDemoMode) {
            return this.generateMockLeaderboard(limit);
        }

        try {
            const response = await fetch(`${this.apiEndpoint}?limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-Game-ID': this.gameId
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return { success: false, error: error.message };
        }
    }

    generateMockLeaderboard(limit) {
        const names = ['Yoast_Master', 'SEO_Ninja', 'Content_King', 'Brick_Breaker', 'Orange_Crusher'];
        const leaderboard = [];

        for (let i = 0; i < limit; i++) {
            leaderboard.push({
                rank: i + 1,
                player: names[i % names.length] + '_' + (Math.floor(Math.random() * 999) + 1),
                score: Math.floor(Math.random() * 10000) + 1000,
                date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            });
        }

        // Sort by score descending
        leaderboard.sort((a, b) => b.score - a.score);

        // Update ranks
        leaderboard.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        return {
            success: true,
            leaderboard: leaderboard,
            total: leaderboard.length
        };
    }

    // Utility method for delays
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Configuration methods
    setAPIEndpoint(endpoint) {
        this.apiEndpoint = endpoint;
    }

    setAPIKey(key) {
        this.apiKey = key;
    }

    setGameId(id) {
        this.gameId = id;
    }

    enableDemoMode(enabled = true) {
        this.isDemoMode = enabled;
        console.log(`Demo mode ${enabled ? 'enabled' : 'disabled'}`);
    }

    // Validate score before submission
    isValidScore(score) {
        return typeof score === 'number' &&
               score >= 0 &&
               score <= 1000000 && // Maximum reasonable score
               Number.isInteger(score);
    }
}
