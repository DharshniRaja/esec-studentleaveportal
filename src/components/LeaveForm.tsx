import { useState } from 'react';
import { useLeave } from '@/contexts/LeaveContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

const LeaveForm = () => {
  const { addRequest } = useLeave();
  const [form, setForm] = useState({
    studentName: '',
    rollNumber: '',
    registerNumber: '',
    mentorName: '',
    parentMobile: '',
    reason: '',
    startDate: '',
    endDate: '',
  });

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRequest(form);
    toast.success('Leave request submitted successfully!');
    setForm({ studentName: '', rollNumber: '', registerNumber: '', mentorName: '', parentMobile: '', reason: '', startDate: '', endDate: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">Apply for Leave</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Student Name</Label>
            <Input value={form.studentName} onChange={e => update('studentName', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Roll Number</Label>
            <Input value={form.rollNumber} onChange={e => update('rollNumber', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Register Number</Label>
            <Input value={form.registerNumber} onChange={e => update('registerNumber', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Mentor Name</Label>
            <Input value={form.mentorName} onChange={e => update('mentorName', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Parent Mobile Number</Label>
            <Input type="tel" value={form.parentMobile} onChange={e => update('parentMobile', e.target.value)} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Reason for Leave</Label>
            <Textarea value={form.reason} onChange={e => update('reason', e.target.value)} required rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input type="date" value={form.endDate} onChange={e => update('endDate', e.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="w-full" size="lg">
              <Send className="mr-2 h-4 w-4" />
              Submit Leave Request
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeaveForm;
