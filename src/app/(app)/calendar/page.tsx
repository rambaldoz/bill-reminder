import { CalendarDays } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function CalendarPage() {
  return (
    <ComingSoon
      icon={CalendarDays}
      title="Calendar"
      description="Your bills will show up here, marked on the day they're due."
    />
  );
}
