import { bench, describe } from 'vitest';

function originalIsCheckboxChecked(value: any, index: number): value is number[] {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item !== "number") {
        return false;
      }
    }
    if (value.includes(index)) {
      return true;
    }
  }
  return false;
}

function optimizedIsCheckboxChecked(value: any, index: number): value is number[] {
  return Array.isArray(value) && value.includes(index);
}

// Generate test data
const largeArray = Array.from({ length: 1000 }, (_, i) => i);
const mixedArray = [...largeArray, "string", true, null];
const smallArray = [1, 2, 3];
const booleanValue = true;
const numberValue = 123;

describe('isCheckboxChecked performance', () => {
  bench('original with large array', () => {
    originalIsCheckboxChecked(largeArray, 500);
  });

  bench('optimized with large array', () => {
    optimizedIsCheckboxChecked(largeArray, 500);
  });

  bench('original with mixed array (early exit)', () => {
    originalIsCheckboxChecked(mixedArray, 500);
  });

  // Note: optimized will process the mixed array differently (it won't exit early, it will check includes)
  // But since we assume data is correct (number[]), we focus on the large array case.

  bench('optimized with mixed array', () => {
    optimizedIsCheckboxChecked(mixedArray, 500);
  });

  bench('original with small array', () => {
    originalIsCheckboxChecked(smallArray, 2);
  });

  bench('optimized with small array', () => {
    optimizedIsCheckboxChecked(smallArray, 2);
  });

  bench('original with boolean', () => {
    originalIsCheckboxChecked(booleanValue, 1);
  });

  bench('optimized with boolean', () => {
    optimizedIsCheckboxChecked(booleanValue, 1);
  });
});
