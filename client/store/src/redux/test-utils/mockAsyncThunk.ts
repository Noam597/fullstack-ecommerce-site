import { vi } from 'vitest';

export const makeMockAsyncThunk = (type: string) => {
    const thunk: any = vi.fn(() => ({
      type: `${type}/pending`,
    }));
  
    thunk.pending = { type: `${type}/pending` };
    thunk.fulfilled = { type: `${type}/fulfilled` };
    thunk.rejected = { type: `${type}/rejected` };
  
    return thunk;
  };

  