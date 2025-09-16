'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DEVICE_TYPES, 
  SUBSCRIPTION_STATUSES, 
  CURRENCIES, 
  PAYMENT_STATUSES,
  PLAN_OPTIONS,
  CardDetails,
  type CustomerFormData 
} from '@/lib/types/customer';
import { Plus, RotateCcw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
  onReset: () => void;
  loading?: boolean;
  initialData?: CustomerFormData;
}

interface Platform {
  id: string;
  name: string;
}

export default function CustomerForm({ onSubmit, onReset, loading = false, initialData }: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>(initialData || {
    subscription_status: '',
    full_name: '',
    email: '',
    subscription_id: '',
    plan_id: '',
    has_trial: false,
    device_type: [],
  });

  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<string[]>([]);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: ''
  });
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchPlatforms();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.device_type && Array.isArray(initialData.device_type)) {
        setSelectedDeviceTypes(initialData.device_type);
      } else if (initialData.device_type && typeof initialData.device_type === 'string') {
        try {
          const parsed = JSON.parse(initialData.device_type);
          setSelectedDeviceTypes(Array.isArray(parsed) ? parsed : [initialData.device_type]);
        } catch {
          setSelectedDeviceTypes([initialData.device_type]);
        }
      } else {
        setSelectedDeviceTypes([]);
      }
      
      // Initialize card details from existing card_details
      if (initialData.card_details) {
        // If card_details contains the old format with separators, extract just the number
        const cardNumber = initialData.card_details.includes(' | ') 
          ? initialData.card_details.split(' | ')[0]
          : initialData.card_details;
        setCardDetails({ number: cardNumber });
      }
    }
  }, [initialData]);

  // Auto-calculate total hours based on start and end dates
  useEffect(() => {
    if (formData.trial_start_date && formData.trial_end_date) {
      const startDate = new Date(formData.trial_start_date);
      const endDate = new Date(formData.trial_end_date);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalHours = diffDays * 24; // Assuming 24 hours per day
      
      setFormData(prev => ({
        ...prev,
        total_hours: totalHours
      }));
    }
  }, [formData.trial_start_date, formData.trial_end_date]);

  const fetchPlatforms = async () => {
    try {
      const { data, error } = await supabase
        .from('platforms')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error fetching platforms:', error);
        return;
      }

      setPlatforms(data || []);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    }
  };

  const handleInputChange = (field: keyof CustomerFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeviceTypeToggle = (deviceType: string) => {
    setSelectedDeviceTypes(prev => {
      const newSelection = prev.includes(deviceType)
        ? prev.filter(type => type !== deviceType)
        : [...prev, deviceType];
      
      console.log('Device type selection changed:', newSelection);
      
      setFormData(prev => ({
        ...prev,
        device_type: newSelection
      }));
      
      return newSelection;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileUploading(true);
      setUploadedFileName(file.name);
      
      // Simulate upload delay for better UX
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          attachment_file: file
        }));
        setFileUploading(false);
      }, 1000);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    console.log('Card number changed:', formatted);
    
    setCardDetails(prev => ({
      ...prev,
      number: formatted
    }));
    
    // Update form data with just the card number
    setFormData(prev => ({
      ...prev,
      card_details: formatted
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    console.log('Device types:', formData.device_type);
    console.log('Card details:', formData.card_details);
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      subscription_status: '',
      full_name: '',
      email: '',
      subscription_id: '',
      plan_id: '',
      has_trial: false,
      device_type: [],
    });
    setSelectedDeviceTypes([]);
    onReset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {initialData ? 'Edit Customer' : 'Add Customer'}
          </h1>
          <p className="text-slate-400 mt-1">
            {initialData ? 'Update customer information and subscription details.' : 'Create a new customer and manage their subscription details.'}
          </p>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="customer-info" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="customer-info" className="data-[state=active]:bg-slate-600">
                  Customer Info
                </TabsTrigger>
                <TabsTrigger value="trial-details" className="data-[state=active]:bg-slate-600">
                  Trial Details
                </TabsTrigger>
                <TabsTrigger value="device-details" className="data-[state=active]:bg-slate-600">
                  Device Details
                </TabsTrigger>
              </TabsList>

               <TabsContent value="customer-info" className="space-y-8 mt-6">
                 <div className="space-y-8">
                   {/* Basic Info Section */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-semibold text-white mb-6">Customer Information</h3>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div>
                         <Label htmlFor="customer_from" className="text-slate-300">Customer From</Label>
                         <Select
                           value={formData.customer_from || ''}
                           onValueChange={(value) => handleInputChange('customer_from', value)}
                         >
                           <SelectTrigger className="w-full mt-1 h-26 bg-slate-700 border-slate-600 text-white px-4 py-6 rounded-lg">
                             <SelectValue placeholder="Select platform" />
                           </SelectTrigger>
                           <SelectContent>
                             {platforms.map(platform => (
                               <SelectItem key={platform.id} value={platform.id}>
                                 {platform.name}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>

                       <div>
                         <Label htmlFor="subscription_status" className="text-slate-300">Subscription Status</Label>
                         <Select
                           value={formData.subscription_status}
                           onValueChange={(value) => handleInputChange('subscription_status', value)}
                           required
                         >
                           <SelectTrigger className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white px-4 py-6 rounded-lg">
                             <SelectValue placeholder="Select Subscription Status" />
                           </SelectTrigger>
                           <SelectContent>
                             {SUBSCRIPTION_STATUSES.map(status => (
                               <SelectItem key={status} value={status}>
                                 {status}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>

                       <div>
                         <Label htmlFor="full_name" className="text-slate-300">Full Name</Label>
                         <Input
                           id="full_name"
                           type="text"
                           placeholder="Enter full name"
                           value={formData.full_name}
                           onChange={(e) => handleInputChange('full_name', e.target.value)}
                           className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 py-6 rounded-lg"
                           required
                         />
                       </div>

                       <div>
                         <Label htmlFor="phone" className="text-slate-300">Phone No.</Label>
                         <Input
                           id="phone"
                           type="tel"
                           placeholder="Enter phone no."
                           value={formData.phone || ''}
                           onChange={(e) => handleInputChange('phone', e.target.value)}
                           className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 py-6 rounded-lg"
                         />
                       </div>
                     </div>
                   </div>

                   {/* Address Information Section */}
                   <div className="space-y-4">
                     <h4 className="text-md font-medium text-slate-200 mb-4">Address Information</h4>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div>
                         <Label htmlFor="billing_address" className="text-slate-300">Billing Address</Label>
                         <Input
                           id="billing_address"
                           type="text"
                           placeholder="Enter billing address"
                           value={formData.billing_address || ''}
                           onChange={(e) => handleInputChange('billing_address', e.target.value)}
                           className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 py-6 rounded-lg"
                         />
                       </div>

                       <div>
                         <Label htmlFor="shipping_address" className="text-slate-300">Shipping Address</Label>
                         <Input
                           id="shipping_address"
                           type="text"
                           placeholder="Enter shipping address"
                           value={formData.shipping_address || ''}
                           onChange={(e) => handleInputChange('shipping_address', e.target.value)}
                           className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 py-6 rounded-lg"
                         />
                       </div>
                     </div>
                   </div>

                   {/* Payment Information Section */}
                   <div className="space-y-4">
                     <h4 className="text-md font-medium text-slate-200 mb-4">Payment Information</h4>
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <div>
                         <Label htmlFor="currency" className="text-slate-300">Currency</Label>
                         <Select
                           value={formData.currency || ''}
                           onValueChange={(value) => handleInputChange('currency', value)}
                         >
                           <SelectTrigger className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white px-4 py-6 rounded-lg">
                             <SelectValue placeholder="Select currency" />
                           </SelectTrigger>
                           <SelectContent>
                             {CURRENCIES.map(currency => (
                               <SelectItem key={currency} value={currency}>
                                 {currency}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>

                       <div>
                         <Label htmlFor="payment_method" className="text-slate-300">Payment Method</Label>
                         <Input
                           id="payment_method"
                           type="text"
                           placeholder="Enter payment method"
                           value={formData.payment_method || ''}
                           onChange={(e) => handleInputChange('payment_method', e.target.value)}
                           className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 py-6 rounded-lg"
                         />
                       </div>

                       <div>
                         <Label htmlFor="payment_status" className="text-slate-300">Payment Status</Label>
                         <Select
                           value={formData.payment_status || ''}
                           onValueChange={(value) => handleInputChange('payment_status', value)}
                         >
                           <SelectTrigger className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white px-4 py-6 rounded-lg">
                             <SelectValue placeholder="Select payment status" />
                           </SelectTrigger>
                           <SelectContent>
                             {PAYMENT_STATUSES.map(status => (
                               <SelectItem key={status} value={status}>
                                 {status}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>
                     </div>
                   </div>

                   {/* Plan Information Section */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-semibold text-white mb-6">Plan Information</h3>
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <div>
                         <Label htmlFor="plan_id" className="text-slate-300">Plan Info</Label>
                         <Select
                           value={formData.plan_id}
                           onValueChange={(value) => handleInputChange('plan_id', value)}
                           required
                         >
                           <SelectTrigger className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white px-4 py-6 rounded-lg">
                             <SelectValue placeholder="Select plan" />
                           </SelectTrigger>
                           <SelectContent>
                             {PLAN_OPTIONS.map(plan => (
                               <SelectItem key={plan} value={plan}>
                                 {plan}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>

                       <div>
                         <Label htmlFor="subscription_id" className="text-slate-300">Subscription Id</Label>
                         <Input
                           id="subscription_id"
                           type="text"
                           placeholder="Enter subscription id"
                           value={formData.subscription_id}
                           onChange={(e) => handleInputChange('subscription_id', e.target.value)}
                           className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 py-6 rounded-lg"
                           required
                         />
                       </div>

                       <div>
                         <Label htmlFor="email" className="text-slate-300">Email</Label>
                         <Input
                           id="email"
                           type="email"
                           placeholder="Enter email"
                           value={formData.email}
                           onChange={(e) => handleInputChange('email', e.target.value)}
                           className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 py-6 rounded-lg"
                           required
                         />
                       </div>
                     </div>
                   </div>

                   {/* Subscription Dates Section */}
                   <div className="space-y-4">
                     <h4 className="text-md font-medium text-slate-200 mb-4">Subscription Dates</h4>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div>
                         <Label htmlFor="subscription_start_date" className="text-slate-300">Start Date & Time</Label>
                         <Input
                           id="subscription_start_date"
                           type="datetime-local"
                           value={formData.subscription_start_date || ''}
                           onChange={(e) => handleInputChange('subscription_start_date', e.target.value)}
                           className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 rounded-lg"
                         />
                       </div>

                       <div>
                         <Label htmlFor="subscription_end_date" className="text-slate-300">End Date & Time</Label>
                         <Input
                           id="subscription_end_date"
                           type="datetime-local"
                           value={formData.subscription_end_date || ''}
                           onChange={(e) => handleInputChange('subscription_end_date', e.target.value)}
                           className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 rounded-lg"
                         />
                       </div>
                     </div>
                   </div>

                   {/* Additional Details Section */}
                   <div className="space-y-4">
                     <h4 className="text-md font-medium text-slate-200 mb-4">Additional Details</h4>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div className="lg:col-span-2">
                         <Label className="text-slate-300">Card Details</Label>
                         <div className="mt-2 space-y-4 p-4 bg-slate-800 border border-slate-600 rounded-lg">
                           {/* Card Number */}
                           <div>
                             <Label htmlFor="card_number" className="text-slate-400 text-sm">Card Number</Label>
                             <Input
                               id="card_number"
                               type="text"
                               placeholder="1234 5678 9012 3456"
                               value={cardDetails.number}
                               onChange={(e) => handleCardNumberChange(e.target.value)}
                               maxLength={19}
                               className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 rounded-lg font-mono"
                             />
                           </div>
                           
                         </div>
                       </div>

                       <div>
                         <Label htmlFor="price" className="text-slate-300">Price</Label>
                         <Input
                           id="price"
                           type="number"
                           step="0.01"
                           placeholder="Enter price"
                           value={formData.price || ''}
                           onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                           className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 rounded-lg"
                         />
                       </div>

                       <div>
                         <Label htmlFor="payment_gateway" className="text-slate-300">Payment Gateway</Label>
                         <Input
                           id="payment_gateway"
                           type="text"
                           placeholder="Enter payment gateway"
                           value={formData.payment_gateway || ''}
                           onChange={(e) => handleInputChange('payment_gateway', e.target.value)}
                           className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 rounded-lg"
                         />
                       </div>

                       <div>
                         <Label htmlFor="reference_number" className="text-slate-300">Reference Number</Label>
                         <Input
                           id="reference_number"
                           type="text"
                           placeholder="Enter reference number"
                           value={formData.reference_number || ''}
                           onChange={(e) => handleInputChange('reference_number', e.target.value)}
                           className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 rounded-lg"
                         />
                       </div>

                       <div className="lg:col-span-2">
                         <Label htmlFor="attachment_file" className="text-slate-300">Attachment File</Label>
                         <div className="mt-1">
                           <input
                             id="attachment_file"
                             type="file"
                             accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                             onChange={handleFileChange}
                             className="hidden"
                             disabled={fileUploading}
                           />
                           <label
                             htmlFor="attachment_file"
                             className={`inline-flex items-center px-4 py-3 h-12 border rounded-lg text-white cursor-pointer transition-colors ${
                               fileUploading 
                                 ? 'bg-slate-600 border-slate-500 cursor-not-allowed opacity-50' 
                                 : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                             }`}
                           >
                             {fileUploading ? (
                               <>
                                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                 Uploading...
                               </>
                             ) : (
                               'Choose File'
                             )}
                           </label>
                           
                           {fileUploading && uploadedFileName && (
                             <div className="mt-2 p-3 bg-slate-800 rounded-lg border border-slate-600">
                               <div className="flex items-center space-x-2">
                                 <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                 <span className="text-slate-300 text-sm">
                                   Uploading: <span className="font-medium text-white">{uploadedFileName}</span>
                                 </span>
                               </div>
                             </div>
                           )}
                           
                           {!fileUploading && formData.attachment_file && (
                             <div className="mt-2 p-3 bg-green-900/20 border border-green-600 rounded-lg">
                               <div className="flex items-center space-x-2">
                                 <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                   <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                   </svg>
                                 </div>
                                 <span className="text-green-300 text-sm">
                                   Ready: <span className="font-medium text-white">{formData.attachment_file.name}</span>
                                 </span>
                               </div>
                             </div>
                           )}
                           
                           {!fileUploading && !formData.attachment_file && (
                             <span className="ml-2 text-slate-400">No file chosen</span>
                           )}
                           
                           <p className="text-xs text-slate-500 mt-1">jpg, jpeg, png, pdf and word file only</p>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </TabsContent>

              <TabsContent value="trial-details" className="space-y-8 mt-6">
                <div className="space-y-8">
                  <h3 className="text-lg font-semibold text-white mb-6">Trial Details</h3>
                  
                  <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <div className="flex items-center space-x-3 mb-6">
                      <input
                        type="checkbox"
                        id="has_trial"
                        checked={formData.has_trial}
                        onChange={(e) => handleInputChange('has_trial', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                      />
                      <Label htmlFor="has_trial" className="text-slate-300 text-lg font-medium">Enable Trial Details</Label>
                    </div>

                    {formData.has_trial && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="trial_start_date" className="text-slate-300">Trial Start Date & Time</Label>
                            <Input
                              id="trial_start_date"
                              type="datetime-local"
                              value={formData.trial_start_date || ''}
                              onChange={(e) => handleInputChange('trial_start_date', e.target.value)}
                              className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 rounded-lg"
                            />
                          </div>
                          <div>
                            <Label htmlFor="trial_end_date" className="text-slate-300">Trial End Date & Time</Label>
                            <Input
                              id="trial_end_date"
                              type="datetime-local"
                              value={formData.trial_end_date || ''}
                              onChange={(e) => handleInputChange('trial_end_date', e.target.value)}
                              className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 rounded-lg"
                            />
                          </div>
                          <div>
                            <Label htmlFor="total_hours" className="text-slate-300">Total Hours</Label>
                            <Input
                              id="total_hours"
                              type="number"
                              placeholder="Auto-calculated"
                              value={formData.total_hours || ''}
                              readOnly
                              className="w-full mt-1 h-12 bg-slate-600 border-slate-500 text-slate-300 placeholder:text-slate-500 px-4 rounded-lg cursor-not-allowed"
                            />
                            <p className="text-xs text-slate-500 mt-1">Automatically calculated based on trial start and end dates</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="device-details" className="space-y-8 mt-6">
                <div className="space-y-8">
                  <h3 className="text-lg font-semibold text-white mb-6">Device Details</h3>
                  
                  <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <div className="space-y-6">
                      <div>
                        <Label className="text-slate-300 mb-4 block text-lg font-medium">Device Type</Label>
                        <p className="text-slate-400 text-sm mb-4">Select all applicable device types</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {DEVICE_TYPES.map((device) => (
                            <label key={device} className={`flex items-center space-x-3 p-4 h-16 rounded-lg cursor-pointer transition-colors ${
                              selectedDeviceTypes.includes(device) 
                                ? 'bg-blue-600 border-2 border-blue-500' 
                                : 'bg-slate-700 hover:bg-slate-600 border-2 border-transparent'
                            }`}>
                              <input
                                type="checkbox"
                                name="device_type"
                                value={device}
                                checked={selectedDeviceTypes.includes(device)}
                                onChange={() => handleDeviceTypeToggle(device)}
                                className="w-5 h-5 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500"
                              />
                              <span className={`text-sm font-medium ${
                                selectedDeviceTypes.includes(device) ? 'text-white' : 'text-slate-300'
                              }`}>{device}</span>
                            </label>
                          ))}
                        </div>
                        {selectedDeviceTypes.length > 0 && (
                          <div className="mt-4 p-3 bg-slate-800 rounded-lg">
                            <p className="text-slate-300 text-sm">
                              <span className="font-medium">Selected devices:</span> {selectedDeviceTypes.join(', ')}
                            </p>
                          </div>
                        )}
                        {selectedDeviceTypes.includes('Any Other Device') && (
                          <Input
                            type="text"
                            placeholder="Enter any other device"
                            value={formData.any_other_device || ''}
                            onChange={(e) => handleInputChange('any_other_device', e.target.value)}
                            className="mt-4 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 rounded-lg"
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="mac_address" className="text-slate-300">MAC Address</Label>
                          <Input
                            id="mac_address"
                            type="text"
                            placeholder="Enter mac address"
                            value={formData.mac_address || ''}
                            onChange={(e) => handleInputChange('mac_address', e.target.value)}
                            className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 rounded-lg"
                          />
                        </div>
                        <div>
                          <Label htmlFor="service_type" className="text-slate-300">Service Type</Label>
                          <Input
                            id="service_type"
                            type="text"
                            placeholder="Enter service type"
                            value={formData.service_type || ''}
                            onChange={(e) => handleInputChange('service_type', e.target.value)}
                            className="w-full mt-1 h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 px-4 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
              <Button
                type="button"
                onClick={handleReset}
                variant="outline"
                className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                {loading ? (initialData ? 'Updating...' : 'Adding...') : (initialData ? 'Update Customer' : 'Add Customer')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
