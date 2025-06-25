
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TestTube } from "lucide-react";
import OGTester from "../OGTester";

const OGTestButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Only show in development or for testing
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="fixed bottom-4 right-4 z-50">
          <TestTube className="w-4 h-4 mr-2" />
          Test OG
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Open Graph Testing</DialogTitle>
        </DialogHeader>
        <OGTester />
      </DialogContent>
    </Dialog>
  );
};

export default OGTestButton;
