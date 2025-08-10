import { Control, useFieldArray } from "react-hook-form";

interface UseArrayFormParams<TItem> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string; // path to array field, e.g., "experiences"
  defaultItem: Partial<TItem>;
}

export function useArrayForm<TItem>({ control, name, defaultItem }: UseArrayFormParams<TItem>) {
  const { fields, append, remove } = useFieldArray({ name, control });

  const appendEmpty = () => append({ ...(defaultItem as unknown as Record<string, unknown>) } as unknown as TItem);
  const removeAt = (index: number) => remove(index);

  const saveAll = async <TResult>(
    items: readonly TItem[],
    save: (item: TItem) => Promise<TResult>
  ): Promise<TResult[]> => {
    return Promise.all(items.map((it) => save(it)));
  };

  return { fields, appendEmpty, removeAt, saveAll } as const;
}
