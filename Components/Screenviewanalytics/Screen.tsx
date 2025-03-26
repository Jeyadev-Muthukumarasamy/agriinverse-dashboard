import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from "axios"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DetailedScreenData {
  screenName: string;
  averageDuration: number;
  totalDuration: number;
  viewCount: number;
  uniqueCountries: number;
  uniqueCrops: number;
  countryName: string;
  cropType: string;
  countryBreakdown?: {
    country: string;
    averageDuration: number;
    totalDuration: number;
    viewCount: number;
  }[];
  areaBreakdown?: {
    area: string;
    averageDuration: number;
    totalDuration: number;
    viewCount: number;
  }[];
}

interface DetailedApiResponse {
  success: boolean;
  data: DetailedScreenData[];
}

interface PlaceData {
  success: boolean;
  data: {
    screenName: string;
    averageDuration: number;
    totalDuration: number;
    viewCount: number;
    cropBreakdown: {
      crop: string;
      averageDuration: number;
      totalDuration: number;
      viewCount: number;
    }[];
    countryName: string;
  }[];
}

interface CropData {
  data: {
    success: boolean;
    data: {
      screenName: string;
      averageDuration: number;
      totalDuration: number;
      viewCount: number;
      countryBreakdown: {
        country: string;
        averageDuration: number;
        totalDuration: number;
        viewCount: number;
      }[];
      crop: string;
    }[];
  };
  status: number;
  statusText: string;
}

interface DeviceScreenData {
  screenName: string;
  averageDuration: number;
  totalDuration: number;
  viewCount: number;
  deviceCountBreakdown: Array<{
    deviceCount: string;
    averageDuration: number;
    totalDuration: number;
    viewCount: number;
  }>;
  countryName: string;
}

interface DeviceCountData {
  data: {
    data: {
      success: boolean;
      data: DeviceScreenData[];
    };
  };
}

type ScreenDataType = DetailedScreenData | {
  screenName: string;
  averageDuration: number;
  totalDuration: number;
  viewCount: number;
  countryBreakdown?: {
    country: string;
    averageDuration: number;
    totalDuration: number;
    viewCount: number;
  }[];
  cropBreakdown?: {
    crop: string;
    averageDuration: number;
    totalDuration: number;
    viewCount: number;
  }[];
  areaBreakdown?: {
    area: string;
    averageDuration: number;
    totalDuration: number;
    viewCount: number;
  }[];
  countryName?: string;
  crop?: string;
  uniqueCountries?: number;
  uniqueCrops?: number;
};

const Screen: React.FC = () => {
  const [apiData, setApiData] = useState<DetailedApiResponse | null>(null);
  const [placeData, setPlaceData] = useState<PlaceData | null>(null);
  const [cropData, setCropData] = useState<CropData | null>(null);
  const [deviceData, setDeviceData] = useState<DeviceCountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [areaFilter, setAreaFilter] = useState<string>('');
  const [deviceCountFilter, setDeviceCountFilter] = useState<string>('');
  const [pendingArea, setPendingArea] = useState<string>('');
  const [pendingDeviceCount, setPendingDeviceCount] = useState<string>('');
  const [areaData, setAreaData] = useState<ScreenDataType[] | null>(null);

  console.log(pendingArea, "areaFilter")
  console.log(selectedCrop,"selectedcrop")
  // Predefined lists of countries and crops
  const predefinedCountries = [
    'India',
    'United States',
    'United Kingdom',
    'Australia',
    'Canada',
    'Brazil',
    'Germany',
    'Japan',
    'France',
    'Italy'
  ];

  const predefinedCrops = [
    'Corn',
    'Wheat',
    'Cotton',
    'Soybean',
    'Sugarcane',
    'Barley',
    'Rice',
    'Grapes',
    'Tomatoes'
  ];

  // API base URL
  const API_BASE_URL = 'http://localhost:3001';

  // Country flag mapping
  const countryFlags: {[key: string]: string} = {
    'India': '🇮🇳',
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'Australia': '🇦🇺',
    'Canada': '🇨🇦',
    'Brazil': '🇧🇷',
    'Germany': '🇩🇪',
    'Japan': '🇯🇵',
    'France': '🇫🇷',
    'Italy': '🇮🇹'
  };

  // Country colors
  const countryColors: {[key: string]: string} = {
    'India': 'rgba(255, 153, 51, 0.6)',
    'United States': 'rgba(0, 82, 156, 0.6)',
    'United Kingdom': 'rgba(200, 16, 46, 0.6)',
    'Australia': 'rgba(0, 0, 139, 0.6)',
    'Canada': 'rgba(255, 0, 0, 0.6)',
    'Brazil': 'rgba(0, 156, 59, 0.6)',
  };

  // Helper function to get country with flag
  const getCountryWithFlag = (countryName: string) => {
    const flag = countryFlags[countryName] || '';
    return `${countryName} ${flag}`;
  };

  // Update useEffect to handle device count filter correctly
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response;

        // Handle device count filter
        if (deviceCountFilter) {
          response = await axios.get(`${API_BASE_URL}/api/admin/screenTime/device-count/${deviceCountFilter}`);
          if (response.data?.data?.success) {
            setDeviceData(response.data);
            setApiData(null);
            setPlaceData(null);
            setCropData(null);
            setError(null);
            return;
          }
        }

        // Existing filter logic
        if (selectedCountry === 'all' && selectedCrop === 'all') {
          response = await axios.get(`${API_BASE_URL}/api/screenTime/detailedAnalytics`);
          if (response.data && response.data.success) {
            setApiData(response.data);
            setPlaceData(null);
            setCropData(null);
            setDeviceData(null);
          }
        } else if (selectedCountry !== 'all') {
          response = await axios.get(`${API_BASE_URL}/api/screenTime/adminPanelScreenTimePerPlace/${selectedCountry}`);
          if (response.data && response.data.success) {
            setPlaceData(response.data);
            setApiData(null);
            setCropData(null);
            setDeviceData(null);
          }
        } else if (selectedCrop !== 'all') {
          response = await axios.get(`${API_BASE_URL}/api/screenTime/adminPanelScreenTimePerCrops/${selectedCrop}`);
          if (response.data && response.data.success) {
            setCropData(response);
            setApiData(null);
            setPlaceData(null);
            setDeviceData(null);
          }
        }

        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCountry, selectedCrop, deviceCountFilter]);

  // Update getChartData to handle all data sources correctly
  const getChartData = () => {
    if (areaFilter && areaData) {
      // Get the area-specific data from the API response
      const areaSpecificData = areaData.map(item => {
        const areaBreakdown = item.areaBreakdown?.find(b => b.area === areaFilter);
        return {
          screenName: item.screenName,
          averageDuration: areaBreakdown?.averageDuration || 0,
          totalDuration: areaBreakdown?.totalDuration || 0,
          viewCount: areaBreakdown?.viewCount || 0
        };
      }).filter(item => item.averageDuration > 0); // Only include screens with data for this area

      if (areaSpecificData.length === 0) {
        return {
          labels: [],
          datasets: [{
            label: `No data available for area ${areaFilter}`,
            data: [],
            backgroundColor: 'rgba(234, 88, 12, 0.6)',
            borderColor: 'rgba(234, 88, 12, 1)',
            borderWidth: 1,
          }],
        };
      }

      return {
        labels: areaSpecificData.map(item => item.screenName),
        datasets: [{
          label: `Average Time Spent (minutes) - Area ${areaFilter}`,
          data: areaSpecificData.map(item => item.averageDuration),
          backgroundColor: 'rgba(234, 88, 12, 0.6)', // Orange color for area data
          borderColor: 'rgba(234, 88, 12, 1)',
          borderWidth: 1,
        }],
      };
    }

    // Handle device count filter data
    if (deviceCountFilter && deviceData?.data?.data?.data) {
      const deviceDataArray = deviceData.data.data.data;
      return {
        labels: deviceDataArray.map(item => item.screenName),
        datasets: [{
          label: `Average Time Spent (minutes) - Devices ≥${deviceCountFilter}`,
          data: deviceDataArray.map(item => item.averageDuration),
          backgroundColor: 'rgba(147, 51, 234, 0.6)', // Purple color for device count
          borderColor: 'rgba(147, 51, 234, 1)',
          borderWidth: 1,
        }],
      };
    }

    // Handle country-specific data
    if (selectedCountry !== 'all' && placeData?.data) {
      return {
        labels: placeData.data.map(item => item.screenName),
        datasets: [{
          label: `Average Time Spent (minutes) in ${selectedCountry}`,
          data: placeData.data.map(item => item.averageDuration),
          backgroundColor: countryColors[selectedCountry] || 'rgba(75, 192, 192, 0.6)',
          borderColor: countryColors[selectedCountry] || 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      };
    }

    // Handle crop-specific data
    if (selectedCrop !== 'all' && cropData?.data?.data) {
      return {
        labels: cropData.data.data.map(item => item.screenName),
        datasets: [{
          label: `Average Time Spent (minutes) for ${selectedCrop}`,
          data: cropData.data.data.map(item => item.averageDuration),
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        }],
      };
    }

    // Handle general analytics data (default case)
    if (apiData?.data) {
      return {
        labels: apiData.data.map(item => item.screenName),
        datasets: [{
          label: 'Average Time Spent (minutes)',
          data: apiData.data.map(item => item.averageDuration),
          backgroundColor: 'rgba(53, 162, 235, 0.6)',
          borderColor: 'rgba(53, 162, 235, 1)',
          borderWidth: 1,
        }],
      };
    }

    // Return empty data if nothing is available
    return {
      labels: [],
      datasets: [{
        label: 'No data available',
        data: [],
        backgroundColor: 'rgba(53, 162, 235, 0.6)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      }],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Screen Time Analytics',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: '#111827',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time (minutes)',
          color: '#374151',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Screens',
          color: '#374151',
        },
      },
    },
  };

  // Update getSummaryStats to handle area data correctly
  const getSummaryStats = () => {
    if (areaFilter && areaData) {
      // Calculate summary stats for the selected area
      const areaSpecificData = areaData.map(item => {
        const areaBreakdown = item.areaBreakdown?.find(b => b.area === areaFilter);
        return {
          viewCount: areaBreakdown?.viewCount || 0,
          totalDuration: areaBreakdown?.totalDuration || 0,
          averageDuration: areaBreakdown?.averageDuration || 0
        };
      }).filter(item => item.viewCount > 0);

      if (areaSpecificData.length === 0) {
        return {
          totalScreenViews: 0,
          totalDuration: 0,
          averageDuration: 0
        };
      }

      return {
        totalScreenViews: areaSpecificData.reduce((sum, item) => sum + item.viewCount, 0),
        totalDuration: areaSpecificData.reduce((sum, item) => sum + item.totalDuration, 0),
        averageDuration: areaSpecificData.reduce((sum, item) => sum + item.averageDuration, 0) / areaSpecificData.length
      };
    }

    if (deviceCountFilter && deviceData?.data?.data?.data) {
      const deviceDataArray = deviceData.data.data.data;
      return {
        totalScreenViews: deviceDataArray.reduce((sum, item) => sum + item.viewCount, 0),
        totalDuration: deviceDataArray.reduce((sum, item) => sum + item.totalDuration, 0),
        averageDuration: deviceDataArray.reduce((sum, item) => sum + item.averageDuration, 0) / deviceDataArray.length
      };
    }

    if (selectedCountry === 'all' && selectedCrop === 'all' && apiData?.data) {
      return {
        totalScreenViews: apiData.data.reduce((sum, item) => sum + item.viewCount, 0),
        totalDuration: apiData.data.reduce((sum, item) => sum + item.totalDuration, 0),
        averageDuration: apiData.data.reduce((sum, item) => sum + item.averageDuration, 0) / apiData.data.length
      };
    } else if (selectedCountry !== 'all' && placeData?.data) {
      return {
        totalScreenViews: placeData.data.reduce((sum, item) => sum + item.viewCount, 0),
        totalDuration: placeData.data.reduce((sum, item) => sum + item.totalDuration, 0),
        averageDuration: placeData.data.reduce((sum, item) => sum + item.averageDuration, 0) / placeData.data.length
      };
    } else if (selectedCrop !== 'all' && cropData?.data?.data) {
      console.log('Calculating summary for crop data:', cropData.data.data);
      return {
        totalScreenViews: cropData.data.data.reduce((sum, item) => sum + item.viewCount, 0),
        totalDuration: cropData.data.data.reduce((sum, item) => sum + item.totalDuration, 0),
        averageDuration: cropData.data.data.reduce((sum, item) => sum + item.averageDuration, 0) / cropData.data.data.length
      };
    }
    return {
      totalScreenViews: 0,
      totalDuration: 0,
      averageDuration: 0
    };
  };

  // Update getMostActiveScreen to handle area data correctly
  const getMostActiveScreen = () => {
    if (areaFilter && areaData) {
      // Get the most active screen for the selected area
      const areaSpecificData = areaData.map(item => {
        const areaBreakdown = item.areaBreakdown?.find(b => b.area === areaFilter);
        return {
          screenName: item.screenName,
          totalDuration: areaBreakdown?.totalDuration || 0
        };
      }).filter(item => item.totalDuration > 0);

      if (areaSpecificData.length === 0) {
        return 'No data available for this area';
      }
      
      const topScreen = areaSpecificData.reduce((max, current) => 
        current.totalDuration > max.totalDuration ? current : max,
        areaSpecificData[0]
      );
      return `${topScreen.screenName} (${Math.round(topScreen.totalDuration)} minutes)`;
    }

    if (deviceCountFilter && deviceData?.data?.data?.data) {
      const deviceDataArray = deviceData.data.data.data;
      if (deviceDataArray.length === 0) return 'No data available';
      
      const topScreen = deviceDataArray.reduce((max, current) => 
        current.totalDuration > max.totalDuration ? current : max,
        deviceDataArray[0]
      );
      return `${topScreen.screenName} (${Math.round(topScreen.totalDuration)} minutes)`;
    }

    if (selectedCountry === 'all' && selectedCrop === 'all') {
      if (!apiData?.data || apiData.data.length === 0) return 'No data available';
      const topScreen = apiData.data.reduce((max, current) => 
        current.totalDuration > max.totalDuration ? current : max,
        apiData.data[0]
      );
      return `${topScreen.screenName} (${Math.round(topScreen.totalDuration)} minutes)`;
    } else if (selectedCountry !== 'all') {
      if (!placeData?.data || placeData.data.length === 0) return 'No data available';
      const topScreen = placeData.data.reduce((max, current) => 
        current.totalDuration > max.totalDuration ? current : max,
        placeData.data[0]
      );
      return `${topScreen.screenName} (${Math.round(topScreen.totalDuration)} minutes)`;
    } else if (selectedCrop !== 'all') {
      if (!cropData?.data?.data || cropData.data.data.length === 0) return 'No data available';
      const topScreen = cropData.data.data.reduce((max, current) => 
        current.totalDuration > max.totalDuration ? current : max,
        cropData.data.data[0]
      );
      return `${topScreen.screenName} (${Math.round(topScreen.totalDuration)} minutes)`;
    }
    return 'No data available';
  };

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCountry(value !== 'all' ? value : 'all');
  };

  // Update handleCountryChange to reset crop selection
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
    setSelectedCrop('all'); // Reset crop when country changes
  };

  // Update handleCropChange to reset country selection
  const handleCropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCrop(e.target.value);
    setSelectedCountry('all'); // Reset country when crop changes
  };

  // Add handler for area filter
  const handleAreaFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingArea(e.target.value);
  };

  // Add handler for device count filter
  const handleDeviceCountFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingDeviceCount(e.target.value);
  };

  // Update handleDeviceCountFilter to handle the response correctly
  const handleDeviceCountFilter = async () => {
    if (!pendingDeviceCount) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/screenTime/device-count/${pendingDeviceCount}`);
      console.log('Device count response:', response);
      
      if (response.data?.data?.success) {
        setDeviceData(response.data);
        setApiData(null);
        setPlaceData(null);
        setCropData(null);
        setDeviceCountFilter(pendingDeviceCount);
        setError(null);
      } else {
        setError('No data available for the selected device count');
      }
    } catch (err) {
      setError('Failed to fetch device count data');
      console.error('Error fetching device count data:', err);
    } finally {
      setLoading(false);
      setIsFilterOpen(false);
    }
  };

  // Update handleAreaFilter function
  const handleAreaFilter = async () => {
    if (!pendingArea.trim()) {
      setError('Please enter an area');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/screenTime/area/${pendingArea}`);
      console.log('Area filter response:', response.data);
      
      if (response.data?.data?.success && response.data.data.data) {
        const areaScreenData = response.data.data.data;
        setAreaData(areaScreenData);
        setApiData(null);
        setPlaceData(null);
        setCropData(null);
        setDeviceData(null);
        setAreaFilter(pendingArea);
        setError(null);
      } else {
        setError('No data available for this area');
      }
    } catch (err) {
      setError('Failed to fetch area data');
      console.error('Error fetching area data:', err);
    } finally {
      setLoading(false);
      setIsFilterOpen(false);
    }
  };

  // Add to reset filters function
  const resetFilters = () => {
    setSelectedCountry('all');
    setSelectedCrop('all');
    setAreaFilter('');
    setDeviceCountFilter('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Update the error condition to check for any valid data source
  if (!apiData?.data && !placeData?.data && !cropData?.data?.data) {
    console.log('No data available. API Data:', apiData, 'Place Data:', placeData, 'Crop Data:', cropData);
    return (
      <div className="flex justify-center items-center h-full">
        <div className="bg-yellow-50 p-4 rounded-lg text-yellow-600">
          <p>No data available. Please check API connection.</p>
        </div>
      </div>
    );
  }

  const summary = getSummaryStats();

  // Update getCurrentData to handle device count data correctly
  const getCurrentData = (): ScreenDataType[] => {
    if (areaFilter && areaData) {
      return areaData;
    }

    if (deviceCountFilter && deviceData?.data?.data?.data) {
      const deviceDataArray = deviceData.data.data.data;
      return deviceDataArray.map(item => ({
        screenName: item.screenName,
        averageDuration: item.averageDuration,
        totalDuration: item.totalDuration,
        viewCount: item.viewCount,
        deviceCountBreakdown: item.deviceCountBreakdown
      }));
    }

    if (selectedCountry === 'all' && selectedCrop === 'all') {
      return apiData?.data || [];
    } else if (selectedCountry !== 'all') {
      return placeData?.data || [];
    } else if (selectedCrop !== 'all' && cropData?.data?.data) {
      return cropData.data.data;
    }
    return [];
  };

  const currentData = getCurrentData();

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Screen Time Analytics</h1>
            <p className="text-gray-600">Monitor user engagement and screen activity</p>
            {error && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm">
                {error}
              </div>
            )}
          </div>
          
          {/* New Filter UI */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 font-medium">Filter</span>
              {(selectedCountry !== 'all' || selectedCrop !== 'all') && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Options</h3>
                  
                  {/* Country Filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Country
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      <option value="all">All Countries</option>
                      {predefinedCountries.map((country) => (
                        <option key={country} value={country}>
                          {country} {countryFlags[country]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Crop Filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Crop
                    </label>
                    <select
                      value={selectedCrop}
                      onChange={handleCropChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      <option value="all">All Crops</option>
                      {predefinedCrops.map((crop) => (
                        <option key={crop} value={crop}>
                          {crop}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Area Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Area (in hectares)
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={pendingArea}
                          onChange={handleAreaFilterChange}
                          placeholder="Enter minimum area"
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-500">ha</span>
                      </div>
                      <button
                        onClick={handleAreaFilter}
                        className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        Apply Area Filter
                      </button>
                    </div>
                  </div>

                  {/* Device Count Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Device Count
                    </label>
                    <div className="space-y-2">
                      <input
                        type="number"
                        value={pendingDeviceCount}
                        onChange={handleDeviceCountFilterChange}
                        placeholder="Enter minimum devices"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                      <button
                        onClick={handleDeviceCountFilter}
                        className="w-full px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                      >
                        Apply Device Count Filter
                      </button>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {(selectedCountry !== 'all' || selectedCrop !== 'all' || areaFilter || deviceCountFilter) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCountry !== 'all' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {countryFlags[selectedCountry]} {selectedCountry}
                            <button
                              onClick={() => setSelectedCountry('all')}
                              className="ml-1 hover:text-blue-900"
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {selectedCrop !== 'all' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {selectedCrop}
                            <button
                              onClick={() => setSelectedCrop('all')}
                              className="ml-1 hover:text-green-900"
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {areaFilter && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Area: ≥{areaFilter} ha
                            <button
                              onClick={() => setAreaFilter('')}
                              className="ml-1 hover:text-purple-900"
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {deviceCountFilter && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Devices: ≥{deviceCountFilter}
                            <button
                              onClick={() => setDeviceCountFilter('')}
                              className="ml-1 hover:text-orange-900"
                            >
                              ×
                            </button>
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reset Filters Button */}
                  {(selectedCountry !== 'all' || selectedCrop !== 'all' || areaFilter || deviceCountFilter) && (
                    <button
                      onClick={resetFilters}
                      className="mt-4 w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Reset All Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{summary.totalScreenViews}</p>
          <p className="text-xs text-green-600 mt-2">
            {selectedCountry === 'all' ? 'Across all countries' : `In ${selectedCountry}`}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Avg Session Duration</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{Math.round(summary.averageDuration)} min</p>
          <p className="text-xs text-green-600 mt-2">
            {selectedCountry === 'all' ? 'Across all countries' : `In ${selectedCountry}`}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500">Most Active Screen</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{getMostActiveScreen()}</p>
          <p className="text-xs text-green-600 mt-2">By total screen time</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Screen View Analytics</h2>
        </div>
        <div className="h-[400px]">
          <Bar data={getChartData()} options={options} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Screen Details</h3>
          <div className="space-y-4">
            {currentData.map((screen: ScreenDataType, index: number) => (
              <div key={index} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium text-gray-700">{screen.screenName}</p>
                  <p className="text-sm text-gray-500">
                    Average: {Math.round(screen.averageDuration)} minutes • {screen.viewCount} views
                  </p>
                  {(screen.uniqueCountries !== undefined || screen.countryBreakdown) && (
                    <p className="text-xs text-gray-400 mt-1">
                      {screen.uniqueCountries !== undefined ? 
                        `Unique Countries: ${screen.uniqueCountries} • Unique Crops: ${screen.uniqueCrops}` :
                        `Countries: ${screen.countryBreakdown?.length || 0}`
                      }
                    </p>
                  )}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs ${
                  index === 0 ? 'bg-green-100 text-green-800' :
                  index === 1 ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {Math.round(screen.totalDuration)} min total
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Global Statistics</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <h4 className="font-medium text-gray-800">Total Screen Time</h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {Math.round(summary.totalDuration)} minutes
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Across {currentData.length} different screens
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <h4 className="font-medium text-gray-800">Coverage</h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {selectedCrop !== 'all' ? 
                  `${currentData[0]?.countryBreakdown?.length || 0} countries` :
                  `${(currentData[0] as DetailedScreenData)?.uniqueCountries || 0} countries`
                }
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedCrop !== 'all' ? 
                  `Viewing data for ${selectedCrop}` :
                  `${(currentData[0] as DetailedScreenData)?.uniqueCrops || 0} different crops`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen;
