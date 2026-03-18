"use client";
import { useState } from "react";
import { Organization, User, Contact } from "@/lib/types/contacts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { OrganizationsForm } from "./organizations-form";

export default function OrganizationsClient({
  organizations,
  contacts,
  members,
}: {
  organizations: Organization[];
  contacts: Contact[];
  members: User[];
}) {
  const [filter, setFilter] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredOrgs = organizations.filter((o) =>
    o.name.toLowerCase().includes(filter.toLowerCase()) ||
    (o.domain && o.domain.toLowerCase().includes(filter.toLowerCase()))
  );

  // Empty State
  if (!organizations.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <span className="text-2xl font-semibold mb-2">No organizations found</span>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Add your first organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add New Organization</DialogTitle>
            <OrganizationsForm
              contacts={contacts}
              members={members}
              onSuccess={() => setModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-3">
        <h2 className="text-2xl font-bold">Organizations</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search organizations…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Add Organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Add New Organization</DialogTitle>
              <OrganizationsForm
                contacts={contacts}
                members={members}
                onSuccess={() => setModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Primary Contact</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrgs.map((org) => (
            <TableRow key={org.id}>
              <TableCell>
                {org.name}
              </TableCell>
              <TableCell>{org.domain}</TableCell>
              <TableCell>
                {org.primaryContactId
                  ? contacts.find((c) => c.id === org.primaryContactId)?.firstName +
                    " " +
                    contacts.find((c) => c.id === org.primaryContactId)?.lastName
                  : "-"}
              </TableCell>
              <TableCell>{org.industry || "-"}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedOrg(org);
                    setModalOpen(true);
                  }}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedOrg && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogTitle>Edit Organization</DialogTitle>
            <OrganizationsForm
              organization={selectedOrg}
              contacts={contacts}
              members={members}
              onSuccess={() => {
                setModalOpen(false);
                setSelectedOrg(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}