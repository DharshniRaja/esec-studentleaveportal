import { useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useLeave } from '@/contexts/LeaveContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { differenceInCalendarDays, parseISO, format } from 'date-fns';

const AdvisorRecords = () => {
  const { requests } = useLeave();
  const processed = requests.filter(r => r.status !== 'pending');

  const studentSummary = useMemo(() => {
    const map: Record<string, { name: string; roll: string; total: number; monthly: Record<string, number>; yearly: Record<number, number> }> = {};
    processed.forEach(r => {
      if (r.status !== 'approved') return;
      if (!map[r.rollNumber]) map[r.rollNumber] = { name: r.studentName, roll: r.rollNumber, total: 0, monthly: {}, yearly: {} };
      const days = differenceInCalendarDays(parseISO(r.endDate), parseISO(r.startDate)) + 1;
      const month = format(parseISO(r.startDate), 'MMM yyyy');
      const year = parseISO(r.startDate).getFullYear();
      map[r.rollNumber].total += days;
      map[r.rollNumber].monthly[month] = (map[r.rollNumber].monthly[month] || 0) + days;
      map[r.rollNumber].yearly[year] = (map[r.rollNumber].yearly[year] || 0) + days;
    });
    return Object.values(map);
  }, [processed]);

  return (
    <DashboardLayout title="Student Leave Records">
      <div className="space-y-6 max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">All Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processed.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.studentName}</TableCell>
                      <TableCell>{r.rollNumber}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{r.reason}</TableCell>
                      <TableCell className="text-xs">{r.startDate} → {r.endDate}</TableCell>
                      <TableCell>{differenceInCalendarDays(parseISO(r.endDate), parseISO(r.startDate)) + 1}</TableCell>
                      <TableCell>
                        <Badge variant={r.status === 'approved' ? 'default' : 'destructive'}>
                          {r.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {processed.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No records yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {studentSummary.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Leave Summary by Student</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Total Days</TableHead>
                      <TableHead>Monthly Breakdown</TableHead>
                      <TableHead>Yearly Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentSummary.map(s => (
                      <TableRow key={s.roll}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>{s.roll}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{s.total} days</Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {Object.entries(s.monthly).map(([m, d]) => `${m}: ${d}`).join(', ')}
                        </TableCell>
                        <TableCell className="text-xs">
                          {Object.entries(s.yearly).map(([y, d]) => `${y}: ${d} days`).join(', ')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdvisorRecords;
