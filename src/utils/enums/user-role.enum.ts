export enum UserRole {
  // Administrative Roles
  ADMIN = 'ADMIN', // Full access
  SYSTEM_ADMIN = 'SYSTEM_ADMIN', // Access to user management and settings

  // Medical Roles
  DOCTOR = 'DOCTOR', // Access to patient management and medical records
  RECEPTIONIST = 'RECEPTIONIST', // Access to appointments and patient info
  BILLING = 'BILLING', // Access to billing and payments
  PHARMACIST = 'PHARMACIST', // Access to pharmacy inventory and medication management
  MANAGER = 'MANAGER', // Access to reports and general management
  PATIENT = 'PATIENT', // Access to patient portal
}
