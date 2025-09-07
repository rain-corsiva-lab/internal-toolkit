import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, History, Save, X } from "lucide-react";
import { mockCostVersions, getActiveCostVersion } from "@/data/costingData";
import { CostItem, CostVersion as CostVersionType } from "@/types/costing";
import { getStaffById } from "@/data/mockData";

const CostVersion = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValueSGD, setEditValueSGD] = useState<number>(0);
  const [editValueMYR, setEditValueMYR] = useState<number>(0);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  
  const activeCostVersion = getActiveCostVersion();
  const perManhourCosts = activeCostVersion?.costItems.filter(item => item.type === 'per_manhour') || [];
  const fixedCosts = activeCostVersion?.costItems.filter(item => item.type === 'fixed') || [];

  const handleEditClick = (item: CostItem) => {
    setEditingId(item.id);
    setEditValueSGD(item.costSGD);
    setEditValueMYR(item.costMYR);
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    setEditingId(null);
    setEditValueSGD(0);
    setEditValueMYR(0);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValueSGD(0);
    setEditValueMYR(0);
  };

  const CostItemRow = ({ item }: { item: CostItem }) => (
    <TableRow key={item.id}>
      <TableCell className="font-medium">{item.description}</TableCell>
      <TableCell>
        {editingId === item.id ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-xs">SGD</Label>
              <Input
                type="number"
                value={editValueSGD}
                onChange={(e) => setEditValueSGD(Number(e.target.value))}
                className="w-20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs">MYR</Label>
              <Input
                type="number"
                value={editValueMYR}
                onChange={(e) => setEditValueMYR(Number(e.target.value))}
                className="w-20"
              />
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="space-y-1">
              <div className="text-sm">SGD ${item.costSGD}</div>
              <div className="text-sm">MYR ${item.costMYR}</div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => handleEditClick(item)}>
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cost Version Management</h1>
          <p className="text-muted-foreground">
            Manage cost descriptions and corresponding costs
          </p>
        </div>
        <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <History className="h-4 w-4 mr-2" />
              View History
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Cost Version History</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {mockCostVersions.map((version) => (
                <Card key={version.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{version.version}</CardTitle>
                      <div className="flex items-center gap-2">
                        {version.isActive && <Badge variant="default">Active</Badge>}
                        <span className="text-sm text-muted-foreground">
                          Created by {getStaffById(version.createdBy)?.fullName} on{" "}
                          {new Date(version.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Per Manhour Costs</h4>
                        {version.costItems.filter(item => item.type === 'per_manhour').map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.description}</span>
                            <div>
                              <div>SGD ${item.costSGD}</div>
                              <div>MYR ${item.costMYR}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Fixed Costs</h4>
                        {version.costItems.filter(item => item.type === 'fixed').map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.description}</span>
                            <div>
                              <div>SGD ${item.costSGD}</div>
                              <div>MYR ${item.costMYR}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Per Manhour Costs */}
        <Card>
          <CardHeader>
            <CardTitle>Per Manhour Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Cost per Hour</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {perManhourCosts.map((item) => (
                  <CostItemRow key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Fixed Costs */}
        <Card>
          <CardHeader>
            <CardTitle>Fixed Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Fixed Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixedCosts.map((item) => (
                  <CostItemRow key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CostVersion;