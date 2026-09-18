"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CategoryIcon } from "@/lib/bills/category-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/lib/bills/types";

export function HistoryFilters({
  categories,
  currencies,
}: {
  categories: Category[];
  currencies: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("category") ?? "all";
  const currency = searchParams.get("currency") ?? "all";
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  const categoryItems: Record<string, ReactNode> = {
    all: "All categories",
    ...Object.fromEntries(
      categories.map((category) => [
        category.id,
        <span key={category.id} className="inline-flex items-center gap-1.5">
          <CategoryIcon icon={category.icon} className="size-4" />
          {category.name}
        </span>,
      ]),
    ),
  };

  const currencyItems: Record<string, string> = {
    all: "All currencies",
    ...Object.fromEntries(currencies.map((code) => [code, code])),
  };

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <Select value={categoryId} items={categoryItems} onValueChange={(v) => setParam("category", String(v))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(categoryItems).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {currencies.length > 1 && (
          <Select value={currency} items={currencyItems} onValueChange={(v) => setParam("currency", String(v))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All currencies" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(currencyItems).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="from" className="text-xs text-muted-foreground">
            From
          </Label>
          <Input
            id="from"
            type="date"
            value={from}
            onChange={(e) => setParam("from", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="to" className="text-xs text-muted-foreground">
            To
          </Label>
          <Input
            id="to"
            type="date"
            value={to}
            onChange={(e) => setParam("to", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
