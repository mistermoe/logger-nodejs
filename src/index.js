/* eslint no-console: 0 */

'use strict';

const DEFAULT_OPTS = { logMetadata: true, plugins: [] };
const LOG_LEVELS = {
    'debug': 0,
    'info': 1,
    'warn': 2,
    'error': 3,
    'fatal': 4,
    'always': 5
};

/**
 * Creates a logger that exposes various logging functions based on the selected log level.
 * The selected log level acts as a filter with regards to how much you want printed out.
 * If you choose 'info' as your log level then everything from info - fatal will be printed out.
 * On the other hand if you want to only print out the most severe errors you could select 'error'
 * as the log level which would cause only error and fatal logs to be printed out. There is a function
 * available for every log level from the level chosen all the way to the highest level. For example,
 * if you were to choose `fatal` as your selected log level then an instance of this class would have
 * a `fatal()` function available for you to use.
 */
class Logger {
    constructor(opts = {}) {
        opts = { ...DEFAULT_OPTS, ...opts };
        const logLevel = process.env['LOG_LEVEL'] || 'info';

        // store the numerical value of the selected log level so we don't have to look it up every time we log
        // something
        this.SELECTED_LEVEL = LOG_LEVELS[logLevel.toLowerCase()];
        this.name = opts.name;
        this.plugins = opts.plugins;
        this.output = console.log;


        // Create a function for each log level that is greater than or equal to the selected log level.
        // For example, if the selected log level is `info` then we create the following functions:
        //   info, warn, error fatal.
        Object.keys(LOG_LEVELS).forEach(logLevel => { this[logLevel] = this.log(logLevel); });
    }

    log(level) {
        return async function(text, opts = {}) {
            const levelValue = LOG_LEVELS[level];

            if (levelValue < this.SELECTED_LEVEL) return;

            let timestamp = `<${new Date().toLocaleString()}>`;
            text = `[${level.toUpperCase()}] ${timestamp} (${this.name}) -> ${text}`;

            // serialize and log metadata if metadata logging is turned on.
            if (this.logMetadata && opts.metadata) {
                text += ` ${JSON.stringify(opts.metadata)}`;
            }

            this.output(text);

            // run all attached plugins
            for (let plugin of this.plugins) {
                try {
                    plugin.run({ text, level, levelValue, opts });
                } catch (e) {
                    this.output('plugin error:', e);

                }
            }
        };
    }

    set name(name) {
        if (name) {
            this._name = `${name}-${process.pid}`;
        } else {
            this._name = process.pid;
        }
    }

    get name() {
        return this._name;
    }

    static getLevelValue(level) {
        return LOG_LEVELS[level];
    }
}

// Export logger
module.exports = Logger;
