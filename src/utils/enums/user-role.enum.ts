export enum UserRole {
  // Administrative Roles
  ADMIN = 'ADMIN',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  
  // Clinical Staff
  PSYCHIATRIST = 'PSYCHIATRIST',           // Medical doctors who can prescribe medication
  PSYCHOLOGIST = 'PSYCHOLOGIST',           // Clinical psychologists for therapy/assessment
  COUNSELOR = 'COUNSELOR',                 // Mental health counselors
  THERAPIST = 'THERAPIST',                 // Various types of therapists
  
  // Specialized Therapeutic Roles
  BEHAVIORAL_THERAPIST = 'BEHAVIORAL_THERAPIST',    // CBT specialists
  FAMILY_THERAPIST = 'FAMILY_THERAPIST',           // Family therapy specialists
  CHILD_THERAPIST = 'CHILD_THERAPIST',             // Child psychology specialists
  ADDICTION_COUNSELOR = 'ADDICTION_COUNSELOR',      // Substance abuse specialists
  
  // Support Staff
  CASE_MANAGER = 'CASE_MANAGER',          // Manages patient cases and coordination
  SOCIAL_WORKER = 'SOCIAL_WORKER',        // Mental health social workers
  INTAKE_COORDINATOR = 'INTAKE_COORDINATOR', // Handles new patient intake
  
  // Management Roles
  CLINICAL_DIRECTOR = 'CLINICAL_DIRECTOR',     // Oversees clinical operations
  PRACTICE_MANAGER = 'PRACTICE_MANAGER',       // Manages facility operations
  
  // Administrative Support
  RECEPTIONIST = 'RECEPTIONIST',
  BILLING_SPECIALIST = 'BILLING_SPECIALIST',
  
  // Patient Portal Access (if applicable)
  PATIENT = 'PATIENT',
  GUARDIAN = 'GUARDIAN'                    // For parents/guardians of minors
}
