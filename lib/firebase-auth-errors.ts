const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'Email ini sudah dipakai. Coba login saja.',
  'auth/invalid-email': 'Format email tidak valid.',
  'auth/invalid-credential': 'Email atau password salah.',
  'auth/missing-password': 'Password wajib diisi.',
  'auth/network-request-failed': 'Koneksi gagal. Coba lagi.',
  'auth/popup-blocked': 'Popup login Google diblokir browser.',
  'auth/popup-closed-by-user': 'Popup login Google ditutup sebelum selesai.',
  'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.',
  'auth/user-not-found': 'Akun tidak ditemukan.',
  'auth/weak-password': 'Password minimal 6 karakter.',
}

export function getFirebaseAuthErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return AUTH_ERROR_MESSAGES[error.code] ?? 'Terjadi kesalahan autentikasi.'
  }

  return 'Terjadi kesalahan autentikasi.'
}
