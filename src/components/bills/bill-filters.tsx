"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CategoryIcon } from "@/lib/bills/category-icons";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BillStatus, Category } from "@/lib/bills/types";
import { STATUS_LABEL } from "@/lib/bills/status";

const STATUS_TABS: Array<{ value: "all" | BillStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "upcoming", label: STATUS_LABEL.upcoming },
  { value: "due_soon", label: STATUS_LABEL.due_soon },
  { value: "overdue", label: STATUS_LABEL.overdue },
  { value: "paid", label: STATUS_LABEL.paid },
];

export function BillFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") ?? "all";
  const categoryId = searchParams.get("category") ?? "all";

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

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3">
      <Tabs value={status} onValueChange={(value) => setParam("status", String(value))}>
        <TabsList className="w-full">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Select
        value={categoryId}
        items={categoryItems}
        onValueChange={(value) => setParam("category", String(value))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <CategoryIcon icon={category.icon} className="size-4" />
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
