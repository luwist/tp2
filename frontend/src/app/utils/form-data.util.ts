type FormDataValue = string | number | boolean | Date | File | Blob | null | undefined;

export function toFormData<T extends object>(data: T): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]: [string, unknown]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => appendValue(formData, key, item));
      return;
    }

    appendValue(formData, key, value as FormDataValue);
  });

  return formData;
}

function appendValue(formData: FormData, key: string, value: FormDataValue): void {
  if (value === undefined || value === null) {
    return;
  }

  if (value instanceof Blob) {
    formData.append(key, value);
  } else if (value instanceof Date) {
    formData.append(key, value.toISOString());
  } else {
    formData.append(key, String(value));
  }
}
