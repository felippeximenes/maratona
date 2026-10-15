import NetInfo from '@react-native-community/netinfo';
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { clearCache } from '@/lib/cache';
import { supabase } from '@/lib/supabase';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export class SignInError extends Error {}

async function ensureOnline() {
  const state = await NetInfo.fetch();
  if (state.isConnected === false) {
    throw new SignInError('Sem internet. Confira a conexão e tente de novo.');
  }
}

/** Returns false when the person cancels; cancelling is not an error. */
export async function signInWithGoogle(): Promise<boolean> {
  await ensureOnline();

  let idToken: string | null;
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (isCancelledResponse(response)) {
      return false;
    }
    idToken = response.data.idToken;
  } catch (error) {
    if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) {
      return false;
    }
    if (isErrorWithCode(error) && error.code === statusCodes.IN_PROGRESS) {
      return false;
    }
    if (isErrorWithCode(error) && error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new SignInError('O Google Play não está disponível neste aparelho. Atualize e tente de novo.');
    }
    console.warn('Google sign-in failed', error);
    throw new SignInError('O Google não respondeu. Tente de novo.');
  }

  if (!idToken) {
    throw new SignInError('O Google não respondeu. Tente de novo.');
  }

  const { error } = await supabase.auth.signInWithIdToken({ provider: 'google', token: idToken });
  if (error) {
    console.warn('Supabase sign-in failed', error);
    await ensureOnline();
    throw new SignInError('Nosso servidor não respondeu. Tente de novo em instantes.');
  }
  return true;
}

export async function signOut() {
  // Sai também do Google para o seletor de contas aparecer no próximo login.
  // Sair apaga do aparelho a cópia das telas.
  await Promise.allSettled([GoogleSignin.signOut(), supabase.auth.signOut(), clearCache()]);
}
