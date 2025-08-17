import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types";
import { Users, DollarSign, Briefcase, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  clients: Client[];
}

export const DashboardStats = ({ clients }: DashboardStatsProps) => {
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const totalMRR = clients.reduce((acc, client) => {
    return client.status === 'Active' ? acc + (client.monthlySubscription || 0) : acc;
  }, 0);
  const prospectClients = clients.filter(c => c.status === 'Prospect').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
          <p className="text-xs text-muted-foreground">{activeClients} active</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalMRR)}</div>
          <p className="text-xs text-muted-foreground">from active clients</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {clients.filter(c => c.projectStatus === 'In Progress').length}
          </div>
          <p className="text-xs text-muted-foreground">currently in progress</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prospects</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{prospectClients}</div>
          <p className="text-xs text-muted-foreground">potential new clients</p>
        </CardContent>
      </Card>
    </div>
  );
};