export interface InputStream {
  next(): string;
  peek(): string;
  eof(): boolean;
  croak(msg: string): never;
  cursor(): Cursor;
  saveState(): State;
  restoreState(state: State): void;
}

export type Cursor = {
  line: number;
  column: number;
};

export interface State {
  pos: number;
  line: number;
  col: number;
}

export function InputStream(input: string): InputStream {
  let pos = 0;
  let line = 1;
  let col = 0;

  return {
    next,
    peek,
    eof,
    croak,
    cursor,
    saveState,
    restoreState,
  };

  function saveState(): State {
    return {
      col,
      line,
      pos,
    };
  }

  function restoreState(state: State): void {
    col = state.col;
    line = state.line;
    pos = state.pos;
  }

  function cursor(): Cursor {
    return {
      line,
      column: col,
    };
  }

  function next(): string {
    const ch = input.charAt(pos++);
    if (ch === '\n') {
      line++;
      col = 0;
    } else {
      col++;
    }
    return ch;
  }

  function peek(): string {
    return input.charAt(pos);
  }

  function eof(): boolean {
    return peek() === '';
  }

  function croak(msg: string): never {
    throw new Error(msg + ' (' + line + ':' + col + ')');
  }
}
