import React, { useState, useEffect } from "react";
import { Search, ListFilter, X, ChevronRight, ChevronLeft, SortAsc, Star, Award, Tag, Filter } from "lucide-react";
import { ImArrowUpRight2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../api/getAPI";
import CelebrityCardskeliton from "../../../Component/Skeleton/products/CelebrityCardskeliton";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const CelebrityCard = () => {
  const navigate = useNavigate();
  const [celebritiesData, setCelebritiesData] = useState([]);
  const [filteredCelebrities, setFilteredCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
      sortBy: "New Arrivals",
      experienceLevel: [],
      expertise: [],
      specialTags: [],
      search: "",
    });
  const debouncedSearch = useDebounce(filters.search, 400); // 400ms debounce delay

  const [options, setOptions] = useState({
    expertise: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fetchCelebritiesData = async () => {
    try {
      const response = await getAPI("/api/celebrities");
      if (response?.hasError === false) {
        setCelebritiesData(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching celebrities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await getAPI("/api/main-category", true);
        if (res?.data?.data) {
          setOptions({
            expertise: res.data.data.map((c) => c.mainCategoryName),
          });
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchOptions();
    fetchCelebritiesData();
  }, []);

  useEffect(() => {
    let result = [...celebritiesData];

    // Search filter
    if (debouncedSearch) {
      result = result.filter((c) =>
        c.artistName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        c.profession?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Expertise filter
    if (filters.expertise.length > 0) {
      result = result.filter((c) =>
        filters.expertise.some((exp) =>
          c.profession?.toLowerCase().includes(exp.toLowerCase())
        )
      );
    }

    // Special Tags filter
    if (filters.specialTags.length > 0) {
      result = result.filter((c) => {
        return filters.specialTags.some((tag) => {
          if (tag === "Trending") return parseInt(c.yearsActiveInArt) > 20;
          if (tag === "Verified") return true; // Most celebrities are verified by default in this view
          return false;
        });
      });
    }

    // Experience Level filter (mapping yearsActiveInArt)
    if (filters.experienceLevel.length > 0) {
      result = result.filter((c) => {
        const years = parseInt(c.yearsActiveInArt) || 0;
        return filters.experienceLevel.some((level) => {
          if (level === "Emerging Artist") return years < 5;
          if (level === "Mid-Level Artist") return years >= 5 && years < 15;
          if (level === "Established Artist") return years >= 15 && years < 30;
          if (level === "Master Artist") return years >= 30;
          return false;
        });
      });
    }

    // Sort
    if (filters.sortBy === "New Arrivals") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === "Trending") {
      result.sort((a, b) => (parseInt(b.yearsActiveInArt) || 0) - (parseInt(a.yearsActiveInArt) || 0));
    } else if (filters.sortBy === "Name (A-Z)") {
      result.sort((a, b) => a.artistName.localeCompare(b.artistName));
    } else if (filters.sortBy === "Name (Z-A)") {
      result.sort((a, b) => b.artistName.localeCompare(a.artistName));
    }

    setFilteredCelebrities(result);
    setCurrentPage(1);
  }, [celebritiesData, filters, debouncedSearch]);

  const handleFilterChange = (category, value, isChecked) => {
    setFilters((prev) => {
      if (category === "sortBy" || category === "search") {
        return { ...prev, [category]: value };
      }

      const currentList = prev[category] || [];
      if (isChecked) {
        return { ...prev, [category]: [...currentList, value] };
      } else {
        return { ...prev, [category]: currentList.filter((item) => item !== value) };
      }
    });
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentCelebrities = filteredCelebrities.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredCelebrities.length / itemsPerPage);

  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToPage = (page) => setCurrentPage(page);

  const slugify = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const FilterSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4">
      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Icon size={18} className="text-[#6F4D34]" />
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const CheckboxItem = ({ label, checked, onChange }) => (
    <label className="flex items-center group cursor-pointer">
      <div className="relative flex items-center">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`w-5 h-5 border-2 rounded-md transition-all flex items-center justify-center ${checked ? "border-[#6F4D34] bg-[#6F4D34]" : "border-gray-300 group-hover:border-[#6F4D34]"}`}>
          {checked && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className={`ml-3 text-sm font-medium transition-colors ${checked ? "text-[#6F4D34]" : "text-gray-600 group-hover:text-gray-900"}`}>{label}</span>
    </label>
  );

  const RadioItem = ({ label, checked, onChange, name }) => (
    <label className="flex items-center group cursor-pointer">
      <div className="relative flex items-center">
        <input type="radio" name={name} className="sr-only" checked={checked} onChange={onChange} />
        <div className={`w-5 h-5 border-2 rounded-full transition-all ${checked ? "border-[#6F4D34] bg-[#6F4D34]" : "border-gray-300 group-hover:border-[#6F4D34]"}`}>
          <div className={`w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform ${checked ? "scale-100" : "scale-0"}`} />
        </div>
      </div>
      <span className={`ml-3 text-sm font-medium transition-colors ${checked ? "text-[#6F4D34]" : "text-gray-600 group-hover:text-gray-900"}`}>{label}</span>
    </label>
  );

  if (loading) return (
    <div className="w-full bg-gray-50 min-h-screen p-4">
      <div className="max-w-[1440px] mx-auto">
        <CelebrityCardskeliton />
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen font-[poppins]">
      <div className="w-full max-w-[1440px] mx-auto p-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Sidebar */}
          <aside className="w-full lg:w-[300px] shrink-0">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm font-bold text-[#6F4D34]"
              >
                <span className="flex items-center gap-2">
                  <ListFilter size={20} />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </span>
                {showFilters ? <X size={20} /> : <ChevronRight size={20} />}
              </button>
            </div>

            <div className={`${showFilters ? "block" : "hidden"} lg:block sticky top-6 space-y-4`}>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Filter by</h2>
                <p className="text-sm text-gray-500">Refine celebrity search</p>
              </div>

                <FilterSection title="Sort Results" icon={SortAsc}>
                  {["New Arrivals", "Trending", "Name (A-Z)", "Name (Z-A)"].map((option) => (
                    <RadioItem
                      key={option}
                      label={option}
                      name="sortBy"
                      checked={filters.sortBy === option}
                      onChange={() => handleFilterChange("sortBy", option)}
                    />
                  ))}
                </FilterSection>

                <FilterSection title="Special Tags" icon={Tag}>
                  {["Verified", "Trending"].map((tag) => (
                    <CheckboxItem
                      key={tag}
                      label={tag}
                      checked={filters.specialTags.includes(tag)}
                      onChange={(e) => handleFilterChange("specialTags", tag, e.target.checked)}
                    />
                  ))}
                </FilterSection>

                <FilterSection title="Expertise" icon={Filter}>
                  {options.expertise.map((exp) => (
                    <CheckboxItem
                      key={exp}
                      label={exp}
                      checked={filters.expertise.includes(exp)}
                      onChange={(e) => handleFilterChange("expertise", exp, e.target.checked)}
                    />
                  ))}
                </FilterSection>


              <FilterSection title="Experience Level" icon={Award}>
                {["Emerging Artist", "Mid-Level Artist", "Established Artist", "Master Artist"].map((level) => (
                  <CheckboxItem
                    key={level}
                    label={level}
                    checked={filters.experienceLevel.includes(level)}
                    onChange={(e) => handleFilterChange("experienceLevel", level, e.target.checked)}
                  />
                ))}
              </FilterSection>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search celebrities, professions, or names..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {currentCelebrities.length > 0 ? (
                currentCelebrities.map((celebrity, index) => (
                  <div
                    key={celebrity._id}
                    className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">
                        {celebrity.artistName}
                      </h2>
                    </div>

                    <div className="relative aspect-square overflow-hidden bg-gray-50 border-y border-gray-100">
                      <img
                        src={celebrity.profilePicture || "/herosectionimg/1.jpg"}
                        alt={celebrity.artistName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-6 mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Star size={16} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-bold text-gray-900">
                            {celebrity.yearsActiveInArt}+ Years Active
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-[#6F4D34] bg-[#6F4D34]/5 px-3 py-1 rounded-full uppercase tracking-wider">
                          Featured
                        </div>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/celebrity/${slugify(celebrity.artistName)}`, { state: { celebrity } })}
                        className="w-full flex items-center justify-center gap-2 bg-[#6F4D34] text-white hover:!text-[#6F4D34] py-3 border border-gray-100 rounded-xl font-bold hover:bg-[#ffffff] transition-colors shadow-sm"
                      >
                        View Collection
                        <ImArrowUpRight2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-24 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6 text-gray-400">
                    <Search size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No celebrities found</h3>
                  <p className="text-gray-500 max-w-sm mx-auto mb-8">
                    Try adjusting your filters or search term to discover more incredible talent.
                  </p>
                      <button
                        onClick={() => setFilters({
                          sortBy: "New Arrivals",
                          experienceLevel: [],
                          expertise: [],
                          specialTags: [],
                          search: "",
                        })}
                        className="text-[#6F4D34] font-bold hover:underline px-6 py-2 border-2 border-[#6F4D34] rounded-full"
                      >
                        Clear All Filters
                      </button>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center gap-2 p-1 bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <button
                    disabled={currentPage === 1}
                    onClick={goToPrevPage}
                    className="p-3 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <div className="flex items-center px-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => goToPage(i + 1)}
                        className={`w-11 h-11 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                          currentPage === i + 1 ? "bg-[#6F4D34] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={goToNextPage}
                    className="p-3 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CelebrityCard;
