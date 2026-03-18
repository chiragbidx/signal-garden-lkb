"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Organization, Contact, User } from "@/lib/types/contacts";

const organizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  domain: z.string().min(1, "Domain is required"),
  address: z.string().optional(),
  description: z.string().optional(),
  industry: z.string().optional(),
  tags: z.string().optional(),
  primaryContactId: z.string().optional(),
});

export function OrganizationsForm({
  organization,
  contacts,
  members,
  onSuccess,
}: {
  organization?: Organization;
  contacts: Contact[];
  members: User[];
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(organizationSchema),
    defaultValues: organization
      ? {
          name: organization.name,
          domain: organization.domain,
          address: organization.address,
          description: organization.description,
          industry: organization.industry,
          tags: organization.tags,
          primaryContactId: organization.primaryContactId,
        }
      : {},
  });

  const onSubmit = async (data: any) => {
    // Replace with mutation to the organizations server action.
    // await createOrUpdateOrganization(data);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Name" {...register("name")} />
      {errors.name && (
        <span className="text-red-600 text-xs">{errors.name.message}</span>
      )}
      <Input label="Domain" {...register("domain")} />
      {errors.domain && (
        <span className="text-red-600 text-xs">{errors.domain.message}</span>
      )}
      <Input label="Address" {...register("address")} />
      <Input label="Description" {...register("description")} />
      <Input label="Industry" {...register("industry")} />
      <Input label="Tags" {...register("tags")} />
      <div>
        <label>Primary Contact</label>
        <select {...register("primaryContactId")} className="w-full border p-2 rounded">
          <option value="">—</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.firstName} {c.lastName}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {organization ? "Update" : "Create"} Organization
        </Button>
      </div>
    </form>
  );
}