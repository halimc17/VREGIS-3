/**
 * Calculate age from birth date
 * @param birthDate - Date of birth
 * @returns Age in years as a string
 */
export function calculateAge(birthDate: Date | string): string {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // Adjust age if birthday hasn't occurred this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return `${age} tahun`;
}

/**
 * Calculate age as a number for filtering/sorting
 * @param birthDate - Date of birth
 * @returns Age in years as a number
 */
export function calculateAgeNumber(birthDate: Date | string): number {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // Adjust age if birthday hasn't occurred this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}