export type YearSummaryDto = {
  id: number;
  name: string;
};

export type SubjectSummaryDto = {
  id: number;
  name: string;
};

export type TeacherSummaryDto = {
  id: number;
  name: string;
  surname: string;
  email: string;
  assignedHours: number;
};

export type ClassSubjectAssignmentDto = {
  teacherId: number;
  teacher: TeacherSummaryDto;
};

export type ClassYearSubjectDto = {
  subjectId: number;
  subject: SubjectSummaryDto;
  assignment: ClassSubjectAssignmentDto | null;
};

export type AssignmentsByYearDto = {
  classId: number;
  yearId: number;
  year: YearSummaryDto;
  numWeeks: number;
  classes: ClassYearSubjectDto[];
};

export type SubjectGroupDto = {
  subjectLabel: string;
  requiredHours: number;
  assignmentsByYears: AssignmentsByYearDto[];
};

export type ProgramByClassDto = {
  id: number;
  name: string;
  availableHours: number;
  subjectsByClassByYear: SubjectGroupDto[];
};
