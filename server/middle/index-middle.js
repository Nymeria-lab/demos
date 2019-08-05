const ejs = require("ejs");

module.exports = function (cdn_host, server_disable_map) {
    return function (req, res) {
        let _params = {
            app_type: 'apps',
            app_target: 'pc',
            cdn_host: cdn_host || '',
            special_title: '',
            company_logo: '',
            domain: '',
            app_company: '',
            server_disable_map: server_disable_map,
            sso: '',
            cc_highlight: '',
            theme: '',
            os: /Windows/.test(req.headers['user-agent']) ? 'windows' : 'not_windows'
        };
        let template_file = __dirname + "/../template/pc.ejs";
        ejs.renderFile(template_file, {params: _params}, null, function (err, str) {
            res.set("Cache-Control", "no-store");
            res.write(str);
            res.end();
        });
    }
};
