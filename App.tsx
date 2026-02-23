import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  View,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000"
      />

      <WebView
         
        source={{ uri: "https://haw-mobile-app.vercel.app/mobile.html" }}

        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={["*"]}

        /* ✅ ANDROID FIXES */
        mixedContentMode="always"
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}

        /* ✅ MEDIA */
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        allowsFullscreenVideo={true}

        /* ✅ UX */
        startInLoadingState={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}

        /* ✅ DEBUG (VERY IMPORTANT) */
        onError={(e) => {
          console.log("❌ WEBVIEW ERROR:", e.nativeEvent);
        }}
        onHttpError={(e) => {
          console.log("❌ HTTP ERROR:", e.nativeEvent);
        }}
        renderError={() => (
          <View style={styles.error}>
            <Text style={styles.errorText}>
              Failed to load website
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight
        : 0,
  },
  error: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
  },
});