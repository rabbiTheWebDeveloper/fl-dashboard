"use client";
import { createCardOrderAction } from "@/app/actions/order";
import { getUserId } from "@/lib/auth";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { FiShoppingCart, FiX, FiCheck, FiInfo, FiFilter, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-toastify";

const Market = ({ getCardsList, balance }) => {
  // State management
  const [allCards, setAllCards] = useState(getCardsList);
  const [filteredCards, setFilteredCards] = useState(getCardsList);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    category: "",
    bank: "All",
    type: "All",
    level: "All",
    state: "",
    city: "",
    country: "",
    bin: "",
    zip: "",
    seller: "All",
    price: "All",
    linesPerPage: 50
  });

  // Extract unique values for dropdowns using useMemo for performance
  const uniqueValues = useMemo(() => {
    return {
      categories: ["All", ...new Set(allCards.map(card => card.category))],
      banks: ["All", ...new Set(allCards.map(card => card.bank))],
      types: ["All", ...new Set(allCards.map(card => card.type))],
      levels: ["All", ...new Set(allCards.map(card => card.level))],
      sellers: ["All", ...new Set(allCards.map(card => card.seller))],
      bins: ["All", ...new Set(allCards.map(card => card.bin))],
      countries: ["All", ...new Set(allCards.map(card => card.country))],
    };
  }, [allCards]);

  const priceRanges = [
    "All",
    "0-50",
    "50-100",
    "100-200",
    "200-500",
    "500-1000"
  ];

  // Apply filters whenever filters or allCards change
  useEffect(() => {
    applyFilters();
  }, [filters, allCards]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let result = [...allCards];
    
    // Apply each filter
    if (filters.category && filters.category !== "All") {
      result = result.filter(card => card.category === filters.category);
    }
    
    if (filters.bank && filters.bank !== "All") {
      result = result.filter(card => card.bank === filters.bank);
    }
    
    if (filters.type && filters.type !== "All") {
      result = result.filter(card => card.type === filters.type);
    }
    
    if (filters.level && filters.level !== "All") {
      result = result.filter(card => card.level === filters.level);
    }
    
    if (filters.state) {
      result = result.filter(card => 
        card.state?.toLowerCase().includes(filters.state.toLowerCase())
      );
    }
    
    if (filters.city) {
      result = result.filter(card => 
        card.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    
    if (filters.country && filters.country !== "All") {
      result = result.filter(card => 
        card.country?.toLowerCase().includes(filters.country.toLowerCase())
      );
    }
    
    if (filters.bin && filters.bin !== "All") {
      result = result.filter(card => card.bin.startsWith(filters.bin));
    }
    
    if (filters.zip) {
      result = result.filter(card => card.zip === filters.zip);
    }
    
    if (filters.seller && filters.seller !== "All") {
      result = result.filter(card => card.seller === filters.seller);
    }
    
    if (filters.price && filters.price !== "All") {
      const [min, max] = filters.price.split('-').map(Number);
      result = result.filter(card => {
        const cardPrice = Number(card.price.replace(/[^0-9.-]+/g,""));
        return cardPrice >= min && cardPrice <= max;
      });
    }
    
    // Apply pagination
    if (filters.linesPerPage) {
      result = result.slice(0, Number(filters.linesPerPage));
    }
    
    setFilteredCards(result);
  };

  const resetFilters = () => {
    setFilters({
      category: "All",
      bank: "All",
      type: "All",
      level: "All",
      state: "",
      city: "",
      country: "All",
      bin: "All",
      zip: "",
      seller: "All",
      price: "All",
      linesPerPage: 50
    });
  };

  const handlePurchase = (card) => {
    setSelectedCard(card);
    setShowModal(true);
    setPurchaseSuccess(false);
  };

  const confirmPurchase = async () => {
    const userId = getUserId();
    const orderData = {
      userId,
      cardId: selectedCard._id,
    };

    try {
      setLoading(true);
      const response = await createCardOrderAction(orderData);
  
      if (response?.error) {
        throw new Error(response.error);
      }

      toast.success("Purchase completed successfully!");
      setPurchaseSuccess(true);
      
      // Update the cards list to remove the purchased card
      setAllCards(prev => prev.filter(card => card._id !== selectedCard._id));
    } catch (error) {
      console.error("Purchase failed:", error);
      const errorMessage =
        error.message || "Failed to complete purchase. Please try again.";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCard(null);
    setPurchaseSuccess(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Top Buttons */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Card Marketplace</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-yellow-100 px-4 py-2 rounded-lg">
            <span className="text-yellow-700 font-bold mr-2">Balance:</span>
            <span className="text-yellow-600 font-bold">
              ${balance?.balance?.toFixed(2)}
            </span>
          </div>
          <Link
            href="/dashboard/deposits"
            className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            $ Add Funds
          </Link>
          <Link
            href="/dashboard/my-orders"
            className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            🧾 My Orders
          </Link>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showFilters ? <FiX /> : <FiFilter />}
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6 border rounded-xl shadow-sm bg-white mb-8">
          <select 
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {uniqueValues.categories.map(category => (
              <option key={category} value={category}>
                {category === "All" ? "All Categories" : category}
              </option>
            ))}
          </select>
          
          <select 
            name="bank"
            value={filters.bank}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {uniqueValues.banks.map(bank => (
              <option key={bank} value={bank}>
                {bank === "All" ? "All Banks" : bank}
              </option>
            ))}
          </select>
          
          <select 
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {uniqueValues.types.map(type => (
              <option key={type} value={type}>
                {type === "All" ? "All Types" : type}
              </option>
            ))}
          </select>
          
          <select 
            name="level"
            value={filters.level}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {uniqueValues.levels.map(level => (
              <option key={level} value={level}>
                {level === "All" ? "All Levels" : level}
              </option>
            ))}
          </select>
          
          <input
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="State"
          />
          
          <input
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="City"
          />
          
          <select
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {uniqueValues.countries.map(country => (
              <option key={country} value={country}>
                {country === "All" ? "All Countries" : country}
              </option>
            ))}
          </select>
         
          <select 
            name="bin"
            value={filters.bin}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">BIN</option>
            <option value="414709">414709</option>
          <option value="517805">517805</option>
          <option value="5448012">5448012</option>
          <option value="448233">448233</option>
          <option value="430665">430665</option>
          <option value="521876">521876</option>
          <option value="542217">542217</option>
          </select>
          
          <input
            name="zip"
            value={filters.zip}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="ZIP"
          />
          
          <select
            name="seller"
            value={filters.seller}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {uniqueValues.sellers.map(seller => (
              <option key={seller} value={seller}>
                {seller === "All" ? "All Sellers" : seller}
              </option>
            ))}
          </select>
          
          <select 
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {priceRanges.map(range => (
              <option key={range} value={range}>
                {range === "All" ? "All Prices" : `$${range}`}
              </option>
            ))}
          </select>
          
          <input
            name="linesPerPage"
            type="number"
            value={filters.linesPerPage}
            onChange={handleFilterChange}
            min="1"
            max="1000"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Items per page"
          />
          
          <button 
            onClick={applyFilters}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiFilter />
            Apply Filters
          </button>
          
          <button 
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FiRefreshCw />
            Reset Filters
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Showing <span className="font-bold">{filteredCards.length}</span> of{" "}
          <span className="font-bold">{allCards.length}</span> cards
        </p>
        {filteredCards.length === 0 && (
          <button 
            onClick={resetFilters}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Table Display */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        <table className="table-auto w-full">
          <thead className="bg-gray-100">
            <tr className="border-b">
              <th className="px-6 py-4 text-left font-medium text-gray-700">Type</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Category</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">MM/YY</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Level</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">BIN</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Bank</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Country</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">State</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">City</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">ZIP</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Seller</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Price</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <tr key={card._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={`/${card.type.toLowerCase()}.png`}
                        alt={card.type}
                        className="h-6 mr-2"
                      
                      />
                      {card.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{card.category}</td>
                  <td className="px-6 py-4 text-gray-700">{card.expiry}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {card.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-mono">{card.bin}</td>
                  <td className="px-6 py-4 text-gray-700">{card.bank}</td>
                  <td className="px-6 py-4 text-gray-700">{card.country}</td>
                  <td className="px-6 py-4 text-gray-700">{card.state}</td>
                  <td className="px-6 py-4 text-gray-700">{card.city}</td>
                  <td className="px-6 py-4 text-gray-700">{card.zip}</td>
                  <td className="px-6 py-4 text-blue-600 hover:text-blue-800 cursor-pointer">
                    {card.seller}
                  </td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    ${(card.price)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handlePurchase(card)}
                      disabled={loading}
                      className="flex items-center justify-center p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                      title="Purchase card"
                    >
                      <FiShoppingCart className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="px-6 py-24 text-center text-gray-500">
                  No cards found matching your filters. Try adjusting your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Purchase Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {purchaseSuccess ? "Purchase Successful" : "Confirm Purchase"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {purchaseSuccess ? (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <FiCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Your card details will be available in your orders section.
                  </p>
                  <button
                    onClick={closeModal}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Card Details
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Type</p>
                          <p className="font-medium">{selectedCard?.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Level</p>
                          <p className="font-medium">{selectedCard?.level}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Bank</p>
                          <p className="font-medium">{selectedCard?.bank}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Country</p>
                          <p className="font-medium">{selectedCard?.country}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-bold text-green-600">
                            ${parseFloat(selectedCard?.price).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Seller</p>
                          <p className="font-medium text-blue-600">
                            {selectedCard?.seller}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start mb-6">
                    <div className="flex-shrink-0">
                      <FiInfo className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">
                        By purchasing this card, you agree to our terms of
                        service. All sales are final.
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={loading}
                      onClick={confirmPurchase}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Confirm Purchase"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;