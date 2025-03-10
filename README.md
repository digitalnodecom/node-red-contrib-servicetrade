# ServiceTrade GET Data Node

## Overview

The ServiceTrade GET Data Node is a Node-RED node that enables you to make GET requests to the ServiceTrade API. This node requires authentication through a separate Auth Config Node that manages your ServiceTrade credentials.

## Prerequisites

- Node-RED installed and running
- Valid ServiceTrade account credentials
- Auth Config Node installed and configured


### Configuration Fields

| Field | Description |
|-------|-------------|
| Name | A name to identify this node in your flow |
| Auth Config | Select the Auth Config Node that contains your ServiceTrade credentials |
| URL | The base URL for the ServiceTrade API (typically `https://api.servicetrade.com/api`) |
| Objects | Select from a comprehensive list of ServiceTrade objects to query |
| Limit | The maximum number of records to return per request |
| Page | The page number for paginated results |

### Available ServiceTrade Objects

The node supports all ServiceTrade API objects, including:

- Account
- Activity
- Appointment
- Asset
- Contact
- Contract
- Invoice
- Job
- Quote
- User
- ...and many more (see dropdown in the node configuration for the complete list)

## Usage Examples

### Basic GET Request

1. Configure the Auth Config Node with your ServiceTrade credentials
2. Configure the GET Data Node with:
   - Auth Config: Your auth node
   - URL: `https://api.servicetrade.com/api`
   - Objects: `job`
   - Limit: 10
   - Page: 1

This will retrieve the first 10 jobs from your ServiceTrade account.

### Dynamic Requests

You can override the node's configuration using message properties:

```javascript
msg.url = "https://api.servicetrade.com/api";
msg.payload = {
    servicetradeobject: "quote"
};
msg.limit = 20;
msg.page = 2;
return msg;
```

## Input

The node accepts the following inputs through the incoming message:

| Property | Type | Description |
|----------|------|-------------|
| `msg.url` | String | Overrides the configured URL |
| `msg.servicetradeobject` | String | Overrides the configured ServiceTrade object |
| `msg.limit` | Number | Overrides the configured limit |
| `msg.page` | Number | Overrides the configured page |


## Error Handling

The node will report errors in the following situations:
- Auth Config is not set
- URL is not specified
- Authentication fails
- API request fails

## Notes on Authentication

This node works in conjunction with the Auth Config Node, which manages your ServiceTrade credentials. The Auth Config Node:

1. Securely stores your username and password
2. Obtains an authentication token from the ServiceTrade API
3. Provides this token to the GET Data Node for API requests


## Troubleshooting

- **Error: Auth Config not set** - Ensure you have created and selected an Auth Config Node
- **Error: URL not specified** - Verify that either the URL field is configured or `msg.url` is provided
- **Authentication errors** - Check your username and password in the Auth Config Node
- **API errors** - Refer to the ServiceTrade API documentation for specific error codes

