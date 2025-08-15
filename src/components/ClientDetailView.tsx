import { Client } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from "date-fns";
import { useEmployees } from "@/context/EmployeeContext";

interface ClientDetailViewProps {
  client: Client;
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-4 py-2 items-start">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <div className="col-span-2 text-sm">{value}</div>
  </div>
);

export const ClientDetailView = ({ client }: ClientDetailViewProps) => {
  const { employees } = useEmployees();
  const assignedEmployee = employees.find(emp => emp.id === client.assignedTo);

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const pendingAmount = (client.designCharges || 0) - (client.amountPaid || 0);

  return (
    <ScrollArea className="h-[70vh] p-1">
        <Card className="border-none shadow-none">
            <CardHeader className="p-4">
                <CardTitle className="text-2xl">{client.name}</CardTitle>
                <CardDescription>{client.email} &bull; {client.phone}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
                <Separator />
                <DetailItem label="Address" value={client.address || "N/A"} />
                <DetailItem label="Services" value={
                    <div className="flex flex-wrap gap-2">
                        {client.services.map(service => <Badge key={service} variant="secondary">{service}</Badge>)}
                    </div>
                } />
                <Separator />
                <h3 className="text-lg font-semibold mt-4">Status & Project Details</h3>
                <DetailItem label="Client Status" value={<Badge>{client.status}</Badge>} />
                <DetailItem label="Project Status" value={<Badge variant="outline">{client.projectStatus}</Badge>} />
                <DetailItem label="Last Contact" value={format(parseISO(client.lastContact), "PPP")} />
                <DetailItem label="Assigned To" value={assignedEmployee ? assignedEmployee.name : "Unassigned"} />
                <Separator />
                <h3 className="text-lg font-semibold mt-4">Financials</h3>
                <DetailItem label="Design Charges" value={formatCurrency(client.designCharges)} />
                <DetailItem label="Amount Paid" value={formatCurrency(client.amountPaid)} />
                <DetailItem label="Pending Amount" value={
                    <span className={pendingAmount > 0 ? "text-orange-600 font-medium" : ""}>
                        {formatCurrency(pendingAmount)}
                    </span>
                } />
                <DetailItem label="Subscription" value={`${formatCurrency(client.monthlySubscription)}/mo`} />
                <DetailItem label="Payment Status" value={<Badge variant={client.paymentStatus === 'Paid' ? 'default' : 'destructive'}>{client.paymentStatus || "N/A"}</Badge>} />
            </CardContent>
        </Card>
    </ScrollArea>
  );
};