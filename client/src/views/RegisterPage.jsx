import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth.js";
import { getDashboardPath } from "../utils/formatters.js";
import LoadingSpinner from "../components/shared/LoadingSpinner.jsx";

const RegisterPage = () => {
  const {
    register: registerUser,
    loginWithGoogle,
    isAuthenticated,
    user,
    loading: authLoading,
  } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      photo: "",
      password: "",
      confirmPassword: "",
      role: "tenant",
    },
  });

  const password = watch("password");

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
      const newUser = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        photo: values.photo,
        role: values.role,
      });
      router.replace(getDashboardPath(newUser.role));
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
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
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-surface rounded-xl border border-border-subtle shadow-ambient p-8">
          <h1 className="text-2xl font-bold text-text-main mb-2">
            Create your account
          </h1>
          <p className="text-text-muted mb-8">
            Join Nestify as a tenant or property owner
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="form-label-nestify" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className={`form-input-nestify ${errors.name ? "input-error" : ""}`}
                placeholder="Jane Doe"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-error text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

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
              <label className="form-label-nestify" htmlFor="photo">
                Photo URL (optional)
              </label>
              <input
                id="photo"
                type="url"
                className="form-input-nestify"
                placeholder="https://example.com/photo.jpg"
                {...register("photo")}
              />
            </div>

            <div>
              <label className="form-label-nestify" htmlFor="role">
                I want to
              </label>
              <select
                id="role"
                className="select select-bordered w-full focus:border-primary"
                {...register("role", { required: true })}
              >
                <option value="tenant">Rent properties (Tenant)</option>
                <option value="owner">List my properties (Owner)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="form-label-nestify" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`form-input-nestify ${errors.confirmPassword ? "input-error" : ""}`}
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-error text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary-nestify w-full mt-2"
              disabled={submitting}
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Create Account"
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
              "Continue with Google (Tenant)"
            )}
          </button>

          <p className="text-center text-sm text-text-muted mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
