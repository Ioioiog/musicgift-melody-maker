
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Sparkles, Palette } from "lucide-react";
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
              {designs.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInactive(!showInactive)}
                  className="whitespace-nowrap"
                >
                  {showInactive ? "Hide Inactive" : "Show All"}
                </Button>
              )}
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

      {/* Designs Table or Empty State */}
      {designs.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <ResponsiveTable
              headers={["Design", "Status", "Created", "Actions"]}
              data={designs}
              renderRow={renderDesktopRow}
              renderMobileCard={renderMobileCard}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-blue-50 p-6 mb-4">
              <Palette className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Gift Card Designs Yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Create your first gift card design using our intuitive canvas editor. 
              Add text, shapes, and placeholders to build beautiful gift cards.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAdd} className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Create Your First Design
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] max-h-[95vh] w-full overflow-hidden">
                  <DialogHeader className="pb-4 border-b flex-shrink-0">
                    <DialogTitle className="text-lg">
                      Create New Gift Card Design
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-auto">
                    <GiftCardDesignForm 
                      design={null}
                      onSuccess={handleFormSuccess}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-6 text-sm text-gray-400">
              <p>💡 Use placeholders like "Recipient Name" and "Gift Amount" to make your designs dynamic</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GiftCardDesignsSection;
