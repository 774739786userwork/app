import { Storage } from 'react-native-go';

const DeviceInfoKey = 'DeviceInfoKey';
const DeviceInfoURL = undefined;

class DeviceInfo {

    //返回用户基本信息
    static getInfo() {
        return DeviceInfoURL;
    }
    //设置用户信息
    static setInfo(_Info) {
        DeviceInfoURL = _Info;
        Storage.save(DeviceInfoKey, _Info);
    }

    static loadInfo() {
        Storage.get(DeviceInfoKey).then((item) => {
            if (item) {
                DeviceInfoURL = item;
            }
        });
    }

}

export default DeviceInfo;