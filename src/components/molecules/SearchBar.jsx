import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const SearchBar = ({ className, onSearch, placeholder = "Search for products...", autoFocus = false }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex items-center", className)}>
      <div className="relative flex-1">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          icon="Search"
          iconPosition="left"
          className="pr-12"
          autoFocus={autoFocus}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-primary-100 hover:text-primary-600"
            disabled={!query.trim()}
          >
            <span className="sr-only">Search</span>
            ➤
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;