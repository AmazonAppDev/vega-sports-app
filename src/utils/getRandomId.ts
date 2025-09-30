//returns string in format 'aqzqiy-86dsc-a3t55a-00h1r'
export const getRandomId = (sectionNumber = 4, sectionLen = 7) =>
  Array.from({ length: sectionNumber })
    .map(() => Math.random().toString(36).substring(sectionLen))
    .join('-');
