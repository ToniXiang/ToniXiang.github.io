## 基礎的 Flutter 應用程式
檢查開發環境的配置是否正確。它會檢測 Flutter SDK、相關工具(如 Android Studio)、設備模擬器。配置終端指令：
```cmd
flutter doctor
```
pubspec.yaml 用來新增專案的相依套件與設定
```txt
name: FlutterApp
description: "A new Flutter project."
publish_to: 'none'
version: 0.1.0
environment:
    sdk: ^3.7.2
dependencies :
    flutter:
        sdk: flutter
dev_dependencies :
    flutter test:
        sdk: flutter
    flutter_lints: ^5.0.0
flutter:
    uses-material-design: true
```
建立 Flutter 專案:
```cmd
flutter create my_app
```
進入專案目錄:
```cmd
cd my_app
```
啟動應用程式:
```cmd
flutter run
```
重置相依套件:
```cmd
flutter clean
flutter pub get
```
打包應用程式:
```cmd
flutter build apk --split-per-abi   # Android
flutter build ios --release   # iOS
```
主要的 Flutter 檔案結構：
- lib/ 包含 Dart 程式碼的主要目錄
- pubspec.yaml 專案的相依套件與設定檔
- android/ Android 平台相關檔案
- ios/ iOS 平台相關檔案