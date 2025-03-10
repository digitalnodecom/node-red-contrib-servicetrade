module.exports = function (RED) {
    function serviceTradeNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.authConfig = RED.nodes.getNode(config.authConfig);

        node.on('input', async function (msg, send, done) {
            if (!node.authConfig) {
                node.error('Auth Config not set');
                return done();
            }

            try {
                const authToken = await node.authConfig.getAuthToken();

                let requestUrl = msg.url || config.url;
                const servicetradeobject = msg.servicetradeobject || config.servicetradeobject;
                const limit = msg.limit || config.limit;
                const page = msg.page || config.page;
                if (!requestUrl) {
                    node.error('URL not specified');
                    return done();
                }
                if(servicetradeobject){
                    requestUrl = requestUrl + "/" + servicetradeobject;
                }
                if(limit){
                    requestUrl = requestUrl + "?limit=" + limit;
                }
                if(page && limit){
                    requestUrl = requestUrl + "&page=" + page;
                }
                if(page && !limit){
                    requestUrl = requestUrl + "?page=" + page;
                }
                const axios = require('axios');
                let requestConfig = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: requestUrl,
                    headers: {
                        'Cookie': `PHPSESSID=${authToken.data.authToken}` // Use the token
                    }
                };

                const response = await axios.request(requestConfig);

                msg.payload = response.data;
                send(msg);

                done();
            } catch (error) {
                node.error('Error making GET request: ' + error.message, msg);
                done(error);
            }
        });
    }

    RED.nodes.registerType('get-st-data-node', serviceTradeNode);
};
