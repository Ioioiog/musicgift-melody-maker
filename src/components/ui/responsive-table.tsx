
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveTableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
  renderMobileCard: (item: any, index: number) => React.ReactNode;
  className?: string;
}

export function ResponsiveTable({ 
  headers, 
  data, 
  renderRow, 
  renderMobileCard, 
  className = "" 
}: ResponsiveTableProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={`space-y-3 ${className}`}>
        {data.map((item, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-4">
              {renderMobileCard(item, index)}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {renderRow(item, index)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
