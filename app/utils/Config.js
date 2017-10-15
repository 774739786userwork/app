import { Storage } from 'react-native-go';

const ConfigKey = 'ConfigKey';
let ConfigInfo = {};

class Config {

    //返回用户基本信息
    static get(key) {
        return ConfigInfo[key];
    }
    //设置用户信息
    static put(key,value) {
        ConfigInfo[key] = value;
        Storage.save(ConfigKey, JSON.stringify(ConfigInfo));
    }
    static init() {
        Storage.get(ConfigKey).then((item) => {
            if (item) {
                ConfigInfo = JSON.parse(item);
            }
        });
    }

}

export default Config;