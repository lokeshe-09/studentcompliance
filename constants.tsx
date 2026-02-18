
import { Complaint, ComplaintCategory, ComplaintStatus, Priority } from './types';

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-1001',
    studentId: 'student',
    studentName: 'Alex Johnson',
    title: 'Wi-Fi connectivity issues in Block B',
    description: 'The Wi-Fi signal in Hostel Block B, Room 304 is extremely weak and frequently disconnects during peak hours.',
    category: ComplaintCategory.HOSTEL,
    priority: Priority.HIGH,
    status: ComplaintStatus.UNDER_REVIEW,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    remarks: ['Technical team notified.', 'Infrastructure team is looking into router placement.'],
    attachments: [
      { name: 'speed_test.png', url: 'https://picsum.photos/400/300?random=1' },
      { name: 'signal_strength.pdf', url: 'https://picsum.photos/400/300?random=2' }
    ]
  },
  {
    id: 'CMP-1002',
    studentId: 'student',
    studentName: 'Alex Johnson',
    title: 'Library late fee miscalculation',
    description: 'I was charged a late fee of $15 for a book I returned on time. I have the return receipt.',
    category: ComplaintCategory.ACADEMIC,
    priority: Priority.MEDIUM,
    status: ComplaintStatus.RESOLVED,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(), // Resolved in 1 day
    remarks: ['Verified receipt. Refund processed.'],
    attachments: []
  },
  {
    id: 'CMP-1003',
    studentId: 'student-2',
    studentName: 'Sarah Smith',
    title: 'Water cooler leaking in Library',
    description: 'The water cooler on the 2nd floor of the library is leaking and creating a slippery mess.',
    category: ComplaintCategory.INFRASTRUCTURE,
    priority: Priority.MEDIUM,
    status: ComplaintStatus.RESOLVED,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 8).toISOString(), // Resolved in 2 days
    remarks: ['Plumber fixed the leak.'],
    attachments: [
      { name: 'leak_photo.jpg', url: 'https://picsum.photos/400/300?random=3' }
    ]
  },
  {
    id: 'CMP-1004',
    studentId: 'student',
    studentName: 'Alex Johnson',
    title: 'Broken desk in Lecture Hall 4',
    description: 'Desk number 42 in the third row is partially collapsed.',
    category: ComplaintCategory.INFRASTRUCTURE,
    priority: Priority.LOW,
    status: ComplaintStatus.RESOLVED,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 12).toISOString(), // Resolved in 3 days
    remarks: ['Desk replaced with a new unit.'],
    attachments: []
  },
  {
    id: 'CMP-1005',
    studentId: 'student-3',
    studentName: 'Chris Evans',
    title: 'Hostel laundry service delay',
    description: 'Laundry hasn\'t been returned for 5 days.',
    category: ComplaintCategory.HOSTEL,
    priority: Priority.MEDIUM,
    status: ComplaintStatus.RESOLVED,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 18).toISOString(), // Resolved in 2 days
    remarks: ['Laundry service apologized and delivered.'],
    attachments: []
  }
];
