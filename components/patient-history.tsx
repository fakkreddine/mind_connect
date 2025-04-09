import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, CheckCircle2, FileText, Pill } from "lucide-react"

interface PatientHistoryProps {
  patient: {
    name: string
    avatar: string
    issues: string
    age: number
    gender: string
    sessionCount: number
  }
  history: {
    diagnoses: Array<{ condition: string; diagnosedDate: string; status: string }>
    medications: Array<{ name: string; dosage: string; startDate: string; status: string }>
    previousSessions: Array<{ date: string; notes: string }>
    goals: string[]
  }
}

export function PatientHistory({ patient, history }: PatientHistoryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={patient.avatar} alt={patient.name} />
          <AvatarFallback>JP</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">{patient.name}</h3>
          <p className="text-sm text-muted-foreground">
            {patient.age} years old, {patient.gender}
          </p>
          <p className="text-sm text-muted-foreground">Session #{patient.sessionCount}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {patient.issues.split(", ").map((issue) => (
              <Badge key={issue} variant="outline">
                {issue}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="diagnoses">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="diagnoses" className="pt-4">
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {history.diagnoses.map((diagnosis, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2 mt-1">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">{diagnosis.condition}</h4>
                        <p className="text-sm text-muted-foreground">Diagnosed: {diagnosis.diagnosedDate}</p>
                        <Badge
                          variant="outline"
                          className={`mt-2 ${
                            diagnosis.status === "Active"
                              ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300 border-green-200 dark:border-green-800"
                              : "bg-gray-50 text-gray-700 dark:bg-gray-950/50 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                          }`}
                        >
                          {diagnosis.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="medications" className="pt-4">
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {history.medications.map((medication, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-2 mt-1">
                        <Pill className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">{medication.name}</h4>
                        <p className="text-sm text-muted-foreground">Dosage: {medication.dosage}</p>
                        <p className="text-sm text-muted-foreground">Started: {medication.startDate}</p>
                        <Badge
                          variant="outline"
                          className={`mt-2 ${
                            medication.status === "Current"
                              ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300 border-green-200 dark:border-green-800"
                              : "bg-gray-50 text-gray-700 dark:bg-gray-950/50 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                          }`}
                        >
                          {medication.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sessions" className="pt-4">
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {history.previousSessions.map((session, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 p-2 mt-1">
                        <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Session: {session.date}</h4>
                        <p className="text-sm mt-1">{session.notes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="goals" className="pt-4">
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {history.goals.map((goal, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-amber-100 dark:bg-amber-900/50 p-2 mt-1">
                        <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="font-medium">{goal}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
