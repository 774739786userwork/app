package com.shengyibao;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Application;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.util.Log;

import com.facebook.react.ReactApplication;
import me.ele.dodo.AMapLocationReactPackage;
import com.doctadre.contactpicker.ContactPickerPackage;
import com.rhaker.reactnativeselectcontacts.ReactNativeSelectContacts;
import com.imagepicker.ImagePickerPackage;
import com.gm.RCTGMBluetooth.RCTGMBluetoothPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.tencent.bugly.Bugly;
import com.tencent.bugly.crashreport.CrashReport;

import org.json.JSONException;
import org.json.JSONObject;
import org.lzh.framework.updatepluginlib.UpdateConfig;
import org.lzh.framework.updatepluginlib.creator.DialogCreator;
import org.lzh.framework.updatepluginlib.model.Update;
import org.lzh.framework.updatepluginlib.model.UpdateParser;
import org.lzh.framework.updatepluginlib.strategy.UpdateStrategy;
import org.lzh.framework.updatepluginlib.util.SafeDialogOper;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new AMapLocationReactPackage(),
            new ContactPickerPackage(),
            new ReactNativeSelectContacts(),
            new ImagePickerPackage(),
            new RCTGMBluetoothPackage(),
            new FastImageViewPackage(),
            new RNDeviceInfo(),
            new RCTCameraPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  //  checkVerionInit();
     // CrashReport.initCrashReport(getApplicationContext(), "fd74a0b563", false);
      Bugly.init(getApplicationContext(), "fd74a0b563", false);
  }

  private void checkVerionInit(){
    PackageManager manager = this.getPackageManager();
        PackageInfo info = null;
        try {
            info = manager.getPackageInfo(getPackageName(), 0);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
         UpdateConfig.getConfig()
                .url("http://112.74.47.41:1009/csbboss/mobileServiceManager/user/updateAppVersion.page?token=ksXeexA60VU")
                .jsonParser(new UpdateParser() {
                    @Override
                    public Update parse(String response) {
                        try {
                            JSONObject object = new JSONObject(response);
                            JSONObject data = object.getJSONObject("data");
                            if (data == null) return null;
                            Update update = new Update(response);
                            update.setUpdateTime(System.currentTimeMillis());
                            update.setUpdateUrl(data.optString("link"));
                            update.setVersionCode(data.optInt("version_code"));
                            update.setVersionName(data.optString("version"));
                            update.setUpdateContent(data.optString("version_content"));
                            update.setForced(false);
                            update.setIgnore(false);
                            return update;
                        } catch (JSONException e) {
                            return null;
                        }

                    }
                }).updateDialogCreator(new DialogCreator() {
            @Override
            public Dialog create(final Update update, Activity activity) {
                if (activity == null || activity.isFinishing()) {
                    Log.e("DialogCreator--->", "Activity was recycled or finished,dialog shown failed!");
                    return null;
                }

                String updateContent = update.getUpdateContent();
                AlertDialog.Builder builder = new AlertDialog.Builder(activity)
                        .setMessage(updateContent)
                        .setTitle(R.string.update_title)
                        .setPositiveButton(R.string.update_immediate, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                sendDownloadRequest(update);
                                SafeDialogOper.safeDismissDialog((Dialog) dialog);
                            }
                        });
                if (update.isIgnore() && !update.isForced()) {
                    builder.setNeutralButton(R.string.update_ignore, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            sendUserIgnore(update);
                            SafeDialogOper.safeDismissDialog((Dialog) dialog);
                        }
                    });
                }
                if (!update.isForced()) {
                    builder.setNegativeButton(R.string.update_cancel, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            sendUserCancel();
                            SafeDialogOper.safeDismissDialog((Dialog) dialog);
                        }
                    });
                }
                builder.setCancelable(false);
                return builder.create();
            }
        }).strategy(new UpdateStrategy() {

            @Override
            public boolean isShowUpdateDialog(Update update) {
                return true;
            }

            @Override
            public boolean isAutoInstall() {
                return true;
            }

            @Override
            public boolean isShowDownloadDialog() {
                return true;
            }
        });
  }
}
