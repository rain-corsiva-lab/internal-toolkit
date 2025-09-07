import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, FolderOpen } from "lucide-react";
import { mockClients } from "@/data/mockData";
import { Project } from "@/types/admin";

// Mock projects data
const mockProjects: Project[] = [
  {
    id: "1",
    clientId: "1",
    quotationId: "1", 
    projectName: "Corporate Website Redesign",
    billingAddress: "1 Raffles Place, Singapore 048616",
    status: "active",
    createdAt: "2024-01-06T00:00:00Z",
    updatedAt: "2024-01-06T00:00:00Z"
  }
];

const ProjectManagement = () => {
  const getCompanyName = (clientId: string) => {
    return mockClients.find(client => client.id === clientId)?.companyName || "Unknown Company";
  };

  const getStatusBadge = (status: Project['status']) => {
    const variants: Record<Project['status'], 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      completed: 'secondary', 
      'on-hold': 'destructive'
    };
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Project Management</h1>
          <p className="text-muted-foreground">
            View and manage all active projects
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            All Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {getCompanyName(project.clientId)}
                    </div>
                  </TableCell>
                  <TableCell>{project.projectName}</TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {mockProjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No projects found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectManagement;