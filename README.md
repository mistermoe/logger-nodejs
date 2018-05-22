# Logger

A Simple extensible logging lib for nodejs. Enables users with as much functionality as they want (i.e. sending certain log messages to slack) in the form of plugins.

## Usage:
```js
const Logger = require('logger-nodejs');
const log = new Logger();


log.info('info');
log.warn('warn');
log.error('error');
log.fatal('fatal');
```

```
# output:
[INFO] <2018-5-21 18:48:21> (74539) -> info
[WARN] <2018-5-21 18:48:21> (74539) -> warn
[ERROR] <2018-5-21 18:48:21> (74539) -> error
[FATAL] <2018-5-21 18:48:21> (74539) -> fatal
```

- Provide your desired log level when starting your application like so `LOG_LEVEL=error` 
- The selected log level acts as a filter with regards to how much you want printed out. If you choose 'info' as your log level then everything from info - fatal will be printed out. On the other hand if you want to only print out the most severe errors you could select 'error' as the log level which would cause only error and fatal logs to be printed out. There is a function available for every log level from the level chosen all the way to the highest level. For example, if you were to choose `fatal` as your selected log level then an instance of this class would have a `fatal()` function available for you to use.

## Available log levels:
- debug
- info
- warn
- error
- fatal
- always

## Plugins
- Additional functionality can be added to this logger in the form of plugins which are provided during instantiation.
- For example, if you wanted to send certain log messages to slack, you can make use of the [slack plugin](https://github.com/mistermoe/logger-nodejs-slack-plugin) like so:

```js
const Logger = require('logger-nodejs');
const SlackPlugin = require('logger-nodejs-slack-plugin');

const slackPlugin = new SlackPlugin({
    webhook: 'https://hooks.slack.com/services/your/webhook',
    channel: 'errors',
    username: 'API',
    logLevel: 'error'
});

const log = new Logger({ plugins: [slackPlugin] });
```

- Now, every message of at least level `error` will be sent to the configured slack channel.