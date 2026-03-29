import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid w-full max-w-5xl gap-6 p-6 md:p-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Shadcn UI Preview
          </h1>
          <p className="text-sm text-muted-foreground">
            A quick preview of your installed base components.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Brand Logo Comparison</CardTitle>
              <CardDescription>
                Light and dark logo assets rendered side by side.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Dark logo
                </p>
                <div className="mx-auto max-w-sm overflow-hidden rounded-lg border border-border bg-primary p-3">
                  <Image
                    src="/assets/logos/SimpliCity_dark_logo.png"
                    alt="SimpliCity dark logo on deep green background"
                    width={1000}
                    height={1000}
                    className="h-auto w-full max-w-[240px] rounded-md"
                    priority
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Light logo
                </p>
                <div className="mx-auto max-w-sm overflow-hidden rounded-lg border border-border bg-[#e5e7e6] p-3">
                  <Image
                    src="/assets/logos/SimpliCity_light_logo.png"
                    alt="SimpliCity light logo on light neutral background"
                    width={1000}
                    height={1000}
                    className="h-auto w-full max-w-[240px] rounded-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>
                Base variants and common actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Try keyboard navigation to check focus visibility.
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Inputs</CardTitle>
              <CardDescription>
                Inputs with labels and a select field.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="e.g. Victoria Lee" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Advice topic</Label>
                <Select>
                  <SelectTrigger id="topic" className="w-full">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buying">Buying strategy</SelectItem>
                    <SelectItem value="investment">
                      Investment options
                    </SelectItem>
                    <SelectItem value="mortgage">Mortgage guidance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Describe your situation and goals..."
                />
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button type="button">Submit</Button>
              <Button type="button" variant="outline">
                Save Draft
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
