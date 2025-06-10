
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  useAutoGenerationRules, 
  useCreateAutoRule, 
  useToggleAutoRule, 
  useDeleteAutoRule,
  CreateAutoRuleData 
} from "@/hooks/useAutoGenerationRules";
import { Trash2, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const autoRuleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  enabled: z.boolean(),
  triggerType: z.enum(["order_completed", "first_order", "order_amount"]),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().min(1),
  minimumOrderAmount: z.number().min(0).optional(),
  maximumDiscountAmount: z.number().min(0).optional(),
  validityDays: z.number().min(1).max(365),
  codePrefix: z.string().min(2).max(10),
  limitPerCustomer: z.number().min(1).optional(),
});

const AutoGenerationRules = () => {
  const { data: rules, isLoading } = useAutoGenerationRules();
  const createRule = useCreateAutoRule();
  const toggleRule = useToggleAutoRule();
  const deleteRule = useDeleteAutoRule();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAutoRuleData>({
    resolver: zodResolver(autoRuleSchema),
    defaultValues: {
      enabled: false,
      validityDays: 30,
      minimumOrderAmount: 0,
    },
  });

  const triggerType = watch("triggerType");
  const discountType = watch("discountType");

  const onSubmit = async (data: CreateAutoRuleData) => {
    await createRule.mutateAsync(data);
    reset();
  };

  const getTriggerDescription = (type: string) => {
    switch (type) {
      case "order_completed":
        return "Generate a discount code for every completed order";
      case "first_order":
        return "Generate a discount code only for first-time customers";
      case "order_amount":
        return "Generate a discount code when order exceeds minimum amount";
      default:
        return "";
    }
  };

  const handleToggle = (id: string, enabled: boolean) => {
    toggleRule.mutate({ id, enabled });
  };

  const handleDelete = (id: string) => {
    deleteRule.mutate(id);
  };

  if (isLoading) {
    return <div>Loading auto-generation rules...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Auto-Generation Rules</CardTitle>
          <CardDescription>
            Configure automatic discount code generation based on customer behavior.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!rules || rules.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No auto-generation rules configured yet.
            </p>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.enabled ? "default" : "secondary"}>
                        {rule.enabled ? "Active" : "Inactive"}
                      </Badge>
                      <span className="font-medium">{rule.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {rule.code_prefix}XXXX
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getTriggerDescription(rule.trigger_type)}
                    </p>
                    <p className="text-sm">
                      {rule.discount_type === "percentage" 
                        ? `${rule.discount_value}% off` 
                        : `${rule.discount_value / 100} RON off`}
                      {rule.validity_days && ` • Valid for ${rule.validity_days} days`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(checked) => handleToggle(rule.id, checked)}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Auto-Generation Rule</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{rule.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(rule.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configure New Rule</CardTitle>
          <CardDescription>
            Set up a new automatic discount code generation rule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rule Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., First Order Welcome"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Code Prefix */}
              <div className="space-y-2">
                <Label htmlFor="codePrefix">Code Prefix *</Label>
                <Input
                  id="codePrefix"
                  {...register("codePrefix")}
                  placeholder="RETURN"
                  className="uppercase"
                />
                <p className="text-xs text-muted-foreground">
                  Generated codes will be: {watch("codePrefix") || "PREFIX"}XXXX
                </p>
                {errors.codePrefix && (
                  <p className="text-sm text-destructive">{errors.codePrefix.message}</p>
                )}
              </div>

              {/* Trigger Type */}
              <div className="space-y-2">
                <Label htmlFor="triggerType">Trigger Event *</Label>
                <Select onValueChange={(value) => setValue("triggerType", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order_completed">Every Order Completed</SelectItem>
                    <SelectItem value="first_order">First Order Only</SelectItem>
                    <SelectItem value="order_amount">Minimum Order Amount</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {getTriggerDescription(triggerType)}
                </p>
                {errors.triggerType && (
                  <p className="text-sm text-destructive">{errors.triggerType.message}</p>
                )}
              </div>

              {/* Discount Type */}
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select onValueChange={(value) => setValue("discountType", value as any)}>
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

              {/* Validity Days */}
              <div className="space-y-2">
                <Label htmlFor="validityDays">Valid for (days) *</Label>
                <Input
                  id="validityDays"
                  type="number"
                  {...register("validityDays", { valueAsNumber: true })}
                  placeholder="30"
                />
                {errors.validityDays && (
                  <p className="text-sm text-destructive">{errors.validityDays.message}</p>
                )}
              </div>

              {/* Limit Per Customer */}
              <div className="space-y-2">
                <Label htmlFor="limitPerCustomer">Limit Per Customer</Label>
                <Input
                  id="limitPerCustomer"
                  type="number"
                  {...register("limitPerCustomer", { valueAsNumber: true })}
                  placeholder="1"
                />
              </div>

              {triggerType === "order_amount" && (
                <div className="space-y-2">
                  <Label htmlFor="minimumOrderAmount">Minimum Order Amount (RON)</Label>
                  <Input
                    id="minimumOrderAmount"
                    type="number"
                    step="0.01"
                    {...register("minimumOrderAmount", { valueAsNumber: true })}
                    placeholder="100.00"
                  />
                </div>
              )}

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
                </div>
              )}
            </div>

            <Separator />

            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                onCheckedChange={(checked) => setValue("enabled", checked)}
              />
              <Label htmlFor="enabled">Enable this rule</Label>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : "Save Auto-Generation Rule"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoGenerationRules;
