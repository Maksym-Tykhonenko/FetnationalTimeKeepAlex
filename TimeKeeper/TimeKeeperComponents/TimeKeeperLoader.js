import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, ImageBackground } from 'react-native';

const TimeKeeperLoader = () => {
  const timekeepeSpinner = `
     <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=0.7">
        <style>
          body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
          }

          .loading-wave {
            width: 300px;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: flex-end;
          }

          .loading-bar {
            width: 20px;
            height: 10px;
            margin: 0 5px;
            background-color: #fff;
            border-radius: 5px;
            animation: loading-wave-animation 1s ease-in-out infinite;
          }

          .loading-bar:nth-child(2) { animation-delay: 0.1s; }
          .loading-bar:nth-child(3) { animation-delay: 0.2s; }
          .loading-bar:nth-child(4) { animation-delay: 0.3s; }

          @keyframes loading-wave-animation {
            0%   { height: 10px; }
            50%  { height: 50px; }
            100% { height: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="loading-wave">
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
        </div>
      </body>
    </html>
  `;

  return (
    <ImageBackground
      source={require('../../assets/images/timekeeploader.png')}
      style={{ flex: 1 }}
    >
      <View style={styles.loaderwrap}>
        <WebView
          originWhitelist={['*']}
          source={{ html: timekeepeSpinner }}
          style={{ width: 200, height: 200, backgroundColor: 'transparent' }}
          scrollEnabled={false}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  loadercnt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 650,
  },
  loaderwrap: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default TimeKeeperLoader;
