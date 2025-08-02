"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card } from "@/src/components/ui/card";
import { LocationFields } from "@/src/components/profile/shared/LocationFields.component";
import { UserIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/src/helpers/tailwind.helper";
import { InlineLoader } from "@/src/components/common/Loader.component";
import { LoadingAction, SpinnerSize } from "@/src/types/ui.type";

const customerOnboardingSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
  state_id: z.number().optional(),
  district_id: z.number().optional(),
});

type CustomerOnboardingForm = z.infer<typeof customerOnboardingSchema>;

export function CustomerOnboarding() {
  const { updateProfile, user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStateId, setSelectedStateId] = useState<number>(0);

  const form = useForm<CustomerOnboardingForm>({
    resolver: zodResolver(customerOnboardingSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      state_id: undefined,
      district_id: undefined,
    },
  });

  const handleStateChange = (stateId: number) => {
    setSelectedStateId(stateId);
    form.setValue("district_id", undefined);
  };

  const onSubmit = async (data: CustomerOnboardingForm) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await updateProfile({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        state_id: data.state_id,
        district_id: data.district_id,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to update profile:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/20 relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-primary-200/40 to-accent-200/40 rounded-full blur-3xl'></div>
        <div className='absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-accent-200/40 to-primary-200/40 rounded-full blur-3xl'></div>
      </div>

      <div className='relative z-10'>
        <div className='container mx-auto px-4 py-8 sm:px-6 lg:px-8'>
          <div className='max-w-2xl mx-auto'>
            <Card className='shadow-neumorphic-md hover:shadow-neumorphic-lg transition-all duration-300 border-primary-100/50'>
              <div className='text-center pb-6 p-6'>
                <div className='mx-auto mb-4 p-3 rounded-full bg-primary-50 shadow-neumorphic-sm'>
                  <UserIcon className='h-8 w-8 text-primary-600' weight='bold' />
                </div>
                <h2 className='text-2xl font-bold text-primary-800'>Complete Your Profile</h2>
                <p className='text-primary-600/70 mt-2'>Just a few details to get you started</p>
              </div>

              <div className='pt-0 px-6 pb-6'>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  {/* Name Fields */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-primary-800'>Basic Information</h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='first_name' className='text-sm font-medium text-primary-800'>
                          First Name *
                        </Label>
                        <Input
                          id='first_name'
                          placeholder='Enter your first name'
                          {...form.register("first_name")}
                          className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'
                          hasError={!!form.formState.errors.first_name}
                        />
                        {form.formState.errors.first_name && (
                          <p className='text-xs text-red-600 font-medium'>{form.formState.errors.first_name.message}</p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='last_name' className='text-sm font-medium text-primary-800'>
                          Last Name *
                        </Label>
                        <Input
                          id='last_name'
                          placeholder='Enter your last name'
                          {...form.register("last_name")}
                          className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'
                          hasError={!!form.formState.errors.last_name}
                        />
                        {form.formState.errors.last_name && (
                          <p className='text-xs text-red-600 font-medium'>{form.formState.errors.last_name.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-primary-800'>Contact Information (Optional)</h3>

                    <div className='space-y-2'>
                      <Label htmlFor='phone' className='text-sm font-medium text-primary-800 flex items-center gap-2'>
                        <PhoneIcon className='h-4 w-4' weight='bold' />
                        Phone Number
                      </Label>
                      <Input
                        id='phone'
                        type='tel'
                        placeholder='Enter your phone number'
                        {...form.register("phone")}
                        className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'
                      />
                      <p className='text-xs text-primary-600/70'>CAs can contact you directly if provided</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-primary-800'>Location (Optional)</h3>

                    <div className='space-y-2'>
                      <p className='text-xs text-primary-600/70'>Help us find CAs in your area</p>
                      <LocationFields
                        control={form.control}
                        errors={form.formState.errors}
                        stateValue={selectedStateId}
                        onStateChange={handleStateChange}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className='pt-6 border-t border-primary-100/50'>
                    <Button
                      type='submit'
                      disabled={isSubmitting}
                      className={cn(
                        "w-full h-12 text-lg font-semibold",
                        "bg-gradient-to-r from-primary-600 to-primary-700",
                        "hover:from-primary-500 hover:to-primary-600",
                        "shadow-neumorphic-md hover:shadow-neumorphic-lg",
                        "active:shadow-neumorphic-sm",
                        "transition-all duration-300",
                        "text-white"
                      )}
                    >
                      {isSubmitting ? (
                        <div className='flex items-center gap-2'>
                          <InlineLoader action={LoadingAction.SAVING} size={SpinnerSize.SMALL} />
                          <span>Setting up your profile...</span>
                        </div>
                      ) : (
                        "Complete Setup"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
