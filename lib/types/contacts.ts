export interface Contact {
  id: string;
  teamId: string;
  ownerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  organizationId?: string;
  tags?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  organization?: Organization;
  owner?: User;
}

export interface Organization {
  id: string;
  teamId: string;
  name: string;
  domain: string;
  address?: string;
  description?: string;
  industry?: string;
  tags?: string;
  primaryContactId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}