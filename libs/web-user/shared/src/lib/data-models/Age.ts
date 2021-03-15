export interface Age {
  key: number;
  value: string;
}

export const AgeList: Array<Age> = Array(100)
  .fill(0)
  .map((x, i) => {
    return { value: `${i + 1} years`, key: i + 1 };
  });
