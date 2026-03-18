"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Organization, Contact, Deal, User, Activity } from "@/lib/types/contacts";

const activitySchema = z.object({
  type: z.enum(["call", "meeting", "email", "note", "task"]),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
  dateTime: z.string().min(1, "Date/time required"),
  contactId: z.string().optional(),
  organizationId: z.string().optional(),
  dealId: z.string().optional(),
  ownerId: z.string().min(1, "Owner is required"),
});

export function ActivitiesForm({
  activity,
  organizations,
  contacts,
  deals,
  members,
  onSuccess,
}: {
  activity?: Activity;
  organizations: Organization[];
  contacts: Contact[];
  deals: Deal[];
  members: User[];
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(activitySchema),
    defaultValues: activity
      ? {
          type: activity.type,
          subject: activity.subject,
          description: activity.description,
          dateTime: activity.dateTime
            ? new Date(activity.dateTime).toISOString().substring(0, 16)
            : "",
          contactId: activity.contactId,
          organizationId: activity.organizationId,
          dealId: activity.dealId,
          ownerId: activity.ownerId,
        }
      : {
          type: "call",
        },
  });

  const onSubmit = async (data: any) => {
    // Replace with mutation to the activities server action.
    // await createOrUpdateActivity(data);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Type</label>
        <select {...register("type")} className="w-full border rounded p-2">
          <option value="call">Call</option>
          <option value="meeting">Meeting</option>
          <option value="email">Email</option>
          <option value="note">Note</option>
          <option value="task">Task</option>
        </select>
        {errors.type && (
          <span className="text-red-600 text-xs">{errors.type.message}</span>
        )}
      </div>
      <Input label="Subject" {...register("subject")} />
      {errors.subject && (
        <span className="text-red-600 text-xs">{errors.subject.message}</span>
      )}
      <Input label="Description" {...register("description")} />
      <Input label="Date/Time" type="datetime-local" {...register("dateTime")} />
      {errors.dateTime && (
        <span className="text-red-600 text-xs">{errors.dateTime.message}</span>
      )}
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
      <div>
        <label>Organization</label>
        <select {...register("organizationId")} className="w-full border p-2 rounded">
          <option value="">—</option>
          {organizations.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Deal</label>
        <select {...register("dealId")} className="w-full border p-2 rounded">
          <option value="">—</option>
          {deals.map((d) => (
            <option key={d.id} value={d.id}>
              {d.title}
            </option>
          ))}
        </select>
      </div>
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
          {activity ? "Update" : "Log"} Activity
        </Button>
      </div>
    </form>
  );
}