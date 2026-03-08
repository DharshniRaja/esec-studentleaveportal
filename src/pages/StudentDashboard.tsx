import DashboardLayout from '@/components/DashboardLayout';
import LeaveForm from '@/components/LeaveForm';
import { useLeave } from '@/contexts/LeaveContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Bell } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { getStudentRequests, clearNotification } = useLeave();
  const myRequests = getStudentRequests(user?.username || '');
  const notifications = myRequests.filter(r => r.notification);

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="space-y-6 max-w-4xl">
        {notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map(n => (
              <Card key={n.id} className={`border-l-4 ${n.status === 'approved' ? 'border-l-success' : 'border-l-accent'}`}>
                <CardContent className="flex items-center justify-between py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{n.notification}</span>
                    <span className="text-xs text-muted-foreground">({n.startDate} - {n.endDate})</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => clearNotification(n.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <LeaveForm />
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
