// Shim for react-dom in React Native
// React Query v4 imports unstable_batchedUpdates from react-dom,
// but in React Native this is provided by react-native instead.
export {unstable_batchedUpdates} from 'react-native';
