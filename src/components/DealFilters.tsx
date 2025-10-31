'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectSeparator,
} from '@/components/ui/select';
import { X, ChevronDown, ChevronUp, Filter } from 'lucide-react';

export interface FilterOptions {
    origins: string[];
    destinations: string[];
    statuses: string[];
    transports: string[];
    minInvestment: number | null;
}

interface DealFiltersProps {
    onFilterChange: (filters: FilterOptions) => void;
}

export default function DealFilters({ onFilterChange }: DealFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
    const [selectedDestination, setSelectedDestination] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedTransport, setSelectedTransport] = useState<string>('all');
    const [selectedMinInvestment, setSelectedMinInvestment] = useState<string>('all');

    const updateFilters = () => {
        const filters: FilterOptions = {
            origins: selectedOrigin === 'all' ? [] : [selectedOrigin],
            destinations: selectedDestination === 'all' ? [] : [selectedDestination],
            statuses: selectedStatus === 'all' ? [] : [selectedStatus],
            transports: selectedTransport === 'all' ? [] : [selectedTransport],
            minInvestment: selectedMinInvestment === 'all' ? null : parseInt(selectedMinInvestment),
        };
        onFilterChange(filters);
    };

    const handleOriginChange = (value: string) => {
        setSelectedOrigin(value);
        setTimeout(updateFilters, 0);
    };

    const handleDestinationChange = (value: string) => {
        setSelectedDestination(value);
        setTimeout(updateFilters, 0);
    };

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        setTimeout(updateFilters, 0);
    };

    const handleTransportChange = (value: string) => {
        setSelectedTransport(value);
        setTimeout(updateFilters, 0);
    };

    const handleMinInvestmentChange = (value: string) => {
        setSelectedMinInvestment(value);
        setTimeout(updateFilters, 0);
    };

    const clearAllFilters = () => {
        setSelectedOrigin('all');
        setSelectedDestination('all');
        setSelectedStatus('all');
        setSelectedTransport('all');
        setSelectedMinInvestment('all');
        onFilterChange({
            origins: [],
            destinations: [],
            statuses: [],
            transports: [],
            minInvestment: null,
        });
    };

    const hasActiveFilters =
        selectedOrigin !== 'all' ||
        selectedDestination !== 'all' ||
        selectedStatus !== 'all' ||
        selectedTransport !== 'all' ||
        selectedMinInvestment !== 'all';

    const getActiveFilterCount = () => {
        let count = 0;
        if (selectedOrigin !== 'all') count++;
        if (selectedDestination !== 'all') count++;
        if (selectedStatus !== 'all') count++;
        if (selectedTransport !== 'all') count++;
        if (selectedMinInvestment !== 'all') count++;
        return count;
    };

    return (
        <Card className="mb-6 border-gray-300">
            <CardContent className="pt-6">
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Filter Preferences</h3>
                        {hasActiveFilters && (
                            <Badge className="bg-[#3CA63820] text-[#2D8828] border border-[#3CA638]">
                                {getActiveFilterCount()} active
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearAllFilters();
                                }}
                                className="text-red-600 hover:text-red-700"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Clear
                            </Button>
                        )}
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                </div>

                {isExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        {/* Origin Filter */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Origin Country
                            </label>
                            <Select value={selectedOrigin} onValueChange={handleOriginChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select origin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Countries</SelectItem>
                                    <SelectSeparator />
                                    <SelectItem value="Peru">🇵🇪 Peru</SelectItem>
                                    <SelectItem value="Portugal">🇵🇹 Portugal</SelectItem>
                                    <SelectItem value="United States">🇺🇸 United States</SelectItem>
                                    <SelectItem value="Spain">🇪🇸 Spain</SelectItem>
                                    <SelectItem value="Israel">🇮🇱 Israel</SelectItem>
                                    <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Destination Filter */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Destination Country
                            </label>
                            <Select value={selectedDestination} onValueChange={handleDestinationChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select destination" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Countries</SelectItem>
                                    <SelectSeparator />
                                    <SelectItem value="Peru">🇵🇪 Peru</SelectItem>
                                    <SelectItem value="Portugal">🇵🇹 Portugal</SelectItem>
                                    <SelectItem value="United States">🇺🇸 United States</SelectItem>
                                    <SelectItem value="Spain">🇪🇸 Spain</SelectItem>
                                    <SelectItem value="Israel">🇮🇱 Israel</SelectItem>
                                    <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Deal Status
                            </label>
                            <Select value={selectedStatus} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectSeparator />
                                    <SelectItem value="proposal">🟡 Active</SelectItem>
                                    <SelectItem value="confirmed">🔵 In Progress</SelectItem>
                                    <SelectItem value="finished">🟢 Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Transport Filter */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Transport Type
                            </label>
                            <Select value={selectedTransport} onValueChange={handleTransportChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select transport" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectSeparator />
                                    <SelectItem value="Sea">🚢 Sea</SelectItem>
                                    <SelectItem value="Air">✈️ Air</SelectItem>
                                    <SelectItem value="Land">🚛 Land</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Minimum Investment Filter */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Minimum Investment
                            </label>
                            <Select value={selectedMinInvestment} onValueChange={handleMinInvestmentChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select amount" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Amounts</SelectItem>
                                    <SelectSeparator />
                                    <SelectItem value="50000">💰 $50,000+</SelectItem>
                                    <SelectItem value="100000">💰 $100,000+</SelectItem>
                                    <SelectItem value="250000">💎 $250,000+</SelectItem>
                                    <SelectItem value="500000">💎 $500,000+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

