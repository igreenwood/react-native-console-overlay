import {useCallback, FC, PropsWithChildren} from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'
import {ConsoleOverlay, LogType} from 'react-native-console-overlay'

export default function Home() {
  console.info('app started')

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: 16
          }}>
          <Text style={{paddingVertical: 32}}>
            Welcome to React Native Console Overlay Example!
          </Text>
          <Button type="log" />
          <Button type="debug" />
          <Button type="info" />
          <Button type="dir" />
          <Button type="warn" />
          <Button type="error" />
          <Button
            type="debug"
            label="long log"
            message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          />
        </View>
        <ConsoleOverlay showTimestamp />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

type ButtonProps = {
  type: LogType
  label?: string
  message?: string
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({type, label, message}) => {
  const colors = {
    log: 'white',
    debug: 'white',
    info: 'blue',
    warn: 'orange',
    error: 'red',
    dir: 'white'
  }
  const onPress = useCallback((_type: LogType) => {
    console[_type](message ? message : `${_type} clicked`)
  }, [])
  return (
    <TouchableOpacity
      style={{
        marginVertical: 8,
        padding: 8,
        backgroundColor: colors[type],
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'gray',
        width: '80%'
      }}
      onPress={() => onPress(type)}>
      <Text style={{alignSelf: 'center', color: 'gray'}}>
        {label ? label : type}
      </Text>
    </TouchableOpacity>
  )
}
