"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { cn } from "@/src/helpers/tailwind.helper";
import { useAuth } from "@/src/hooks/useAuth";
import { useCreateContactRequest } from "@/src/services/contact-requests.service";
import { useProfileDetails, useSpecializations } from "@/src/services/profile.service";
import type { ProfileDetails } from "@/src/types/profile.type";
import type { CreateContactRequestData, UrgencyLevel } from "@/src/types/contact-request.type";
import { LoadingAction } from "@/src/types/ui.type";
import { InlineLoader } from "@/src/components/common/Loader.component";

interface ContactRequestModalProps {
  open: boolean;
  onClose: () => void;
  caProfile: ProfileDetails | null;
}

const formSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(1000, "Message must be less than 1000 characters"),
  service_needed: z.string().optional(),
  urgency: z.custom<UrgencyLevel>(),
  customer_phone: z
    .string()
    .regex(/^[+]?[\d\s\-()]+$/, "Please enter a valid phone number")
    .min(10, "Phone number must be between 10 and 15 characters")
    .max(15, "Phone number must be between 10 and 15 characters")
    .optional(),
  location_city: z.string().max(50, "City name must be less than 50 characters").optional(),
  location_state: z.string().max(50, "State name must be less than 50 characters").optional(),
});

type FormData = z.infer<typeof formSchema>;

export const ContactRequestModal: React.FC<ContactRequestModalProps> = ({ open, onClose, caProfile }) => {
  const { user, profile: customerProfile, isAuthenticated } = useAuth();
  const { data: customerDetails } = useProfileDetails(user?.id);
  const { data: specializations = [] } = useSpecializations();
  const createMutation = useCreateContactRequest();

  const defaultUrgency: UrgencyLevel = "medium" as UrgencyLevel;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      message: "",
      service_needed: undefined,
      urgency: defaultUrgency,
      customer_phone: customerProfile?.phone || "",
      location_city: "",
      location_state: customerDetails?.state_name || "",
    },
  });

  // Reset form when modal opens/closes or target CA changes
  useEffect(() => {
    if (open) {
      reset({
        subject: "",
        message: "",
        service_needed: undefined,
        urgency: defaultUrgency,
        customer_phone: customerProfile?.phone || "",
        location_city: "",
        location_state: customerDetails?.state_name || "",
      });
    }
  }, [open, caProfile?.id, reset, customerProfile?.phone, customerDetails?.state_name]);

  const urgency = watch("urgency");

  // Accessibility: focus management and trap within modal
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    // Focus first interactive element (subject field) or Close button fallback
    const subjectInput = modalRef.current?.querySelector<HTMLInputElement>("#subject");
    if (subjectInput) {
      subjectInput.focus();
    } else if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC to close
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      // Trap focus within modal
      const container = modalRef.current;
      if (!container) return;
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        // Shift + Tab
        if (active === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        // Tab
        if (active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleUrgencyClick = (value: UrgencyLevel) => setValue("urgency", value);

  const urgencyOptions: Array<{ value: UrgencyLevel; label: string; className: string }> = useMemo(
    () => [
      { value: "low" as UrgencyLevel, label: "Low", className: "bg-green-50 text-green-700 border-green-200" },
      { value: "medium" as UrgencyLevel, label: "Medium", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
      { value: "high" as UrgencyLevel, label: "High", className: "bg-orange-50 text-orange-700 border-orange-200" },
      { value: "urgent" as UrgencyLevel, label: "Urgent", className: "bg-red-50 text-red-700 border-red-200" },
    ],
    []
  );

  async function onSubmit(values: FormData) {
    if (!caProfile) return;
    if (!isAuthenticated || !user) {
      window.location.href = `/auth?returnUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    const payload: CreateContactRequestData = {
      ca_profile_id: caProfile.id,
      customer_profile_id: customerProfile?.id,
      customer_name:
        [customerProfile?.first_name, customerProfile?.last_name].filter(Boolean).join(" ") || user.email || "Customer",
      customer_email: user.email || "",
      subject: values.subject.trim(),
      message: values.message.trim(),
      service_needed: values.service_needed || undefined,
      urgency: values.urgency as UrgencyLevel,
      customer_phone: values.customer_phone?.trim() || undefined,
      location_city: values.location_city?.trim() || undefined,
      location_state: values.location_state?.trim() || undefined,
    };

    await createMutation.mutateAsync(payload);
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-[60] flex items-center justify-center'
      role='dialog'
      aria-modal='true'
      aria-labelledby='contact-modal-title'
      aria-describedby='contact-modal-description'
    >
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={onClose} aria-hidden='true' />

      {/* Modal Card */}
      <Card
        className={cn(
          "relative z-[61] w-full max-w-2xl mx-4",
          "shadow-neumorphic-lg border border-primary-100 bg-white"
        )}
        ref={modalRef}
      >
        <div className='p-6 space-y-6'>
          <div className='space-y-1'>
            <h3 id='contact-modal-title' className='text-xl font-bold text-primary-900'>
              Send Contact Request
            </h3>
            <p id='contact-modal-description' className='text-sm text-primary-700/80'>
              We’ll share your details with the CA so they can respond.
            </p>
          </div>

          {/* CA summary */}
          {caProfile && (
            <div className='text-sm text-primary-800'>
              To:{" "}
              <span className='font-semibold'>
                {`${caProfile.first_name || ""} ${caProfile.last_name || ""}`.trim()}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <div className='space-y-2'>
              <Label htmlFor='subject'>Subject</Label>
              <Input
                id='subject'
                {...register("subject")}
                className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'
              />
              {errors.subject && <p className='text-sm text-red-600/90'>{errors.subject.message}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='message'>Message</Label>
              <Textarea
                id='message'
                rows={6}
                {...register("message")}
                className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'
              />
              {errors.message && <p className='text-sm text-red-600/90'>{errors.message.message}</p>}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='service'>Service Needed</Label>
                <Select onValueChange={(value) => setValue("service_needed", value)}>
                  <SelectTrigger className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'>
                    <SelectValue id='service' placeholder='Select a service (optional)' />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec.id} value={spec.code}>
                        {spec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Urgency</Label>
                <div className='flex flex-wrap gap-2'>
                  {urgencyOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type='button'
                      onClick={() => handleUrgencyClick(opt.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-full border text-sm transition-all duration-200",
                        "shadow-neumorphic-inset hover:shadow-neumorphic-md",
                        opt.className,
                        urgency === opt.value && "ring-2 ring-primary-400"
                      )}
                      aria-pressed={urgency === opt.value}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {errors.urgency && <p className='text-sm text-red-600/90'>Please select urgency</p>}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone (optional)</Label>
                <Input
                  id='phone'
                  {...register("customer_phone")}
                  className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'
                />
                {errors.customer_phone && <p className='text-sm text-red-600/90'>{errors.customer_phone.message}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='city'>City (optional)</Label>
                <Input
                  id='city'
                  {...register("location_city")}
                  className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'
                />
                {errors.location_city && <p className='text-sm text-red-600/90'>{errors.location_city.message}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='state'>State (optional)</Label>
                <Input
                  id='state'
                  {...register("location_state")}
                  className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'
                />
                {errors.location_state && <p className='text-sm text-red-600/90'>{errors.location_state.message}</p>}
              </div>
            </div>

            <div className='flex items-center justify-end gap-3 pt-2'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                className='shadow-neumorphic-sm'
                ref={closeButtonRef}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting || createMutation.isPending} className='gap-2'>
                {isSubmitting || createMutation.isPending ? (
                  <>
                    <InlineLoader action={LoadingAction.SAVING} />
                    Sending
                  </>
                ) : (
                  "Send Request"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};
