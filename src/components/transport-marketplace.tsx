'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bike, Bus, Car, Coffee, CreditCard, Gift, Phone, ShoppingBag, Train, Zap } from 'lucide-react';
import { useState } from 'react';

const rewardCategories = [
  { name: 'Transport', icon: <Bus className="h-6 w-6" /> },
  { name: 'Food', icon: <Coffee className="h-6 w-6" /> },
  { name: 'Shopping', icon: <ShoppingBag className="h-6 w-6" /> },
  { name: 'Entertainment', icon: <Gift className="h-6 w-6" /> },
];

const rewardItems = [
  { name: '₱50 eCash', points: 5000, icon: <CreditCard className="h-6 w-6" />, category: 'Shopping' },
  { name: '10% Off Next Ride', points: 3000, icon: <Bus className="h-6 w-6" />, category: 'Transport' },
  { name: '₱100 Prepaid Load', points: 8000, icon: <Phone className="h-6 w-6" />, category: 'Entertainment' },
  { name: 'Free LRT Ride', points: 2000, icon: <Train className="h-6 w-6" />, category: 'Transport' },
  { name: 'Grab ₱200 Voucher', points: 10000, icon: <Car className="h-6 w-6" />, category: 'Transport' },
  { name: '1-Day Bike Rental', points: 7000, icon: <Bike className="h-6 w-6" />, category: 'Transport' },
  { name: 'Jollibee Meal Voucher', points: 6000, icon: <Coffee className="h-6 w-6" />, category: 'Food' },
  { name: 'SM Cinema Ticket', points: 9000, icon: <Gift className="h-6 w-6" />, category: 'Entertainment' },
];

const featuredDeals = [
  { name: 'Double Points Weekend', description: 'Earn 2x points on all rides this weekend', icon: <Zap className="h-6 w-6" /> },
  { name: 'Flash Sale: 50% Off Rewards', description: 'Limited time offer on select items', icon: <Gift className="h-6 w-6" /> },
];

export function TransportMarketplaceComponent() {
  const [points] = useState(15000);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredRewards = selectedCategory === 'All'
    ? rewardItems
    : rewardItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Your Points</span>
              <span className="text-2xl font-bold">{points} pts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={75} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              You&apos;re 5,000 points away from Gold Tier!
            </p>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Featured Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredDeals.map((deal, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex items-center">
                  <div className="mr-4 bg-primary text-primary-foreground p-2 rounded-full">
                    {deal.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{deal.name}</h3>
                    <p className="text-sm text-muted-foreground">{deal.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Tabs defaultValue="rewards">
          <TabsList>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="earn">Earn Points</TabsTrigger>
          </TabsList>
          <TabsContent value="rewards">
            <div className="mb-4 flex space-x-2 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === 'All' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('All')}
              >
                All
              </Button>
              {rewardCategories.map((category, index) => (
                <Button
                  key={index}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredRewards.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-2">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-center">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.points} points</p>
                    <Badge variant="secondary" className="mt-2">{item.category}</Badge>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" disabled={points < item.points}>Redeem</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="earn">
            <Card>
              <CardHeader>
                <CardTitle>How to Earn Points</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use public transport: 10 points per ride</li>
                  <li>Refer a friend: 1000 points</li>
                  <li>Complete surveys: 100-500 points per survey</li>
                  <li>Participate in eco-challenges: Up to 2000 points</li>
                  <li>Use partner services: Varies by partner</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}