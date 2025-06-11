
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { useGiftCardDesigns, useDeleteGiftCardDesign, useUpdateGiftCardDesign } from "@/hooks/useGiftCards";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { TableCell } from "@/components/ui/table";
import GiftCardDesignForm from "./GiftCardDesignForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const GiftCardDesignsSection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [showInactive, setShowInactive] = useState(true);
  const { data: allDesigns = [], isLoading } = useGiftCardDesigns();
  const deleteDesignMutation = useDeleteGiftCardDesign();
  const updateDesignMutation = useUpdateGiftCardDesign();
  const { toast } = useToast();

  // Filter designs based on showInactive toggle
  const designs = showInactive ? allDesigns : allDesigns.filter(design => design.is_active);

  const handleEdit = (design: any) => {
    setEditingDesign(design);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingDesign(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (designId: string) => {
    try {
      await deleteDesignMutation.mutateAsync(designId);
    } catch (error) {
      console.error("Error deleting design:", error);
    }
  };

  const handleToggleStatus = async (design: any) => {
    try {
      await updateDesignMutation.mutateAsync({
        id: design.id,
        designData: { is_active: !design.is_active }
      });
      toast({
        title: design.is_active ? "Design Deactivated" : "Design Activated",
        description: `Design has been ${design.is_active ? "deactivated" : "activated"} successfully!`,
      });
    } catch (error) {
      console.error("Error toggling design status:", error);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingDesign(null);
  };

  const renderDesktopRow = (design: any, index: number) => (
    <>
      <TableCell>
        <div className="flex items-center gap-3">
          {design.preview_image_url ? (
            <img 
              src={design.preview_image_url} 
              alt={design.name}
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
          <div>
            <div className="font-medium">{design.name}</div>
            <div className="text-sm text-gray-500">{design.theme}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={design.is_active ? "default" : "secondary"}>
          {design.is_active ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-500">
          {new Date(design.created_at).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleToggleStatus(design)}
            disabled={updateDesignMutation.isPending}
          >
            {design.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEdit(design)}>
            <Edit className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Design</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to permanently delete "{design.name}"? 
                  <br /><br />
                  <strong>Note:</strong> If this design is being used by existing gift cards, deletion will fail. 
                  Consider deactivating the design instead if you want to prevent it from being used for new gift cards.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => handleDelete(design.id)}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleteDesignMutation.isPending}
                >
                  {deleteDesignMutation.isPending ? "Deleting..." : "Delete Permanently"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </>
  );

  const renderMobileCard = (design: any, index: number) => (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {design.preview_image_url ? (
          <img 
            src={design.preview_image_url} 
            alt={design.name}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-medium">{design.name}</h3>
          <p className="text-sm text-gray-500">{design.theme}</p>
          <Badge variant={design.is_active ? "default" : "secondary"} className="mt-1">
            {design.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Created: {new Date(design.created_at).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleToggleStatus(design)}
            disabled={updateDesignMutation.isPending}
          >
            {design.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEdit(design)}>
            <Edit className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Design</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to permanently delete "{design.name}"? 
                  <br /><br />
                  <strong>Note:</strong> If this design is being used by existing gift cards, deletion will fail. 
                  Consider deactivating the design instead if you want to prevent it from being used for new gift cards.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => handleDelete(design.id)}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleteDesignMutation.isPending}
                >
                  {deleteDesignMutation.isPending ? "Deleting..." : "Delete Permanently"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading designs...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Gift Card Designs</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Create and manage custom gift card designs
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInactive(!showInactive)}
                className="whitespace-nowrap"
              >
                {showInactive ? "Hide Inactive" : "Show All"}
              </Button>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAdd} className="whitespace-nowrap">
                    <Plus className="w-4 h-4 mr-2" />
                    New Design
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] max-h-[95vh] w-full overflow-hidden">
                  <DialogHeader className="pb-4 border-b flex-shrink-0">
                    <DialogTitle className="text-lg">
                      {editingDesign ? 'Edit Gift Card Design' : 'Create New Gift Card Design'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-auto">
                    <GiftCardDesignForm 
                      design={editingDesign}
                      onSuccess={handleFormSuccess}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Designs Table */}
      <Card>
        <CardContent className="p-0">
          <ResponsiveTable
            headers={["Design", "Status", "Created", "Actions"]}
            data={designs}
            renderRow={renderDesktopRow}
            renderMobileCard={renderMobileCard}
          />
          {designs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="mb-2">
                {showInactive ? "No gift card designs found." : "No active gift card designs found."}
              </div>
              <p className="text-sm">
                {designs.length === 0 && allDesigns.length === 0 
                  ? "Get started by creating your first design."
                  : "Try adjusting your filters or create a new design."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GiftCardDesignsSection;
