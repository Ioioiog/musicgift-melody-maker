
import React from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ChevronDown, Calendar, SortDesc, Music, Headphones, User, Mic, Guitar, X } from "lucide-react";

interface Category {
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface BlogFilterSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: Category[];
  totalPosts: number;
  filteredCount: number;
  sortBy: string;
  setSortBy: (sort: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const BlogFilterSection: React.FC<BlogFilterSectionProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  totalPosts,
  filteredCount,
  sortBy,
  setSortBy,
  dateFilter,
  setDateFilter,
  isOpen,
  setIsOpen
}) => {
  const { t } = useLanguage();

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (searchTerm) count++;
    if (dateFilter !== "all") count++;
    if (sortBy !== "newest") count++;
    return count;
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setDateFilter("all");
    setSortBy("newest");
  };

  const getSelectedCategoryName = () => {
    if (selectedCategory === "all") return "All Categories";
    const category = categories.find(cat => 
      cat.name.toLowerCase().replace(/\s+/g, '-') === selectedCategory
    );
    return category?.name || "All Categories";
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="max-w-5xl mx-auto">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Filter Header with Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Filter Trigger */}
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 px-4 py-3 rounded-xl font-medium flex items-center gap-2 justify-start sm:w-auto"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge className="bg-purple-500 text-white ml-1 px-2 py-1 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
              <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>

          {/* Search Bar */}
          <div className="w-full sm:w-auto sm:min-w-[280px] sm:max-w-[320px]">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-purple-400 transition-colors" />
              <Input 
                placeholder={t('searchPlaceholder') || "Search articles..."} 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border-white/20 rounded-xl text-white placeholder:text-gray-300 focus:border-purple-400 focus:ring-purple-400/20 w-full text-sm" 
              />
            </div>
          </div>
        </div>

        {/* Active Filters Summary (when collapsed) */}
        {!isOpen && activeFiltersCount > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-300">Active filters:</span>
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                {getSelectedCategoryName()}
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                Search: "{searchTerm}"
              </Badge>
            )}
            {dateFilter !== "all" && (
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                {dateFilter === "recent" ? "Recent" : dateFilter === "month" ? "This Month" : "This Year"}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-400 hover:text-white hover:bg-white/10 p-1 h-auto"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Collapsible Filter Content */}
        <CollapsibleContent className="space-y-6 mb-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            {/* Categories Grid */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Music className="w-5 h-5" />
                Categories
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  className={`${
                    selectedCategory === "all" 
                      ? "bg-purple-500 hover:bg-purple-600 text-white" 
                      : "bg-white/10 border-white/20 text-white hover:bg-white/15"
                  } rounded-lg p-2 h-auto flex flex-col items-center gap-1 text-xs`}
                  onClick={() => setSelectedCategory("all")}
                >
                  <Music className="w-3 h-3" />
                  <span className="text-center leading-tight">All</span>
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs px-1 py-0.5">
                    {totalPosts}
                  </Badge>
                </Button>
                
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  const categoryValue = category.name.toLowerCase().replace(/\s+/g, '-');
                  const isSelected = selectedCategory === categoryValue;
                  
                  return (
                    <Button
                      key={categoryValue}
                      variant={isSelected ? "default" : "outline"}
                      className={`${
                        isSelected 
                          ? "bg-purple-500 hover:bg-purple-600 text-white" 
                          : "bg-white/10 border-white/20 text-white hover:bg-white/15"
                      } rounded-lg p-2 h-auto flex flex-col items-center gap-1 text-xs`}
                      onClick={() => setSelectedCategory(categoryValue)}
                    >
                      <IconComponent className="w-3 h-3" />
                      <span className="text-center leading-tight">{category.name}</span>
                      <Badge variant="secondary" className="bg-white/20 text-white text-xs px-1 py-0.5">
                        {category.count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Additional Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Filter */}
              <div>
                <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date Range
                </label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="recent">Recent (Last 30 days)</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <SortDesc className="w-4 h-4" />
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="title">By Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Summary and Clear Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-white/10">
              <div className="text-sm text-gray-300">
                Showing <span className="font-semibold text-white">{filteredCount}</span> of <span className="font-semibold text-white">{totalPosts}</span> articles
                {activeFiltersCount > 0 && (
                  <span className="ml-2">
                    ({activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active)
                  </span>
                )}
              </div>
              
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default BlogFilterSection;
