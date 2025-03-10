module.exports = function(RED) {
    function AuthConfigNode(config) {
        RED.nodes.createNode(this, config);
        this.username = config.username;
        this.password = config.password;

        // Function to get the token
        this.getAuthToken = async function() {
            const axios = require('axios');
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `https://api.servicetrade.com/api/auth?username=${this.username}&password=${this.password}`
            };

            try {
                const response = await axios.request(config);
                return response.data; // Return token or auth data
            } catch (error) {
                throw error;
            }
        };
    }

    // Register the config node
    RED.nodes.registerType('auth-config-node', AuthConfigNode, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    });
};
