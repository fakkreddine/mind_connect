"use client"

import { useState } from "react"
import { AlertCircle, ChevronDown, ChevronRight, FileText, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

interface MedicalTerm {
  id: string
  term: string
  definition: string
  timestamp: string
  relatedRecords: boolean
  viewed?: boolean
}

interface PatientHistory {
  diagnoses: Array<{ condition: string; diagnosedDate: string; status: string }>
  medications: Array<{ name: string; dosage: string; startDate: string; status: string }>
  previousSessions: Array<{ date: string; notes: string }>
  goals: string[]
}

interface MedicalTermDetectorProps {
  terms: MedicalTerm[]
  patientHistory: PatientHistory
}

export function MedicalTermDetector({ terms, patientHistory }: MedicalTermDetectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedTerms, setExpandedTerms] = useState<string[]>([])
  const [viewedTerms, setViewedTerms] = useState<string[]>([])

  const toggleTerm = (termId: string) => {
    setExpandedTerms((prev) => (prev.includes(termId) ? prev.filter((id) => id !== termId) : [...prev, termId]))

    if (!viewedTerms.includes(termId)) {
      setViewedTerms((prev) => [...prev, termId])
    }
  }

  const filteredTerms = terms.filter(
    (term) =>
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((term) => (
              <Collapsible
                key={term.id}
                open={expandedTerms.includes(term.id)}
                onOpenChange={() => toggleTerm(term.id)}
                className={`rounded-lg border ${
                  viewedTerms.includes(term.id) || term.viewed
                    ? "bg-white dark:bg-gray-900"
                    : "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800"
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-6 w-6 rounded-full">
                        {expandedTerms.includes(term.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>

                    <div className="ml-2 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{term.term}</h3>
                          {term.relatedRecords && (
                            <Badge
                              variant="outline"
                              className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                            >
                              <AlertCircle className="mr-1 h-3 w-3" />
                              In Records
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{term.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{term.definition.substring(0, 80)}...</p>
                    </div>
                  </div>
                </div>

                <CollapsibleContent>
                  <div className="px-4 pb-4 pt-0 space-y-4">
                    <div className="ml-8">
                      <p className="text-sm">{term.definition}</p>

                      {term.relatedRecords && (
                        <div className="mt-4 space-y-3">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            Related Patient Records
                          </h4>

                          {term.term === "anxiety" && (
                            <div className="rounded-md bg-blue-50 dark:bg-blue-950/20 p-3 text-sm">
                              <p className="font-medium">Diagnosis: Generalized Anxiety Disorder</p>
                              <p className="text-muted-foreground">
                                Diagnosed: {patientHistory.diagnoses[0].diagnosedDate}
                              </p>
                              <p className="text-muted-foreground">Status: {patientHistory.diagnoses[0].status}</p>
                            </div>
                          )}

                          {term.term === "depression" && (
                            <div className="rounded-md bg-blue-50 dark:bg-blue-950/20 p-3 text-sm">
                              <p className="font-medium">Diagnosis: Major Depressive Disorder</p>
                              <p className="text-muted-foreground">
                                Diagnosed: {patientHistory.diagnoses[1].diagnosedDate}
                              </p>
                              <p className="text-muted-foreground">Status: {patientHistory.diagnoses[1].status}</p>
                            </div>
                          )}

                          {(term.term === "anxiety" || term.term === "depression") && (
                            <div className="rounded-md bg-blue-50 dark:bg-blue-950/20 p-3 text-sm">
                              <p className="font-medium">Medication: {patientHistory.medications[0].name}</p>
                              <p className="text-muted-foreground">Dosage: {patientHistory.medications[0].dosage}</p>
                              <p className="text-muted-foreground">
                                Started: {patientHistory.medications[0].startDate}
                              </p>
                            </div>
                          )}

                          {term.term === "anxiety" && (
                            <div className="rounded-md bg-blue-50 dark:bg-blue-950/20 p-3 text-sm">
                              <p className="font-medium">Previous Session Note (May 8, 2025):</p>
                              <p className="text-muted-foreground">
                                "Patient reported improved sleep patterns but continued anxiety in social situations. We
                                practiced mindfulness techniques and discussed cognitive restructuring for negative
                                thoughts."
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No medical terms detected yet</p>
              <p className="text-sm text-muted-foreground">
                Terms will appear here as they are detected in the conversation
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
