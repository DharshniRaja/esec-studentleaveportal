import DashboardLayout from '@/components/DashboardLayout';
import { useLeave } from '@/contexts/LeaveContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, CalendarDays } from 'lucide-react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { toast } from 'sonner';

const AdvisorDashboard = () => {
  const { requests, updateStatus } = useLeave();
  const pending = requests.filter(r => r.status === 'pending');

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    updateStatus(id, status);
    toast.success(`Leave request ${status}!`);
  };

  return (
    <DashboardLayout title="Pending Leave Requests">
      <div className="space-y-4 max-w-4xl">
        {pending.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No pending leave requests</p>
            </CardContent>
          </Card>
        ) : (
          pending.map(req => {
            const days = differenceInCalendarDays(parseISO(req.endDate), parseISO(req.startDate)) + 1;
            return (
              <Card key={req.id}>
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-bold">{req.studentName}</h3>
                        <Badge variant="secondary">{req.rollNumber}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{req.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {req.startDate} → {req.endDate} ({days} day{days > 1 ? 's' : ''})
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button onClick={() => handleAction(req.id, 'approved')} className="bg-success hover:bg-success/90 text-success-foreground">
                        <Check className="mr-1 h-4 w-4" /> Approve
                      </Button>
                      <Button variant="destructive" onClick={() => handleAction(req.id, 'rejected')}>
                        <X className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdvisorDashboard;
