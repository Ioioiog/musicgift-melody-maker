
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateDiscountCode } from "@/hooks/useDiscountCodes";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const discountCodeSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(50),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().min(1, "Discount value must be greater than 0"),
  minimumOrderAmount: z.number().min(0).optional(),
  maximumDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().min(1).optional(),
  expiresAt: z.date().optional(),
  isActive: z.boolean().default(true),
});

type DiscountCodeFormData = z.infer<typeof discountCodeSchema>;

const DiscountCodeForm = () => {
  const { toast } = useToast();
  const createCode = useCreateDiscountCode();
  const [expiryDate, setExpiryDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DiscountCodeFormData>({
    resolver: zodResolver(discountCodeSchema),
    defaultValues: {
      isActive: true,
      minimumOrderAmount: 0,
    },
  });

  const discountType = watch("discountType");

  const generateRandomCode = () => {
    const prefix = "DISC";
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `${prefix}${randomPart}`;
    setValue("code", code);
  };

  const onSubmit = async (data: DiscountCodeFormData) => {
    try {
      await createCode.mutateAsync({
        ...data,
        discountValue: discountType === "percentage" ? data.discountValue : Math.round(data.discountValue * 100),
        minimumOrderAmount: data.minimumOrderAmount ? Math.round(data.minimumOrderAmount * 100) : 0,
        maximumDiscountAmount: data.maximumDiscountAmount ? Math.round(data.maximumDiscountAmount * 100) : undefined,
        expiresAt: expiryDate?.toISOString(),
      });

      toast({
        title: "Success",
        description: "Discount code created successfully",
      });

      reset();
      setExpiryDate(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create discount code",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Code */}
        <div className="space-y-2">
          <Label htmlFor="code">Discount Code *</Label>
          <div className="flex gap-2">
            <Input
              id="code"
              {...register("code")}
              placeholder="Enter discount code"
            />
            <Button
              type="button"
              variant="outline"
              onClick={generateRandomCode}
            >
              Generate
            </Button>
          </div>
          {errors.code && (
            <p className="text-sm text-destructive">{errors.code.message}</p>
          )}
        </div>

        {/* Discount Type */}
        <div className="space-y-2">
          <Label htmlFor="discountType">Discount Type *</Label>
          <Select onValueChange={(value) => setValue("discountType", value as "percentage" | "fixed")}>
            <SelectTrigger>
              <SelectValue placeholder="Select discount type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
          {errors.discountType && (
            <p className="text-sm text-destructive">{errors.discountType.message}</p>
          )}
        </div>

        {/* Discount Value */}
        <div className="space-y-2">
          <Label htmlFor="discountValue">
            Discount Value * {discountType === "percentage" ? "(%)" : "(RON)"}
          </Label>
          <Input
            id="discountValue"
            type="number"
            step={discountType === "percentage" ? "1" : "0.01"}
            {...register("discountValue", { valueAsNumber: true })}
            placeholder={discountType === "percentage" ? "10" : "50.00"}
          />
          {errors.discountValue && (
            <p className="text-sm text-destructive">{errors.discountValue.message}</p>
          )}
        </div>

        {/* Minimum Order Amount */}
        <div className="space-y-2">
          <Label htmlFor="minimumOrderAmount">Minimum Order Amount (RON)</Label>
          <Input
            id="minimumOrderAmount"
            type="number"
            step="0.01"
            {...register("minimumOrderAmount", { valueAsNumber: true })}
            placeholder="0.00"
          />
          {errors.minimumOrderAmount && (
            <p className="text-sm text-destructive">{errors.minimumOrderAmount.message}</p>
          )}
        </div>

        {/* Maximum Discount Amount */}
        {discountType === "percentage" && (
          <div className="space-y-2">
            <Label htmlFor="maximumDiscountAmount">Maximum Discount Amount (RON)</Label>
            <Input
              id="maximumDiscountAmount"
              type="number"
              step="0.01"
              {...register("maximumDiscountAmount", { valueAsNumber: true })}
              placeholder="100.00"
            />
            {errors.maximumDiscountAmount && (
              <p className="text-sm text-destructive">{errors.maximumDiscountAmount.message}</p>
            )}
          </div>
        )}

        {/* Usage Limit */}
        <div className="space-y-2">
          <Label htmlFor="usageLimit">Usage Limit</Label>
          <Input
            id="usageLimit"
            type="number"
            {...register("usageLimit", { valueAsNumber: true })}
            placeholder="Leave empty for unlimited"
          />
          {errors.usageLimit && (
            <p className="text-sm text-destructive">{errors.usageLimit.message}</p>
          )}
        </div>

        {/* Expiry Date */}
        <div className="space-y-2">
          <Label>Expiry Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expiryDate ? format(expiryDate, "PPP") : "No expiry date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={expiryDate}
                onSelect={setExpiryDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          onCheckedChange={(checked) => setValue("isActive", checked)}
          defaultChecked={true}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating..." : "Create Discount Code"}
      </Button>
    </form>
  );
};

export default DiscountCodeForm;
