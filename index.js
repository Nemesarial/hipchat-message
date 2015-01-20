var exec = require('child_process').exec;
var _ = require('lodash');

var parse = function (str, vars) {
    vars = ( typeof(vars) == 'object' && vars != null && !vars.hasOwnProperty('length')) ? vars : {};
    for (var idx in vars) {
        var r = new RegExp('\\[' + idx + '\\]', 'gi');
        str = str.replace(r, vars[idx]);
    }
    return str;
};


var Hipchat = function (options) {
    this.notify = function (config) {
        var config = _.assign({}, options, config);
        var cmd = 'curl -X POST -H "Cache-Control:no-cache" -d "room_id=[room_id]&from=[from]&message=[message]&message_format=[format]&color=[color]&notify=[notify]" https://api.hipchat.com/v1/rooms/message?auth_token=[auth_token]';

        cmd = parse(cmd, config);
        //console.log('\n\n' + cmd + '\n\n');
        //console.log(config);
        exec(cmd, function (err, stdo, stde) {
            //console.log('stdout:'+stdo);
            //console.log('stderr:'+stde);
            //if(null != err){
            //    console.log('exec err:'+err);
            //}
        });

    };

    this.message = function (message, settings, notify) {
        if (typeof(settings) !== 'object') {
            settings = {};
        }

        settings.message = message;

        if (typeof(notify) !== 'undefined') {
            settings.notify = (!!notify)?'1':'0';
        }

        this.notify(settings);
    };

    this.info = function (message, notify) {
        this.message(message, {color: 'gray'},notify);
    };

    this.success = function (message, notify) {
        this.message(message, {color: 'green'},notify);
    };

    this.warn = function (message, notify) {
        this.message(message, {color: 'yellow'},notify);
    };

    this.error = function (message, notify) {
        this.message(message, {color: 'red'},notify);
    };
};

module.exports=Hipchat;
