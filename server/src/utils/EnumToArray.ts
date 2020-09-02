export const enumToArray = (en: { [key: number]: string }): string[] => {
  return Object.keys(en).map(key => en[key]);
};
