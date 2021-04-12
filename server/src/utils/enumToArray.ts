export const enumToArray = (en: { [key: string]: string }): string[] => {
  return Object.keys(en).map((key: string) => en[key] as string);
};
