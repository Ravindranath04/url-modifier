
import React from "react";
import { Badge } from "@/components/ui/badge";
import { SecurityCheckResult } from "@/services/urlSecurityService";
import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SecurityBadgeProps {
  securityStatus?: {
    safe: boolean;
    results: SecurityCheckResult[];
    checkedAt: Date;
  };
}

const SecurityBadge: React.FC<SecurityBadgeProps> = ({ securityStatus }) => {
  if (!securityStatus) {
    return (
      <Badge variant="outline" className="flex items-center bg-gray-100 text-gray-800 border-none">
        <ShieldQuestion size={14} className="mr-1" />
        Not Checked
      </Badge>
    );
  }

  const { safe, results } = securityStatus;

  if (safe) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="flex items-center bg-green-100 text-green-800 border-none">
              <ShieldCheck size={14} className="mr-1" />
              Safe
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="p-2 max-w-xs">
              <p className="font-semibold">Security Check Results:</p>
              <ul className="text-xs mt-1">
                {results.map((result, index) => (
                  <li key={index} className="flex items-start mt-1">
                    <ShieldCheck size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                    <span>{result.source}: No threats detected</span>
                  </li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else {
    // URL is not safe, show warning
    const threats = results.flatMap(result => result.threats).filter(Boolean);
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="flex items-center bg-red-100 text-red-800 border-none">
              <ShieldAlert size={14} className="mr-1" />
              Unsafe
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="p-2 max-w-xs">
              <p className="font-semibold">Security Issues Detected:</p>
              <ul className="text-xs mt-1">
                {threats.map((threat, index) => (
                  <li key={index} className="flex items-start mt-1">
                    <ShieldAlert size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                    <span>{threat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
};

export default SecurityBadge;
