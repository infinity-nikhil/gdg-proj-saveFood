import { registerSchema, type RegisterInput, type Role } from "@morsel/shared";
import { HandHeart, Store, type LucideIcon } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Alert } from "@/components/Alert";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/Button";
import { TextField } from "@/components/Field";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/format";
import { fieldErrorsFrom, validate, type FieldErrors } from "@/lib/validation";

const roles: Array<{ value: Role; icon: LucideIcon; title: string; body: string }> = [
  { value: "DONOR", icon: Store, title: "I have food", body: "Restaurant, bakery, grocer or caterer" },
  { value: "RECEIVER", icon: HandHeart, title: "I need food", body: "Shelter, NGO, community fridge or individual" },
];

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [values, setValues] = useState<RegisterInput>({
    name: "",
    email: "",
    password: "",
    role: params.get("role") === "RECEIVER" ? "RECEIVER" : "DONOR",
    organization: "",
    city: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { data, errors } = validate(registerSchema, values);
    setErrors(errors);
    if (!data) return;

    setSubmitting(true);
    setFormError(null);
    try {
      await register({ ...data, organization: data.organization || undefined });
      navigate(data.role === "DONOR" ? "/listings/new" : "/browse", { replace: true });
    } catch (error) {
      setErrors(fieldErrorsFrom(error));
      setFormError(error instanceof Error ? error.message : "Could not create your account");
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: keyof RegisterInput) => (event: ChangeEvent<HTMLInputElement>) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  return (
    <AuthShell
      title="Join Morsel"
      subtitle="Free for everyone. Takes about a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-forest-600 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Alert message={formError} />

        <div className="grid grid-cols-2 gap-3">
          {roles.map(({ value, icon: Icon, title, body }) => {
            const active = values.role === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setValues((current) => ({ ...current, role: value }))}
                className={cn(
                  "rounded-2xl p-4 text-left ring-1 transition",
                  active ? "bg-forest-700 text-cream ring-forest-700" : "bg-paper ring-line hover:ring-forest-200",
                )}
              >
                <Icon className={cn("size-6", active ? "text-sun-400" : "text-forest-600")} />
                <p className="mt-3 font-semibold">{title}</p>
                <p className={cn("mt-1 text-xs", active ? "text-cream/70" : "text-muted")}>{body}</p>
              </button>
            );
          })}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Your name" autoComplete="name" value={values.name} onChange={update("name")} error={errors.name} />
          <TextField label="City" autoComplete="address-level2" value={values.city} onChange={update("city")} error={errors.city} />
        </div>
        <TextField
          label="Organisation"
          hint="Optional — shown to people you share with"
          value={values.organization}
          onChange={update("organization")}
          error={errors.organization}
        />
        <TextField label="Email" type="email" autoComplete="email" value={values.email} onChange={update("email")} error={errors.email} />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters"
          value={values.password}
          onChange={update("password")}
          error={errors.password}
        />

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
