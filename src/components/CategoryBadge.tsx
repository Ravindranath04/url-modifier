
import React from "react";
import { Badge } from "@/components/ui/badge";
import { UrlCategory } from "@/context/UrlShortenerContext";
import { 
  Newspaper, 
  Share2, 
  ShoppingBag, 
  Cpu, 
  Film, 
  GraduationCap, 
  Tag 
} from "lucide-react";

interface CategoryBadgeProps {
  category: UrlCategory;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const getCategoryStyles = () => {
    switch (category) {
      case "News":
        return { bg: "bg-red-100", text: "text-red-800", icon: <Newspaper size={14} className="mr-1" /> };
      case "Social Media":
        return { bg: "bg-blue-100", text: "text-blue-800", icon: <Share2 size={14} className="mr-1" /> };
      case "Shopping":
        return { bg: "bg-green-100", text: "text-green-800", icon: <ShoppingBag size={14} className="mr-1" /> };
      case "Tech":
        return { bg: "bg-purple-100", text: "text-purple-800", icon: <Cpu size={14} className="mr-1" /> };
      case "Entertainment":
        return { bg: "bg-yellow-100", text: "text-yellow-800", icon: <Film size={14} className="mr-1" /> };
      case "Education":
        return { bg: "bg-indigo-100", text: "text-indigo-800", icon: <GraduationCap size={14} className="mr-1" /> };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", icon: <Tag size={14} className="mr-1" /> };
    }
  };

  const { bg, text, icon } = getCategoryStyles();

  return (
    <Badge variant="outline" className={`flex items-center ${bg} ${text} border-none`}>
      {icon}
      {category}
    </Badge>
  );
};

export default CategoryBadge;
