export interface Course {
  id: number;
  name: string;
  code: string;
  icon: string;
}

export interface DoctorProfile {
  name: string;
  fullName: string;
  email: string;
  department: string;
  position: string;
  avatar: string;
}

export interface Session {
  id: number;
  courseId: number;       // هذا ما كان ينقصك وحل مشكلة الخطأ
  date: string;
  duration: string;
  attendance: string;     // للنسبة المئوية مثل '95%'
  focus: string;          // للنسبة المئوية مثل '87%'
  focusLevel: 'High' | 'Medium' | 'Low'; // أضفتها لكِ ليعمل ستايل الـ React
}
