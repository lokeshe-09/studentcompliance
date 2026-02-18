
export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT'
}

export enum ComplaintStatus {
  SUBMITTED = 'Submitted',
  ASSIGNED = 'Assigned to Department',
  UNDER_REVIEW = 'Under Review',
  ACTION_TAKEN = 'Action Taken',
  RESOLVED = 'Resolved'
}

export enum ComplaintCategory {
  ACADEMIC = 'Academic',
  INFRASTRUCTURE = 'Infrastructure',
  HOSTEL = 'Hostel',
  ADMINISTRATION = 'Administration',
  OTHER = 'Other'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Attachment {
  name: string;
  url: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: Priority;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  remarks: string[];
  attachments: Attachment[];
  branch?: string;
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  fullName: string;
  department?: string;
}
