"use client";
import { useState } from "react";
import { Contact, Organization, User } from "@/lib/types/contacts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { ContactsForm } from "./contacts-form";
import { LoaderCircle } from "lucide-react";

export default function ContactsClient({
  contacts,
  organizations,
  members,
}: {
  contacts: Contact[];
  organizations: Organization[];
  members: User[];
}) {
  const [filter, setFilter] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredContacts = contacts.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(filter.toLowerCase()) ||
      c.email.toLowerCase().includes(filter.toLowerCase()) ||
      (c.organization && c.organization.name.toLowerCase().includes(filter.toLowerCase()))
  );

  // Empty state if no records
  if (!contacts.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <span className="text-2xl font-semibold mb-2">No contacts found</span>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Add your first contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add New Contact</DialogTitle>
            <ContactsForm
              organizations={organizations}
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
        <h2 className="text-2xl font-bold">Contacts</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search contacts…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Add New Contact</DialogTitle>
              <ContactsForm
                organizations={organizations}
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
            <TableHead>Email</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                {c.firstName} {c.lastName}
              </TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>
                {c.organization ? c.organization.name : "-"}
              </TableCell>
              <TableCell>{c.jobTitle || "-"}</TableCell>
              <TableCell>
                {c.owner ? `${c.owner.firstName} ${c.owner.lastName}` : "-"}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedContact(c);
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
      {selectedContact && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogTitle>Edit Contact</DialogTitle>
            <ContactsForm
              contact={selectedContact}
              organizations={organizations}
              members={members}
              onSuccess={() => {
                setModalOpen(false);
                setSelectedContact(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}