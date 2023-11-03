import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { clearStorage } from './services/deviceStorage';
import { handleSignIn } from './features/userSlice';

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => async (action) => {
    console.log(action?.payload?.data, 'global error');

    if (
      action?.payload?.data?.message === 'jwt expired' ||
      action?.payload?.data?.message?.includes('Your token has expired') ||
      action?.payload?.data?.message?.includes('Invalid token') ||
      action?.payload?.data?.message?.includes('invalid signature')
    ) {
      await clearStorage();
      api.dispatch(handleSignIn(false));
      return next(action);
    }

    if (action?.payload?.data?.message?.includes('duplicate')) {
      Toast.show({
        type: 'error',
        text1: 'This ad is already in your list',
        autoHide: true,
        visibilityTime: 5000,
      });
      return next(action);
    }

    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (
      isRejectedWithValue(action) &&
      !action?.payload?.data?.message?.includes('Please log') &&
      !action?.payload?.data?.message?.includes('query')
    ) {
      Toast.show({
        type: 'error',
        text1: action?.payload?.data?.message || 'Something went wrong!',
        autoHide: true,
        visibilityTime: 5000,
      });
    }

    return next(action);
  };
