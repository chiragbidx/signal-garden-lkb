export interface Deal {
  id: string;
  teamId: string;
  ownerId: string;
  title: string;
  value: number;
  currency: string;
  status: "New" | "Qualified" | "Proposal" | "Won" | "Lost";
  organizationId?: string;
  contactId?: string;
  expectedCloseDate?: string;
  description?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  organization?: Organization;
  contact?: Contact;
  owner?: User;
}