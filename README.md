# Phi Skills HTTP Client for JavaScript

| **Homepage** | [https://phiskills.com][0]        |
| ------------ | --------------------------------- | 
| **GitHub**   | [https://github.com/phiskills][1] |

## Overview

This project contains the JavaScript package to create an **HTTP Client**.  

## Installation

```bash
npm i @phiskills/http-client
```

## Creating the client

```javascript
import { build } from "@phiskills/http-client"

const client = build({ host: 'localhost', port: 80, token: '...zH34sk00wK...' })
const items = await client.get('api/items')
```
For more details, see [Fetch API][10].

[0]: https://phiskills.com
[1]: https://github.com/phiskills
[10]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
