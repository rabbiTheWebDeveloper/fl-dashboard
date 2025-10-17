/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, Globe, Truck, CreditCard, MessageSquare, MessageCircle, FileText, Share2, Bell } from "lucide-react";

export default function ManageShopPage() {
  const [shopSettings, setShopSettings] = useState({
    shopName: "AMARDokan",
    shopEmail: "support@amardokan.com",
    shopPhone: "+880 17XX-XXXXXX",
    shopAddress: "Rangpur, Bangladesh",
    isActive: true,
    maintenanceMode: false
  });

  const [domainSettings, setDomainSettings] = useState({
    customDomain: "amardokan.com",
    primaryDomain: "amardokan.myshop.com",
    sslEnabled: true,
    redirectWww: true
  });

  const [deliverySettings, setDeliverySettings] = useState({
    enabled: true,
    freeShippingThreshold: 2000,
    shippingZones: [
      { name: "Inside Rangpur", cost: 60 },
      { name: "Outside Rangpur", cost: 120 },
      { name: "Dhaka Division", cost: 100 }
    ],
    processingTime: "1-2 business days"
  });

  const [paymentSettings, setPaymentSettings] = useState({
    cod: true,
    bKash: true,
    nagad: true,
    rocket: true,
    card: false,
    bankTransfer: true
  });

  const [smsSettings, setSmsSettings] = useState({
    orderConfirmations: true,
    shippingUpdates: true,
    promotionalMessages: false,
    lowStockAlerts: true,
    smsGateway: "BulkSMS"
  });

  const [chatSettings, setChatSettings] = useState({
    enabled: true,
    offlineMessage: true,
    autoReply: true,
    workingHours: "9:00 AM - 6:00 PM",
    responseTime: "Within 5 minutes"
  });

  const [policySettings, setPolicySettings] = useState({
    returnPolicy: "7 days return policy",
    refundPolicy: "Full refund within 7 days",
    shippingPolicy: "1-2 business days processing",
    privacyPolicy: "We value your privacy...",
    termsOfService: "Terms and conditions apply..."
  });

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "AMARDokan - Your Trusted Online Shop",
    metaDescription: "Best products at affordable prices with fast delivery",
    googleAnalytics: "G-XXXXXXXXXX",
    facebookPixel: "XXXXXXXXXX",
    googleSearchConsole: true
  });

  const [socialSettings, setSocialSettings] = useState({
    facebook: "https://facebook.com/amardokan",
    instagram: "https://instagram.com/amardokan",
    twitter: "https://twitter.com/amardokan",
    youtube: "",
    linkedin: ""
  });

  const handleSaveSettings = (section) => {
    // Here you would typically make an API call to save the settings
    console.log(`Saving ${section} settings:`, {
      shopSettings,
      domainSettings,
      deliverySettings,
      paymentSettings,
      smsSettings,
      chatSettings,
      policySettings,
      seoSettings,
      socialSettings
    });
    
    alert(`${section} settings saved successfully!`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Shop</h1>
          <p className="text-muted-foreground">
            Set up and customize your shop to ensure a smooth and efficient experience
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Shop ID: 451899
        </Badge>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="domain" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Domain
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Delivery
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="policy" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Policy
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            SEO & Marketing
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Social Links
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Shop Settings
              </CardTitle>
              <CardDescription>
                General shop configurations to customize your shop's core settings for a seamless experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input
                    id="shopName"
                    value={shopSettings.shopName}
                    onChange={(e) => setShopSettings({...shopSettings, shopName: e.target.value})}
                    placeholder="Enter your shop name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopEmail">Shop Email</Label>
                  <Input
                    id="shopEmail"
                    type="email"
                    value={shopSettings.shopEmail}
                    onChange={(e) => setShopSettings({...shopSettings, shopEmail: e.target.value})}
                    placeholder="shop@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopPhone">Shop Phone</Label>
                  <Input
                    id="shopPhone"
                    value={shopSettings.shopPhone}
                    onChange={(e) => setShopSettings({...shopSettings, shopPhone: e.target.value})}
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopAddress">Shop Address</Label>
                  <Input
                    id="shopAddress"
                    value={shopSettings.shopAddress}
                    onChange={(e) => setShopSettings({...shopSettings, shopAddress: e.target.value})}
                    placeholder="Enter your shop address"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="shopActive">Shop Active</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable or disable your shop temporarily
                    </div>
                  </div>
                  <Switch
                    id="shopActive"
                    checked={shopSettings.isActive}
                    onCheckedChange={(checked) => setShopSettings({...shopSettings, isActive: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <div className="text-sm text-muted-foreground">
                      Put your shop under maintenance
                    </div>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={shopSettings.maintenanceMode}
                    onCheckedChange={(checked) => setShopSettings({...shopSettings, maintenanceMode: checked})}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("General")}>
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Domain Settings */}
        <TabsContent value="domain">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Shop Domain
              </CardTitle>
              <CardDescription>
                Manage your shop's core configurations, including domain setup and general settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customDomain">Custom Domain</Label>
                  <Input
                    id="customDomain"
                    value={domainSettings.customDomain}
                    onChange={(e) => setDomainSettings({...domainSettings, customDomain: e.target.value})}
                    placeholder="yourdomain.com"
                  />
                  <div className="text-sm text-muted-foreground">
                    Enter your custom domain (e.g., shop.yourdomain.com)
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryDomain">Primary Domain</Label>
                  <Input
                    id="primaryDomain"
                    value={domainSettings.primaryDomain}
                    disabled
                    className="bg-muted"
                  />
                  <div className="text-sm text-muted-foreground">
                    This is your default AMARDokan subdomain
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sslEnabled">SSL Certificate</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable SSL for secure connections
                    </div>
                  </div>
                  <Switch
                    id="sslEnabled"
                    checked={domainSettings.sslEnabled}
                    onCheckedChange={(checked) => setDomainSettings({...domainSettings, sslEnabled: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="redirectWww">Redirect WWW</Label>
                    <div className="text-sm text-muted-foreground">
                      Redirect www to non-www or vice versa
                    </div>
                  </div>
                  <Switch
                    id="redirectWww"
                    checked={domainSettings.redirectWww}
                    onCheckedChange={(checked) => setDomainSettings({...domainSettings, redirectWww: checked})}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Domain")}>
                Save Domain Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Settings */}
        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Support
              </CardTitle>
              <CardDescription>
                Manage your shop's delivery settings to ensure smooth and efficient order fulfillment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="deliveryEnabled">Enable Delivery</Label>
                  <div className="text-sm text-muted-foreground">
                    Turn delivery services on or off
                  </div>
                </div>
                <Switch
                  id="deliveryEnabled"
                  checked={deliverySettings.enabled}
                  onCheckedChange={(checked) => setDeliverySettings({...deliverySettings, enabled: checked})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="freeShipping">Free Shipping Threshold</Label>
                <Input
                  id="freeShipping"
                  type="number"
                  value={deliverySettings.freeShippingThreshold}
                  onChange={(e) => setDeliverySettings({...deliverySettings, freeShippingThreshold: parseInt(e.target.value) || 0})}
                  placeholder="2000"
                />
                <div className="text-sm text-muted-foreground">
                  Minimum order amount for free shipping (in BDT)
                </div>
              </div>

              <div className="space-y-4">
                <Label>Shipping Zones & Costs</Label>
                {deliverySettings.shippingZones.map((zone, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Input
                      value={zone.name}
                      onChange={(e) => {
                        const newZones = [...deliverySettings.shippingZones];
                        newZones[index].name = e.target.value;
                        setDeliverySettings({...deliverySettings, shippingZones: newZones});
                      }}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={zone.cost}
                      onChange={(e) => {
                        const newZones = [...deliverySettings.shippingZones];
                        newZones[index].cost = parseInt(e.target.value) || 0;
                        setDeliverySettings({...deliverySettings, shippingZones: newZones});
                      }}
                      className="w-24"
                    />
                    <span>BDT</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="processingTime">Order Processing Time</Label>
                <Input
                  id="processingTime"
                  value={deliverySettings.processingTime}
                  onChange={(e) => setDeliverySettings({...deliverySettings, processingTime: e.target.value})}
                  placeholder="1-2 business days"
                />
              </div>

              <Button onClick={() => handleSaveSettings("Delivery")}>
                Save Delivery Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Gateway
              </CardTitle>
              <CardDescription>
                Integrate and manage payment options to provide customers with secure and flexible transaction methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="cod">Cash on Delivery (COD)</Label>
                    <div className="text-sm text-muted-foreground">
                      Accept cash payments on delivery
                    </div>
                  </div>
                  <Switch
                    id="cod"
                    checked={paymentSettings.cod}
                    onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, cod: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="bKash">bKash</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable bKash payments
                    </div>
                  </div>
                  <Switch
                    id="bKash"
                    checked={paymentSettings.bKash}
                    onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, bKash: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="nagad">Nagad</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable Nagad payments
                    </div>
                  </div>
                  <Switch
                    id="nagad"
                    checked={paymentSettings.nagad}
                    onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, nagad: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="rocket">Rocket</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable Rocket payments
                    </div>
                  </div>
                  <Switch
                    id="rocket"
                    checked={paymentSettings.rocket}
                    onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, rocket: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="card">Credit/Debit Card</Label>
                    <div className="text-sm text-muted-foreground">
                      Accept card payments
                    </div>
                  </div>
                  <Switch
                    id="card"
                    checked={paymentSettings.card}
                    onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, card: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="bankTransfer">Bank Transfer</Label>
                    <div className="text-sm text-muted-foreground">
                      Accept bank transfer payments
                    </div>
                  </div>
                  <Switch
                    id="bankTransfer"
                    checked={paymentSettings.bankTransfer}
                    onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, bankTransfer: checked})}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Payment")}>
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Settings */}
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                SMS Support
              </CardTitle>
              <CardDescription>
                Enable SMS notifications and support to keep your customers informed with real-time updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="orderConfirmations">Order Confirmations</Label>
                    <div className="text-sm text-muted-foreground">
                      Send SMS when orders are confirmed
                    </div>
                  </div>
                  <Switch
                    id="orderConfirmations"
                    checked={smsSettings.orderConfirmations}
                    onCheckedChange={(checked) => setSmsSettings({...smsSettings, orderConfirmations: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="shippingUpdates">Shipping Updates</Label>
                    <div className="text-sm text-muted-foreground">
                      Send SMS with shipping status updates
                    </div>
                  </div>
                  <Switch
                    id="shippingUpdates"
                    checked={smsSettings.shippingUpdates}
                    onCheckedChange={(checked) => setSmsSettings({...smsSettings, shippingUpdates: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="promotionalMessages">Promotional Messages</Label>
                    <div className="text-sm text-muted-foreground">
                      Send promotional SMS to customers
                    </div>
                  </div>
                  <Switch
                    id="promotionalMessages"
                    checked={smsSettings.promotionalMessages}
                    onCheckedChange={(checked) => setSmsSettings({...smsSettings, promotionalMessages: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive SMS for low stock products
                    </div>
                  </div>
                  <Switch
                    id="lowStockAlerts"
                    checked={smsSettings.lowStockAlerts}
                    onCheckedChange={(checked) => setSmsSettings({...smsSettings, lowStockAlerts: checked})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smsGateway">SMS Gateway</Label>
                <Select value={smsSettings.smsGateway} onValueChange={(value) => setSmsSettings({...smsSettings, smsGateway: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select SMS Gateway" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BulkSMS">BulkSMS</SelectItem>
                    <SelectItem value="GreenWeb">GreenWeb</SelectItem>
                    <SelectItem value="SSLWireless">SSL Wireless</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => handleSaveSettings("SMS")}>
                Save SMS Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat Settings */}
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chat Support
              </CardTitle>
              <CardDescription>
                Provide instant communication and assistance to customers with chat support system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="chatEnabled">Enable Chat Support</Label>
                    <div className="text-sm text-muted-foreground">
                      Turn live chat support on or off
                    </div>
                  </div>
                  <Switch
                    id="chatEnabled"
                    checked={chatSettings.enabled}
                    onCheckedChange={(checked) => setChatSettings({...chatSettings, enabled: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="offlineMessage">Offline Messages</Label>
                    <div className="text-sm text-muted-foreground">
                      Allow customers to send messages when offline
                    </div>
                  </div>
                  <Switch
                    id="offlineMessage"
                    checked={chatSettings.offlineMessage}
                    onCheckedChange={(checked) => setChatSettings({...chatSettings, offlineMessage: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoReply">Auto Reply</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable automatic replies to customer messages
                    </div>
                  </div>
                  <Switch
                    id="autoReply"
                    checked={chatSettings.autoReply}
                    onCheckedChange={(checked) => setChatSettings({...chatSettings, autoReply: checked})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <Input
                    id="workingHours"
                    value={chatSettings.workingHours}
                    onChange={(e) => setChatSettings({...chatSettings, workingHours: e.target.value})}
                    placeholder="9:00 AM - 6:00 PM"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responseTime">Response Time</Label>
                  <Input
                    id="responseTime"
                    value={chatSettings.responseTime}
                    onChange={(e) => setChatSettings({...chatSettings, responseTime: e.target.value})}
                    placeholder="Within 5 minutes"
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Chat")}>
                Save Chat Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policy Settings */}
        <TabsContent value="policy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Shop Policy
              </CardTitle>
              <CardDescription>
                Define and customize policies for your shop, including returns, refunds, and customer service guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="returnPolicy">Return Policy</Label>
                  <Textarea
                    id="returnPolicy"
                    value={policySettings.returnPolicy}
                    onChange={(e) => setPolicySettings({...policySettings, returnPolicy: e.target.value})}
                    placeholder="Describe your return policy..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refundPolicy">Refund Policy</Label>
                  <Textarea
                    id="refundPolicy"
                    value={policySettings.refundPolicy}
                    onChange={(e) => setPolicySettings({...policySettings, refundPolicy: e.target.value})}
                    placeholder="Describe your refund policy..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingPolicy">Shipping Policy</Label>
                  <Textarea
                    id="shippingPolicy"
                    value={policySettings.shippingPolicy}
                    onChange={(e) => setPolicySettings({...policySettings, shippingPolicy: e.target.value})}
                    placeholder="Describe your shipping policy..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privacyPolicy">Privacy Policy</Label>
                  <Textarea
                    id="privacyPolicy"
                    value={policySettings.privacyPolicy}
                    onChange={(e) => setPolicySettings({...policySettings, privacyPolicy: e.target.value})}
                    placeholder="Describe your privacy policy..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="termsOfService">Terms of Service</Label>
                  <Textarea
                    id="termsOfService"
                    value={policySettings.termsOfService}
                    onChange={(e) => setPolicySettings({...policySettings, termsOfService: e.target.value})}
                    placeholder="Describe your terms of service..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Policy")}>
                Save Policy Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO & Marketing Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                SEO & Marketing Integrations
              </CardTitle>
              <CardDescription>
                Enhance your shop's visibility by connecting SEO tools and marketing integrations for better engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={seoSettings.metaTitle}
                    onChange={(e) => setSeoSettings({...seoSettings, metaTitle: e.target.value})}
                    placeholder="Your shop meta title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={seoSettings.metaDescription}
                    onChange={(e) => setSeoSettings({...seoSettings, metaDescription: e.target.value})}
                    placeholder="Your shop meta description"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                  <Input
                    id="googleAnalytics"
                    value={seoSettings.googleAnalytics}
                    onChange={(e) => setSeoSettings({...seoSettings, googleAnalytics: e.target.value})}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                  <Input
                    id="facebookPixel"
                    value={seoSettings.facebookPixel}
                    onChange={(e) => setSeoSettings({...seoSettings, facebookPixel: e.target.value})}
                    placeholder="XXXXXXXXXX"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="googleSearchConsole">Google Search Console</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable Google Search Console integration
                    </div>
                  </div>
                  <Switch
                    id="googleSearchConsole"
                    checked={seoSettings.googleSearchConsole}
                    onCheckedChange={(checked) => setSeoSettings({...seoSettings, googleSearchConsole: checked})}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("SEO & Marketing")}>
                Save SEO Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Social Links
              </CardTitle>
              <CardDescription>
                Connect your shop with social media platforms to enhance visibility and engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    type="url"
                    value={socialSettings.facebook}
                    onChange={(e) => setSocialSettings({...socialSettings, facebook: e.target.value})}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    type="url"
                    value={socialSettings.instagram}
                    onChange={(e) => setSocialSettings({...socialSettings, instagram: e.target.value})}
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={socialSettings.twitter}
                    onChange={(e) => setSocialSettings({...socialSettings, twitter: e.target.value})}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube URL</Label>
                  <Input
                    id="youtube"
                    type="url"
                    value={socialSettings.youtube}
                    onChange={(e) => setSocialSettings({...socialSettings, youtube: e.target.value})}
                    placeholder="https://youtube.com/yourchannel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={socialSettings.linkedin}
                    onChange={(e) => setSocialSettings({...socialSettings, linkedin: e.target.value})}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Social Links")}>
                Save Social Links
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}