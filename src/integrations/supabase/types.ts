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
      campaign_metrics: {
        Row: {
          bounces: number | null
          campaign_id: string
          clicks: number | null
          created_at: string
          delivered: number | null
          hard_bounces: number | null
          id: string
          last_updated: string | null
          opens: number | null
          soft_bounces: number | null
          spam_reports: number | null
          unsubscribes: number | null
        }
        Insert: {
          bounces?: number | null
          campaign_id: string
          clicks?: number | null
          created_at?: string
          delivered?: number | null
          hard_bounces?: number | null
          id?: string
          last_updated?: string | null
          opens?: number | null
          soft_bounces?: number | null
          spam_reports?: number | null
          unsubscribes?: number | null
        }
        Update: {
          bounces?: number | null
          campaign_id?: string
          clicks?: number | null
          created_at?: string
          delivered?: number | null
          hard_bounces?: number | null
          id?: string
          last_updated?: string | null
          opens?: number | null
          soft_bounces?: number | null
          spam_reports?: number | null
          unsubscribes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_recipient_activity: {
        Row: {
          action_timestamp: string | null
          action_type: string
          bounce_reason: string | null
          campaign_id: string
          created_at: string
          email: string
          id: string
          ip_address: string | null
          link_url: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          action_timestamp?: string | null
          action_type: string
          bounce_reason?: string | null
          campaign_id: string
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          link_url?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          action_timestamp?: string | null
          action_type?: string
          bounce_reason?: string | null
          campaign_id?: string
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          link_url?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_recipient_activity_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          brevo_campaign_id: string | null
          content: string | null
          created_at: string
          created_by: string | null
          html_content: string | null
          id: string
          name: string
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          target_list_ids: Json | null
          updated_at: string
        }
        Insert: {
          brevo_campaign_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          html_content?: string | null
          id?: string
          name: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          target_list_ids?: Json | null
          updated_at?: string
        }
        Update: {
          brevo_campaign_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          html_content?: string | null
          id?: string
          name?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          target_list_ids?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      discount_auto_rules: {
        Row: {
          code_prefix: string
          created_at: string
          created_by: string | null
          discount_type: string
          discount_value: number
          enabled: boolean
          id: string
          limit_per_customer: number | null
          maximum_discount_amount: number | null
          minimum_order_amount: number | null
          name: string
          trigger_type: string
          updated_at: string
          validity_days: number
        }
        Insert: {
          code_prefix: string
          created_at?: string
          created_by?: string | null
          discount_type: string
          discount_value: number
          enabled?: boolean
          id?: string
          limit_per_customer?: number | null
          maximum_discount_amount?: number | null
          minimum_order_amount?: number | null
          name: string
          trigger_type: string
          updated_at?: string
          validity_days: number
        }
        Update: {
          code_prefix?: string
          created_at?: string
          created_by?: string | null
          discount_type?: string
          discount_value?: number
          enabled?: boolean
          id?: string
          limit_per_customer?: number | null
          maximum_discount_amount?: number | null
          minimum_order_amount?: number | null
          name?: string
          trigger_type?: string
          updated_at?: string
          validity_days?: number
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          maximum_discount_amount: number | null
          minimum_order_amount: number | null
          updated_at: string
          usage_limit: number | null
          used_count: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          maximum_discount_amount?: number | null
          minimum_order_amount?: number | null
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          maximum_discount_amount?: number | null
          minimum_order_amount?: number | null
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Relationships: []
      }
      email_accounts: {
        Row: {
          available_folders: Json | null
          created_at: string
          email_address: string
          encrypted_password: string
          id: string
          imap_port: number
          imap_server: string
          is_active: boolean
          last_sync_at: string | null
          smtp_port: number | null
          smtp_security: string | null
          smtp_server: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          available_folders?: Json | null
          created_at?: string
          email_address: string
          encrypted_password: string
          id?: string
          imap_port?: number
          imap_server?: string
          is_active?: boolean
          last_sync_at?: string | null
          smtp_port?: number | null
          smtp_security?: string | null
          smtp_server?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          available_folders?: Json | null
          created_at?: string
          email_address?: string
          encrypted_password?: string
          id?: string
          imap_port?: number
          imap_server?: string
          is_active?: boolean
          last_sync_at?: string | null
          smtp_port?: number | null
          smtp_security?: string | null
          smtp_server?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_attachments: {
        Row: {
          attachment_data: string | null
          content_type: string
          created_at: string
          filename: string
          id: string
          message_id: string
          size_bytes: number
        }
        Insert: {
          attachment_data?: string | null
          content_type: string
          created_at?: string
          filename: string
          id?: string
          message_id: string
          size_bytes: number
        }
        Update: {
          attachment_data?: string | null
          content_type?: string
          created_at?: string
          filename?: string
          id?: string
          message_id?: string
          size_bytes?: number
        }
        Relationships: [
          {
            foreignKeyName: "email_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "email_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      email_drafts: {
        Row: {
          account_id: string
          attachments: Json | null
          auto_saved_at: string | null
          bcc_emails: string[] | null
          body_html: string | null
          body_plain: string | null
          cc_emails: string[] | null
          created_at: string
          id: string
          is_template: boolean | null
          subject: string
          template_name: string | null
          to_emails: string[]
          updated_at: string
        }
        Insert: {
          account_id: string
          attachments?: Json | null
          auto_saved_at?: string | null
          bcc_emails?: string[] | null
          body_html?: string | null
          body_plain?: string | null
          cc_emails?: string[] | null
          created_at?: string
          id?: string
          is_template?: boolean | null
          subject?: string
          template_name?: string | null
          to_emails: string[]
          updated_at?: string
        }
        Update: {
          account_id?: string
          attachments?: Json | null
          auto_saved_at?: string | null
          bcc_emails?: string[] | null
          body_html?: string | null
          body_plain?: string | null
          cc_emails?: string[] | null
          created_at?: string
          id?: string
          is_template?: boolean | null
          subject?: string
          template_name?: string | null
          to_emails?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_drafts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_messages: {
        Row: {
          account_id: string
          body_preview: string | null
          created_at: string
          folder: string
          full_body: string | null
          has_attachments: boolean
          id: string
          is_read: boolean
          message_id: string
          raw_headers: Json | null
          received_date: string
          sender_email: string
          sender_name: string | null
          subject: string
        }
        Insert: {
          account_id: string
          body_preview?: string | null
          created_at?: string
          folder?: string
          full_body?: string | null
          has_attachments?: boolean
          id?: string
          is_read?: boolean
          message_id: string
          raw_headers?: Json | null
          received_date: string
          sender_email: string
          sender_name?: string | null
          subject: string
        }
        Update: {
          account_id?: string
          body_preview?: string | null
          created_at?: string
          folder?: string
          full_body?: string | null
          has_attachments?: boolean
          id?: string
          is_read?: boolean
          message_id?: string
          raw_headers?: Json | null
          received_date?: string
          sender_email?: string
          sender_name?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_messages_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_card_designs: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          preview_image_url: string | null
          template_data: Json | null
          theme: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          preview_image_url?: string | null
          template_data?: Json | null
          theme: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          preview_image_url?: string | null
          template_data?: Json | null
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      gift_cards: {
        Row: {
          amount_eur: number | null
          amount_ron: number | null
          audio_message_url: string | null
          code: string
          created_at: string
          currency: string | null
          delivery_date: string | null
          design_id: string | null
          expires_at: string | null
          gift_amount: number | null
          id: string
          message_text: string | null
          package_type: string | null
          payment_status: string | null
          recipient_email: string
          recipient_name: string
          sender_email: string
          sender_name: string
          sender_user_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          amount_eur?: number | null
          amount_ron?: number | null
          audio_message_url?: string | null
          code: string
          created_at?: string
          currency?: string | null
          delivery_date?: string | null
          design_id?: string | null
          expires_at?: string | null
          gift_amount?: number | null
          id?: string
          message_text?: string | null
          package_type?: string | null
          payment_status?: string | null
          recipient_email: string
          recipient_name: string
          sender_email: string
          sender_name: string
          sender_user_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount_eur?: number | null
          amount_ron?: number | null
          audio_message_url?: string | null
          code?: string
          created_at?: string
          currency?: string | null
          delivery_date?: string | null
          design_id?: string | null
          expires_at?: string | null
          gift_amount?: number | null
          id?: string
          message_text?: string | null
          package_type?: string | null
          payment_status?: string | null
          recipient_email?: string
          recipient_name?: string
          sender_email?: string
          sender_name?: string
          sender_user_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_cards_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "gift_card_designs"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_redemptions: {
        Row: {
          created_at: string
          gift_card_id: string
          id: string
          order_id: string | null
          redeemed_amount: number
          redemption_date: string
          remaining_balance: number
        }
        Insert: {
          created_at?: string
          gift_card_id: string
          id?: string
          order_id?: string | null
          redeemed_amount: number
          redemption_date?: string
          remaining_balance: number
        }
        Update: {
          created_at?: string
          gift_card_id?: string
          id?: string
          order_id?: string | null
          redeemed_amount?: number
          redemption_date?: string
          remaining_balance?: number
        }
        Relationships: [
          {
            foreignKeyName: "gift_redemptions_gift_card_id_fkey"
            columns: ["gift_card_id"]
            isOneToOne: false
            referencedRelation: "gift_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_redemptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          brevo_contact_id: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string | null
          source: string | null
          subscribed_at: string
          unsubscribe_token: string
          updated_at: string
        }
        Insert: {
          brevo_contact_id?: string | null
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribe_token?: string
          updated_at?: string
        }
        Update: {
          brevo_contact_id?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribe_token?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          currency: string
          discount_amount: number | null
          discount_code: string | null
          form_data: Json
          gift_card_id: string | null
          gift_credit_applied: number | null
          id: string
          invoice_conversion_requested_at: string | null
          invoice_conversion_source: string | null
          is_gift_redemption: boolean | null
          last_status_check_at: string | null
          package_delivery_time: string | null
          package_id: string | null
          package_includes: Json | null
          package_name: string | null
          package_price: number | null
          package_value: string | null
          payment_id: string | null
          payment_provider: string | null
          payment_status: string | null
          payment_url: string | null
          revolut_order_id: string | null
          revolut_payment_id: string | null
          selected_addons: Json | null
          session_expires_at: string | null
          smartbill_invoice_data: Json | null
          smartbill_invoice_error: string | null
          smartbill_invoice_id: string | null
          smartbill_payment_status: string | null
          smartbill_payment_url: string | null
          smartbill_proforma_data: Json | null
          smartbill_proforma_error: string | null
          smartbill_proforma_id: string | null
          smartbill_proforma_status: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total_price: number | null
          updated_at: string | null
          user_id: string | null
          webhook_processed_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string
          discount_amount?: number | null
          discount_code?: string | null
          form_data: Json
          gift_card_id?: string | null
          gift_credit_applied?: number | null
          id?: string
          invoice_conversion_requested_at?: string | null
          invoice_conversion_source?: string | null
          is_gift_redemption?: boolean | null
          last_status_check_at?: string | null
          package_delivery_time?: string | null
          package_id?: string | null
          package_includes?: Json | null
          package_name?: string | null
          package_price?: number | null
          package_value?: string | null
          payment_id?: string | null
          payment_provider?: string | null
          payment_status?: string | null
          payment_url?: string | null
          revolut_order_id?: string | null
          revolut_payment_id?: string | null
          selected_addons?: Json | null
          session_expires_at?: string | null
          smartbill_invoice_data?: Json | null
          smartbill_invoice_error?: string | null
          smartbill_invoice_id?: string | null
          smartbill_payment_status?: string | null
          smartbill_payment_url?: string | null
          smartbill_proforma_data?: Json | null
          smartbill_proforma_error?: string | null
          smartbill_proforma_id?: string | null
          smartbill_proforma_status?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id?: string | null
          webhook_processed_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string
          discount_amount?: number | null
          discount_code?: string | null
          form_data?: Json
          gift_card_id?: string | null
          gift_credit_applied?: number | null
          id?: string
          invoice_conversion_requested_at?: string | null
          invoice_conversion_source?: string | null
          is_gift_redemption?: boolean | null
          last_status_check_at?: string | null
          package_delivery_time?: string | null
          package_id?: string | null
          package_includes?: Json | null
          package_name?: string | null
          package_price?: number | null
          package_value?: string | null
          payment_id?: string | null
          payment_provider?: string | null
          payment_status?: string | null
          payment_url?: string | null
          revolut_order_id?: string | null
          revolut_payment_id?: string | null
          selected_addons?: Json | null
          session_expires_at?: string | null
          smartbill_invoice_data?: Json | null
          smartbill_invoice_error?: string | null
          smartbill_invoice_id?: string | null
          smartbill_payment_status?: string | null
          smartbill_payment_url?: string | null
          smartbill_proforma_data?: Json | null
          smartbill_proforma_error?: string | null
          smartbill_proforma_id?: string | null
          smartbill_proforma_status?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id?: string | null
          webhook_processed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_gift_card_id_fkey"
            columns: ["gift_card_id"]
            isOneToOne: false
            referencedRelation: "gift_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_providers: {
        Row: {
          config: Json | null
          created_at: string | null
          display_name: string
          id: string
          is_enabled: boolean | null
          logo_url: string | null
          provider_name: string
          supported_currencies: string[] | null
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          display_name: string
          id?: string
          is_enabled?: boolean | null
          logo_url?: string | null
          provider_name: string
          supported_currencies?: string[] | null
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          display_name?: string
          id?: string
          is_enabled?: boolean | null
          logo_url?: string | null
          provider_name?: string
          supported_currencies?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
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
      sent_emails: {
        Row: {
          account_id: string
          bcc_emails: string[] | null
          body_html: string | null
          body_plain: string | null
          cc_emails: string[] | null
          created_at: string
          delivery_status: string | null
          draft_id: string | null
          error_message: string | null
          id: string
          message_id: string
          sent_at: string
          subject: string
          to_emails: string[]
        }
        Insert: {
          account_id: string
          bcc_emails?: string[] | null
          body_html?: string | null
          body_plain?: string | null
          cc_emails?: string[] | null
          created_at?: string
          delivery_status?: string | null
          draft_id?: string | null
          error_message?: string | null
          id?: string
          message_id: string
          sent_at?: string
          subject: string
          to_emails: string[]
        }
        Update: {
          account_id?: string
          bcc_emails?: string[] | null
          body_html?: string | null
          body_plain?: string | null
          cc_emails?: string[] | null
          created_at?: string
          delivery_status?: string | null
          draft_id?: string | null
          error_message?: string | null
          id?: string
          message_id?: string
          sent_at?: string
          subject?: string
          to_emails?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "sent_emails_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sent_emails_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "email_drafts"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_events: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_id: string
          event_type: string
          id: string
          order_id: string | null
          payload: Json | null
          processed_at: string | null
          processing_status: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_id: string
          event_type: string
          id?: string
          order_id?: string | null
          payload?: Json | null
          processed_at?: string | null
          processing_status?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_id?: string
          event_type?: string
          id?: string
          order_id?: string | null
          payload?: Json | null
          processed_at?: string | null
          processing_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_webhook_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      suno_prompts: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_optimized: boolean
          language: string
          lyrics: string
          order_id: string
          prompt: string
          technical_tags: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_optimized?: boolean
          language?: string
          lyrics: string
          order_id: string
          prompt: string
          technical_tags: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_optimized?: boolean
          language?: string
          lyrics?: string
          order_id?: string
          prompt?: string
          technical_tags?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved: boolean | null
          context: string | null
          created_at: string | null
          display_order: number | null
          id: string
          location: string | null
          name: string
          stars: number | null
          text: string | null
          updated_at: string | null
          video_url: string | null
          youtube_link: string | null
        }
        Insert: {
          approved?: boolean | null
          context?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          location?: string | null
          name: string
          stars?: number | null
          text?: string | null
          updated_at?: string | null
          video_url?: string | null
          youtube_link?: string | null
        }
        Update: {
          approved?: boolean | null
          context?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          location?: string | null
          name?: string
          stars?: number | null
          text?: string | null
          updated_at?: string | null
          video_url?: string | null
          youtube_link?: string | null
        }
        Relationships: []
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
      generate_gift_card_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_gift_card_balance: {
        Args: { card_id: string }
        Returns: number
      }
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
      validate_discount_code: {
        Args: { code_input: string; order_total: number }
        Returns: {
          is_valid: boolean
          discount_amount: number
          discount_type: string
          error_message: string
        }[]
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
