import React from 'react';
import {
  YellowBox
} from 'react-native';

import Routes from './routes';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket',
  'Async Storage'
]);

export default function App(){
  return(
      <Routes/>
  );
}

