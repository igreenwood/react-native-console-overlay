import React from 'react'
import {View, Text} from 'react-native'
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'
import {ConsoleOverlay} from 'react-native-console-overlay'

export default function Home() {
  console.info('app started')
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Welcome to React Native Console Overlay Example!</Text>
          <ConsoleOverlay />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
