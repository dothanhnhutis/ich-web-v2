import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getShortName(name: string) {
  return name
    .trim() // bỏ khoảng trắng thừa
    .split(/\s+/) // tách theo khoảng trắng
    .map((word) => word.charAt(0).toUpperCase()) // lấy ký tự đầu và viết hoa
    .join("");
}

export const buildSortField = (fields: string[]) => {
  return fields.flatMap((f) => [`${f}.asc`, `${f}.desc`]);
};

export const awaitCus = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const hasDuplicateKey = (arr: string[]): boolean => {
  const keys = arr.map((item) => item.split(".")[0]); // lấy phần trước dấu "."
  const unique = new Set(keys);
  return unique.size !== keys.length; // nếu có trùng thì true
};
