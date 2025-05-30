export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addons: {
        Row: {
          addon_key: string
          created_at: string | null
          description_key: string | null
          id: string
          is_active: boolean | null
          label_key: string
          price: number
          updated_at: string | null
        }
        Insert: {
          addon_key: string
          created_at?: string | null
          description_key?: string | null
          id?: string
          is_active?: boolean | null
          label_key: string
          price?: number
          updated_at?: string | null
        }
        Update: {
          addon_key?: string
          created_at?: string | null
          description_key?: string | null
          id?: string
          is_active?: boolean | null
          label_key?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_package_generations: {
        Row: {
          created_at: string
          generated_data: Json | null
          id: string
          input_delivery_time: string | null
          input_description: string
          input_price: number | null
          package_id: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          generated_data?: Json | null
          id?: string
          input_delivery_time?: string | null
          input_description: string
          input_price?: number | null
          package_id?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          generated_data?: Json | null
          id?: string
          input_delivery_time?: string | null
          input_description?: string
          input_price?: number | null
          package_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_package_generations_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "package_info"
            referencedColumns: ["id"]
          },
        ]
      }
      field_dependencies: {
        Row: {
          condition: Database["public"]["Enums"]["dependency_condition"]
          condition_value: string
          created_at: string | null
          depends_on_field: string
          field_id: string | null
          id: string
          is_active: boolean | null
        }
        Insert: {
          condition: Database["public"]["Enums"]["dependency_condition"]
          condition_value: string
          created_at?: string | null
          depends_on_field: string
          field_id?: string | null
          id?: string
          is_active?: boolean | null
        }
        Update: {
          condition?: Database["public"]["Enums"]["dependency_condition"]
          condition_value?: string
          created_at?: string | null
          depends_on_field?: string
          field_id?: string | null
          id?: string
          is_active?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "field_dependencies_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "step_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      field_validation: {
        Row: {
          created_at: string | null
          error_message_key: string | null
          field_id: string | null
          id: string
          is_active: boolean | null
          validation_type: Database["public"]["Enums"]["validation_rule_type"]
          validation_value: string | null
        }
        Insert: {
          created_at?: string | null
          error_message_key?: string | null
          field_id?: string | null
          id?: string
          is_active?: boolean | null
          validation_type: Database["public"]["Enums"]["validation_rule_type"]
          validation_value?: string | null
        }
        Update: {
          created_at?: string | null
          error_message_key?: string | null
          field_id?: string | null
          id?: string
          is_active?: boolean | null
          validation_type?: Database["public"]["Enums"]["validation_rule_type"]
          validation_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "field_validation_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "step_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          form_data: Json
          id: string
          package_id: string | null
          selected_addons: Json | null
          status: string | null
          total_price: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          form_data: Json
          id?: string
          package_id?: string | null
          selected_addons?: Json | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          form_data?: Json
          id?: string
          package_id?: string | null
          selected_addons?: Json | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "package_info"
            referencedColumns: ["id"]
          },
        ]
      }
      package_addons: {
        Row: {
          addon_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          package_id: string | null
        }
        Insert: {
          addon_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          package_id?: string | null
        }
        Update: {
          addon_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          package_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_addons_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "package_info"
            referencedColumns: ["id"]
          },
        ]
      }
      package_includes: {
        Row: {
          created_at: string | null
          id: string
          include_key: string
          include_order: number | null
          package_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          include_key: string
          include_order?: number | null
          package_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          include_key?: string
          include_order?: number | null
          package_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_includes_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "package_info"
            referencedColumns: ["id"]
          },
        ]
      }
      package_info: {
        Row: {
          created_at: string | null
          delivery_time_key: string | null
          description_key: string | null
          id: string
          is_active: boolean | null
          label_key: string
          price: number
          tagline_key: string | null
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          delivery_time_key?: string | null
          description_key?: string | null
          id?: string
          is_active?: boolean | null
          label_key: string
          price?: number
          tagline_key?: string | null
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          delivery_time_key?: string | null
          description_key?: string | null
          id?: string
          is_active?: boolean | null
          label_key?: string
          price?: number
          tagline_key?: string | null
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      package_tags: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          package_id: string | null
          styling_class: string | null
          tag_label_key: string | null
          tag_type: Database["public"]["Enums"]["package_tag_type"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          package_id?: string | null
          styling_class?: string | null
          tag_label_key?: string | null
          tag_type: Database["public"]["Enums"]["package_tag_type"]
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          package_id?: string | null
          styling_class?: string | null
          tag_label_key?: string | null
          tag_type?: Database["public"]["Enums"]["package_tag_type"]
        }
        Relationships: [
          {
            foreignKeyName: "package_tags_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "package_info"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      step_fields: {
        Row: {
          created_at: string | null
          field_name: string
          field_order: number | null
          field_type: Database["public"]["Enums"]["field_type"]
          id: string
          options: Json | null
          placeholder_key: string | null
          required: boolean | null
          step_id: string | null
        }
        Insert: {
          created_at?: string | null
          field_name: string
          field_order?: number | null
          field_type: Database["public"]["Enums"]["field_type"]
          id?: string
          options?: Json | null
          placeholder_key?: string | null
          required?: boolean | null
          step_id?: string | null
        }
        Update: {
          created_at?: string | null
          field_name?: string
          field_order?: number | null
          field_type?: Database["public"]["Enums"]["field_type"]
          id?: string
          options?: Json | null
          placeholder_key?: string | null
          required?: boolean | null
          step_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "step_fields_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "steps"
            referencedColumns: ["id"]
          },
        ]
      }
      steps: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          package_id: string | null
          step_number: number
          step_order: number | null
          title_key: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          package_id?: string | null
          step_number: number
          step_order?: number | null
          title_key: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          package_id?: string | null
          step_number?: number
          step_order?: number | null
          title_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "steps_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "package_info"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "editor" | "viewer"
      dependency_condition:
        | "equals"
        | "not_equals"
        | "contains"
        | "not_contains"
      field_type:
        | "text"
        | "email"
        | "tel"
        | "textarea"
        | "select"
        | "checkbox"
        | "checkbox-group"
        | "date"
        | "url"
        | "file"
        | "audio-recorder"
      package_tag_type: "popular" | "hot" | "discount" | "new" | "limited"
      validation_rule_type:
        | "required"
        | "min_length"
        | "max_length"
        | "pattern"
        | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "editor", "viewer"],
      dependency_condition: [
        "equals",
        "not_equals",
        "contains",
        "not_contains",
      ],
      field_type: [
        "text",
        "email",
        "tel",
        "textarea",
        "select",
        "checkbox",
        "checkbox-group",
        "date",
        "url",
        "file",
        "audio-recorder",
      ],
      package_tag_type: ["popular", "hot", "discount", "new", "limited"],
      validation_rule_type: [
        "required",
        "min_length",
        "max_length",
        "pattern",
        "custom",
      ],
    },
  },
} as const
