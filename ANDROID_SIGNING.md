Android signing guide for Capacitor (Android)

1) Generate a release keystore (run on Windows PowerShell/CMD):

```bash
keytool -genkey -v -keystore my-release-key.jks -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Place the generated `my-release-key.jks` somewhere safe (e.g., `android/app/` or a secure folder).

2) Add signing properties (recommended: `~/.gradle/gradle.properties` or `android/gradle.properties`):

```
MYAPP_UPLOAD_STORE_FILE=my-release-key.jks
MYAPP_UPLOAD_STORE_PASSWORD=your_store_password
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_KEY_PASSWORD=your_key_password
```

3) Configure `android/app/build.gradle` (add/modify inside the `android {` block):

```groovy
signingConfigs {
    release {
        storeFile file(MYAPP_UPLOAD_STORE_FILE)
        storePassword MYAPP_UPLOAD_STORE_PASSWORD
        keyAlias MYAPP_UPLOAD_KEY_ALIAS
        keyPassword MYAPP_UPLOAD_KEY_PASSWORD
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        // enable proguard or other settings as needed
    }
}
```

If you prefer not to keep raw passwords in repo files, put them into your user `~/.gradle/gradle.properties` (keeps values local).

4) Build the signed release APK (from project root):

```powershell
cd android
.\gradlew assembleRelease
```

Signed APK path (when signing config applied):
`android/app/build/outputs/apk/release/app-release.apk`

If you forget signing the release, an unsigned APK appears as `app-release-unsigned.apk`.

5) Verify signature and align (optional, ZIP align is applied by Gradle for release builds):

```bash
jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/app-release.apk
```

Notes & troubleshooting:
- If `MYAPP_UPLOAD_STORE_FILE` is relative, ensure the file is inside the `android/app/` folder or use an absolute path.
- Android Studio can generate signing config for you via Build > Generate Signed Bundle / APK and will auto-add the necessary Gradle config.
- Keep the keystore and passwords secure; back them up.
