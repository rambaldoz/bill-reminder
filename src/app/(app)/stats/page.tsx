import { PieChart } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function StatsPage() {
  return (
    <ComingSoon
      icon={PieChart}
      title="Statistics"
      description="Category breakdowns and spend-over-time will show up here once you've logged some bills."
    />
  );
}
