
import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";

const autoRuleSchema = z.object({
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

type AutoRuleFormData = z.infer<typeof autoRuleSchema>;

const AutoGenerationRules = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<AutoRuleFormData[]>([
    {
      enabled: false,
      triggerType: "order_completed",
      discountType: "percentage",
      discountValue: 10,
      validityDays: 30,
      codePrefix: "RETURN",
      limitPerCustomer: 1,
    },
  ]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AutoRuleFormData>({
    resolver: zodResolver(autoRuleSchema),
    defaultValues: rules[0],
  });

  const triggerType = watch("triggerType");
  const discountType = watch("discountType");

  const onSubmit = async (data: AutoRuleFormData) => {
    try {
      // Here you would save the rules to your backend
      console.log("Saving auto-generation rule:", data);
      
      toast({
        title: "Success",
        description: "Auto-generation rule saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save auto-generation rule",
        variant: "destructive",
      });
    }
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
          {rules.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No auto-generation rules configured yet.
            </p>
          ) : (
            <div className="space-y-4">
              {rules.map((rule, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.enabled ? "default" : "secondary"}>
                        {rule.enabled ? "Active" : "Inactive"}
                      </Badge>
                      <span className="font-medium">{rule.codePrefix}XXXX</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getTriggerDescription(rule.triggerType)}
                    </p>
                    <p className="text-sm">
                      {rule.discountType === "percentage" 
                        ? `${rule.discountValue}% off` 
                        : `${rule.discountValue} RON off`}
                      {rule.validityDays && ` • Valid for ${rule.validityDays} days`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(checked) => {
                        const updatedRules = [...rules];
                        updatedRules[index].enabled = checked;
                        setRules(updatedRules);
                      }}
                    />
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
