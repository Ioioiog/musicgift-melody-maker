
import React from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ChevronDown, Calendar, SortDesc, Music, X } from "lucide-react";

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
    if (selectedCategory === "all") return t('allCategories');
    const category = categories.find(cat => 
      cat.name.toLowerCase().replace(/\s+/g, '-') === selectedCategory
    );
    return category?.name || t('allCategories');
  };

  const getDateFilterLabel = (value: string) => {
    switch (value) {
      case "recent": return t('recent');
      case "month": return t('thisMonth');
      case "year": return t('thisYear');
      default: return t('allTime');
    }
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="max-w-5xl mx-auto">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Compact Filter Header with Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          {/* Filter Trigger */}
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 px-3 py-2 rounded-lg font-medium flex items-center gap-2 justify-start sm:w-auto text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>{t('filters')}</span>
              {activeFiltersCount > 0 && (
                <Badge className="bg-purple-500 text-white ml-1 px-1.5 py-0.5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
              <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>

          {/* Compact Search Bar */}
          <div className="w-full sm:w-auto sm:min-w-[240px] sm:max-w-[280px]">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-purple-400 transition-colors" />
              <Input 
                placeholder={t('searchPlaceholder')} 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="pl-9 pr-4 py-2 bg-white/10 backdrop-blur-md border-white/20 rounded-lg text-white placeholder:text-gray-300 focus:border-purple-400 focus:ring-purple-400/20 w-full text-sm h-9" 
              />
            </div>
          </div>
        </div>

        {/* Compact Active Filters Summary */}
        {!isOpen && activeFiltersCount > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-300">{t('active')}:</span>
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs px-2 py-0.5">
                {getSelectedCategoryName()}
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs px-2 py-0.5">
                {t('search')}: "{searchTerm}"
              </Badge>
            )}
            {dateFilter !== "all" && (
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs px-2 py-0.5">
                {getDateFilterLabel(dateFilter)}
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

        {/* Compact Collapsible Filter Content */}
        <CollapsibleContent className="space-y-4 mb-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
            {/* Categories - Horizontal Scroll with Pills */}
            <div className="mb-4">
              <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                <Music className="w-4 h-4" />
                {t('allCategories')}
              </h3>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  className={`${
                    selectedCategory === "all" 
                      ? "bg-purple-500 hover:bg-purple-600 text-white" 
                      : "bg-white/10 border-white/20 text-white hover:bg-white/15"
                  } rounded-full px-3 py-1.5 h-auto flex items-center gap-1.5 text-xs whitespace-nowrap flex-shrink-0`}
                  onClick={() => setSelectedCategory("all")}
                >
                  <Music className="w-3 h-3" />
                  <span>{t('all')}</span>
                  <Badge variant="secondary" className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 ml-1">
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
                      } rounded-full px-3 py-1.5 h-auto flex items-center gap-1.5 text-xs whitespace-nowrap flex-shrink-0`}
                      onClick={() => setSelectedCategory(categoryValue)}
                    >
                      <IconComponent className="w-3 h-3" />
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 ml-1">
                        {category.count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Compact Additional Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Date Filter */}
              <div>
                <label className="text-xs font-medium text-white mb-2 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {t('dateRange')}
                </label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allTime')}</SelectItem>
                    <SelectItem value="recent">{t('recent')}</SelectItem>
                    <SelectItem value="month">{t('thisMonth')}</SelectItem>
                    <SelectItem value="year">{t('thisYear')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="text-xs font-medium text-white mb-2 flex items-center gap-2">
                  <SortDesc className="w-3 h-3" />
                  {t('sortBy')}
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t('newestFirst')}</SelectItem>
                    <SelectItem value="oldest">{t('oldestFirst')}</SelectItem>
                    <SelectItem value="popular">{t('mostPopular')}</SelectItem>
                    <SelectItem value="title">{t('byTitleAZ')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Compact Results Summary and Clear Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10">
              <div className="text-xs text-gray-300">
                {t('showing')} <span className="font-semibold text-white">{filteredCount}</span> {t('of')} <span className="font-semibold text-white">{totalPosts}</span> {t('articles')}
                {activeFiltersCount > 0 && (
                  <span className="ml-2">
                    ({activeFiltersCount} {activeFiltersCount !== 1 ? t('filtersActive') : t('filter')} {t('active')})
                  </span>
                )}
              </div>
              
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="border-white/20 text-white hover:bg-white/10 text-xs px-3 py-1"
                >
                  {t('clearAllFilters')}
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
