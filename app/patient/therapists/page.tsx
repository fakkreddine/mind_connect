import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data
const therapists = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    specialty: "Cognitive Behavioral Therapy",
    focus: ["Anxiety", "Depression", "Stress Management"],
    experience: "15 years",
    rating: 4.9,
    reviewCount: 124,
    nextAvailable: "Tomorrow",
    bio: "Dr. Johnson specializes in cognitive behavioral therapy with a focus on anxiety and depression. She has extensive experience helping clients develop practical strategies to manage their mental health.",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    avatar: "/placeholder.svg?height=80&width=80",
    specialty: "Psychodynamic Therapy",
    focus: ["Trauma", "Relationship Issues", "Self-Esteem"],
    experience: "12 years",
    rating: 4.8,
    reviewCount: 98,
    nextAvailable: "May 18, 2025",
    bio: "Dr. Chen uses psychodynamic approaches to help clients understand how past experiences influence current behaviors. He specializes in trauma recovery and relationship counseling.",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    avatar: "/placeholder.svg?height=80&width=80",
    specialty: "Mindfulness-Based Therapy",
    focus: ["Anxiety", "Stress", "Work-Life Balance"],
    experience: "8 years",
    rating: 4.7,
    reviewCount: 76,
    nextAvailable: "May 20, 2025",
    bio: "Dr. Rodriguez integrates mindfulness practices with traditional therapy approaches. She helps clients develop present-moment awareness to reduce stress and anxiety.",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    avatar: "/placeholder.svg?height=80&width=80",
    specialty: "Solution-Focused Therapy",
    focus: ["Career Challenges", "Life Transitions", "Goal Setting"],
    experience: "10 years",
    rating: 4.6,
    reviewCount: 89,
    nextAvailable: "May 17, 2025",
    bio: "Dr. Wilson specializes in solution-focused approaches that help clients navigate life transitions and career challenges. He focuses on practical strategies for achieving goals.",
  },
]

export default function TherapistsPage() {
  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Find a Therapist</h1>
        <p className="text-muted-foreground">
          Browse our network of licensed therapists to find the right match for you
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="md:w-1/3 lg:w-1/4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search</CardTitle>
              <CardDescription>Find therapists by name or specialty</CardDescription>
            </CardHeader>
            <CardContent>
              <Input placeholder="Search therapists..." />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Filter</CardTitle>
              <CardDescription>Refine your search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Specialties</h3>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="anxiety" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="anxiety" className="text-sm">
                      Anxiety
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="depression" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="depression" className="text-sm">
                      Depression
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="trauma" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="trauma" className="text-sm">
                      Trauma
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="relationships" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="relationships" className="text-sm">
                      Relationships
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="stress" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="stress" className="text-sm">
                      Stress
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Availability</h3>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="today" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="today" className="text-sm">
                      Today
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="this-week" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="this-week" className="text-sm">
                      This Week
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="evenings" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="evenings" className="text-sm">
                      Evenings
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="weekends" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="weekends" className="text-sm">
                      Weekends
                    </label>
                  </div>
                </div>
              </div>

              <Button className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3 lg:w-3/4">
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Therapists</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="available">Available Today</TabsTrigger>
              </TabsList>
              <div className="text-sm text-muted-foreground">Showing {therapists.length} therapists</div>
            </div>

            <TabsContent value="all" className="space-y-6">
              {therapists.map((therapist) => (
                <Card key={therapist.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/4 flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-2">
                          <AvatarImage src={therapist.avatar} alt={therapist.name} />
                          <AvatarFallback>
                            {therapist.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-medium">{therapist.name}</h3>
                        <p className="text-sm text-muted-foreground">{therapist.specialty}</p>
                        <div className="flex items-center justify-center mt-2">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="font-medium">{therapist.rating}</span>
                          <span className="text-muted-foreground text-xs ml-1">({therapist.reviewCount})</span>
                        </div>
                        <p className="text-sm mt-2">
                          <span className="font-medium">Experience:</span> {therapist.experience}
                        </p>
                      </div>

                      <div className="md:w-2/4 space-y-4">
                        <div>
                          <h4 className="font-medium mb-1">About</h4>
                          <p className="text-sm">{therapist.bio}</p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Specializes in</h4>
                          <div className="flex flex-wrap gap-2">
                            {therapist.focus.map((item) => (
                              <Badge key={item} variant="outline">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="md:w-1/4 flex flex-col space-y-4">
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <p className="text-sm font-medium">Next Available</p>
                          <p className="text-lg font-bold">{therapist.nextAvailable}</p>
                        </div>

                        <Button className="w-full" asChild>
                          <Link href={`/patient/book/${therapist.id}`}>Book Session</Link>
                        </Button>

                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/patient/therapist/${therapist.id}`}>View Profile</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="recommended" className="space-y-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    Complete your profile to get personalized therapist recommendations
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/patient/profile">Complete Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="available" className="space-y-6">
              {therapists
                .filter((t) => t.nextAvailable === "Tomorrow")
                .map((therapist) => (
                  <Card key={therapist.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/4 flex flex-col items-center text-center">
                          <Avatar className="h-24 w-24 mb-2">
                            <AvatarImage src={therapist.avatar} alt={therapist.name} />
                            <AvatarFallback>
                              {therapist.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-medium">{therapist.name}</h3>
                          <p className="text-sm text-muted-foreground">{therapist.specialty}</p>
                          <div className="flex items-center justify-center mt-2">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="font-medium">{therapist.rating}</span>
                            <span className="text-muted-foreground text-xs ml-1">({therapist.reviewCount})</span>
                          </div>
                          <p className="text-sm mt-2">
                            <span className="font-medium">Experience:</span> {therapist.experience}
                          </p>
                        </div>

                        <div className="md:w-2/4 space-y-4">
                          <div>
                            <h4 className="font-medium mb-1">About</h4>
                            <p className="text-sm">{therapist.bio}</p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Specializes in</h4>
                            <div className="flex flex-wrap gap-2">
                              {therapist.focus.map((item) => (
                                <Badge key={item} variant="outline">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="md:w-1/4 flex flex-col space-y-4">
                          <div className="text-center p-3 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg">
                            <p className="text-sm font-medium">Available</p>
                            <p className="text-lg font-bold">Tomorrow</p>
                          </div>

                          <Button className="w-full" asChild>
                            <Link href={`/patient/book/${therapist.id}`}>Book Session</Link>
                          </Button>

                          <Button variant="outline" className="w-full" asChild>
                            <Link href={`/patient/therapist/${therapist.id}`}>View Profile</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
