"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Organization, User, Contact } from "@/lib/types/contacts";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  organizationId: z.string().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
  ownerId: z.string().min(1, "Owner is required"),
});

export function ContactsForm({
  contact,
  organizations,
  members,
  onSuccess,
}: {
  contact?: Contact;
  organizations: Organization[];
  members: User[];
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: contact
      ? {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          jobTitle: contact.jobTitle,
          organizationId: contact.organizationId,
          tags: contact.tags,
          notes: contact.notes,
          ownerId: contact.ownerId,
        }
      : {},
  });

  const onSubmit = async (data: any) => {
    // Replace with mutation to the contacts server action.
    // await createOrUpdateContact(data);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input label="First Name" {...register("firstName")} />
          {errors.firstName && (
            <span className="text-red-600 text-xs">{errors.firstName.message}</span>
          )}
        </div>
        <div className="flex-1">
          <Input label="Last Name" {...register("lastName")} />
          {errors.lastName && (
            <span className="text-red-600 text-xs">{errors.lastName.message}</span>
          )}
        </div>
      </div>
      <Input label="Email" type="email" {...register("email")} />
      {errors.email && (
        <span className="text-red-600 text-xs">{errors.email.message}</span>
      )}
      <Input label="Phone" {...register("phone")} />
      <Input label="Job Title" {...register("jobTitle")} />
      <div>
        <label>Organization</label>
        <select {...register("organizationId")} className="w-full border p-2 rounded">
          <option value="">—</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>
      <Input label="Tags" {...register("tags")} />
      <Input label="Notes" {...register("notes")} />
      <div>
        <label>Owner</label>
        <select {...register("ownerId")} className="w-full border p-2 rounded">
          <option value="">Choose owner</option>
          {members.map((user) => (
            <option value={user.id} key={user.id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>
        {errors.ownerId && (
          <span className="text-red-600 text-xs">{errors.ownerId.message}</span>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {contact ? "Update" : "Create"} Contact
        </Button>
      </div>
    </form>
  );
}