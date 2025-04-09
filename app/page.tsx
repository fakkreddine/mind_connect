import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Calendar, MessageSquare, Shield, Video } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MindConnect</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/login">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-24 space-y-8 md:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              Your Mental Health Journey <br className="hidden sm:inline" />
              Starts Here
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Connect with licensed therapists through secure video sessions, track your progress, and take control of
              your mental wellbeing with MindConnect.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/login?role=patient">
                <Button size="lg" className="gap-2">
                  Get Started as Patient
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login?role=therapist">
                <Button size="lg" variant="outline" className="gap-2">
                  Join as Therapist
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="container py-16 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground">
              MindConnect offers a comprehensive suite of tools for both patients and therapists.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Secure Video Sessions</h3>
              <p className="text-muted-foreground">
                Connect with your therapist through encrypted, HIPAA-compliant video calls.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Easy Scheduling</h3>
              <p className="text-muted-foreground">
                Book appointments with your preferred therapist at times that work for you.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Therapy Management</h3>
              <p className="text-muted-foreground">
                Track progress, manage tasks, and keep all your therapy resources in one place.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Privacy First</h3>
              <p className="text-muted-foreground">
                Your data is protected with enterprise-grade security and strict privacy controls.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Visualize your mental health journey with intuitive progress tracking tools.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Seamless Experience</h3>
              <p className="text-muted-foreground">
                Enjoy a user-friendly interface designed for both patients and therapists.
              </p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-muted py-16">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                Getting started with MindConnect is simple and straightforward.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Create an Account</h3>
                <p className="text-muted-foreground">Sign up as a patient or therapist and complete your profile.</p>
              </div>

              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Connect</h3>
                <p className="text-muted-foreground">
                  Patients can browse therapists and book sessions. Therapists manage their availability.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Begin Your Journey</h3>
                <p className="text-muted-foreground">
                  Attend video sessions, track progress, and work together toward better mental health.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="container py-16 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">What Our Users Say</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground">
              Hear from patients and therapists who use MindConnect.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-lg border p-6 space-y-4">
              <p className="italic text-muted-foreground">
                "MindConnect has transformed how I provide therapy. The platform is intuitive, and my patients
                appreciate the seamless experience. The session notes and progress tracking features save me hours each
                week."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10"></div>
                <div>
                  <p className="font-medium">Dr. Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Clinical Psychologist</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-6 space-y-4">
              <p className="italic text-muted-foreground">
                "Finding the right therapist used to be so difficult. With MindConnect, I was able to browse profiles,
                book a session, and start therapy all in one day. The video quality is excellent, and I love being able
                to track my progress."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10"></div>
                <div>
                  <p className="font-medium">Michael T.</p>
                  <p className="text-sm text-muted-foreground">Patient</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16">
          <div className="container text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Ready to Start Your Mental Health Journey?
            </h2>
            <p className="mx-auto max-w-[700px]">Join thousands of patients and therapists on MindConnect today.</p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Link href="/login?role=patient">
                <Button size="lg" variant="secondary" className="gap-2">
                  Get Started as Patient
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login?role=therapist">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Join as Therapist
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-bold">MindConnect</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 MindConnect. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
