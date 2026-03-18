"use client";
import { useState } from "react";
import { Deal, Organization, Contact, User } from "@/lib/types/contacts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DealsForm } from "./deals-form";

export default function DealsClient({
  deals,
  organizations,
  contacts,
  members,
}: {
  deals: Deal[];
  organizations: Organization[];
  contacts: Contact[];
  members: User[];
}) {
  const [filter, setFilter] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter logic
  const filteredDeals = deals.filter(
    (d) =>
      d.title.toLowerCase().includes(filter.toLowerCase()) ||
      (d.organization && d.organization.name.toLowerCase().includes(filter.toLowerCase())) ||
      (d.status && d.status.toLowerCase().includes(filter.toLowerCase()))
  );

  if (!deals.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <span className="text-2xl font-semibold mb-2">No deals found</span>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Add your first deal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add New Deal</DialogTitle>
            <DealsForm
              organizations={organizations}
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
        <h2 className="text-2xl font-bold">Deals</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search deals…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Add New Deal</DialogTitle>
              <DealsForm
                organizations={organizations}
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
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDeals.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell>{deal.title}</TableCell>
              <TableCell>{deal.status}</TableCell>
              <TableCell>
                {deal.organization ? deal.organization.name : "-"}
              </TableCell>
              <TableCell>
                {deal.contact ? `${deal.contact.firstName} ${deal.contact.lastName}` : "-"}
              </TableCell>
              <TableCell>
                {deal.value ? `${deal.value} ${deal.currency}` : "-"}
              </TableCell>
              <TableCell>
                {deal.owner ? `${deal.owner.firstName} ${deal.owner.lastName}` : "-"}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedDeal(deal);
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
      {selectedDeal && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogTitle>Edit Deal</DialogTitle>
            <DealsForm
              deal={selectedDeal}
              organizations={organizations}
              contacts={contacts}
              members={members}
              onSuccess={() => {
                setModalOpen(false);
                setSelectedDeal(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}