import { loginSchema, type LoginInput } from "@morsel/shared";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Alert } from "@/components/Alert";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/Button";
import { TextField } from "@/components/Field";
import { useAuth } from "@/hooks/useAuth";
import { fieldErrorsFrom, validate, type FieldErrors } from "@/lib/validation";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState<LoginInput>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { data, errors } = validate(loginSchema, values);
    setErrors(errors);
    if (!data) return;

    setSubmitting(true);
    setFormError(null);
    try {
      await login(data);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrors(fieldErrorsFrom(error));
      setFormError(error instanceof Error ? error.message : "Could not sign in");
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: keyof LoginInput) => (event: ChangeEvent<HTMLInputElement>) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to share surplus or pick up food nearby."
      footer={
        <>
          New to Morsel?{" "}
          <Link to="/register" className="font-semibold text-forest-600 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Alert message={formError} />
        <TextField label="Email" type="email" autoComplete="email" value={values.email} onChange={update("email")} error={errors.email} />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={update("password")}
          error={errors.password}
        />
        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          Sign in
        </Button>
        <p className="rounded-2xl bg-forest-50 px-4 py-3 text-xs text-forest-700">
          Demo: <strong>ana@crumbandco.com</strong> (donor) or <strong>kabir@hopekitchen.org</strong> (receiver),
          password <strong>password123</strong>
        </p>
      </form>
    </AuthShell>
  );
}
