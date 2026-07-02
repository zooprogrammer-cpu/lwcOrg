import { defineState } from '@lwc/state';

const counterManager = defineState(({ atom, computed, setAtom }, initialValue = 0) => {
  const count = atom(initialValue);
  const doubleCount = computed([count], (countValue) => countValue * 2);

  const increment = () => setAtom(count, (countValue) => countValue + 1);

  return { count, doubleCount, increment };
});

export default counterManager;
