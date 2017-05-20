import * as types from './ActionTypes';
/**
 * 用户登录
 */
export function loginingActon(username, password) {
    return {
        type: types.Logining_ACTION,
        api: types.Login_API,
        param: { username, password }
    };
}