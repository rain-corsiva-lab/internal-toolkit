import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, Shield, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Admin Panel System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Comprehensive management system for staff, roles, and clients. 
            Streamline your administrative processes with our powerful dashboard.
          </p>
          <Link to="/admin">
            <Button size="lg" className="bg-admin-primary hover:bg-admin-primary-hover text-lg px-8">
              Access Admin Panel
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="group hover:shadow-primary transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-admin-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-admin-primary/20 transition-colors">
                <Users className="h-6 w-6 text-admin-primary" />
              </div>
              <CardTitle>Staff Management</CardTitle>
              <CardDescription>
                Manage employee information, track login history, and handle staff records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Add, edit, and remove employees</li>
                <li>• Assign departments and roles</li>
                <li>• Track employment types</li>
                <li>• Monitor login history</li>
                <li>• Export staff data</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-primary transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-admin-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-admin-primary/20 transition-colors">
                <Shield className="h-6 w-6 text-admin-primary" />
              </div>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>
                Create roles and assign CRUD permissions for system access control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Create custom roles</li>
                <li>• Set CRUD permissions</li>
                <li>• Assign roles to staff</li>
                <li>• Permission matrix view</li>
                <li>• Default role protection</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-primary transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-admin-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-admin-primary/20 transition-colors">
                <Building2 className="h-6 w-6 text-admin-primary" />
              </div>
              <CardTitle>Client Management</CardTitle>
              <CardDescription>
                Manage client companies and their points of contact efficiently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Company registration details</li>
                <li>• Multiple address management</li>
                <li>• Client POC tracking</li>
                <li>• Sales PIC assignments</li>
                <li>• Project status monitoring</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">
            Access the admin panel to begin managing your organization's data.
          </p>
          <Link to="/admin">
            <Button variant="outline" size="lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
