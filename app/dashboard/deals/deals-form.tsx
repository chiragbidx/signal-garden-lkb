"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Organization, Contact, User, Deal } from "@/lib/types/contacts";

const dealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  value: z.coerce.number().min(0, "Value must be non-negative"),
  currency: z.string().min(1, "Currency is required"),
  status: z.enum(["New", "Qualified", "Proposal", "Won", "Lost"]),
  organizationId: z.string().optional(),
  contactId: z.string().optional(),
  expectedCloseDate: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  ownerId: z.string().min(1, "Owner is required"),
});

export function DealsForm({
  deal,
  organizations,
  contacts,
  members,
  onSuccess,
}: {
  deal?: Deal;
  organizations: Organization[];
  contacts: Contact[];
  members: User[];
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(dealSchema),
    defaultValues: deal
      ? {
          title: deal.title,
          value: deal.value,
          currency: deal.currency,
          status: deal.status,
          organizationId: deal.organizationId,
          contactId: deal.contactId,
          expectedCloseDate: deal.expectedCloseDate
            ? new Date(deal.expectedCloseDate).toISOString().substring(0, 10)
            : "",
          description: deal.description,
          notes: deal.notes,
          ownerId: deal.ownerId,
        }
      : {},
  });

  const onSubmit = async (data: any) => {
    // Replace with mutation to the deals server action.
    // await createOrUpdateDeal(data);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Title" {...register("title")} />
      {errors.title && (
        <span className="text-red-600 text-xs">{errors.title.message}</span>
      )}
      <Input label="Value" type="number" {...register("value")} />
      {errors.value && (
        <span className="text-red-600 text-xs">{errors.value.message}</span>
      )}
      <Input label="Currency" {...register("currency")} />
      {errors.currency && (
        <span className="text-red-600 text-xs">{errors.currency.message}</span>
      )}
      <div>
        <label>Status</label>
        <select {...register("status")} className="w-full border p-2 rounded">
          <option value="New">New</option>
          <option value="Qualified">Qualified</option>
          <option value="Proposal">Proposal</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
        {errors.status && (
          <span className="text-red-600 text-xs">{errors.status.message}</span>
        )}
      </div>
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
      <div>
        <label>Contact</label>
        <select {...register("contactId")} className="w-full border p-2 rounded">
          <option value="">—</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.firstName} {c.lastName}
            </option>
          ))}
        </select>
      </div>
      <Input label="Expected Close Date" type="date" {...register("expectedCloseDate")} />
      <Input label="Description" {...register("description")} />
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
          {deal ? "Update" : "Create"} Deal
        </Button>
      </div>
    </form>
  );
}