export interface Activity {
  id: string;
  teamId: string;
  ownerId: string;
  type: "call" | "meeting" | "email" | "note" | "task";
  subject: string;
  description?: string;
  dateTime: string;
  contactId?: string;
  organizationId?: string;
  dealId?: string;
  createdAt: Date;
  updatedAt: Date;
  contact?: Contact;
  organization?: Organization;
  deal?: Deal;
  owner?: User;
}