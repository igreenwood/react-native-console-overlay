import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react'
import type {ViewStyle, TextStyle, ImageStyle} from 'react-native'
import {
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Text,
  Image
} from 'react-native'
import {getLogs} from './consoleLogger'
import type {LogEntry} from './consoleLogger'
import ExpansionIcon from './assets/expansion.png'
import ShrinkIcon from './assets/shrink.png'

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window')
const CONSOLE_WIDTH = SCREEN_WIDTH
const CONSOLE_HEIGHT = SCREEN_HEIGHT / 4
const MINIMIZED_HEIGHT = 48
const MINIMIZED_WIDTH = 48
const BORDER_WIDTH = 16 // ドラッグ可能な外周の幅

export const ConsoleOverlay: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [position, setPosition] = useState({x: 0, y: 0})
  const [isMinimized, setIsMinimized] = useState(false)

  const scrollViewRef = useRef<ScrollView>(null)

  const constrain = useCallback(() => {
    const x = position.x
    const y = position.y
    const maxX = SCREEN_WIDTH - (isMinimized ? MINIMIZED_WIDTH : CONSOLE_WIDTH)
    const maxY =
      SCREEN_HEIGHT - (isMinimized ? MINIMIZED_HEIGHT : CONSOLE_HEIGHT)
    if (x < 0 || x > maxX || y < 0 || y > maxY) {
      setPosition({
        x: Math.max(0, Math.min(x, maxX)),
        y: Math.max(0, Math.min(y, maxY))
      })
    }
  }, [isMinimized, position.x, position.y])

  const createPanResponder = useCallback(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
          const {dx, dy} = gestureState
          setPosition({
            x: Math.max(
              0,
              Math.min(
                position.x + dx,
                SCREEN_WIDTH - (isMinimized ? MINIMIZED_WIDTH : CONSOLE_WIDTH)
              )
            ),
            y: Math.max(
              0,
              Math.min(
                position.y + dy,
                SCREEN_HEIGHT -
                  (isMinimized ? MINIMIZED_HEIGHT : CONSOLE_HEIGHT)
              )
            )
          })
        }
      }),
    [isMinimized, position]
  )

  const topPanResponder = useMemo(
    () => createPanResponder(),
    [createPanResponder]
  )
  const leftPanResponder = useMemo(
    () => createPanResponder(),
    [createPanResponder]
  )
  const rightPanResponder = useMemo(
    () => createPanResponder(),
    [createPanResponder]
  )
  const bottomPanResponder = useMemo(
    () => createPanResponder(),
    [createPanResponder]
  )

  const styles = useMemo(() => {
    return StyleSheet.create<Styles>({
      container: {
        position: 'absolute',
        width: isMinimized ? MINIMIZED_WIDTH : CONSOLE_WIDTH,
        height: isMinimized ? MINIMIZED_HEIGHT : CONSOLE_HEIGHT,
        backgroundColor: 'black',
        opacity: 0.9,
        borderRadius: 8,
        overflow: 'hidden'
      },
      topDraggable: {
        height: BORDER_WIDTH,
        width: '100%'
      },
      centerContainer: {
        flexDirection: 'row',
        flex: 1
      },
      leftDraggable: {
        width: BORDER_WIDTH
      },
      rightDraggable: {
        width: BORDER_WIDTH
      },
      bottomDraggable: {
        height: BORDER_WIDTH,
        width: '100%'
      },
      console: {
        flex: 1
      },
      textInput: {
        flex: 1,
        color: 'white'
      },
      logText: {
        fontSize: 12,
        userSelect: 'text'
      },
      log: {color: 'white'},
      debug: {color: 'white'},
      info: {color: 'blue'},
      warn: {color: 'orange'},
      error: {color: 'red'},
      dir: {color: 'white'},
      minimizeButton: {
        position: 'absolute',
        top: BORDER_WIDTH,
        right: BORDER_WIDTH,
        opacity: 1,
        backgroundColor: 'black'
      },
      icon: {
        width: 16,
        height: 16
      },
      dragButton: {
        position: 'absolute',
        top: BORDER_WIDTH,
        left: BORDER_WIDTH,
        opacity: 1,
        backgroundColor: 'black'
      }
    })
  }, [isMinimized])

  useEffect(() => {
    const updateLogs = () => {
      const newLogs = getLogs()
      setLogs(prevLogs => {
        if (JSON.stringify(prevLogs) !== JSON.stringify(newLogs)) {
          return [...newLogs]
        }
        return prevLogs
      })
    }

    const intervalId = setInterval(updateLogs, 100)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (!isMinimized) {
      scrollViewRef.current?.scrollToEnd({animated: true})
    }
    constrain()
  }, [logs, isMinimized, constrain])

  const toggleMinimize = () => {
    setIsMinimized(prev => !prev)
  }

  return (
    <View
      style={[
        styles.container,
        {
          left: position.x,
          top: position.y
        }
      ]}>
      <View {...topPanResponder.panHandlers} style={styles.topDraggable} />
      <View style={styles.centerContainer}>
        <View {...leftPanResponder.panHandlers} style={styles.leftDraggable} />
        <View style={styles.console}>
          {!isMinimized && (
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({animated: true})
              }
              scrollEventThrottle={16}>
              {/* iosで複数行テキスト選択させるための手法、逆にandroidでは選択できない */}
              {Platform.OS === 'ios' ? (
                <TextInput
                  value={(() => {
                    let logContent = ''
                    for (const log of logs) {
                      logContent += `[${log.type}] ${log.content}\n`
                    }
                    return logContent
                  })()}
                  multiline
                  editable={false}
                  scrollEnabled={false}
                  style={styles.textInput}
                />
              ) : (
                <Text selectable style={styles.textInput}>
                  {(() => {
                    let logContent = ''
                    for (const log of logs) {
                      logContent += `[${log.type}] ${log.content}\n`
                    }
                    return logContent
                  })()}
                </Text>
              )}
            </ScrollView>
          )}
        </View>
        <View
          {...rightPanResponder.panHandlers}
          style={styles.rightDraggable}
        />
      </View>
      <View
        {...bottomPanResponder.panHandlers}
        style={styles.bottomDraggable}
      />

      <TouchableOpacity onPress={toggleMinimize} style={styles.minimizeButton}>
        {isMinimized ? (
          <Image source={ExpansionIcon} style={styles.icon} />
        ) : (
          <Image source={ShrinkIcon} style={styles.icon} />
        )}
      </TouchableOpacity>
    </View>
  )
}

interface Styles {
  container: ViewStyle
  topDraggable: ViewStyle
  centerContainer: ViewStyle
  leftDraggable: ViewStyle
  rightDraggable: ViewStyle
  bottomDraggable: ViewStyle
  console: ViewStyle
  textInput: TextStyle
  logText: TextStyle
  log: TextStyle
  debug: TextStyle
  info: TextStyle
  warn: TextStyle
  error: TextStyle
  dir: TextStyle
  minimizeButton: ViewStyle
  icon: ImageStyle
  dragButton: ViewStyle
}
