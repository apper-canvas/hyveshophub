import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/category/${category.name.toLowerCase()}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Card hover className="overflow-hidden h-full">
          <div className="relative">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-lg font-semibold text-white mb-1">
                {category.name}
              </h3>
            </div>
          </div>
          
          <div className="p-3">
            <div className="flex flex-wrap gap-1">
              {category.subcategories.slice(0, 3).map((sub, index) => (
                <span
                  key={index}
                  className="text-xs text-secondary-600 bg-secondary-100 px-2 py-1 rounded-full"
                >
                  {sub}
                </span>
              ))}
              {category.subcategories.length > 3 && (
                <span className="text-xs text-secondary-500">
                  +{category.subcategories.length - 3} more
                </span>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;