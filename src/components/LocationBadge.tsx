
import React from "react";
import { Badge } from "@/components/ui/badge";
import { UrlLocation } from "@/context/UrlShortenerContext";
import { 
  MapPin, 
  GlobeAmericas,
  Globe, 
  MapPinned
} from "lucide-react";

interface LocationBadgeProps {
  location: UrlLocation;
}

const LocationBadge: React.FC<LocationBadgeProps> = ({ location }) => {
  const getLocationStyles = () => {
    switch (location) {
      case "North America":
        return { bg: "bg-blue-100", text: "text-blue-800", icon: <MapPin size={14} className="mr-1" /> };
      case "Europe":
        return { bg: "bg-yellow-100", text: "text-yellow-800", icon: <MapPin size={14} className="mr-1" /> };
      case "Asia":
        return { bg: "bg-red-100", text: "text-red-800", icon: <MapPin size={14} className="mr-1" /> };
      case "South America":
        return { bg: "bg-green-100", text: "text-green-800", icon: <MapPin size={14} className="mr-1" /> };
      case "Africa":
        return { bg: "bg-orange-100", text: "text-orange-800", icon: <MapPin size={14} className="mr-1" /> };
      case "Australia":
        return { bg: "bg-purple-100", text: "text-purple-800", icon: <MapPin size={14} className="mr-1" /> };
      case "Global":
        return { bg: "bg-indigo-100", text: "text-indigo-800", icon: <Globe size={14} className="mr-1" /> };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", icon: <GlobeAmericas size={14} className="mr-1" /> };
    }
  };

  const { bg, text, icon } = getLocationStyles();

  return (
    <Badge variant="outline" className={`flex items-center ${bg} ${text} border-none`}>
      {icon}
      {location}
    </Badge>
  );
};

export default LocationBadge;
