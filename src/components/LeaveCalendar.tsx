import { useMemo, useState } from 'react';
import { useLeave } from '@/contexts/LeaveContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isWithinInterval, parseISO, differenceInCalendarDays, isSameMonth } from 'date-fns';

interface Props {
  rollNumber?: string;
}

const LeaveCalendar = ({ rollNumber }: Props) => {
  const { requests } = useLeave();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const approvedLeaves = useMemo(() =>
    requests.filter(r => r.status === 'approved' && (!rollNumber || r.rollNumber === rollNumber)),
    [requests, rollNumber]
  );

  const leaveDates = useMemo(() => {
    const dates = new Set<string>();
    approvedLeaves.forEach(r => {
      const start = parseISO(r.startDate);
      const end = parseISO(r.endDate);
      eachDayOfInterval({ start, end }).forEach(d => dates.add(format(d, 'yyyy-MM-dd')));
    });
    return dates;
  }, [approvedLeaves]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  const monthLeaveCount = daysInMonth.filter(d => leaveDates.has(format(d, 'yyyy-MM-dd'))).length;

  const yearLeaveCount = useMemo(() => {
    const yearStart = new Date(currentMonth.getFullYear(), 0, 1);
    const yearEnd = new Date(currentMonth.getFullYear(), 11, 31);
    return eachDayOfInterval({ start: yearStart, end: yearEnd }).filter(d => leaveDates.has(format(d, 'yyyy-MM-dd'))).length;
  }, [leaveDates, currentMonth]);

  const totalLeaveDays = useMemo(() =>
    approvedLeaves.reduce((sum, r) => sum + differenceInCalendarDays(parseISO(r.endDate), parseISO(r.startDate)) + 1, 0),
    [approvedLeaves]
  );

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-lg">Leave Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(m => subMonths(m, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-heading font-bold min-w-[140px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(m => addMonths(m, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 rounded-lg bg-muted">
            <p className="text-2xl font-bold text-primary">{totalLeaveDays}</p>
            <p className="text-xs text-muted-foreground">Total Leave Days</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <p className="text-2xl font-bold text-accent">{monthLeaveCount}</p>
            <p className="text-xs text-muted-foreground">This Month</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <p className="text-2xl font-bold text-secondary-foreground">{yearLeaveCount}</p>
            <p className="text-xs text-muted-foreground">This Year</p>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
          ))}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {daysInMonth.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isLeave = leaveDates.has(dateStr);
            const isWeekend = getDay(day) === 0 || getDay(day) === 6;
            return (
              <div
                key={dateStr}
                className={`text-center py-2 rounded text-sm font-medium ${
                  isLeave ? 'calendar-leave' : isWeekend ? 'bg-muted/50 text-muted-foreground' : 'calendar-present'
                }`}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded calendar-present" /> Present
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded calendar-leave" /> Leave/Absent
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveCalendar;
