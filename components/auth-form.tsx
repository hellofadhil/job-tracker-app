'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { auth, googleProvider } from '@/lib/firebase'
import { getFirebaseAuthErrorMessage } from '@/lib/firebase-auth-errors'

type AuthMode = 'login' | 'register' | 'forgot-password'

type AuthFormProps = {
  mode: AuthMode
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        d="M21.805 10.023H12v3.955h5.613c-.242 1.275-.967 2.355-2.06 3.08v2.56h3.34c1.955-1.8 3.112-4.45 3.112-7.596 0-.67-.06-1.314-.2-1.999Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.813 0 5.173-.93 6.893-2.522l-3.34-2.56c-.93.624-2.12.995-3.553.995-2.723 0-5.032-1.84-5.858-4.32H2.69v2.642A10.41 10.41 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.142 13.592A6.232 6.232 0 0 1 5.813 11.8c0-.62.113-1.222.329-1.792V7.366H2.69A10.41 10.41 0 0 0 1.6 11.8c0 1.59.38 3.1 1.09 4.434l3.452-2.642Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.688c1.53 0 2.9.526 3.98 1.56l2.982-2.982C17.168 2.59 14.813 1.6 12 1.6 7.93 1.6 4.42 3.934 2.69 7.366l3.452 2.642c.826-2.48 3.135-4.32 5.858-4.32Z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const redirectQuery = `?redirect=${encodeURIComponent(redirect)}`
  const [isPending, setIsPending] = React.useState(false)
  const [isGooglePending, setIsGooglePending] = React.useState(false)

  const titleMap: Record<AuthMode, string> = {
    login: 'Welcome back',
    register: 'Create your account',
    'forgot-password': 'Reset your password',
  }

  const descriptionMap: Record<AuthMode, string> = {
    login: 'Masuk ke dashboard job tracker dengan email atau akun Google.',
    register:
      'Buat akun baru untuk mulai simpan dan track progress lamaran kerja.',
    'forgot-password':
      'Masukkan email akunmu, lalu kami kirim link reset password.',
  }

  async function handleLoginSubmit(formData: FormData) {
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    setIsPending(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Login berhasil.')
      router.replace(redirect)
    } catch (error) {
      toast.error(getFirebaseAuthErrorMessage(error))
    } finally {
      setIsPending(false)
    }
  }

  async function handleRegisterSubmit(formData: FormData) {
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    setIsPending(true)

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )

      if (name) {
        await updateProfile(credential.user, { displayName: name })
      }

      toast.success('Akun berhasil dibuat.')
      router.replace(redirect)
    } catch (error) {
      toast.error(getFirebaseAuthErrorMessage(error))
    } finally {
      setIsPending(false)
    }
  }

  async function handleForgotPasswordSubmit(formData: FormData) {
    const email = String(formData.get('email') ?? '').trim()

    setIsPending(true)

    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Link reset password sudah dikirim ke email kamu.')
      router.replace('/login')
    } catch (error) {
      toast.error(getFirebaseAuthErrorMessage(error))
    } finally {
      setIsPending(false)
    }
  }

  async function handleGoogleLogin() {
    setIsGooglePending(true)

    try {
      await signInWithPopup(auth, googleProvider)
      toast.success('Login Google berhasil.')
      router.replace(redirect)
    } catch (error) {
      toast.error(getFirebaseAuthErrorMessage(error))
    } finally {
      setIsGooglePending(false)
    }
  }

  const actionMap: Record<AuthMode, (formData: FormData) => Promise<void>> = {
    login: handleLoginSubmit,
    register: handleRegisterSubmit,
    'forgot-password': handleForgotPasswordSubmit,
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.10),transparent_32%),linear-gradient(135deg,hsl(var(--background))_0%,hsl(var(--muted)/0.75)_45%,hsl(var(--background))_100%)] px-4 py-10">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute left-[-10%] top-12 h-52 w-52 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-0 right-[-5%] h-64 w-64 rounded-full bg-chart-2/20 blur-3xl" />

      <Card className="relative z-10 w-full max-w-md border-border/80 bg-card/90 shadow-2xl backdrop-blur">
        <CardHeader className="space-y-2">
          <div className="inline-flex w-fit rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-primary">
            My Job Tracker
          </div>
          <CardTitle className="text-2xl">{titleMap[mode]}</CardTitle>
          <CardDescription>{descriptionMap[mode]}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mode !== 'forgot-password' && (
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full"
              onClick={handleGoogleLogin}
              disabled={isGooglePending || isPending}
            >
              {isGooglePending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </Button>
          )}

          {mode !== 'forgot-password' && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  atau pakai email
                </span>
              </div>
            </div>
          )}

          <form action={actionMap[mode]} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nama lengkap"
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                autoComplete="email"
                required
              />
            </div>

            {mode !== 'forgot-password' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === 'login' && (
                    <Link
                      href={`/forgot-password${redirectQuery}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  autoComplete={
                    mode === 'register' ? 'new-password' : 'current-password'
                  }
                  required
                />
              </div>
            )}

            <Button className="h-11 w-full" disabled={isPending || isGooglePending}>
              {isPending && <LoaderCircle className="animate-spin" />}
              {mode === 'login' && 'Login'}
              {mode === 'register' && 'Register'}
              {mode === 'forgot-password' && 'Send reset link'}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            {mode === 'login' && (
              <>
                Belum punya akun?{' '}
                <Link
                  href={`/register${redirectQuery}`}
                  className="font-medium text-foreground"
                >
                  Register
                </Link>
              </>
            )}
            {mode === 'register' && (
              <>
                Sudah punya akun?{' '}
                <Link
                  href={`/login${redirectQuery}`}
                  className="font-medium text-foreground"
                >
                  Login
                </Link>
              </>
            )}
            {mode === 'forgot-password' && (
              <>
                Sudah ingat password?{' '}
                <Link
                  href={`/login${redirectQuery}`}
                  className="font-medium text-foreground"
                >
                  Kembali ke login
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
