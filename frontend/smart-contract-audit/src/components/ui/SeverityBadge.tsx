import { Badge } from "@/components/ui/badge";
import {
  AlertCircleIcon,
  InfoIcon,
  AlertTriangleIcon,
} from "lucide-react";

export const getSeverityBadge = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "tinggi":
    case "high":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircleIcon className="w-3 h-3" />
          {severity}
        </Badge>
      );
    case "sedang":
    case "medium":
      return (
        <Badge className="bg-orange-500 text-white flex items-center gap-1">
          <AlertTriangleIcon className="w-3 h-3" />
          {severity}
        </Badge>
      );
    case "rendah":
    case "low":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <InfoIcon className="w-3 h-3" />
          {severity}
        </Badge>
      );
    case "informational":
    case "informasional":
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <InfoIcon className="w-3 h-3" />
          {severity}
        </Badge>
      );
    default:
      return <Badge variant="outline">{severity}</Badge>;
  }
};
