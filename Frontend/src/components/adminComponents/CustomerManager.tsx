import { useState, useEffect } from "react";
import { Search, User, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fetchAllCustomers } from "@/services/customerService";
import { useAuth } from "@clerk/clerk-react";

interface Customer {
  _id: string;
  clerkId: string;
  email: string;
  fullName: string | null;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export function CustomerManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const data = await fetchAllCustomers(getToken);
        setCustomers(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [getToken]);

  const filteredCustomers = customers.filter(customer =>
    (customer.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.includes(searchTerm)
  );

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase();
  };

  // Customer stats are not available from backend, so set to NA
  const customerStats = {
    total: customers.length || 'NA',
    vip: 'NA',
    active: 'NA',
    inactive: 'NA',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-500">View and manage customer information</p>
        </div>
      </div>

      {loading && (
        <div className="text-center text-gray-500">Loading customers...</div>
      )}
      {error && (
        <div className="text-center text-red-500">{error}</div>
      )}

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{customerStats.total}</div>
            <div className="text-sm text-gray-500">Total Customers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{customerStats.vip}</div>
            <div className="text-sm text-gray-500">VIP Customers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{customerStats.active}</div>
            <div className="text-sm text-gray-500">Active Customers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{customerStats.inactive}</div>
            <div className="text-sm text-gray-500">Inactive Customers</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search customers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto">
        {filteredCustomers.map((customer) => (
          <Card key={customer._id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {getInitials(customer.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{customer.fullName || 'NA'}</CardTitle>
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                      NA
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{customer.email}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phoneNumber}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-2">NA</span>
                </div>

                <div className="pt-3 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Orders:</span>
                    <span className="font-medium">NA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Spent:</span>
                    <span className="font-medium text-green-600">NA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Order:</span>
                    <span className="font-medium">NA</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
