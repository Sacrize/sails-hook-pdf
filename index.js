const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const wkhtmltopdf = require('wkhtmltopdf');
const _ = require('lodash');

module.exports = function (sails) {

    let self;

    return {
        defaults: {
            __configKey__: {
                templateDir: 'views/pdfs',
                wkOptions: {
                    output: 'pdfs/default.pdf',
                    disableJavascript: true,
                    minimumFontSize: 14,
                }
            }
        },
        configure: function () {
            sails.config[this.configKey].templateDir = path.resolve(sails.config.appPath, sails.config[this.configKey].templateDir);
        },
        initialize: function (cb) {
            self = this;
            return cb();
        },
        generate: _generate,
    }

    function _compileTemplate(view, data, cb) {
        if (sails.hooks.views && sails.hooks.views.render) {
            let relPath = path.relative(sails.config.paths.views, view);
            sails.hooks.views.render(relPath, data, cb);
            return;
        }
        fs.readFile(view + '.ejs', (err, source) => {
            if (err) return cb(err);
            try {
                let compileFn = ejs.compile((source || "").toString(), {
                    cache: true,
                    filename: view
                });
                cb(null, compileFn(data));
            } catch (e) {
                return cb(e);
            }
        });
    }

    function _generate(template, data, options) {
        return new Promise((resolve, reject) => {
            data = data || {};
            if (typeof data.layout === 'undefined') data.layout = false;
            let templateDir = sails.config[self.configKey].templateDir;
            let templatePath = path.join(templateDir, template);
            let opt = _.defaults(options, sails.config[self.configKey].wkOptions);
            _compileTemplate(templatePath, data, (err, html) => {
                if (err) {
                    return reject(err);
                } else {
                    if (opt.output) {
                        let absolutePathToFile = opt.output.replace(/[^\/]*$/, '');
                        if (absolutePathToFile) {
                            fs.mkdir(absolutePathToFile, { recursive: true }, (err) => {
                                if (err) {
                                    return reject(err);
                                }
                                wkhtmltopdf(html, opt, (err) => {
                                    if (err) {
                                        return reject(err);
                                    }
                                });
                                resolve();
                            });
                            return;
                        }
                    }
                    wkhtmltopdf(html, opt, (err) => {
                        if (err) {
                            return reject(err);
                        }
                    });
                    resolve();
                }
            });
        });
    }

}
