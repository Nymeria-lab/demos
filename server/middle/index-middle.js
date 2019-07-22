const request = require('request');
const ejs = require("ejs");
const fs = require("fs");


function get_lib_list(app_name, target) {
    let lib_path = "../../static/resources/assets.dll.json";
    let assets_path = `../../static/resources/assets.service.pc.json`;

    let libs, assets;
    if (process.env.NODE_ENV === 'production') {
        libs = require(lib_path);
        assets = require(assets_path);
    } else {
        libs = JSON.parse(fs.readFileSync(__dirname + "/" + lib_path).toString());
        assets = JSON.parse(fs.readFileSync(__dirname + "/" + assets_path).toString());
    }

    return {
        js: Object.keys(libs).filter(v => v !== '').map(v => libs[v].js)
    }
}

module.exports = function (cdn_host, server_disable_map) {
    return function (req, res) {
        let  _app ='service';

        let _target = 'pc';

        let _lib_list = get_lib_list(_app, _target);
        let _params = {
            css_libs: _lib_list.css,
            js_libs: _lib_list.js,
            app_type: _app,
            app_target: _target,
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
        let _company_setting_url = `${req.protocol}://${req.headers.host}/api/auth.get.company.setting.info`;
        request({
            url: _company_setting_url,
            headers: {
                'User-Agent': 'request'
            }
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                _params = Object.assign(_params, JSON.parse(body).result);
            } else {
                console.log('_company_url: ', `${req.protocol} ${req.headers.host}`);
                console.error('错误:' + error + ' 状态:' + response);
            }
            let template_file = __dirname + "/../template/" + (_app === 'admin' ? 'admin' : _target) + ".ejs";
            ejs.renderFile(template_file, {params: _params}, null, function (err, str) {
                res.set("Cache-Control", "no-store");
                res.write(str);
                res.end();
            });
        })
    }
};
