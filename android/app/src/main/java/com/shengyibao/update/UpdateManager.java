package com.shengyibao.update;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.tencent.bugly.Bugly;
import com.tencent.bugly.beta.Beta;

/**
 * Created by tielan on 2017/8/24.
 */

public class UpdateManager extends ReactContextBaseJavaModule {

    public UpdateManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "UpdateManager";
    }

    @ReactMethod
    public void check() {
        Beta.checkUpgrade();
    }
}
