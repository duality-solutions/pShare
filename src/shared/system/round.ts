export const round = (decimals: number) => (value: number): number => Number(Math.round(parseFloat(`${value}e${decimals}`)) + `e-${decimals}`);
