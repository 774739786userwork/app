/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <AMapFoundationKit/AMapFoundationKit.h> //引入高德地图核心包
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [AMapServices sharedServices].apiKey = @"cdf355f6a224da6a4a8bacd3ae91c1f3	"; //设置高德地图SDK服务key
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"shengyibao"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [self shareAppVersionAlert];
  return YES;
}


//判断是否需要提示更新App
- (void)shareAppVersionAlert
{
 // [self judgeNeedVersionUpdate];
  //App内info.plist文件里面版本号
  NSDictionary *infoDict = [[NSBundle mainBundle] infoDictionary];
  NSString *appVersion = infoDict[@"CFBundleShortVersionString"];
  NSString *bundleId   = @"1271458189";//@"com.linxkj.wcpapp";//infoDict[@"CFBundleIdentifier"];
  NSString *urlString = [NSString stringWithFormat:@"https://itunes.apple.com/lookup?id=%@", bundleId];
  //两种请求appStore最新版本app信息 通过bundleId与appleId判断
  //[NSString stringWithFormat:@"https://itunes.apple.com/cn/lookup?bundleid=%@", bundleId]
 // [NSString stringWithFormat:@"https://itunes.apple.com/cn/lookup?id=%@", bundleId];
  NSURL *urlStr = [NSURL URLWithString:urlString];
  //创建请求体
  NSURLRequest *urlRequest = [NSURLRequest requestWithURL:urlStr];
  [NSURLConnection sendAsynchronousRequest:urlRequest queue:[NSOperationQueue mainQueue] completionHandler:^(NSURLResponse * _Nullable response, NSData * _Nullable data, NSError * _Nullable connectionError) {
    if (connectionError) {
      //            NSLog(@"connectionError->%@", connectionError.localizedDescription);
      return ;
    }
    NSError *error;
    NSDictionary *resultsDict = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&error];
    if (error) {
      //            NSLog(@"error->%@", error.localizedDescription);
      return;
    }
    NSArray *sourceArray = resultsDict[@"results"];
    if (sourceArray.count > 0) {
      //AppStore内最新App的版本号
      NSDictionary *sourceDict = sourceArray[0];
      NSString *newVersion = sourceDict[@"version"];
      if ([self judgeNewVersion:newVersion withOldVersion:appVersion])
      {
        /*
        UIAlertController *alertVc = [UIAlertController alertControllerWithTitle:@"更新最新版本" message:@"" preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *action2 = [UIAlertAction actionWithTitle:@"现在升级" style:UIAlertActionStyleDestructive handler:^(UIAlertAction * _Nonnull action) {
          //跳转到AppStore，该App下载界面
          [[UIApplication sharedApplication] openURL:[NSURL URLWithString:sourceDict[@"trackViewUrl"]]];
        }];
        [alertVc addAction:action2];
        [[UIApplication sharedApplication].delegate.window.rootViewController presentViewController:alertVc animated:YES completion:nil];
        */
        
        NSString *msg = [NSString stringWithFormat:@"更新最新版本"];
        
        UIAlertController *alertController = [UIAlertController
                                              alertControllerWithTitle:@"升级提示"
                                              message:msg
                                              preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *otherAction = [UIAlertAction
                                      actionWithTitle:@"现在升级"
                                      style:UIAlertActionStyleDestructive
                                      handler:^(UIAlertAction*action) {
          
          NSURL *url = [NSURL URLWithString:@"https://itunes.apple.com/us/app/%E5%A4%9A%E9%82%A6%E7%94%9F%E6%84%8F%E5%AE%9D/id1271458189?l=zh&ls=1&mt=8"];
          [[UIApplication sharedApplication] openURL:url];
                                        
        }];
        [alertController addAction:otherAction];
        
        [[UIApplication sharedApplication].delegate.window.rootViewController
         presentViewController:alertController
         animated:YES
         completion:nil];
      
    }
      
    }
  }];
}
//每天进行一次版本判断
- (void)judgeNeedVersionUpdate
{
  NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
  [formatter setDateFormat:@"yyyy-MM-dd"];
  //获取年-月-日
  NSString *dateString = [formatter stringFromDate:[NSDate date]];
  NSString *currentDate = [[NSUserDefaults standardUserDefaults] objectForKey:@"currentDate"];
  if ([currentDate isEqualToString:dateString]) {
    return;
  }
  [[NSUserDefaults standardUserDefaults] setObject:dateString forKey:@"currentDate"];
}
//判断当前app版本和AppStore最新app版本大小
- (BOOL)judgeNewVersion:(NSString *)newVersion withOldVersion:(NSString *)oldVersion
{
  if([newVersion compare:oldVersion options:NSNumericSearch] == NSOrderedDescending)
  {
    return YES;
  }
  return NO;
}
@end
