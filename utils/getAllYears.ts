export const getYearsArray = () => {
  let years: { label: string; value: string }[] = [];
  const currentYear: number = new Date().getFullYear();

  for (let year: number = 2000; year <= currentYear; year++) {
    years.push({ label: year.toString(), value: year.toString() });
  }

  return years;
};
