import DashboardLayout from '@/components/DashboardLayout';
import LeaveCalendar from '@/components/LeaveCalendar';
import { useAuth } from '@/contexts/AuthContext';

const StudentCalendar = () => {
  const { user } = useAuth();
  return (
    <DashboardLayout title="Leave Calendar">
      <div className="max-w-3xl">
        <LeaveCalendar rollNumber={user?.username} />
      </div>
    </DashboardLayout>
  );
};

export default StudentCalendar;
