import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react'
import type {ViewStyle, TextStyle, ImageStyle, ColorValue} from 'react-native'
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

const MINIMIZED_HEIGHT = 48
const MINIMIZED_WIDTH = 48
const PADDING = 16 // ドラッグ可能な外周の幅
const BORDER_WIDTH = 1

interface ConsoleOverlayProps {
  textColor?: string
  logBackgroundColors?: {
    log?: ColorValue
    debug?: ColorValue
    info?: ColorValue
    warn?: ColorValue
    error?: ColorValue
    dir?: ColorValue
  }
  containerOpacity?: number
  fontSize?: number
  lineHeight?: number
  heightScale?: number // 0.1 <= scale <= 0.9
}

export const ConsoleOverlay: React.FC<ConsoleOverlayProps> = ({
  textColor = 'white',
  logBackgroundColors = {
    log: 'white',
    debug: 'white',
    info: 'blue',
    warn: 'orange',
    error: 'red',
    dir: 'white'
  },
  containerOpacity = 0.9,
  fontSize = 12,
  lineHeight = 12 * 1.8,
  heightScale = 0.25
}) => {
  const validatedHeightScale = Math.min(Math.max(heightScale, 0.1), 0.9)
  const consoleHeight = SCREEN_HEIGHT * validatedHeightScale
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [position, setPosition] = useState({x: 0, y: 0})
  const [isMinimized, setIsMinimized] = useState(false)

  const scrollViewRef = useRef<ScrollView>(null)

  const constrain = useCallback(() => {
    const x = position.x
    const y = position.y
    const maxX = SCREEN_WIDTH - (isMinimized ? MINIMIZED_WIDTH : CONSOLE_WIDTH)
    const maxY =
      SCREEN_HEIGHT - (isMinimized ? MINIMIZED_HEIGHT : consoleHeight)
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
                SCREEN_HEIGHT - (isMinimized ? MINIMIZED_HEIGHT : consoleHeight)
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
        height: isMinimized ? MINIMIZED_HEIGHT : consoleHeight,
        backgroundColor: 'black',
        borderColor: 'gray',
        borderWidth: BORDER_WIDTH,
        opacity: containerOpacity,
        borderRadius: 16,
        overflow: 'hidden',
        zIndex: 999
      },
      topDraggable: {
        height: PADDING,
        width: '100%'
      },
      centerContainer: {
        flexDirection: 'row',
        flex: 1
      },
      leftDraggable: {
        width: PADDING
      },
      rightDraggable: {
        width: PADDING
      },
      bottomDraggable: {
        height: PADDING,
        width: '100%'
      },
      console: {
        flex: 1
      },
      textInput: {
        fontSize,
        lineHeight,
        color: textColor
      },
      log: {backgroundColor: logBackgroundColors.log, color: 'black'},
      debug: {backgroundColor: logBackgroundColors.debug, color: 'black'},
      info: {backgroundColor: logBackgroundColors.info, color: 'black'},
      warn: {backgroundColor: logBackgroundColors.warn, color: 'black'},
      error: {backgroundColor: logBackgroundColors.error, color: 'black'},
      dir: {backgroundColor: logBackgroundColors.dir, color: 'black'},
      minimizeButton: {
        position: 'absolute',
        top: PADDING,
        right: PADDING,
        opacity: 1,
        backgroundColor: 'black'
      },
      icon: {
        width: 16,
        height: 16
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
              scrollEventThrottle={1}>
              {Platform.OS === 'ios' ? (
                <TextInput
                  multiline
                  editable={false}
                  scrollEnabled={false}
                  style={styles.textInput}>
                  {logs.map((log, index) => {
                    return (
                      <TextInput
                        key={index}
                        editable={false}
                        scrollEnabled={false}>
                        <Text
                          style={
                            styles[log.type]
                          }>{` ${log.type.toUpperCase()} `}</Text>
                        <TextInput
                          multiline
                          editable={false}
                          scrollEnabled={false}>
                          {` ${log.content}\n`}
                        </TextInput>
                      </TextInput>
                    )
                  })}
                </TextInput>
              ) : (
                <Text selectable style={styles.textInput}>
                  {logs.map((log, index) => {
                    return (
                      <Text key={index}>
                        <Text key={index} style={styles[log.type]}>
                          {` ${log.type.toUpperCase()} `}
                        </Text>
                        <Text key={index}>{` ${log.content}\n`}</Text>
                      </Text>
                    )
                  })}
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
  log: TextStyle
  debug: TextStyle
  info: TextStyle
  warn: TextStyle
  error: TextStyle
  dir: TextStyle
  minimizeButton: ViewStyle
  icon: ImageStyle
}
