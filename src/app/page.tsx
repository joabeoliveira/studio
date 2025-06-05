"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, PlusCircle, Activity, CheckCircle2, AlertTriangle, FileSearch } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface DashboardStat {
  title: string;
  value: string;
  icon: React.ElementType;
  bgColorClass: string;
  iconColorClass: string;
}

const stats: DashboardStat[] = [
  { title: "Ongoing Research", value: "12", icon: Activity, bgColorClass: "bg-blue-100 dark:bg-blue-900", iconColorClass: "text-primary" },
  { title: "Completed Research", value: "45", icon: CheckCircle2, bgColorClass: "bg-green-100 dark:bg-green-900", iconColorClass: "text-accent-foreground" },
  { title: "Pending Actions", value: "3", icon: AlertTriangle, bgColorClass: "bg-yellow-100 dark:bg-yellow-900", iconColorClass: "text-yellow-600 dark:text-yellow-400" },
  { title: "Total Items Priced", value: "287", icon: FileSearch, bgColorClass: "bg-indigo-100 dark:bg-indigo-900", iconColorClass: "text-indigo-600 dark:text-indigo-400" },
];

const recentResearch = [
  { id: "R001", description: "Acquisition of Office Laptops Model X", status: "Ongoing", date: "2024-07-20", agent: "John Doe" },
  { id: "R002", description: "Hiring Cleaning Services for Building A", status: "Completed", date: "2024-07-15", agent: "Jane Smith" },
  { id: "R003", description: "Purchase of A4 Paper Reams", status: "Pending Review", date: "2024-07-22", agent: "Peter Jones" },
  { id: "R004", description: "Software License Renewal - CRM", status: "Ongoing", date: "2024-07-18", agent: "Alice Brown" },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "Ongoing": return "secondary";
    case "Completed": return "default"; // Will use primary color
    case "Pending Review": return "outline"; // Will use accent or similar
    default: return "secondary";
  }
};


export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
          <Link href="/research/new" passHref>
             <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Price Research
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-6 w-6 ${stat.iconColorClass}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Price Research</CardTitle>
            <CardDescription>Overview of the latest research activities.</CardDescription>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search research..." className="pl-8 w-full sm:w-[300px]" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentResearch.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(item.status)}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.agent}</TableCell>
                    <TableCell>
                      <Link href={`/research/${item.id}`} passHref>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg" data-ai-hint="government building">
          <CardHeader>
            <CardTitle>Compliance Overview</CardTitle>
            <CardDescription>Insights into IN 65/2021 compliance.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/2">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Compliance Chart Placeholder"
                width={600}
                height={400}
                className="rounded-md object-cover"
                data-ai-hint="compliance chart"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-2">
              <p className="text-muted-foreground">This section will display charts and statistics related to compliance, such as adherence to price collection parameters, justification completeness, and report generation timelines.</p>
              <Button variant="secondary">View Compliance Details</Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
