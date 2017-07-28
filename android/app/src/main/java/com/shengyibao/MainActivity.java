package com.shengyibao;

import android.os.Bundle;

import com.facebook.react.ReactActivity;

import org.lzh.framework.updatepluginlib.UpdateBuilder;

import javax.annotation.Nullable;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "shengyibao";
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
       // UpdateBuilder.create().check();
    }
}
