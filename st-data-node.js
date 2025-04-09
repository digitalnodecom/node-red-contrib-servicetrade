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
                const page = typeof msg.page !== 'undefined' ? msg.page : config.page;
                const jobstatus = msg.jobstatus || config.jobstatus; // coming from frontend

                if (!requestUrl) {
                    node.error('URL not specified');
                    return done();
                }

                if (servicetradeobject) {
                    requestUrl += `/${servicetradeobject}`;
                }

                // Build query parameters
                const params = new URLSearchParams();

                if (limit) params.append('limit', limit);
                if (page) params.append('page', page);

                if (Array.isArray(jobstatus) && jobstatus.length > 0) {
                    params.append('status', jobstatus.join(','));
                } else if (typeof jobstatus === 'string' && jobstatus.trim() !== '') {
                    params.append('status', jobstatus);
                }
                

                const queryString = params.toString();
                if (queryString) {
                    requestUrl += `?${queryString}`;
                }

                const axios = require('axios');
                let requestConfig = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: requestUrl,
                    headers: {
                        'Cookie': `PHPSESSID=${authToken.data.authToken}`
                    }
                };

                const response = await axios.request(requestConfig);

                msg.payload = response.data;
                msg.limit = limit;
                msg.page = page;
                msg.servicetradeobject = servicetradeobject;
                msg.jobstatus = jobstatus;
                msg.url = requestUrl;

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
