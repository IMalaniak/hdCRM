export class State {
  id: number;
  keyString: string;

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
    }
  }
}
