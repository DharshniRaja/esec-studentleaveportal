import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LeaveRequest {
  id: string;
  studentName: string;
  rollNumber: string;
  registerNumber: string;
  mentorName: string;
  parentMobile: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  notification?: string;
}

interface LeaveContextType {
  requests: LeaveRequest[];
  addRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => void;
  updateStatus: (id: string, status: 'approved' | 'rejected') => void;
  getStudentRequests: (rollNumber: string) => LeaveRequest[];
  clearNotification: (id: string) => void;
}

const LeaveContext = createContext<LeaveContextType | null>(null);

export const useLeave = () => {
  const ctx = useContext(LeaveContext);
  if (!ctx) throw new Error('useLeave must be within LeaveProvider');
  return ctx;
};

export const LeaveProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('esec_leaves');
    return saved ? JSON.parse(saved) : [];
  });

  const save = (reqs: LeaveRequest[]) => {
    setRequests(reqs);
    localStorage.setItem('esec_leaves', JSON.stringify(reqs));
  };

  const addRequest = (req: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: crypto.randomUUID(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    save([...requests, newReq]);
  };

  const updateStatus = (id: string, status: 'approved' | 'rejected') => {
    save(requests.map(r =>
      r.id === id ? { ...r, status, notification: status === 'approved' ? 'Your leave has been approved!' : 'Your leave has been rejected.' } : r
    ));
  };

  const getStudentRequests = (rollNumber: string) =>
    requests.filter(r => r.rollNumber === rollNumber);

  const clearNotification = (id: string) => {
    save(requests.map(r => r.id === id ? { ...r, notification: undefined } : r));
  };

  return (
    <LeaveContext.Provider value={{ requests, addRequest, updateStatus, getStudentRequests, clearNotification }}>
      {children}
    </LeaveContext.Provider>
  );
};
