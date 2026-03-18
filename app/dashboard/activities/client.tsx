"use client";
import { useState } from "react";
import { Activity, Organization, Contact, Deal, User } from "@/lib/types/contacts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ActivitiesForm } from "./activities-form";

export default function ActivitiesClient({
  activities,
  organizations,
  contacts,
  deals,
  members,
}: {
  activities: Activity[];
  organizations: Organization[];
  contacts: Contact[];
  deals: Deal[];
  members: User[];
}) {
  const [filter, setFilter] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredActivities = activities.filter(
    (a) =>
      a.subject.toLowerCase().includes(filter.toLowerCase()) ||
      (a.type && a.type.toLowerCase().includes(filter.toLowerCase())) ||
      (a.owner && `${a.owner.firstName} ${a.owner.lastName}`.toLowerCase().includes(filter.toLowerCase()))
  );

  if (!activities.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <span className="text-2xl font-semibold mb-2">No activities yet</span>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Log your first activity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Log Activity</DialogTitle>
            <ActivitiesForm
              organizations={organizations}
              contacts={contacts}
              deals={deals}
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
        <h2 className="text-2xl font-bold">Activities</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search activities…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Log Activity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Log Activity</DialogTitle>
              <ActivitiesForm
                organizations={organizations}
                contacts={contacts}
                deals={deals}
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
            <TableHead>Type</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Date/Time</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Deal</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredActivities.map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.type}</TableCell>
              <TableCell>{a.subject}</TableCell>
              <TableCell>
                {a.dateTime
                  ? new Date(a.dateTime).toLocaleString()
                  : "-"}
              </TableCell>
              <TableCell>
                {a.contact ? `${a.contact.firstName} ${a.contact.lastName}` : "-"}
              </TableCell>
              <TableCell>
                {a.organization ? a.organization.name : "-"}
              </TableCell>
              <TableCell>
                {a.deal ? a.deal.title : "-"}
              </TableCell>
              <TableCell>
                {a.owner
                  ? `${a.owner.firstName} ${a.owner.lastName}`
                  : "-"}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedActivity(a);
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
      {selectedActivity && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogTitle>Edit Activity</DialogTitle>
            <ActivitiesForm
              activity={selectedActivity}
              organizations={organizations}
              contacts={contacts}
              deals={deals}
              members={members}
              onSuccess={() => {
                setModalOpen(false);
                setSelectedActivity(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}