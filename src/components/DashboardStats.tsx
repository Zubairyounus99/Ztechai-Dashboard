import { Client } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Clock, CheckCircle } from "lucide-react";

interface DashboardStatsProps {
  clients: Client[];
}

export const DashboardStats = ({ clients }: DashboardStatsProps) => {
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Client').length;
  const totalMRR = clients.reduce((acc, client) => {
    if (client.status === 'Client') {
      return acc + (client.monthlySubscription || 0);
    }
    return acc;
  }, 0);
  const totalPending = clients.reduce((acc, client) => {
    const pending = (client.designCharges || 0) - (client.amountPaid || 0);
    return acc + (pending > 0 ? pending : 0);
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cardClasses = "transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl text-white";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card className={`${cardClasses} bg-gradient-to-br from-blue-500 to-purple-600`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          <Users className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
          <p className="text-xs text-white/80">All clients in the system</p>
        </CardContent>
      </Card>
      <Card className={`${cardClasses} bg-gradient-to-br from-green-500 to-teal-600`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
          <CheckCircle className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeClients}</div>
          <p className="text-xs text-white/80">Currently active clients</p>
        </CardContent>
      </Card>
      <Card className={`${cardClasses} bg-gradient-to-br from-yellow-500 to-orange-600`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalMRR)}</div>
          <p className="text-xs text-white/80">From active subscriptions</p>
        </CardContent>
      </Card>
      <Card className={`${cardClasses} bg-gradient-to-br from-red-500 to-pink-600`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
          <Clock className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalPending)}</div>
          <p className="text-xs text-white/80">From design charges</p>
        </CardContent>
      </Card>
    </div>
  );
};