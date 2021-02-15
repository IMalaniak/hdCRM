export function doesNotMatchRegex(tokens: string[]): string {
  const joinedTokens = tokens.join('|');
  return `^((?!${joinedTokens}).)+$`;
}
