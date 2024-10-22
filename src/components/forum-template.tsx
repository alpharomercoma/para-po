'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Filter, MessageSquare, PlusCircle, Search, Share2, Tag, ThumbsDown, ThumbsUp, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

export function ForumTemplateComponent() {
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    sortBy: 'newest',
    tags: [""],
    answered: false,
    unanswered: false,
  });

  const recentDiscussions = [
    {
      title: 'LRT Line 1 Extension Progress',
      description: 'Updates on the construction and timeline of the LRT Line 1 extension to Cavite. Discuss potential impact on commuters and surrounding areas.',
      views: 1200,
      likes: 45,
      dislikes: 3,
      dateTime: '2023-05-15T14:30:00',
      user: { name: 'Maria Santos', avatar: '/placeholder.svg?height=32&width=32' },
      tags: ['Infrastructure', 'Train', 'LRT']
    },
    {
      title: 'Bus Rapid Transit System Proposal',
      description: 'Examining the proposed Bus Rapid Transit (BRT) system for Metro Manila. Share your thoughts on its feasibility and potential benefits.',
      views: 980,
      likes: 67,
      dislikes: 5,
      dateTime: '2023-05-14T09:15:00',
      user: { name: 'Jose Reyes', avatar: '/placeholder.svg?height=32&width=32' },
      tags: ['Bus', 'Infrastructure', 'Public Transport']
    },
    {
      title: 'Improving Jeepney Routes',
      description: 'Discussing strategies to optimize jeepney routes for better efficiency and coverage. Share your ideas on route improvements in your area.',
      views: 1500,
      likes: 89,
      dislikes: 12,
      dateTime: '2023-05-13T18:45:00',
      user: { name: 'Ana Lim', avatar: '/placeholder.svg?height=32&width=32' },
      tags: ['Jeepney', 'Routes', 'Public Transport']
    },
    {
      title: 'New Bike Lanes in Makati',
      description: 'Updates on the new bike lane network in Makati City. Discuss the impact on cyclists and overall traffic flow in the central business district.',
      views: 750,
      likes: 120,
      dislikes: 8,
      dateTime: '2023-05-12T11:20:00',
      user: { name: 'Miguel Cruz', avatar: '/placeholder.svg?height=32&width=32' },
      tags: ['Cycling', 'Infrastructure', 'Makati']
    },
    {
      title: 'Pasig River Ferry Expansion Plans',
      description: 'Exploring the proposed expansion of the Pasig River Ferry service. Share your thoughts on new routes and improved facilities.',
      views: 620,
      likes: 55,
      dislikes: 4,
      dateTime: '2023-05-11T16:00:00',
      user: { name: 'Sofia Garcia', avatar: '/placeholder.svg?height=32&width=32' },
      tags: ['Ferry', 'Pasig River', 'Public Transport']
    },
  ];

  const categories = ['All', 'Bus', 'Train', 'Jeepney', 'Taxi', 'Ride-sharing', 'Infrastructure', 'Cycling', 'Pedestrian'];

  const communities = [
    {
      name: 'Metro Manila Commuters',
      image: '/placeholder.svg?height=50&width=50',
      members: 15000,
      description: 'A community for daily commuters in Metro Manila to share experiences, tips, and discuss transportation issues.'
    },
    {
      name: 'PH Transport Innovations',
      image: '/placeholder.svg?height=50&width=50',
      members: 8500,
      description: 'Discussing and promoting innovative transportation solutions for Philippine cities.'
    },
    {
      name: 'Bike Commuters Manila',
      image: '/placeholder.svg?height=50&width=50',
      members: 6200,
      description: 'For cyclists who use their bikes for daily commute in Metro Manila. Share routes, safety tips, and advocacy efforts.'
    }
  ];

  const handleFilterChange: (key: string, value: any) => void = (key, value) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    // In a real application, you would apply these filters to your data
    console.log('Applying filters:', selectedFilters);
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto p-4 space-y-4">
        <Card className="bg-white shadow-lg border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">Featured Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <h3 className="font-semibold text-xl mb-2">Proposal: 24/7 Bus Services on EDSA</h3>
                <p className="text-gray-600 mb-4">
                  Let's discuss the feasibility and potential benefits of implementing round-the-clock bus services on EDSA to alleviate traffic congestion and provide more transportation options for night shift workers.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="w-8 h-8 mr-2">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@juandelacruz" />
                      <AvatarFallback>JC</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Juan dela Cruz</span>
                      <span className="text-xs text-gray-500">2023-05-16 09:30 AM</span>
                    </div>
                  </div>
                  <Badge variant="secondary">Hot Topic</Badge>
                </div>
              </div>
              <div className="md:w-1/4 flex-shrink-0">
                <img src="/placeholder.svg?height=150&width=200" alt="Featured discussion" className="w-full h-auto rounded-lg object-cover" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:hidden mb-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex">
                <Input
                  type="search"
                  placeholder="Search forum..."
                  className="w-full bg-white text-black rounded-r-none"
                />
                <Button className="rounded-l-none">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <section className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <CardTitle>Recent Discussions</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Dialog open={isContributeOpen} onOpenChange={setIsContributeOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Contribute
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] w-full">
                      <DialogHeader>
                        <DialogTitle>Create a New Discussion</DialogTitle>
                        <DialogDescription>
                          Share your thoughts or questions with the community.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">
                            Title
                          </Label>
                          <Input id="title" className="w-full" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">
                            Description
                          </Label>
                          <Textarea id="description" className="w-full min-h-[200px]" placeholder="Provide a detailed description of your discussion topic..." />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">
                            Category
                          </Label>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category.toLowerCase()}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="tags">
                            Tags
                          </Label>
                          <Input id="tags" className="w-full" placeholder="Separate tags with commas" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={() => setIsContributeOpen(false)}>Post Discussion</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Filter Discussions</DialogTitle>
                        <DialogDescription>
                          Customize your view of discussions.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Sort by</Label>
                          <Select
                            value={selectedFilters.sortBy}
                            onValueChange={(value) => handleFilterChange('sortBy', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="newest">Newest</SelectItem>
                              <SelectItem value="active">Most Active</SelectItem>
                              <SelectItem value="votes">Highest Votes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Tags</Label>
                          <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                            <div className="grid gap-2">
                              {['Infrastructure', 'Bus', 'Train', 'Jeepney', 'Cycling'].map((tag) => (
                                <div key={tag} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={tag}
                                    checked={selectedFilters.tags.includes(tag)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        handleFilterChange('tags', [...selectedFilters.tags, tag]);
                                      } else {
                                        handleFilterChange('tags', selectedFilters.tags.filter(t => t !== tag));
                                      }
                                    }}
                                  />
                                  <label htmlFor={tag} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {tag}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                        <div className="grid gap-2">
                          <Label>Status</Label>
                          <RadioGroup defaultValue="all">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="all" id="all" />
                              <Label htmlFor="all">All</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="answered" id="answered" />
                              <Label htmlFor="answered">Answered</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="unanswered" id="unanswered" />
                              <Label htmlFor="unanswered">Unanswered</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={applyFilters}>Apply Filters</Button>
                      </DialogFooter>
                    </DialogContent>

                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {recentDiscussions.map((discussion, index) => (
                  <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow transition-all duration-200 hover:shadow-md">
                    <h3 className="font-semibold text-lg mb-2">{discussion.title}</h3>
                    <p className="text-gray-600 mb-2 line-clamp-3">
                      {discussion.description}{' '}
                      <span className="font-bold cursor-pointer">...Read more</span>
                    </p>
                    <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 mb-2">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          <span className="mr-2">{discussion.likes}</span>
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          <span>{discussion.dislikes}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span className="mr-4">23</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="mr-4">{discussion.views}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="p-0">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                      <div className="flex items-center mt-2 sm:mt-0">
                        <Avatar className="w-8 h-8 mr-2">
                          <AvatarImage src={discussion.user.avatar} alt={discussion.user.name} />
                          <AvatarFallback>{discussion.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{discussion.user.name}</span>
                          <span className="text-xs">{new Date(discussion.dateTime).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {discussion.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex justify-center mt-4">
                  <Button variant="outline">Load More</Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-4">
            <div className="hidden md:block">
              <Card>
                <CardContent className="p-4">
                  <div className="flex">
                    <Input
                      type="search"
                      placeholder="Search forum..."
                      className="w-full bg-white text-black rounded-r-none"
                    />
                    <Button className="rounded-l-none">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <Button key={index} variant="outline" size="sm">
                      #{category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communities.map((community, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <img src={community.image} alt={community.name} className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{community.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{community.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            <Users className="inline w-4 h-4 mr-1" />
                            {community.members.toLocaleString()} members
                          </span>
                          <Button variant="outline" size="sm">Join</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {['NAIA Airport Link', 'Pasig River Ferry', 'Bike Lanes Expansion'].map((topic, index) => (
                    <li key={index} className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-red-500" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <footer className="bg-blue-600 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Metro Manila Transport Forum. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}