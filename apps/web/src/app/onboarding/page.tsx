"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const onboardingSchema = z.object({
  organizationName: z.string().min(2, { message: "Organization name is required." }),
  organizationSlug: z.string().min(2, { message: "URL slug is required." }).regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens are allowed."),
  companySize: z.string().min(1, { message: "Please select a company size." }),
  industry: z.string().min(1, { message: "Please select an industry." }),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
  });

  // Auto-generate slug from name
  const orgName = watch("organizationName");
  React.useEffect(() => {
    if (orgName && !watch("organizationSlug")) {
      const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      setValue("organizationSlug", slug, { shouldValidate: true });
    }
  }, [orgName, setValue, watch]);

  const onSubmit = async (data: OnboardingFormValues) => {
    setIsLoading(true);

    // Simulate network delay and frontend-only workspace creation
    setTimeout(() => {
      setIsLoading(false);
      // Success simulation: push to dashboard
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Set up your workspace</CardTitle>
          <CardDescription>Tell us a bit about your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                placeholder="Acme Corp"
                {...register("organizationName")}
                aria-invalid={!!errors.organizationName}
              />
              {errors.organizationName && (
                <p className="text-sm text-red-500">{errors.organizationName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="organizationSlug">Workspace URL</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm">
                  app.example.com/
                </span>
                <Input
                  id="organizationSlug"
                  className="rounded-l-none"
                  placeholder="acme-corp"
                  {...register("organizationSlug")}
                  aria-invalid={!!errors.organizationSlug}
                />
              </div>
              {errors.organizationSlug && (
                <p className="text-sm text-red-500">{errors.organizationSlug.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <select 
                  id="companySize" 
                  {...register("companySize")}
                  className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <option value="">Select size...</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
                {errors.companySize && (
                  <p className="text-sm text-red-500">{errors.companySize.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <select 
                  id="industry" 
                  {...register("industry")}
                  className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <option value="">Select industry...</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="retail">Retail</option>
                  <option value="other">Other</option>
                </select>
                {errors.industry && (
                  <p className="text-sm text-red-500">{errors.industry.message}</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create workspace
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
