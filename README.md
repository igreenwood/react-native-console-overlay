# React Native Console Overlay

<img src="/example/assets/icon.png">

React Native Console Overlay is a powerful, easy-to-use library that brings console logs directly to your device screen.

Say goodbye to the hassles of traditional debugging and hello to a more efficient & flexible development process 🎉

## Features

- On-device console logging
- Support for common console methods (log, debug, info, warn, error, dir)
- Draggable and resizable overlay
- Minimizable interface
- Customizable colors
- Timestamp display option
- Cross-platform compatibility (iOS and Android)

## Installation

```bash
npm install react-native-console-overlay
# or
yarn add react-native-console-overlay
```

## Usage

Add the ConsoleOverlay component to your app's root component.

```typescript

import React from 'react';
import { View } from 'react-native';
import { ConsoleOverlay } from 'react-native-console-overlay';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* Your app content */}
      <ConsoleOverlay />
    </View>
  );
};

export default App;
```

It is useful to use flags to toggle visibility so that you can view logs whenever you want in the application.

```typescript

import React from 'react';
import { View } from 'react-native';
import { ConsoleOverlay } from 'react-native-console-overlay';
import { consoleOverlayAtom } from '~/states/consoleOverlayState';

const App = () => {
  const [consoleOverlayState] = useAtom(consoleOverlayAtom);
  return (
    <View style={{ flex: 1 }}>
      {/* Your app content */}
      {consoleOverlayState.isConsoleVisible && <ConsoleOverlay />}
    </View>
  );
};

export default App;
```

## Props

The ConsoleOverlay component accepts the following props:

| Prop                | Type    | Default   | Description                                                         |
| ------------------- | ------- | --------- | ------------------------------------------------------------------- |
| showTimestamp       | boolean | false     | Show timestamp for each log entry                                   |
| textColor           | string  | 'white'   | Color of the log text                                               |
| logBackgroundColors | object  | See below | Background colors for different log types                           |
| containerOpacity    | number  | 0.9       | Opacity of the overlay container                                    |
| fontSize            | number  | 12        | Font size of the log text                                           |
| lineHeight          | number  | 21.6      | Line height of the log text                                         |
| heightScale         | number  | 0.25      | Height of the overlay as a proportion of screen height (0.1 to 0.9) |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
