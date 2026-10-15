import { CATEGORIES, UNITS, createListingSchema, type CreateListingInput } from "@morsel/shared";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { SelectField, TextArea, TextField } from "@/components/Field";
import { useCreateListing } from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
import { categoryStyles } from "@/lib/categories";
import { cn, toDateTimeLocal } from "@/lib/format";
import { fieldErrorsFrom, validate, type FieldErrors } from "@/lib/validation";

type FormValues = Omit<CreateListingInput, "availableUntil" | "quantity" | "weightKg"> & {
  availableUntil: string;
  quantity: string;
  weightKg: string;
};

const pickupPresets = [
  { label: "2 hours", hours: 2 },
  { label: "Tonight", hours: 6 },
  { label: "Tomorrow", hours: 24 },
];

const hoursFromNow = (hours: number) => toDateTimeLocal(new Date(Date.now() + hours * 3_600_000));

export function NewListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createListing = useCreateListing();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [values, setValues] = useState<FormValues>({
    title: "",
    description: "",
    category: "PREPARED",
    quantity: "",
    unit: "portions",
    weightKg: "",
    pickupAddress: "",
    city: user?.city ?? "",
    availableUntil: hoursFromNow(6),
  });

  const update =
    (key: keyof FormValues) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { data, errors } = validate(createListingSchema, values);
    setErrors(errors);
    if (!data) return;

    createListing.mutate(data, {
      onSuccess: ({ listing }) => navigate(`/listings/${listing.id}`),
      onError: (error) => setErrors(fieldErrorsFrom(error)),
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      <header className="mt-6">
        <h1 className="text-4xl font-semibold text-forest-900">Share your surplus</h1>
        <p className="mt-3 text-muted">Tell people what you have and when it needs to go.</p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-8">
        <Alert message={createListing.error?.message} />

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold">What kind of food?</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((category) => {
              const { label, icon: Icon, tint, accent } = categoryStyles[category];
              const active = values.category === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setValues((current) => ({ ...current, category }))}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl p-3 text-left text-sm font-semibold ring-1 transition",
                    active ? "bg-paper shadow-card ring-2 ring-forest-500" : "bg-paper/60 ring-line hover:ring-forest-200",
                  )}
                >
                  <span className={cn("grid size-9 place-items-center rounded-xl", tint, accent)}>
                    <Icon className="size-5" />
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <section className="space-y-5 rounded-3xl bg-paper p-6 shadow-card ring-1 ring-line/70 sm:p-8">
          <TextField label="Title" placeholder="e.g. 30 portions of dal makhani" value={values.title} onChange={update("title")} error={errors.title} />
          <TextArea
            label="Details"
            placeholder="Ingredients, allergens, how it's stored…"
            value={values.description}
            onChange={update("description")}
            error={errors.description}
          />
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField label="Quantity" type="number" min={1} value={values.quantity} onChange={update("quantity")} error={errors.quantity} />
            <SelectField label="Unit" value={values.unit} onChange={update("unit")}>
              {UNITS.map((unit) => (
                <option key={unit}>{unit}</option>
              ))}
            </SelectField>
            <TextField
              label="Approx. weight (kg)"
              type="number"
              min={0}
              step="0.1"
              value={values.weightKg}
              onChange={update("weightKg")}
              error={errors.weightKg}
            />
          </div>
        </section>

        <section className="space-y-5 rounded-3xl bg-paper p-6 shadow-card ring-1 ring-line/70 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
            <TextField label="Pickup address" value={values.pickupAddress} onChange={update("pickupAddress")} error={errors.pickupAddress} />
            <TextField label="City" value={values.city} onChange={update("city")} error={errors.city} />
          </div>
          <TextField
            label="Available until"
            type="datetime-local"
            value={values.availableUntil}
            onChange={update("availableUntil")}
            error={errors.availableUntil}
          />
          <div className="flex flex-wrap gap-2">
            {pickupPresets.map(({ label, hours }) => (
              <button
                key={label}
                type="button"
                onClick={() => setValues((current) => ({ ...current, availableUntil: hoursFromNow(hours) }))}
                className="rounded-full bg-forest-50 px-3.5 py-1.5 text-xs font-semibold text-forest-700 hover:bg-forest-100"
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <Button type="submit" size="lg" variant="accent" className="w-full" loading={createListing.isPending}>
          <Sparkles className="size-5" />
          Publish listing
        </Button>
      </form>
    </div>
  );
}
