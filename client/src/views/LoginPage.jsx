import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth.js";
import { getDashboardPath } from "../utils/formatters.js";
import LoadingSpinner from "../components/shared/LoadingSpinner.jsx";

const LoginPage = () => {
  const {
    login,
    loginWithGoogle,
    isAuthenticated,
    user,
    loading: authLoading,
  } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || getDashboardPath(user?.role);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  if (authLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.replace(getDashboardPath(user.role));
    }
  }, [isAuthenticated, authLoading, user, router]);

  if (isAuthenticated) {
    return <LoadingSpinner fullScreen message="Redirecting..." />;
  }

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const loggedInUser = await login(values);
      router.replace(getDashboardPath(loggedInUser.role) || from);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const loggedInUser = await loginWithGoogle();
      router.replace(getDashboardPath(loggedInUser.role));
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Google sign-in failed";
      toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-surface rounded-xl border border-border-subtle shadow-ambient p-8">
          <h1 className="text-2xl font-bold text-text-main mb-2">
            Welcome back
          </h1>
          <p className="text-text-muted mb-8">Sign in to continue to Nestify</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="form-label-nestify" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`form-input-nestify ${errors.email ? "input-error" : ""}`}
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="form-label-nestify" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`form-input-nestify ${errors.password ? "input-error" : ""}`}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />
              {errors.password && (
                <p className="text-error text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary-nestify w-full"
              disabled={submitting}
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="divider text-text-muted text-sm my-6">OR</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="btn btn-outline w-full gap-2"
          >
            {googleLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <p className="text-center text-sm text-text-muted mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
