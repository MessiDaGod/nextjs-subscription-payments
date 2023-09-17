export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bankxref: {
        Row: {
          account_code: string | null
          bank_code: string | null
          id: number
          property_code: string | null
          ref_property_id: string | null
          userid: string
        }
        Insert: {
          account_code?: string | null
          bank_code?: string | null
          id?: number
          property_code?: string | null
          ref_property_id?: string | null
          userid: string
        }
        Update: {
          account_code?: string | null
          bank_code?: string | null
          id?: number
          property_code?: string | null
          ref_property_id?: string | null
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "bankxref_userid_fkey"
            columns: ["userid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      chargecodes: {
        Row: {
          account: string | null
          accountdesc: string | null
          chargecodeid: string | null
          code: string | null
          description: string | null
          id: number
          segment0: string | null
          segment1: string | null
          segment10: string | null
          segment11: string | null
          segment2: string | null
          segment3: string | null
          segment4: string | null
          segment5: string | null
          segment6: string | null
          segment7: string | null
          segment8: string | null
          segment9: string | null
          tax: string | null
          type: string | null
        }
        Insert: {
          account?: string | null
          accountdesc?: string | null
          chargecodeid?: string | null
          code?: string | null
          description?: string | null
          id: number
          segment0?: string | null
          segment1?: string | null
          segment10?: string | null
          segment11?: string | null
          segment2?: string | null
          segment3?: string | null
          segment4?: string | null
          segment5?: string | null
          segment6?: string | null
          segment7?: string | null
          segment8?: string | null
          segment9?: string | null
          tax?: string | null
          type?: string | null
        }
        Update: {
          account?: string | null
          accountdesc?: string | null
          chargecodeid?: string | null
          code?: string | null
          description?: string | null
          id?: number
          segment0?: string | null
          segment1?: string | null
          segment10?: string | null
          segment11?: string | null
          segment2?: string | null
          segment3?: string | null
          segment4?: string | null
          segment5?: string | null
          segment6?: string | null
          segment7?: string | null
          segment8?: string | null
          segment9?: string | null
          tax?: string | null
          type?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          active: boolean
          dbtype: string | null
          id: number
          name: string
          type: string
          userid: string
        }
        Insert: {
          active: boolean
          dbtype?: string | null
          id?: number
          name: string
          type: string
          userid: string
        }
        Update: {
          active?: boolean
          dbtype?: string | null
          id?: number
          name?: string
          type?: string
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_userid_fkey"
            columns: ["userid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      commchargeschedules: {
        Row: {
          additional_fee: string | null
          amendment_sequence: string | null
          amendment_type: string | null
          amount: number | null
          amount_period: string | null
          arbitrator_referred_by: string | null
          area_column_overide: string | null
          base_month: string | null
          bill_apr: string | null
          bill_aug: string | null
          bill_day: string | null
          bill_dec: string | null
          bill_feb: string | null
          bill_in_arrears: string | null
          bill_jan: string | null
          bill_jul: string | null
          bill_jun: string | null
          bill_mar: string | null
          bill_may: string | null
          bill_nov: string | null
          bill_oct: string | null
          bill_sep: string | null
          charge_code: string | null
          charge_on_unpaid: string | null
          check_annually: string | null
          cpi_breakpoint_1: string | null
          cpi_breakpoint_2: string | null
          cpi_breakpoint_3: string | null
          cpi_breakpoint_4: string | null
          cpi_breakpoint_5: string | null
          cpi_cpi_2_ratio_percentage: string | null
          cpi_increase_factor: string | null
          cpi_increase_type: string | null
          cpi_index_step_1_percent: string | null
          cpi_index_step_2_percent: string | null
          cpi_index_step_3_percent: string | null
          cpi_index_step_4_percent: string | null
          cpi_index_step_5_percent: string | null
          cpi_index1_code: string | null
          cpi_index2_code: string | null
          cpi_max_percent: string | null
          cpi_min_percent: string | null
          currency: string | null
          date_last_billed: string | null
          days_due: string | null
          days_due_after_method: string | null
          days_in_year: string | null
          decrease_possible: string | null
          description: string | null
          do_not_bill: string | null
          do_not_bill_before: string | null
          earliest_notice_date: string | null
          eft: string | null
          estimate_type: string | null
          estimated_rent: string | null
          ext_schedule_id: string | null
          fixed_percent: string | null
          gl_segment_1: string | null
          gl_segment_2: string | null
          gl_segment_3: string | null
          gl_segment_4: string | null
          id: number
          increase_as_point: string | null
          index_date: string | null
          index_interval: string | null
          index_method: string | null
          index_month: string | null
          invoice_frequency: string | null
          invoice_is_leasecurrency: string | null
          last_day_of_period: string | null
          late_fee_grace_period: string | null
          late_fee_interest_free_period: string | null
          latefeeadjustment: string | null
          latefeecalculationbasis: string | null
          latefeecalculationtype: string | null
          latefeefactor: string | null
          latefeeinterestindex_code: string | null
          latefeemaxpercentage: string | null
          latefeemaxthreshold: string | null
          latefeeminpercentage: string | null
          latefeeminthreshold: string | null
          latefeepercentage: string | null
          latest_notice_date: string | null
          lease_code: string | null
          li_charge_code: string | null
          li_correction_percentage: string | null
          market_rent: string | null
          market_review_notes: string | null
          max_days_to_appoint_valuer: string | null
          max_days_to_deliver_valuation: string | null
          max_days_to_dispute: string | null
          max_days_to_negotiate_new_rent: string | null
          max_increase_type: string | null
          max_increase_value: string | null
          method_of_payment: string | null
          mgmt_fee_code: string | null
          mgmt_fee_percentage: string | null
          min_decrease_amount: string | null
          min_increase_type: string | null
          min_increase_value: string | null
          next_increase_date_after: string | null
          next_increase_interval: string | null
          ninety_day_due_date: string | null
          notes: string | null
          notice_served_date: string | null
          number_of_months_before_index_month: string | null
          parent_amendment_sequence: string | null
          parent_amendment_type: string | null
          payment_schedule: string | null
          price: string | null
          print_invoice_on_change: string | null
          property_code: string | null
          proposal_type: string | null
          proration_method: string | null
          quantity: string | null
          rate_provider: string | null
          rate_type: string | null
          ref_lease_id: string | null
          ref_property_id: string | null
          rent_increase_end_date: string | null
          rent_increase_start_date: string | null
          rent_increase_type: string | null
          rent_increase_value: string | null
          review_type: string | null
          rounding: string | null
          sales_tax_code: string | null
          sales_tax_percentage: string | null
          sales_tran_type: string | null
          scandinavian_indexation: string | null
          schedule_from_date: string | null
          schedule_to_date: string | null
          set_invoice_date_to_due_date: string | null
          settlement_date: string | null
          settlement_rent: string | null
          step_indexation: string | null
          subject_to_late_fee: string | null
          suppress_paper_invoice: string | null
          taxpoint_day: string | null
          third_party: string | null
          unit_code: string | null
          userdefined_1: string | null
          userdefined_10: string | null
          userdefined_11: string | null
          userdefined_12: string | null
          userdefined_13: string | null
          userdefined_14: string | null
          userdefined_15: string | null
          userdefined_16: string | null
          userdefined_17: string | null
          userdefined_18: string | null
          userdefined_19: string | null
          userdefined_2: string | null
          userdefined_20: string | null
          userdefined_3: string | null
          userdefined_4: string | null
          userdefined_5: string | null
          userdefined_6: string | null
          userdefined_7: string | null
          userdefined_8: string | null
          userdefined_9: string | null
          vat_currency_is_local: string | null
          who_initiates: string | null
        }
        Insert: {
          additional_fee?: string | null
          amendment_sequence?: string | null
          amendment_type?: string | null
          amount?: number | null
          amount_period?: string | null
          arbitrator_referred_by?: string | null
          area_column_overide?: string | null
          base_month?: string | null
          bill_apr?: string | null
          bill_aug?: string | null
          bill_day?: string | null
          bill_dec?: string | null
          bill_feb?: string | null
          bill_in_arrears?: string | null
          bill_jan?: string | null
          bill_jul?: string | null
          bill_jun?: string | null
          bill_mar?: string | null
          bill_may?: string | null
          bill_nov?: string | null
          bill_oct?: string | null
          bill_sep?: string | null
          charge_code?: string | null
          charge_on_unpaid?: string | null
          check_annually?: string | null
          cpi_breakpoint_1?: string | null
          cpi_breakpoint_2?: string | null
          cpi_breakpoint_3?: string | null
          cpi_breakpoint_4?: string | null
          cpi_breakpoint_5?: string | null
          cpi_cpi_2_ratio_percentage?: string | null
          cpi_increase_factor?: string | null
          cpi_increase_type?: string | null
          cpi_index_step_1_percent?: string | null
          cpi_index_step_2_percent?: string | null
          cpi_index_step_3_percent?: string | null
          cpi_index_step_4_percent?: string | null
          cpi_index_step_5_percent?: string | null
          cpi_index1_code?: string | null
          cpi_index2_code?: string | null
          cpi_max_percent?: string | null
          cpi_min_percent?: string | null
          currency?: string | null
          date_last_billed?: string | null
          days_due?: string | null
          days_due_after_method?: string | null
          days_in_year?: string | null
          decrease_possible?: string | null
          description?: string | null
          do_not_bill?: string | null
          do_not_bill_before?: string | null
          earliest_notice_date?: string | null
          eft?: string | null
          estimate_type?: string | null
          estimated_rent?: string | null
          ext_schedule_id?: string | null
          fixed_percent?: string | null
          gl_segment_1?: string | null
          gl_segment_2?: string | null
          gl_segment_3?: string | null
          gl_segment_4?: string | null
          id?: number
          increase_as_point?: string | null
          index_date?: string | null
          index_interval?: string | null
          index_method?: string | null
          index_month?: string | null
          invoice_frequency?: string | null
          invoice_is_leasecurrency?: string | null
          last_day_of_period?: string | null
          late_fee_grace_period?: string | null
          late_fee_interest_free_period?: string | null
          latefeeadjustment?: string | null
          latefeecalculationbasis?: string | null
          latefeecalculationtype?: string | null
          latefeefactor?: string | null
          latefeeinterestindex_code?: string | null
          latefeemaxpercentage?: string | null
          latefeemaxthreshold?: string | null
          latefeeminpercentage?: string | null
          latefeeminthreshold?: string | null
          latefeepercentage?: string | null
          latest_notice_date?: string | null
          lease_code?: string | null
          li_charge_code?: string | null
          li_correction_percentage?: string | null
          market_rent?: string | null
          market_review_notes?: string | null
          max_days_to_appoint_valuer?: string | null
          max_days_to_deliver_valuation?: string | null
          max_days_to_dispute?: string | null
          max_days_to_negotiate_new_rent?: string | null
          max_increase_type?: string | null
          max_increase_value?: string | null
          method_of_payment?: string | null
          mgmt_fee_code?: string | null
          mgmt_fee_percentage?: string | null
          min_decrease_amount?: string | null
          min_increase_type?: string | null
          min_increase_value?: string | null
          next_increase_date_after?: string | null
          next_increase_interval?: string | null
          ninety_day_due_date?: string | null
          notes?: string | null
          notice_served_date?: string | null
          number_of_months_before_index_month?: string | null
          parent_amendment_sequence?: string | null
          parent_amendment_type?: string | null
          payment_schedule?: string | null
          price?: string | null
          print_invoice_on_change?: string | null
          property_code?: string | null
          proposal_type?: string | null
          proration_method?: string | null
          quantity?: string | null
          rate_provider?: string | null
          rate_type?: string | null
          ref_lease_id?: string | null
          ref_property_id?: string | null
          rent_increase_end_date?: string | null
          rent_increase_start_date?: string | null
          rent_increase_type?: string | null
          rent_increase_value?: string | null
          review_type?: string | null
          rounding?: string | null
          sales_tax_code?: string | null
          sales_tax_percentage?: string | null
          sales_tran_type?: string | null
          scandinavian_indexation?: string | null
          schedule_from_date?: string | null
          schedule_to_date?: string | null
          set_invoice_date_to_due_date?: string | null
          settlement_date?: string | null
          settlement_rent?: string | null
          step_indexation?: string | null
          subject_to_late_fee?: string | null
          suppress_paper_invoice?: string | null
          taxpoint_day?: string | null
          third_party?: string | null
          unit_code?: string | null
          userdefined_1?: string | null
          userdefined_10?: string | null
          userdefined_11?: string | null
          userdefined_12?: string | null
          userdefined_13?: string | null
          userdefined_14?: string | null
          userdefined_15?: string | null
          userdefined_16?: string | null
          userdefined_17?: string | null
          userdefined_18?: string | null
          userdefined_19?: string | null
          userdefined_2?: string | null
          userdefined_20?: string | null
          userdefined_3?: string | null
          userdefined_4?: string | null
          userdefined_5?: string | null
          userdefined_6?: string | null
          userdefined_7?: string | null
          userdefined_8?: string | null
          userdefined_9?: string | null
          vat_currency_is_local?: string | null
          who_initiates?: string | null
        }
        Update: {
          additional_fee?: string | null
          amendment_sequence?: string | null
          amendment_type?: string | null
          amount?: number | null
          amount_period?: string | null
          arbitrator_referred_by?: string | null
          area_column_overide?: string | null
          base_month?: string | null
          bill_apr?: string | null
          bill_aug?: string | null
          bill_day?: string | null
          bill_dec?: string | null
          bill_feb?: string | null
          bill_in_arrears?: string | null
          bill_jan?: string | null
          bill_jul?: string | null
          bill_jun?: string | null
          bill_mar?: string | null
          bill_may?: string | null
          bill_nov?: string | null
          bill_oct?: string | null
          bill_sep?: string | null
          charge_code?: string | null
          charge_on_unpaid?: string | null
          check_annually?: string | null
          cpi_breakpoint_1?: string | null
          cpi_breakpoint_2?: string | null
          cpi_breakpoint_3?: string | null
          cpi_breakpoint_4?: string | null
          cpi_breakpoint_5?: string | null
          cpi_cpi_2_ratio_percentage?: string | null
          cpi_increase_factor?: string | null
          cpi_increase_type?: string | null
          cpi_index_step_1_percent?: string | null
          cpi_index_step_2_percent?: string | null
          cpi_index_step_3_percent?: string | null
          cpi_index_step_4_percent?: string | null
          cpi_index_step_5_percent?: string | null
          cpi_index1_code?: string | null
          cpi_index2_code?: string | null
          cpi_max_percent?: string | null
          cpi_min_percent?: string | null
          currency?: string | null
          date_last_billed?: string | null
          days_due?: string | null
          days_due_after_method?: string | null
          days_in_year?: string | null
          decrease_possible?: string | null
          description?: string | null
          do_not_bill?: string | null
          do_not_bill_before?: string | null
          earliest_notice_date?: string | null
          eft?: string | null
          estimate_type?: string | null
          estimated_rent?: string | null
          ext_schedule_id?: string | null
          fixed_percent?: string | null
          gl_segment_1?: string | null
          gl_segment_2?: string | null
          gl_segment_3?: string | null
          gl_segment_4?: string | null
          id?: number
          increase_as_point?: string | null
          index_date?: string | null
          index_interval?: string | null
          index_method?: string | null
          index_month?: string | null
          invoice_frequency?: string | null
          invoice_is_leasecurrency?: string | null
          last_day_of_period?: string | null
          late_fee_grace_period?: string | null
          late_fee_interest_free_period?: string | null
          latefeeadjustment?: string | null
          latefeecalculationbasis?: string | null
          latefeecalculationtype?: string | null
          latefeefactor?: string | null
          latefeeinterestindex_code?: string | null
          latefeemaxpercentage?: string | null
          latefeemaxthreshold?: string | null
          latefeeminpercentage?: string | null
          latefeeminthreshold?: string | null
          latefeepercentage?: string | null
          latest_notice_date?: string | null
          lease_code?: string | null
          li_charge_code?: string | null
          li_correction_percentage?: string | null
          market_rent?: string | null
          market_review_notes?: string | null
          max_days_to_appoint_valuer?: string | null
          max_days_to_deliver_valuation?: string | null
          max_days_to_dispute?: string | null
          max_days_to_negotiate_new_rent?: string | null
          max_increase_type?: string | null
          max_increase_value?: string | null
          method_of_payment?: string | null
          mgmt_fee_code?: string | null
          mgmt_fee_percentage?: string | null
          min_decrease_amount?: string | null
          min_increase_type?: string | null
          min_increase_value?: string | null
          next_increase_date_after?: string | null
          next_increase_interval?: string | null
          ninety_day_due_date?: string | null
          notes?: string | null
          notice_served_date?: string | null
          number_of_months_before_index_month?: string | null
          parent_amendment_sequence?: string | null
          parent_amendment_type?: string | null
          payment_schedule?: string | null
          price?: string | null
          print_invoice_on_change?: string | null
          property_code?: string | null
          proposal_type?: string | null
          proration_method?: string | null
          quantity?: string | null
          rate_provider?: string | null
          rate_type?: string | null
          ref_lease_id?: string | null
          ref_property_id?: string | null
          rent_increase_end_date?: string | null
          rent_increase_start_date?: string | null
          rent_increase_type?: string | null
          rent_increase_value?: string | null
          review_type?: string | null
          rounding?: string | null
          sales_tax_code?: string | null
          sales_tax_percentage?: string | null
          sales_tran_type?: string | null
          scandinavian_indexation?: string | null
          schedule_from_date?: string | null
          schedule_to_date?: string | null
          set_invoice_date_to_due_date?: string | null
          settlement_date?: string | null
          settlement_rent?: string | null
          step_indexation?: string | null
          subject_to_late_fee?: string | null
          suppress_paper_invoice?: string | null
          taxpoint_day?: string | null
          third_party?: string | null
          unit_code?: string | null
          userdefined_1?: string | null
          userdefined_10?: string | null
          userdefined_11?: string | null
          userdefined_12?: string | null
          userdefined_13?: string | null
          userdefined_14?: string | null
          userdefined_15?: string | null
          userdefined_16?: string | null
          userdefined_17?: string | null
          userdefined_18?: string | null
          userdefined_19?: string | null
          userdefined_2?: string | null
          userdefined_20?: string | null
          userdefined_3?: string | null
          userdefined_4?: string | null
          userdefined_5?: string | null
          userdefined_6?: string | null
          userdefined_7?: string | null
          userdefined_8?: string | null
          userdefined_9?: string | null
          vat_currency_is_local?: string | null
          who_initiates?: string | null
        }
        Relationships: []
      }
      commcontacts: {
        Row: {
          address_1: string | null
          address_2: string | null
          address_3: string | null
          address_4: string | null
          alternate_email: string | null
          city: string | null
          company_name: string | null
          contact_code: string | null
          contact_date: string | null
          contact_owner: string | null
          contact_type_association: number | null
          country: string | null
          description: string | null
          detach_contact: number | null
          email: string | null
          ext_ref_id: string | null
          first_name: string | null
          id: number
          is_primary: number | null
          last_name: string | null
          notes: string | null
          phonenumber_1: string | null
          phonenumber_10: string | null
          phonenumber_2: string | null
          phonenumber_3: string | null
          phonenumber_4: string | null
          phonenumber_5: string | null
          phonenumber_6: string | null
          phonenumber_7: string | null
          phonenumber_8: string | null
          phonenumber_9: string | null
          record_code: string | null
          ref_record_id: string | null
          role_description: string | null
          salutation: string | null
          salutation_2: string | null
          state: string | null
          title: string | null
          url: string | null
          zip_code: string | null
        }
        Insert: {
          address_1?: string | null
          address_2?: string | null
          address_3?: string | null
          address_4?: string | null
          alternate_email?: string | null
          city?: string | null
          company_name?: string | null
          contact_code?: string | null
          contact_date?: string | null
          contact_owner?: string | null
          contact_type_association?: number | null
          country?: string | null
          description?: string | null
          detach_contact?: number | null
          email?: string | null
          ext_ref_id?: string | null
          first_name?: string | null
          id?: number
          is_primary?: number | null
          last_name?: string | null
          notes?: string | null
          phonenumber_1?: string | null
          phonenumber_10?: string | null
          phonenumber_2?: string | null
          phonenumber_3?: string | null
          phonenumber_4?: string | null
          phonenumber_5?: string | null
          phonenumber_6?: string | null
          phonenumber_7?: string | null
          phonenumber_8?: string | null
          phonenumber_9?: string | null
          record_code?: string | null
          ref_record_id?: string | null
          role_description?: string | null
          salutation?: string | null
          salutation_2?: string | null
          state?: string | null
          title?: string | null
          url?: string | null
          zip_code?: string | null
        }
        Update: {
          address_1?: string | null
          address_2?: string | null
          address_3?: string | null
          address_4?: string | null
          alternate_email?: string | null
          city?: string | null
          company_name?: string | null
          contact_code?: string | null
          contact_date?: string | null
          contact_owner?: string | null
          contact_type_association?: number | null
          country?: string | null
          description?: string | null
          detach_contact?: number | null
          email?: string | null
          ext_ref_id?: string | null
          first_name?: string | null
          id?: number
          is_primary?: number | null
          last_name?: string | null
          notes?: string | null
          phonenumber_1?: string | null
          phonenumber_10?: string | null
          phonenumber_2?: string | null
          phonenumber_3?: string | null
          phonenumber_4?: string | null
          phonenumber_5?: string | null
          phonenumber_6?: string | null
          phonenumber_7?: string | null
          phonenumber_8?: string | null
          phonenumber_9?: string | null
          record_code?: string | null
          ref_record_id?: string | null
          role_description?: string | null
          salutation?: string | null
          salutation_2?: string | null
          state?: string | null
          title?: string | null
          url?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      commetllease: {
        Row: {
          activate: number | null
          activation_date: string | null
          adjustment: number | null
          amendment_description: string | null
          amendment_sequence: number | null
          amendment_status: number | null
          amendment_type: number | null
          anchor: number | null
          at_risk: string | null
          base_percentage: number | null
          base_percentage2: number | null
          bill_to_customer: number | null
          billing_contact_code: string | null
          billingcontact_code: string | null
          brand: string | null
          calc_basis_gross: number | null
          charge_increase_type: string | null
          charge_on_unpaid: number | null
          company_name: string | null
          contract_end_date: string | null
          contracted_area: number | null
          customer_code: string | null
          days_in_year: number | null
          default_sales_tran_type: string | null
          due_day: number | null
          dueday: string | null
          ext_billing_contact_code: string | null
          ext_billingcontact_code: string | null
          ext_primary_contact_code: string | null
          ext_primarycontact_code: string | null
          ext_ref_lease_id: string | null
          factor: number | null
          general_info_1: string | null
          general_info_10: string | null
          general_info_11: string | null
          general_info_12: string | null
          general_info_13: string | null
          general_info_14: string | null
          general_info_2: string | null
          general_info_3: string | null
          general_info_4: string | null
          general_info_5: string | null
          general_info_6: string | null
          general_info_7: string | null
          general_info_8: string | null
          general_info_9: string | null
          grace_period: number | null
          grace_period2: number | null
          guarantee_required: string | null
          holdover_percentage: number | null
          ics_code: string | null
          id: number
          interest_index: string | null
          is_cml_lease: string | null
          iscmllease: number | null
          late_fee_calc_type: number | null
          late_fee_calc_type2: number | null
          late_fee_interest_free: number | null
          late_fee_per_day: number | null
          lease_code: string | null
          lease_currency: string | null
          lease_end_date: string | null
          lease_move_in_date: string | null
          lease_name: string | null
          lease_start_date: string | null
          lease_term: number | null
          lease_type: string | null
          max_number_days: number | null
          max_percentage: number | null
          max_threshold: number | null
          max_total_fee_percentage: number | null
          max_total_fee_type: string | null
          method_of_payment: number | null
          min_percentage: number | null
          min_threshold: number | null
          minimum_due: number | null
          modification_type: number | null
          month_to_month: number | null
          move_out_date: string | null
          notes: string | null
          occupancy_cert_date: string | null
          other_info_1: string | null
          other_info_10: string | null
          other_info_11: string | null
          other_info_12: string | null
          other_info_13: string | null
          other_info_14: string | null
          other_info_15: string | null
          other_info_16: string | null
          other_info_17: string | null
          other_info_18: string | null
          other_info_19: string | null
          other_info_2: string | null
          other_info_20: string | null
          other_info_21: string | null
          other_info_3: string | null
          other_info_4: string | null
          other_info_5: string | null
          other_info_6: string | null
          other_info_7: string | null
          other_info_8: string | null
          other_info_9: string | null
          parent_amendment_sequence: string | null
          parent_amendment_type: string | null
          payment_type: number | null
          possession_date: string | null
          preferred_language: string | null
          primary_contact_code: string | null
          primarycontact_code: string | null
          property_code: string | null
          rate_provider: string | null
          rate_type: string | null
          ref_customer_id: string | null
          ref_property_id: string | null
          sales_category: string | null
          sales_currency: string | null
          sales_rate_provider: string | null
          sales_rate_type: string | null
          security_deposit: number | null
          separate_amendment_terms: number | null
          sign_date: string | null
          sub_type: number | null
          tenant_notes: string | null
          userid: string | null
          vat_reg_number: string | null
        }
        Insert: {
          activate?: number | null
          activation_date?: string | null
          adjustment?: number | null
          amendment_description?: string | null
          amendment_sequence?: number | null
          amendment_status?: number | null
          amendment_type?: number | null
          anchor?: number | null
          at_risk?: string | null
          base_percentage?: number | null
          base_percentage2?: number | null
          bill_to_customer?: number | null
          billing_contact_code?: string | null
          billingcontact_code?: string | null
          brand?: string | null
          calc_basis_gross?: number | null
          charge_increase_type?: string | null
          charge_on_unpaid?: number | null
          company_name?: string | null
          contract_end_date?: string | null
          contracted_area?: number | null
          customer_code?: string | null
          days_in_year?: number | null
          default_sales_tran_type?: string | null
          due_day?: number | null
          dueday?: string | null
          ext_billing_contact_code?: string | null
          ext_billingcontact_code?: string | null
          ext_primary_contact_code?: string | null
          ext_primarycontact_code?: string | null
          ext_ref_lease_id?: string | null
          factor?: number | null
          general_info_1?: string | null
          general_info_10?: string | null
          general_info_11?: string | null
          general_info_12?: string | null
          general_info_13?: string | null
          general_info_14?: string | null
          general_info_2?: string | null
          general_info_3?: string | null
          general_info_4?: string | null
          general_info_5?: string | null
          general_info_6?: string | null
          general_info_7?: string | null
          general_info_8?: string | null
          general_info_9?: string | null
          grace_period?: number | null
          grace_period2?: number | null
          guarantee_required?: string | null
          holdover_percentage?: number | null
          ics_code?: string | null
          id?: number
          interest_index?: string | null
          is_cml_lease?: string | null
          iscmllease?: number | null
          late_fee_calc_type?: number | null
          late_fee_calc_type2?: number | null
          late_fee_interest_free?: number | null
          late_fee_per_day?: number | null
          lease_code?: string | null
          lease_currency?: string | null
          lease_end_date?: string | null
          lease_move_in_date?: string | null
          lease_name?: string | null
          lease_start_date?: string | null
          lease_term?: number | null
          lease_type?: string | null
          max_number_days?: number | null
          max_percentage?: number | null
          max_threshold?: number | null
          max_total_fee_percentage?: number | null
          max_total_fee_type?: string | null
          method_of_payment?: number | null
          min_percentage?: number | null
          min_threshold?: number | null
          minimum_due?: number | null
          modification_type?: number | null
          month_to_month?: number | null
          move_out_date?: string | null
          notes?: string | null
          occupancy_cert_date?: string | null
          other_info_1?: string | null
          other_info_10?: string | null
          other_info_11?: string | null
          other_info_12?: string | null
          other_info_13?: string | null
          other_info_14?: string | null
          other_info_15?: string | null
          other_info_16?: string | null
          other_info_17?: string | null
          other_info_18?: string | null
          other_info_19?: string | null
          other_info_2?: string | null
          other_info_20?: string | null
          other_info_21?: string | null
          other_info_3?: string | null
          other_info_4?: string | null
          other_info_5?: string | null
          other_info_6?: string | null
          other_info_7?: string | null
          other_info_8?: string | null
          other_info_9?: string | null
          parent_amendment_sequence?: string | null
          parent_amendment_type?: string | null
          payment_type?: number | null
          possession_date?: string | null
          preferred_language?: string | null
          primary_contact_code?: string | null
          primarycontact_code?: string | null
          property_code?: string | null
          rate_provider?: string | null
          rate_type?: string | null
          ref_customer_id?: string | null
          ref_property_id?: string | null
          sales_category?: string | null
          sales_currency?: string | null
          sales_rate_provider?: string | null
          sales_rate_type?: string | null
          security_deposit?: number | null
          separate_amendment_terms?: number | null
          sign_date?: string | null
          sub_type?: number | null
          tenant_notes?: string | null
          userid?: string | null
          vat_reg_number?: string | null
        }
        Update: {
          activate?: number | null
          activation_date?: string | null
          adjustment?: number | null
          amendment_description?: string | null
          amendment_sequence?: number | null
          amendment_status?: number | null
          amendment_type?: number | null
          anchor?: number | null
          at_risk?: string | null
          base_percentage?: number | null
          base_percentage2?: number | null
          bill_to_customer?: number | null
          billing_contact_code?: string | null
          billingcontact_code?: string | null
          brand?: string | null
          calc_basis_gross?: number | null
          charge_increase_type?: string | null
          charge_on_unpaid?: number | null
          company_name?: string | null
          contract_end_date?: string | null
          contracted_area?: number | null
          customer_code?: string | null
          days_in_year?: number | null
          default_sales_tran_type?: string | null
          due_day?: number | null
          dueday?: string | null
          ext_billing_contact_code?: string | null
          ext_billingcontact_code?: string | null
          ext_primary_contact_code?: string | null
          ext_primarycontact_code?: string | null
          ext_ref_lease_id?: string | null
          factor?: number | null
          general_info_1?: string | null
          general_info_10?: string | null
          general_info_11?: string | null
          general_info_12?: string | null
          general_info_13?: string | null
          general_info_14?: string | null
          general_info_2?: string | null
          general_info_3?: string | null
          general_info_4?: string | null
          general_info_5?: string | null
          general_info_6?: string | null
          general_info_7?: string | null
          general_info_8?: string | null
          general_info_9?: string | null
          grace_period?: number | null
          grace_period2?: number | null
          guarantee_required?: string | null
          holdover_percentage?: number | null
          ics_code?: string | null
          id?: number
          interest_index?: string | null
          is_cml_lease?: string | null
          iscmllease?: number | null
          late_fee_calc_type?: number | null
          late_fee_calc_type2?: number | null
          late_fee_interest_free?: number | null
          late_fee_per_day?: number | null
          lease_code?: string | null
          lease_currency?: string | null
          lease_end_date?: string | null
          lease_move_in_date?: string | null
          lease_name?: string | null
          lease_start_date?: string | null
          lease_term?: number | null
          lease_type?: string | null
          max_number_days?: number | null
          max_percentage?: number | null
          max_threshold?: number | null
          max_total_fee_percentage?: number | null
          max_total_fee_type?: string | null
          method_of_payment?: number | null
          min_percentage?: number | null
          min_threshold?: number | null
          minimum_due?: number | null
          modification_type?: number | null
          month_to_month?: number | null
          move_out_date?: string | null
          notes?: string | null
          occupancy_cert_date?: string | null
          other_info_1?: string | null
          other_info_10?: string | null
          other_info_11?: string | null
          other_info_12?: string | null
          other_info_13?: string | null
          other_info_14?: string | null
          other_info_15?: string | null
          other_info_16?: string | null
          other_info_17?: string | null
          other_info_18?: string | null
          other_info_19?: string | null
          other_info_2?: string | null
          other_info_20?: string | null
          other_info_21?: string | null
          other_info_3?: string | null
          other_info_4?: string | null
          other_info_5?: string | null
          other_info_6?: string | null
          other_info_7?: string | null
          other_info_8?: string | null
          other_info_9?: string | null
          parent_amendment_sequence?: string | null
          parent_amendment_type?: string | null
          payment_type?: number | null
          possession_date?: string | null
          preferred_language?: string | null
          primary_contact_code?: string | null
          primarycontact_code?: string | null
          property_code?: string | null
          rate_provider?: string | null
          rate_type?: string | null
          ref_customer_id?: string | null
          ref_property_id?: string | null
          sales_category?: string | null
          sales_currency?: string | null
          sales_rate_provider?: string | null
          sales_rate_type?: string | null
          security_deposit?: number | null
          separate_amendment_terms?: number | null
          sign_date?: string | null
          sub_type?: number | null
          tenant_notes?: string | null
          userid?: string | null
          vat_reg_number?: string | null
        }
        Relationships: []
      }
      commleaserecoveryparams: {
        Row: {
          amendment_sequence: string | null
          amendment_start_date: string | null
          amendment_type: string | null
          base_year: string | null
          charge_code: string | null
          custom_denominator_code: string | null
          denominator_column: string | null
          denominator_override: string | null
          denominator_type: string | null
          do_not_reconcile: string | null
          expense_pool: string | null
          fixed_prorata_share_percent: string | null
          from_date: string | null
          gross_up_percent: string | null
          group_base_amount: string | null
          group_base_cap_amount: string | null
          group_base_cap_amount_type: string | null
          group_cap_appliesto: string | null
          group_cap_increase_base: string | null
          group_cap_increase_based_on: string | null
          group_cap_increase_percent: string | null
          group_cpi_index: string | null
          group_cpi_month: string | null
          group_is_base_amount_credit: string | null
          group_max_percent: string | null
          group_mgmt_fee_percent: string | null
          group_min_percent: string | null
          id: number
          is_anchor_deduction: string | null
          lease_code: string | null
          mgmt_fee_code: string | null
          min_occupancy_percent: string | null
          misc_charge_code: string | null
          numerator_column: string | null
          numerator_override: string | null
          occupancy_type: string | null
          parent_amendment_sequence: string | null
          parent_amendment_type: string | null
          pool_base_amount: string | null
          pool_base_cap_amount: string | null
          pool_base_cap_amount_type: string | null
          pool_cap_appliesto: string | null
          pool_cap_increase_base: string | null
          pool_cap_increase_based_on: string | null
          pool_cap_increase_percent: string | null
          pool_cpi_index: string | null
          pool_cpi_month: string | null
          pool_is_base_amount_credit: string | null
          pool_max_percent: string | null
          pool_mgmt_fee_percent: string | null
          pool_min_percent: string | null
          property_code: string | null
          proposal_type: string | null
          proration_type: string | null
          reconcile_charge_code: string | null
          recovery_factor_percent: string | null
          recovery_group: string | null
          ref_lease_id: string | null
          ref_property_id: string | null
          to_date: string | null
          unit_code: string | null
          unit_recovery: string | null
          use_contract_area: string | null
        }
        Insert: {
          amendment_sequence?: string | null
          amendment_start_date?: string | null
          amendment_type?: string | null
          base_year?: string | null
          charge_code?: string | null
          custom_denominator_code?: string | null
          denominator_column?: string | null
          denominator_override?: string | null
          denominator_type?: string | null
          do_not_reconcile?: string | null
          expense_pool?: string | null
          fixed_prorata_share_percent?: string | null
          from_date?: string | null
          gross_up_percent?: string | null
          group_base_amount?: string | null
          group_base_cap_amount?: string | null
          group_base_cap_amount_type?: string | null
          group_cap_appliesto?: string | null
          group_cap_increase_base?: string | null
          group_cap_increase_based_on?: string | null
          group_cap_increase_percent?: string | null
          group_cpi_index?: string | null
          group_cpi_month?: string | null
          group_is_base_amount_credit?: string | null
          group_max_percent?: string | null
          group_mgmt_fee_percent?: string | null
          group_min_percent?: string | null
          id?: number
          is_anchor_deduction?: string | null
          lease_code?: string | null
          mgmt_fee_code?: string | null
          min_occupancy_percent?: string | null
          misc_charge_code?: string | null
          numerator_column?: string | null
          numerator_override?: string | null
          occupancy_type?: string | null
          parent_amendment_sequence?: string | null
          parent_amendment_type?: string | null
          pool_base_amount?: string | null
          pool_base_cap_amount?: string | null
          pool_base_cap_amount_type?: string | null
          pool_cap_appliesto?: string | null
          pool_cap_increase_base?: string | null
          pool_cap_increase_based_on?: string | null
          pool_cap_increase_percent?: string | null
          pool_cpi_index?: string | null
          pool_cpi_month?: string | null
          pool_is_base_amount_credit?: string | null
          pool_max_percent?: string | null
          pool_mgmt_fee_percent?: string | null
          pool_min_percent?: string | null
          property_code?: string | null
          proposal_type?: string | null
          proration_type?: string | null
          reconcile_charge_code?: string | null
          recovery_factor_percent?: string | null
          recovery_group?: string | null
          ref_lease_id?: string | null
          ref_property_id?: string | null
          to_date?: string | null
          unit_code?: string | null
          unit_recovery?: string | null
          use_contract_area?: string | null
        }
        Update: {
          amendment_sequence?: string | null
          amendment_start_date?: string | null
          amendment_type?: string | null
          base_year?: string | null
          charge_code?: string | null
          custom_denominator_code?: string | null
          denominator_column?: string | null
          denominator_override?: string | null
          denominator_type?: string | null
          do_not_reconcile?: string | null
          expense_pool?: string | null
          fixed_prorata_share_percent?: string | null
          from_date?: string | null
          gross_up_percent?: string | null
          group_base_amount?: string | null
          group_base_cap_amount?: string | null
          group_base_cap_amount_type?: string | null
          group_cap_appliesto?: string | null
          group_cap_increase_base?: string | null
          group_cap_increase_based_on?: string | null
          group_cap_increase_percent?: string | null
          group_cpi_index?: string | null
          group_cpi_month?: string | null
          group_is_base_amount_credit?: string | null
          group_max_percent?: string | null
          group_mgmt_fee_percent?: string | null
          group_min_percent?: string | null
          id?: number
          is_anchor_deduction?: string | null
          lease_code?: string | null
          mgmt_fee_code?: string | null
          min_occupancy_percent?: string | null
          misc_charge_code?: string | null
          numerator_column?: string | null
          numerator_override?: string | null
          occupancy_type?: string | null
          parent_amendment_sequence?: string | null
          parent_amendment_type?: string | null
          pool_base_amount?: string | null
          pool_base_cap_amount?: string | null
          pool_base_cap_amount_type?: string | null
          pool_cap_appliesto?: string | null
          pool_cap_increase_base?: string | null
          pool_cap_increase_based_on?: string | null
          pool_cap_increase_percent?: string | null
          pool_cpi_index?: string | null
          pool_cpi_month?: string | null
          pool_is_base_amount_credit?: string | null
          pool_max_percent?: string | null
          pool_mgmt_fee_percent?: string | null
          pool_min_percent?: string | null
          property_code?: string | null
          proposal_type?: string | null
          proration_type?: string | null
          reconcile_charge_code?: string | null
          recovery_factor_percent?: string | null
          recovery_group?: string | null
          ref_lease_id?: string | null
          ref_property_id?: string | null
          to_date?: string | null
          unit_code?: string | null
          unit_recovery?: string | null
          use_contract_area?: string | null
        }
        Relationships: []
      }
      commleases: {
        Row: {
          activate: number | null
          activation_date: string | null
          adjustment: number | null
          amendment_description: string | null
          amendment_sequence: number | null
          amendment_status: number | null
          amendment_type: number | null
          anchor: number | null
          at_risk: number | null
          base_percentage: number | null
          base_percentage2: number | null
          bill_to_customer: number | null
          billingcontact_code: string | null
          brand: string | null
          calc_basis_gross: number | null
          charge_increase_type: number | null
          charge_on_unpaid: number | null
          company_name: string | null
          contract_end_date: string | null
          contracted_area: number | null
          customer_code: string | null
          days_in_year: number | null
          default_sales_tran_type: string | null
          dueday: number | null
          ext_billingcontact_code: string | null
          ext_primarycontact_code: string | null
          ext_ref_lease_id: string | null
          factor: number | null
          general_info_1: string | null
          general_info_10: string | null
          general_info_11: string | null
          general_info_12: string | null
          general_info_13: string | null
          general_info_14: string | null
          general_info_2: string | null
          general_info_3: string | null
          general_info_4: string | null
          general_info_5: string | null
          general_info_6: string | null
          general_info_7: string | null
          general_info_8: string | null
          general_info_9: string | null
          grace_period: number | null
          grace_period2: number | null
          guarantee_required: number | null
          holdover_percentage: number | null
          ics_code: string | null
          id: number
          interest_index: string | null
          is_cml_lease: number | null
          late_fee_calc_type: number | null
          late_fee_calc_type2: number | null
          late_fee_interest_free: number | null
          late_fee_per_day: number | null
          lease_code: string | null
          lease_currency: string | null
          lease_end_date: string | null
          lease_move_in_date: string | null
          lease_name: string | null
          lease_start_date: string | null
          lease_type: string | null
          max_number_days: number | null
          max_percentage: number | null
          max_threshold: number | null
          max_total_fee_percentage: number | null
          max_total_fee_type: number | null
          method_of_payment: number | null
          min_percentage: number | null
          min_threshold: number | null
          minimum_due: number | null
          modification_type: number | null
          month_to_month: number | null
          move_out_date: string | null
          notes: string | null
          occupancy_cert_date: string | null
          other_info_1: string | null
          other_info_10: string | null
          other_info_11: string | null
          other_info_12: string | null
          other_info_13: string | null
          other_info_14: string | null
          other_info_15: string | null
          other_info_16: string | null
          other_info_17: string | null
          other_info_18: string | null
          other_info_19: string | null
          other_info_2: string | null
          other_info_20: string | null
          other_info_21: string | null
          other_info_3: string | null
          other_info_4: string | null
          other_info_5: string | null
          other_info_6: string | null
          other_info_7: string | null
          other_info_8: string | null
          other_info_9: string | null
          parent_amendment_sequence: number | null
          parent_amendment_type: number | null
          payment_type: number | null
          possession_date: string | null
          preferred_language: string | null
          primarycontact_code: string | null
          property_code: string | null
          rate_provider: string | null
          rate_type: string | null
          ref_customer_id: string | null
          ref_property_id: string | null
          risk_type: number | null
          sales_category: string | null
          sales_currency: string | null
          sales_rate_provider: string | null
          sales_rate_type: string | null
          security_deposit: number | null
          separate_amendment_terms: number | null
          sign_date: string | null
          sub_type: number | null
          tenant_notes: string | null
          vat_reg_number: string | null
        }
        Insert: {
          activate?: number | null
          activation_date?: string | null
          adjustment?: number | null
          amendment_description?: string | null
          amendment_sequence?: number | null
          amendment_status?: number | null
          amendment_type?: number | null
          anchor?: number | null
          at_risk?: number | null
          base_percentage?: number | null
          base_percentage2?: number | null
          bill_to_customer?: number | null
          billingcontact_code?: string | null
          brand?: string | null
          calc_basis_gross?: number | null
          charge_increase_type?: number | null
          charge_on_unpaid?: number | null
          company_name?: string | null
          contract_end_date?: string | null
          contracted_area?: number | null
          customer_code?: string | null
          days_in_year?: number | null
          default_sales_tran_type?: string | null
          dueday?: number | null
          ext_billingcontact_code?: string | null
          ext_primarycontact_code?: string | null
          ext_ref_lease_id?: string | null
          factor?: number | null
          general_info_1?: string | null
          general_info_10?: string | null
          general_info_11?: string | null
          general_info_12?: string | null
          general_info_13?: string | null
          general_info_14?: string | null
          general_info_2?: string | null
          general_info_3?: string | null
          general_info_4?: string | null
          general_info_5?: string | null
          general_info_6?: string | null
          general_info_7?: string | null
          general_info_8?: string | null
          general_info_9?: string | null
          grace_period?: number | null
          grace_period2?: number | null
          guarantee_required?: number | null
          holdover_percentage?: number | null
          ics_code?: string | null
          id?: number
          interest_index?: string | null
          is_cml_lease?: number | null
          late_fee_calc_type?: number | null
          late_fee_calc_type2?: number | null
          late_fee_interest_free?: number | null
          late_fee_per_day?: number | null
          lease_code?: string | null
          lease_currency?: string | null
          lease_end_date?: string | null
          lease_move_in_date?: string | null
          lease_name?: string | null
          lease_start_date?: string | null
          lease_type?: string | null
          max_number_days?: number | null
          max_percentage?: number | null
          max_threshold?: number | null
          max_total_fee_percentage?: number | null
          max_total_fee_type?: number | null
          method_of_payment?: number | null
          min_percentage?: number | null
          min_threshold?: number | null
          minimum_due?: number | null
          modification_type?: number | null
          month_to_month?: number | null
          move_out_date?: string | null
          notes?: string | null
          occupancy_cert_date?: string | null
          other_info_1?: string | null
          other_info_10?: string | null
          other_info_11?: string | null
          other_info_12?: string | null
          other_info_13?: string | null
          other_info_14?: string | null
          other_info_15?: string | null
          other_info_16?: string | null
          other_info_17?: string | null
          other_info_18?: string | null
          other_info_19?: string | null
          other_info_2?: string | null
          other_info_20?: string | null
          other_info_21?: string | null
          other_info_3?: string | null
          other_info_4?: string | null
          other_info_5?: string | null
          other_info_6?: string | null
          other_info_7?: string | null
          other_info_8?: string | null
          other_info_9?: string | null
          parent_amendment_sequence?: number | null
          parent_amendment_type?: number | null
          payment_type?: number | null
          possession_date?: string | null
          preferred_language?: string | null
          primarycontact_code?: string | null
          property_code?: string | null
          rate_provider?: string | null
          rate_type?: string | null
          ref_customer_id?: string | null
          ref_property_id?: string | null
          risk_type?: number | null
          sales_category?: string | null
          sales_currency?: string | null
          sales_rate_provider?: string | null
          sales_rate_type?: string | null
          security_deposit?: number | null
          separate_amendment_terms?: number | null
          sign_date?: string | null
          sub_type?: number | null
          tenant_notes?: string | null
          vat_reg_number?: string | null
        }
        Update: {
          activate?: number | null
          activation_date?: string | null
          adjustment?: number | null
          amendment_description?: string | null
          amendment_sequence?: number | null
          amendment_status?: number | null
          amendment_type?: number | null
          anchor?: number | null
          at_risk?: number | null
          base_percentage?: number | null
          base_percentage2?: number | null
          bill_to_customer?: number | null
          billingcontact_code?: string | null
          brand?: string | null
          calc_basis_gross?: number | null
          charge_increase_type?: number | null
          charge_on_unpaid?: number | null
          company_name?: string | null
          contract_end_date?: string | null
          contracted_area?: number | null
          customer_code?: string | null
          days_in_year?: number | null
          default_sales_tran_type?: string | null
          dueday?: number | null
          ext_billingcontact_code?: string | null
          ext_primarycontact_code?: string | null
          ext_ref_lease_id?: string | null
          factor?: number | null
          general_info_1?: string | null
          general_info_10?: string | null
          general_info_11?: string | null
          general_info_12?: string | null
          general_info_13?: string | null
          general_info_14?: string | null
          general_info_2?: string | null
          general_info_3?: string | null
          general_info_4?: string | null
          general_info_5?: string | null
          general_info_6?: string | null
          general_info_7?: string | null
          general_info_8?: string | null
          general_info_9?: string | null
          grace_period?: number | null
          grace_period2?: number | null
          guarantee_required?: number | null
          holdover_percentage?: number | null
          ics_code?: string | null
          id?: number
          interest_index?: string | null
          is_cml_lease?: number | null
          late_fee_calc_type?: number | null
          late_fee_calc_type2?: number | null
          late_fee_interest_free?: number | null
          late_fee_per_day?: number | null
          lease_code?: string | null
          lease_currency?: string | null
          lease_end_date?: string | null
          lease_move_in_date?: string | null
          lease_name?: string | null
          lease_start_date?: string | null
          lease_type?: string | null
          max_number_days?: number | null
          max_percentage?: number | null
          max_threshold?: number | null
          max_total_fee_percentage?: number | null
          max_total_fee_type?: number | null
          method_of_payment?: number | null
          min_percentage?: number | null
          min_threshold?: number | null
          minimum_due?: number | null
          modification_type?: number | null
          month_to_month?: number | null
          move_out_date?: string | null
          notes?: string | null
          occupancy_cert_date?: string | null
          other_info_1?: string | null
          other_info_10?: string | null
          other_info_11?: string | null
          other_info_12?: string | null
          other_info_13?: string | null
          other_info_14?: string | null
          other_info_15?: string | null
          other_info_16?: string | null
          other_info_17?: string | null
          other_info_18?: string | null
          other_info_19?: string | null
          other_info_2?: string | null
          other_info_20?: string | null
          other_info_21?: string | null
          other_info_3?: string | null
          other_info_4?: string | null
          other_info_5?: string | null
          other_info_6?: string | null
          other_info_7?: string | null
          other_info_8?: string | null
          other_info_9?: string | null
          parent_amendment_sequence?: number | null
          parent_amendment_type?: number | null
          payment_type?: number | null
          possession_date?: string | null
          preferred_language?: string | null
          primarycontact_code?: string | null
          property_code?: string | null
          rate_provider?: string | null
          rate_type?: string | null
          ref_customer_id?: string | null
          ref_property_id?: string | null
          risk_type?: number | null
          sales_category?: string | null
          sales_currency?: string | null
          sales_rate_provider?: string | null
          sales_rate_type?: string | null
          security_deposit?: number | null
          separate_amendment_terms?: number | null
          sign_date?: string | null
          sub_type?: number | null
          tenant_notes?: string | null
          vat_reg_number?: string | null
        }
        Relationships: []
      }
      commonglaccounts: {
        Row: {
          account_code: string | null
          account_type: number | null
          advance: number | null
          ap_account: number | null
          ar_account: number | null
          cash_account: number | null
          chart: string | null
          commisionable: number | null
          construction: number | null
          control_account: number | null
          description: string | null
          double_underline: number | null
          exclude_from_ap_iat: number | null
          exclude_from_budget: number | null
          exclude_from_reg: number | null
          exclude_from_use: number | null
          exempt_1099: number | null
          expense_account: number | null
          hold_for: string | null
          iat_account: string | null
          id: number
          include_in_cash_flow: number | null
          margin: number | null
          normal_balance: number | null
          notes: string | null
          offset: string | null
          payable: string | null
          percentage_divisor: number | null
          prepaid_ar_account: string | null
          prepay_holding: number | null
          print_bold: number | null
          print_end_inc_stmt_perc: number | null
          print_italic: number | null
          receivable: string | null
          recoverability: string | null
          report_type: number | null
          subject_to_late_fee: number | null
          summary: number | null
          suppress_financial: number | null
          system_account: string | null
          tax_account: number | null
          tenant_deposit: number | null
          total_into: string | null
          user_defined_1: string | null
          user_defined_2: string | null
          user_defined_3: string | null
          user_defined_4: string | null
          wip_account: number | null
        }
        Insert: {
          account_code?: string | null
          account_type?: number | null
          advance?: number | null
          ap_account?: number | null
          ar_account?: number | null
          cash_account?: number | null
          chart?: string | null
          commisionable?: number | null
          construction?: number | null
          control_account?: number | null
          description?: string | null
          double_underline?: number | null
          exclude_from_ap_iat?: number | null
          exclude_from_budget?: number | null
          exclude_from_reg?: number | null
          exclude_from_use?: number | null
          exempt_1099?: number | null
          expense_account?: number | null
          hold_for?: string | null
          iat_account?: string | null
          id: number
          include_in_cash_flow?: number | null
          margin?: number | null
          normal_balance?: number | null
          notes?: string | null
          offset?: string | null
          payable?: string | null
          percentage_divisor?: number | null
          prepaid_ar_account?: string | null
          prepay_holding?: number | null
          print_bold?: number | null
          print_end_inc_stmt_perc?: number | null
          print_italic?: number | null
          receivable?: string | null
          recoverability?: string | null
          report_type?: number | null
          subject_to_late_fee?: number | null
          summary?: number | null
          suppress_financial?: number | null
          system_account?: string | null
          tax_account?: number | null
          tenant_deposit?: number | null
          total_into?: string | null
          user_defined_1?: string | null
          user_defined_2?: string | null
          user_defined_3?: string | null
          user_defined_4?: string | null
          wip_account?: number | null
        }
        Update: {
          account_code?: string | null
          account_type?: number | null
          advance?: number | null
          ap_account?: number | null
          ar_account?: number | null
          cash_account?: number | null
          chart?: string | null
          commisionable?: number | null
          construction?: number | null
          control_account?: number | null
          description?: string | null
          double_underline?: number | null
          exclude_from_ap_iat?: number | null
          exclude_from_budget?: number | null
          exclude_from_reg?: number | null
          exclude_from_use?: number | null
          exempt_1099?: number | null
          expense_account?: number | null
          hold_for?: string | null
          iat_account?: string | null
          id?: number
          include_in_cash_flow?: number | null
          margin?: number | null
          normal_balance?: number | null
          notes?: string | null
          offset?: string | null
          payable?: string | null
          percentage_divisor?: number | null
          prepaid_ar_account?: string | null
          prepay_holding?: number | null
          print_bold?: number | null
          print_end_inc_stmt_perc?: number | null
          print_italic?: number | null
          receivable?: string | null
          recoverability?: string | null
          report_type?: number | null
          subject_to_late_fee?: number | null
          summary?: number | null
          suppress_financial?: number | null
          system_account?: string | null
          tax_account?: number | null
          tenant_deposit?: number | null
          total_into?: string | null
          user_defined_1?: string | null
          user_defined_2?: string | null
          user_defined_3?: string | null
          user_defined_4?: string | null
          wip_account?: number | null
        }
        Relationships: []
      }
      commoptions: {
        Row: {
          amendment_sequence: string | null
          amendment_type: string | null
          break_date: string | null
          breakpoint_amount: string | null
          brief_description_of_the_option: string | null
          clause_description: string | null
          "clause_name ": string | null
          contiguous_area: string | null
          custom_option_type: string | null
          earliest_handover: string | null
          earliest_notice_days: string | null
          encumb_building_code: string | null
          encumb_floor_code: string | null
          encumb_property_code: string | null
          encumb_unit_code: string | null
          expiration_date: string | null
          fixed_rent: string | null
          fixed_rent_type: string | null
          id: number
          latest_handover: string | null
          latest_notice_days: string | null
          lease_code: string | null
          notes: string | null
          notice_received_date: string | null
          notice_sent_date: string | null
          ongoing_option: string | null
          option_status: string | null
          option_term_type: string | null
          option_type: string | null
          other_rent_notes: string | null
          overage_rent_type: string | null
          parent_amendment_sequence: string | null
          parent_amendment_type: string | null
          penalty: string | null
          percent_fair_market_value: string | null
          percent_of_sales: string | null
          percent_of_sales_less_fixed_breakpoint: string | null
          percent_of_sales_less_rent: string | null
          property_code: string | null
          proposal_type: string | null
          ref_encumb_property_id: string | null
          ref_encumb_unit_id: string | null
          ref_lease_id: string | null
          ref_property_id: string | null
          renewal_rent_type: string | null
          renewal_type: string | null
          required_area: string | null
          response: string | null
          term_in_months: string | null
          timeofessence: string | null
          validtill_date: string | null
          who: string | null
        }
        Insert: {
          amendment_sequence?: string | null
          amendment_type?: string | null
          break_date?: string | null
          breakpoint_amount?: string | null
          brief_description_of_the_option?: string | null
          clause_description?: string | null
          "clause_name "?: string | null
          contiguous_area?: string | null
          custom_option_type?: string | null
          earliest_handover?: string | null
          earliest_notice_days?: string | null
          encumb_building_code?: string | null
          encumb_floor_code?: string | null
          encumb_property_code?: string | null
          encumb_unit_code?: string | null
          expiration_date?: string | null
          fixed_rent?: string | null
          fixed_rent_type?: string | null
          id?: number
          latest_handover?: string | null
          latest_notice_days?: string | null
          lease_code?: string | null
          notes?: string | null
          notice_received_date?: string | null
          notice_sent_date?: string | null
          ongoing_option?: string | null
          option_status?: string | null
          option_term_type?: string | null
          option_type?: string | null
          other_rent_notes?: string | null
          overage_rent_type?: string | null
          parent_amendment_sequence?: string | null
          parent_amendment_type?: string | null
          penalty?: string | null
          percent_fair_market_value?: string | null
          percent_of_sales?: string | null
          percent_of_sales_less_fixed_breakpoint?: string | null
          percent_of_sales_less_rent?: string | null
          property_code?: string | null
          proposal_type?: string | null
          ref_encumb_property_id?: string | null
          ref_encumb_unit_id?: string | null
          ref_lease_id?: string | null
          ref_property_id?: string | null
          renewal_rent_type?: string | null
          renewal_type?: string | null
          required_area?: string | null
          response?: string | null
          term_in_months?: string | null
          timeofessence?: string | null
          validtill_date?: string | null
          who?: string | null
        }
        Update: {
          amendment_sequence?: string | null
          amendment_type?: string | null
          break_date?: string | null
          breakpoint_amount?: string | null
          brief_description_of_the_option?: string | null
          clause_description?: string | null
          "clause_name "?: string | null
          contiguous_area?: string | null
          custom_option_type?: string | null
          earliest_handover?: string | null
          earliest_notice_days?: string | null
          encumb_building_code?: string | null
          encumb_floor_code?: string | null
          encumb_property_code?: string | null
          encumb_unit_code?: string | null
          expiration_date?: string | null
          fixed_rent?: string | null
          fixed_rent_type?: string | null
          id?: number
          latest_handover?: string | null
          latest_notice_days?: string | null
          lease_code?: string | null
          notes?: string | null
          notice_received_date?: string | null
          notice_sent_date?: string | null
          ongoing_option?: string | null
          option_status?: string | null
          option_term_type?: string | null
          option_type?: string | null
          other_rent_notes?: string | null
          overage_rent_type?: string | null
          parent_amendment_sequence?: string | null
          parent_amendment_type?: string | null
          penalty?: string | null
          percent_fair_market_value?: string | null
          percent_of_sales?: string | null
          percent_of_sales_less_fixed_breakpoint?: string | null
          percent_of_sales_less_rent?: string | null
          property_code?: string | null
          proposal_type?: string | null
          ref_encumb_property_id?: string | null
          ref_encumb_unit_id?: string | null
          ref_lease_id?: string | null
          ref_property_id?: string | null
          renewal_rent_type?: string | null
          renewal_type?: string | null
          required_area?: string | null
          response?: string | null
          term_in_months?: string | null
          timeofessence?: string | null
          validtill_date?: string | null
          who?: string | null
        }
        Relationships: []
      }
      commpropexpensepoolaccounts: {
        Row: {
          acctcode: string | null
          acctdescription: string | null
          acctid: string | null
          excludeid: string | null
          expensepoolcode: string | null
          id: number
          isexclude: string | null
          propertycode: string | null
        }
        Insert: {
          acctcode?: string | null
          acctdescription?: string | null
          acctid?: string | null
          excludeid?: string | null
          expensepoolcode?: string | null
          id?: number
          isexclude?: string | null
          propertycode?: string | null
        }
        Update: {
          acctcode?: string | null
          acctdescription?: string | null
          acctid?: string | null
          excludeid?: string | null
          expensepoolcode?: string | null
          id?: number
          isexclude?: string | null
          propertycode?: string | null
        }
        Relationships: []
      }
      commproprecoveryexcludes: {
        Row: {
          accountcode: string | null
          amsequence: string | null
          amtype: string | null
          expensepool: string | null
          id: number
          iexcludelevel: string | null
          leasecode: string | null
          leaserefid: string | null
          leasetype: string | null
          propertycode: string | null
          proprefid: string | null
          recoverygroup: string | null
        }
        Insert: {
          accountcode?: string | null
          amsequence?: string | null
          amtype?: string | null
          expensepool?: string | null
          id?: number
          iexcludelevel?: string | null
          leasecode?: string | null
          leaserefid?: string | null
          leasetype?: string | null
          propertycode?: string | null
          proprefid?: string | null
          recoverygroup?: string | null
        }
        Update: {
          accountcode?: string | null
          amsequence?: string | null
          amtype?: string | null
          expensepool?: string | null
          id?: number
          iexcludelevel?: string | null
          leasecode?: string | null
          leaserefid?: string | null
          leasetype?: string | null
          propertycode?: string | null
          proprefid?: string | null
          recoverygroup?: string | null
        }
        Relationships: []
      }
      commrecoveryexcludes: {
        Row: {
          account: string | null
          amendment_sequence: string | null
          amendment_type: string | null
          exclude_type: string | null
          expense_pool: string | null
          id: number
          lease_code: string | null
          lease_type: string | null
          property_code: string | null
          recovery_group_code: string | null
          ref_lease_id: string | null
          ref_property_id: string | null
        }
        Insert: {
          account?: string | null
          amendment_sequence?: string | null
          amendment_type?: string | null
          exclude_type?: string | null
          expense_pool?: string | null
          id?: number
          lease_code?: string | null
          lease_type?: string | null
          property_code?: string | null
          recovery_group_code?: string | null
          ref_lease_id?: string | null
          ref_property_id?: string | null
        }
        Update: {
          account?: string | null
          amendment_sequence?: string | null
          amendment_type?: string | null
          exclude_type?: string | null
          expense_pool?: string | null
          id?: number
          lease_code?: string | null
          lease_type?: string | null
          property_code?: string | null
          recovery_group_code?: string | null
          ref_lease_id?: string | null
          ref_property_id?: string | null
        }
        Relationships: []
      }
      commsqfts: {
        Row: {
          dsqft0: number | null
          dsqft1: number | null
          dsqft10: number | null
          dsqft11: number | null
          dsqft12: number | null
          dsqft13: number | null
          dsqft14: number | null
          dsqft15: number | null
          dsqft2: number | null
          dsqft3: number | null
          dsqft4: number | null
          dsqft5: number | null
          dsqft6: number | null
          dsqft7: number | null
          dsqft8: number | null
          dsqft9: number | null
          dtdate: string | null
          id: number
          notes: string | null
          property_code: string | null
          ref_property_id: string | null
          ref_unit_id: string | null
          unit_code: string | null
        }
        Insert: {
          dsqft0?: number | null
          dsqft1?: number | null
          dsqft10?: number | null
          dsqft11?: number | null
          dsqft12?: number | null
          dsqft13?: number | null
          dsqft14?: number | null
          dsqft15?: number | null
          dsqft2?: number | null
          dsqft3?: number | null
          dsqft4?: number | null
          dsqft5?: number | null
          dsqft6?: number | null
          dsqft7?: number | null
          dsqft8?: number | null
          dsqft9?: number | null
          dtdate?: string | null
          id?: number
          notes?: string | null
          property_code?: string | null
          ref_property_id?: string | null
          ref_unit_id?: string | null
          unit_code?: string | null
        }
        Update: {
          dsqft0?: number | null
          dsqft1?: number | null
          dsqft10?: number | null
          dsqft11?: number | null
          dsqft12?: number | null
          dsqft13?: number | null
          dsqft14?: number | null
          dsqft15?: number | null
          dsqft2?: number | null
          dsqft3?: number | null
          dsqft4?: number | null
          dsqft5?: number | null
          dsqft6?: number | null
          dsqft7?: number | null
          dsqft8?: number | null
          dsqft9?: number | null
          dtdate?: string | null
          id?: number
          notes?: string | null
          property_code?: string | null
          ref_property_id?: string | null
          ref_unit_id?: string | null
          unit_code?: string | null
        }
        Relationships: []
      }
      communits: {
        Row: {
          address_1: string | null
          address_2: string | null
          address_3: string | null
          address_4: string | null
          attributes_1: string | null
          attributes_10: string | null
          attributes_2: string | null
          attributes_3: string | null
          attributes_4: string | null
          attributes_5: string | null
          attributes_6: string | null
          attributes_7: string | null
          attributes_8: string | null
          attributes_9: string | null
          available_date: string | null
          bedrooms: number | null
          bldg_code: string | null
          city: string | null
          country: string | null
          date_ready: string | null
          exclude: number | null
          ext_ref_unit_id: string | null
          floor_code: string | null
          id: number
          lease_type: string | null
          location: string | null
          mla: string | null
          notes: string | null
          property_code: string | null
          ref_building_id: string | null
          ref_floor_id: string | null
          ref_property_id: string | null
          rent: number | null
          rent_ready: number | null
          rental_type: string | null
          sqft: number | null
          state: string | null
          unit_code: string | null
          unit_type: string | null
          userdefined_1: number | null
          userdefined_10: number | null
          userdefined_2: number | null
          userdefined_3: number | null
          userdefined_4: number | null
          userdefined_5: number | null
          userdefined_6: number | null
          userdefined_7: number | null
          userdefined_8: number | null
          userdefined_9: number | null
          zip_code: string | null
        }
        Insert: {
          address_1?: string | null
          address_2?: string | null
          address_3?: string | null
          address_4?: string | null
          attributes_1?: string | null
          attributes_10?: string | null
          attributes_2?: string | null
          attributes_3?: string | null
          attributes_4?: string | null
          attributes_5?: string | null
          attributes_6?: string | null
          attributes_7?: string | null
          attributes_8?: string | null
          attributes_9?: string | null
          available_date?: string | null
          bedrooms?: number | null
          bldg_code?: string | null
          city?: string | null
          country?: string | null
          date_ready?: string | null
          exclude?: number | null
          ext_ref_unit_id?: string | null
          floor_code?: string | null
          id?: number
          lease_type?: string | null
          location?: string | null
          mla?: string | null
          notes?: string | null
          property_code?: string | null
          ref_building_id?: string | null
          ref_floor_id?: string | null
          ref_property_id?: string | null
          rent?: number | null
          rent_ready?: number | null
          rental_type?: string | null
          sqft?: number | null
          state?: string | null
          unit_code?: string | null
          unit_type?: string | null
          userdefined_1?: number | null
          userdefined_10?: number | null
          userdefined_2?: number | null
          userdefined_3?: number | null
          userdefined_4?: number | null
          userdefined_5?: number | null
          userdefined_6?: number | null
          userdefined_7?: number | null
          userdefined_8?: number | null
          userdefined_9?: number | null
          zip_code?: string | null
        }
        Update: {
          address_1?: string | null
          address_2?: string | null
          address_3?: string | null
          address_4?: string | null
          attributes_1?: string | null
          attributes_10?: string | null
          attributes_2?: string | null
          attributes_3?: string | null
          attributes_4?: string | null
          attributes_5?: string | null
          attributes_6?: string | null
          attributes_7?: string | null
          attributes_8?: string | null
          attributes_9?: string | null
          available_date?: string | null
          bedrooms?: number | null
          bldg_code?: string | null
          city?: string | null
          country?: string | null
          date_ready?: string | null
          exclude?: number | null
          ext_ref_unit_id?: string | null
          floor_code?: string | null
          id?: number
          lease_type?: string | null
          location?: string | null
          mla?: string | null
          notes?: string | null
          property_code?: string | null
          ref_building_id?: string | null
          ref_floor_id?: string | null
          ref_property_id?: string | null
          rent?: number | null
          rent_ready?: number | null
          rental_type?: string | null
          sqft?: number | null
          state?: string | null
          unit_code?: string | null
          unit_type?: string | null
          userdefined_1?: number | null
          userdefined_10?: number | null
          userdefined_2?: number | null
          userdefined_3?: number | null
          userdefined_4?: number | null
          userdefined_5?: number | null
          userdefined_6?: number | null
          userdefined_7?: number | null
          userdefined_8?: number | null
          userdefined_9?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      communitxrefs: {
        Row: {
          amendment_sequence: string | null
          amendment_type: string | null
          id: number
          lease_code: string | null
          parent_amendment_sequence: string | null
          parent_amendment_type: string | null
          property_code: string | null
          proposal_type: string | null
          ref_lease_id: string | null
          ref_property_id: string | null
          ref_unit_id: string | null
          status: string | null
          unit_code: string | null
          unit_end_date: string | null
          unit_move_in_date: string | null
          unit_move_out_date: string | null
          unit_start_date: string | null
        }
        Insert: {
          amendment_sequence?: string | null
          amendment_type?: string | null
          id?: number
          lease_code?: string | null
          parent_amendment_sequence?: string | null
          parent_amendment_type?: string | null
          property_code?: string | null
          proposal_type?: string | null
          ref_lease_id?: string | null
          ref_property_id?: string | null
          ref_unit_id?: string | null
          status?: string | null
          unit_code?: string | null
          unit_end_date?: string | null
          unit_move_in_date?: string | null
          unit_move_out_date?: string | null
          unit_start_date?: string | null
        }
        Update: {
          amendment_sequence?: string | null
          amendment_type?: string | null
          id?: number
          lease_code?: string | null
          parent_amendment_sequence?: string | null
          parent_amendment_type?: string | null
          property_code?: string | null
          proposal_type?: string | null
          ref_lease_id?: string | null
          ref_property_id?: string | null
          ref_unit_id?: string | null
          status?: string | null
          unit_code?: string | null
          unit_end_date?: string | null
          unit_move_in_date?: string | null
          unit_move_out_date?: string | null
          unit_start_date?: string | null
        }
        Relationships: []
      }
      config: {
        Row: {
          id: number
          iv_encrypted: string | null
          key_encrypted: string | null
          password_encrypted: string
          sftp_server_encrypted: string
          userid: string
          username_encrypted: string
        }
        Insert: {
          id?: number
          iv_encrypted?: string | null
          key_encrypted?: string | null
          password_encrypted: string
          sftp_server_encrypted: string
          userid: string
          username_encrypted: string
        }
        Update: {
          id?: number
          iv_encrypted?: string | null
          key_encrypted?: string | null
          password_encrypted?: string
          sftp_server_encrypted?: string
          userid?: string
          username_encrypted?: string
        }
        Relationships: [
          {
            foreignKeyName: "config_userid_fkey"
            columns: ["userid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      errorfilesdownloaded: {
        Row: {
          client: string | null
          dbtype: string | null
          downloadeddate: string
          filepath: string
          id: number
          server: string | null
        }
        Insert: {
          client?: string | null
          dbtype?: string | null
          downloadeddate: string
          filepath: string
          id?: number
          server?: string | null
        }
        Update: {
          client?: string | null
          dbtype?: string | null
          downloadeddate?: string
          filepath?: string
          id?: number
          server?: string | null
        }
        Relationships: []
      }
      expensepools: {
        Row: {
          expensepoolcode: string | null
          expensepooldescription: string | null
          expensepoolid: number | null
          id: number
          propertycode: string | null
          propertyid: string | null
        }
        Insert: {
          expensepoolcode?: string | null
          expensepooldescription?: string | null
          expensepoolid?: number | null
          id?: number
          propertycode?: string | null
          propertyid?: string | null
        }
        Update: {
          expensepoolcode?: string | null
          expensepooldescription?: string | null
          expensepoolid?: number | null
          id?: number
          propertycode?: string | null
          propertyid?: string | null
        }
        Relationships: []
      }
      files: {
        Row: {
          base64string: string | null
          client: string | null
          filename: string | null
          id: number
        }
        Insert: {
          base64string?: string | null
          client?: string | null
          filename?: string | null
          id?: number
        }
        Update: {
          base64string?: string | null
          client?: string | null
          filename?: string | null
          id?: number
        }
        Relationships: []
      }
      filters: {
        Row: {
          page: string
          query_params: Json | null
          updated_at: string | null
          userid: string
        }
        Insert: {
          page: string
          query_params?: Json | null
          updated_at?: string | null
          userid: string
        }
        Update: {
          page?: string
          query_params?: Json | null
          updated_at?: string | null
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "filters_userid_fkey"
            columns: ["userid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      finpayables: {
        Row: {
          account: number | null
          accrual: number | null
          adjustment: number | null
          amount: number | null
          amount2: number | null
          category: string | null
          checknum: number | null
          citblevy: string | null
          company: string | null
          contract: string | null
          costcode: string | null
          creditmemo: number | null
          date: string | null
          desc: string | null
          detailfield1: string | null
          detailfield2: string | null
          detailfield3: string | null
          detailfield4: string | null
          detailfield5: string | null
          detailfield6: string | null
          detailfield7: string | null
          detailfield8: string | null
          detailtaxamount1: number | null
          detailtaxamount2: number | null
          detailtranamount: number | null
          detailvatrateid: string | null
          detailvattrantypeid: string | null
          displaytype: string | null
          documentsequencenumber: number | null
          duedate: string | null
          exchangerate: number | null
          exchangerate2: number | null
          exchangeratedate: string | null
          exchangeratedate2: string | null
          expensetype: string | null
          fromdate: string | null
          fundingentity: string | null
          id: number
          internationalpaymenttype: string | null
          isconsolidatechecks: string | null
          job: string | null
          labour: string | null
          manufacturingcosts: string | null
          material: string | null
          noncislabor: string | null
          notes: string | null
          notes2: string | null
          offset: number | null
          originaluref: string | null
          person: string | null
          podetailid: string | null
          ponum: string | null
          postmonth: string | null
          property: string | null
          ref: string | null
          ref_property_id: string | null
          retention: string | null
          segment1: string | null
          segment10: string | null
          segment11: string | null
          segment12: string | null
          segment2: string | null
          segment3: string | null
          segment4: string | null
          segment5: string | null
          segment6: string | null
          segment7: string | null
          segment8: string | null
          segment9: string | null
          todate: string | null
          trancurrencyid: string | null
          trandate: string | null
          trannum: number | null
          travel: string | null
          userdefinedfield1: string | null
          userdefinedfield10: string | null
          userdefinedfield2: string | null
          userdefinedfield3: string | null
          userdefinedfield4: string | null
          userdefinedfield5: string | null
          userdefinedfield6: string | null
          userdefinedfield7: string | null
          userdefinedfield8: string | null
          userdefinedfield9: string | null
          workflow: string | null
          workflowstatus: string | null
          workflowstep: string | null
        }
        Insert: {
          account?: number | null
          accrual?: number | null
          adjustment?: number | null
          amount?: number | null
          amount2?: number | null
          category?: string | null
          checknum?: number | null
          citblevy?: string | null
          company?: string | null
          contract?: string | null
          costcode?: string | null
          creditmemo?: number | null
          date?: string | null
          desc?: string | null
          detailfield1?: string | null
          detailfield2?: string | null
          detailfield3?: string | null
          detailfield4?: string | null
          detailfield5?: string | null
          detailfield6?: string | null
          detailfield7?: string | null
          detailfield8?: string | null
          detailtaxamount1?: number | null
          detailtaxamount2?: number | null
          detailtranamount?: number | null
          detailvatrateid?: string | null
          detailvattrantypeid?: string | null
          displaytype?: string | null
          documentsequencenumber?: number | null
          duedate?: string | null
          exchangerate?: number | null
          exchangerate2?: number | null
          exchangeratedate?: string | null
          exchangeratedate2?: string | null
          expensetype?: string | null
          fromdate?: string | null
          fundingentity?: string | null
          id?: number
          internationalpaymenttype?: string | null
          isconsolidatechecks?: string | null
          job?: string | null
          labour?: string | null
          manufacturingcosts?: string | null
          material?: string | null
          noncislabor?: string | null
          notes?: string | null
          notes2?: string | null
          offset?: number | null
          originaluref?: string | null
          person?: string | null
          podetailid?: string | null
          ponum?: string | null
          postmonth?: string | null
          property?: string | null
          ref?: string | null
          ref_property_id?: string | null
          retention?: string | null
          segment1?: string | null
          segment10?: string | null
          segment11?: string | null
          segment12?: string | null
          segment2?: string | null
          segment3?: string | null
          segment4?: string | null
          segment5?: string | null
          segment6?: string | null
          segment7?: string | null
          segment8?: string | null
          segment9?: string | null
          todate?: string | null
          trancurrencyid?: string | null
          trandate?: string | null
          trannum?: number | null
          travel?: string | null
          userdefinedfield1?: string | null
          userdefinedfield10?: string | null
          userdefinedfield2?: string | null
          userdefinedfield3?: string | null
          userdefinedfield4?: string | null
          userdefinedfield5?: string | null
          userdefinedfield6?: string | null
          userdefinedfield7?: string | null
          userdefinedfield8?: string | null
          userdefinedfield9?: string | null
          workflow?: string | null
          workflowstatus?: string | null
          workflowstep?: string | null
        }
        Update: {
          account?: number | null
          accrual?: number | null
          adjustment?: number | null
          amount?: number | null
          amount2?: number | null
          category?: string | null
          checknum?: number | null
          citblevy?: string | null
          company?: string | null
          contract?: string | null
          costcode?: string | null
          creditmemo?: number | null
          date?: string | null
          desc?: string | null
          detailfield1?: string | null
          detailfield2?: string | null
          detailfield3?: string | null
          detailfield4?: string | null
          detailfield5?: string | null
          detailfield6?: string | null
          detailfield7?: string | null
          detailfield8?: string | null
          detailtaxamount1?: number | null
          detailtaxamount2?: number | null
          detailtranamount?: number | null
          detailvatrateid?: string | null
          detailvattrantypeid?: string | null
          displaytype?: string | null
          documentsequencenumber?: number | null
          duedate?: string | null
          exchangerate?: number | null
          exchangerate2?: number | null
          exchangeratedate?: string | null
          exchangeratedate2?: string | null
          expensetype?: string | null
          fromdate?: string | null
          fundingentity?: string | null
          id?: number
          internationalpaymenttype?: string | null
          isconsolidatechecks?: string | null
          job?: string | null
          labour?: string | null
          manufacturingcosts?: string | null
          material?: string | null
          noncislabor?: string | null
          notes?: string | null
          notes2?: string | null
          offset?: number | null
          originaluref?: string | null
          person?: string | null
          podetailid?: string | null
          ponum?: string | null
          postmonth?: string | null
          property?: string | null
          ref?: string | null
          ref_property_id?: string | null
          retention?: string | null
          segment1?: string | null
          segment10?: string | null
          segment11?: string | null
          segment12?: string | null
          segment2?: string | null
          segment3?: string | null
          segment4?: string | null
          segment5?: string | null
          segment6?: string | null
          segment7?: string | null
          segment8?: string | null
          segment9?: string | null
          todate?: string | null
          trancurrencyid?: string | null
          trandate?: string | null
          trannum?: number | null
          travel?: string | null
          userdefinedfield1?: string | null
          userdefinedfield10?: string | null
          userdefinedfield2?: string | null
          userdefinedfield3?: string | null
          userdefinedfield4?: string | null
          userdefinedfield5?: string | null
          userdefinedfield6?: string | null
          userdefinedfield7?: string | null
          userdefinedfield8?: string | null
          userdefinedfield9?: string | null
          workflow?: string | null
          workflowstatus?: string | null
          workflowstep?: string | null
        }
        Relationships: []
      }
      finvendors: {
        Row: {
          address1: string | null
          address2: string | null
          address3: string | null
          address4: string | null
          alternate_email: string | null
          cheque_memo_from_invoice: number | null
          city: string | null
          consolidate: number | null
          contact: string | null
          country: string | null
          cross_border_tax_tran_type: string | null
          currency: string | null
          days_from_invoice_or_month: number | null
          default_ap_account: string | null
          default_cash_account: string | null
          discount_day: number | null
          discount_percent: number | null
          domestic_tax_tran_type: string | null
          eft: number | null
          email: string | null
          employee: number | null
          expense_type: string | null
          ext_ref_vendor_id: string | null
          external_id: number | null
          first_name: string | null
          gets: number | null
          government_id: string | null
          government_name: string | null
          hold_payments: number | null
          id: number
          inactive_date: string | null
          is_contractor: number | null
          is_inactive: number | null
          is_require_contract: number | null
          language: string | null
          last_name: string | null
          liability_expiration_date: string | null
          memo: string | null
          no_duplicate_invoice_on_same_date: number | null
          no_signature: number | null
          notes: string | null
          on_cheques_over: number | null
          payment_terms: number | null
          phone_number_1: string | null
          phone_number_10: string | null
          phone_number_2: string | null
          phone_number_3: string | null
          phone_number_4: string | null
          phone_number_5: string | null
          phone_number_6: string | null
          phone_number_7: string | null
          phone_number_8: string | null
          phone_number_9: string | null
          po_required: number | null
          priority: string | null
          prop_prompt: string | null
          pst_exempt: number | null
          sales_tax: number | null
          salutation: string | null
          state: string | null
          tag: string | null
          tax_authority: string | null
          tax_point: number | null
          tax_registered: number | null
          tax_registration_number: string | null
          user_defined_field1: string | null
          user_defined_field10: string | null
          user_defined_field11: string | null
          user_defined_field12: string | null
          user_defined_field2: string | null
          user_defined_field3: string | null
          user_defined_field4: string | null
          user_defined_field5: string | null
          user_defined_field6: string | null
          user_defined_field7: string | null
          user_defined_field8: string | null
          user_defined_field9: string | null
          userid: string
          usual_account_code: string | null
          vendor_code: string | null
          vendor_priority: number | null
          vendor_status: number | null
          workers_comp_expiration_date: string | null
          zipcode: string | null
        }
        Insert: {
          address1?: string | null
          address2?: string | null
          address3?: string | null
          address4?: string | null
          alternate_email?: string | null
          cheque_memo_from_invoice?: number | null
          city?: string | null
          consolidate?: number | null
          contact?: string | null
          country?: string | null
          cross_border_tax_tran_type?: string | null
          currency?: string | null
          days_from_invoice_or_month?: number | null
          default_ap_account?: string | null
          default_cash_account?: string | null
          discount_day?: number | null
          discount_percent?: number | null
          domestic_tax_tran_type?: string | null
          eft?: number | null
          email?: string | null
          employee?: number | null
          expense_type?: string | null
          ext_ref_vendor_id?: string | null
          external_id?: number | null
          first_name?: string | null
          gets?: number | null
          government_id?: string | null
          government_name?: string | null
          hold_payments?: number | null
          id?: number
          inactive_date?: string | null
          is_contractor?: number | null
          is_inactive?: number | null
          is_require_contract?: number | null
          language?: string | null
          last_name?: string | null
          liability_expiration_date?: string | null
          memo?: string | null
          no_duplicate_invoice_on_same_date?: number | null
          no_signature?: number | null
          notes?: string | null
          on_cheques_over?: number | null
          payment_terms?: number | null
          phone_number_1?: string | null
          phone_number_10?: string | null
          phone_number_2?: string | null
          phone_number_3?: string | null
          phone_number_4?: string | null
          phone_number_5?: string | null
          phone_number_6?: string | null
          phone_number_7?: string | null
          phone_number_8?: string | null
          phone_number_9?: string | null
          po_required?: number | null
          priority?: string | null
          prop_prompt?: string | null
          pst_exempt?: number | null
          sales_tax?: number | null
          salutation?: string | null
          state?: string | null
          tag?: string | null
          tax_authority?: string | null
          tax_point?: number | null
          tax_registered?: number | null
          tax_registration_number?: string | null
          user_defined_field1?: string | null
          user_defined_field10?: string | null
          user_defined_field11?: string | null
          user_defined_field12?: string | null
          user_defined_field2?: string | null
          user_defined_field3?: string | null
          user_defined_field4?: string | null
          user_defined_field5?: string | null
          user_defined_field6?: string | null
          user_defined_field7?: string | null
          user_defined_field8?: string | null
          user_defined_field9?: string | null
          userid: string
          usual_account_code?: string | null
          vendor_code?: string | null
          vendor_priority?: number | null
          vendor_status?: number | null
          workers_comp_expiration_date?: string | null
          zipcode?: string | null
        }
        Update: {
          address1?: string | null
          address2?: string | null
          address3?: string | null
          address4?: string | null
          alternate_email?: string | null
          cheque_memo_from_invoice?: number | null
          city?: string | null
          consolidate?: number | null
          contact?: string | null
          country?: string | null
          cross_border_tax_tran_type?: string | null
          currency?: string | null
          days_from_invoice_or_month?: number | null
          default_ap_account?: string | null
          default_cash_account?: string | null
          discount_day?: number | null
          discount_percent?: number | null
          domestic_tax_tran_type?: string | null
          eft?: number | null
          email?: string | null
          employee?: number | null
          expense_type?: string | null
          ext_ref_vendor_id?: string | null
          external_id?: number | null
          first_name?: string | null
          gets?: number | null
          government_id?: string | null
          government_name?: string | null
          hold_payments?: number | null
          id?: number
          inactive_date?: string | null
          is_contractor?: number | null
          is_inactive?: number | null
          is_require_contract?: number | null
          language?: string | null
          last_name?: string | null
          liability_expiration_date?: string | null
          memo?: string | null
          no_duplicate_invoice_on_same_date?: number | null
          no_signature?: number | null
          notes?: string | null
          on_cheques_over?: number | null
          payment_terms?: number | null
          phone_number_1?: string | null
          phone_number_10?: string | null
          phone_number_2?: string | null
          phone_number_3?: string | null
          phone_number_4?: string | null
          phone_number_5?: string | null
          phone_number_6?: string | null
          phone_number_7?: string | null
          phone_number_8?: string | null
          phone_number_9?: string | null
          po_required?: number | null
          priority?: string | null
          prop_prompt?: string | null
          pst_exempt?: number | null
          sales_tax?: number | null
          salutation?: string | null
          state?: string | null
          tag?: string | null
          tax_authority?: string | null
          tax_point?: number | null
          tax_registered?: number | null
          tax_registration_number?: string | null
          user_defined_field1?: string | null
          user_defined_field10?: string | null
          user_defined_field11?: string | null
          user_defined_field12?: string | null
          user_defined_field2?: string | null
          user_defined_field3?: string | null
          user_defined_field4?: string | null
          user_defined_field5?: string | null
          user_defined_field6?: string | null
          user_defined_field7?: string | null
          user_defined_field8?: string | null
          user_defined_field9?: string | null
          userid?: string
          usual_account_code?: string | null
          vendor_code?: string | null
          vendor_priority?: number | null
          vendor_status?: number | null
          workers_comp_expiration_date?: string | null
          zipcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finvendors_userid_fkey"
            columns: ["userid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      glaccts: {
        Row: {
          account_code: string | null
          account_type: number | null
          advance: number | null
          ap_account: number | null
          ar_account: number | null
          cash_account: number | null
          chart: string | null
          commisionable: number | null
          construction: number | null
          control_account: number | null
          description: string | null
          double_underline: number | null
          exclude_from_ap_iat: number | null
          exclude_from_budget: number | null
          exclude_from_reg: number | null
          exclude_from_use: number | null
          exempt_1099: number | null
          expense_account: number | null
          external_id: number | null
          hold_for: string | null
          iat_account: string | null
          id: number
          include_in_cash_flow: number | null
          margin: number | null
          normal_balance: number | null
          notes: string | null
          offset: string | null
          payable: string | null
          percentage_divisor: number | null
          prepaid_ar_account: string | null
          prepay_holding: number | null
          print_bold: number | null
          print_end_inc_stmt_perc: number | null
          print_italic: number | null
          receivable: string | null
          recoverability: string | null
          report_type: number | null
          subject_to_late_fee: number | null
          summary: number | null
          suppress_financial: number | null
          system_account: string | null
          tax_account: number | null
          tenant_deposit: number | null
          total_into: string | null
          user_defined_1: string | null
          user_defined_2: string | null
          user_defined_3: string | null
          user_defined_4: string | null
          userid: string
          wip_account: number | null
        }
        Insert: {
          account_code?: string | null
          account_type?: number | null
          advance?: number | null
          ap_account?: number | null
          ar_account?: number | null
          cash_account?: number | null
          chart?: string | null
          commisionable?: number | null
          construction?: number | null
          control_account?: number | null
          description?: string | null
          double_underline?: number | null
          exclude_from_ap_iat?: number | null
          exclude_from_budget?: number | null
          exclude_from_reg?: number | null
          exclude_from_use?: number | null
          exempt_1099?: number | null
          expense_account?: number | null
          external_id?: number | null
          hold_for?: string | null
          iat_account?: string | null
          id?: number
          include_in_cash_flow?: number | null
          margin?: number | null
          normal_balance?: number | null
          notes?: string | null
          offset?: string | null
          payable?: string | null
          percentage_divisor?: number | null
          prepaid_ar_account?: string | null
          prepay_holding?: number | null
          print_bold?: number | null
          print_end_inc_stmt_perc?: number | null
          print_italic?: number | null
          receivable?: string | null
          recoverability?: string | null
          report_type?: number | null
          subject_to_late_fee?: number | null
          summary?: number | null
          suppress_financial?: number | null
          system_account?: string | null
          tax_account?: number | null
          tenant_deposit?: number | null
          total_into?: string | null
          user_defined_1?: string | null
          user_defined_2?: string | null
          user_defined_3?: string | null
          user_defined_4?: string | null
          userid: string
          wip_account?: number | null
        }
        Update: {
          account_code?: string | null
          account_type?: number | null
          advance?: number | null
          ap_account?: number | null
          ar_account?: number | null
          cash_account?: number | null
          chart?: string | null
          commisionable?: number | null
          construction?: number | null
          control_account?: number | null
          description?: string | null
          double_underline?: number | null
          exclude_from_ap_iat?: number | null
          exclude_from_budget?: number | null
          exclude_from_reg?: number | null
          exclude_from_use?: number | null
          exempt_1099?: number | null
          expense_account?: number | null
          external_id?: number | null
          hold_for?: string | null
          iat_account?: string | null
          id?: number
          include_in_cash_flow?: number | null
          margin?: number | null
          normal_balance?: number | null
          notes?: string | null
          offset?: string | null
          payable?: string | null
          percentage_divisor?: number | null
          prepaid_ar_account?: string | null
          prepay_holding?: number | null
          print_bold?: number | null
          print_end_inc_stmt_perc?: number | null
          print_italic?: number | null
          receivable?: string | null
          recoverability?: string | null
          report_type?: number | null
          subject_to_late_fee?: number | null
          summary?: number | null
          suppress_financial?: number | null
          system_account?: string | null
          tax_account?: number | null
          tenant_deposit?: number | null
          total_into?: string | null
          user_defined_1?: string | null
          user_defined_2?: string | null
          user_defined_3?: string | null
          user_defined_4?: string | null
          userid?: string
          wip_account?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "glaccts_userid_fkey"
            columns: ["userid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      interface_errors: {
        Row: {
          dateexported: string | null
          errortext: string | null
          errortype: string | null
          fieldvalue: string | null
          id: number
          linenumber: string | null
          objectcode: string | null
          property_code: string | null
          sfile: string | null
          userid: string
        }
        Insert: {
          dateexported?: string | null
          errortext?: string | null
          errortype?: string | null
          fieldvalue?: string | null
          id?: number
          linenumber?: string | null
          objectcode?: string | null
          property_code?: string | null
          sfile?: string | null
          userid: string
        }
        Update: {
          dateexported?: string | null
          errortext?: string | null
          errortype?: string | null
          fieldvalue?: string | null
          id?: number
          linenumber?: string | null
          objectcode?: string | null
          property_code?: string | null
          sfile?: string | null
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "interface_errors_userid_fkey"
            columns: ["userid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      jsontransetl: {
        Row: {
          data: Json | null
          id: number
          iscomplete: boolean | null
          userid: string
        }
        Insert: {
          data?: Json | null
          id?: number
          iscomplete?: boolean | null
          userid: string
        }
        Update: {
          data?: Json | null
          id?: number
          iscomplete?: boolean | null
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "jsontransetl_userid_fkey"
            columns: ["userid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      lease: {
        Row: {
          activate: number | null
          activation_date: string | null
          adjustment: number | null
          amendment_description: string | null
          amendment_sequence: number | null
          amendment_status: number | null
          amendment_type: number | null
          anchor: number | null
          at_risk: string | null
          base_percentage: number | null
          base_percentage2: number | null
          bill_to_customer: number | null
          billing_contact_code: string | null
          brand: string | null
          calc_basis_gross: number | null
          charge_increase_type: string | null
          charge_on_unpaid: number | null
          company_name: string | null
          contract_end_date: string | null
          contracted_area: number | null
          customer_code: string | null
          days_in_year: number | null
          default_sales_tran_type: string | null
          due_day: number | null
          ext_billing_contact_code: string | null
          ext_primary_contact_code: string | null
          ext_ref_lease_id: string | null
          factor: number | null
          general_info_1: string | null
          general_info_10: string | null
          general_info_11: string | null
          general_info_12: string | null
          general_info_13: string | null
          general_info_14: string | null
          general_info_2: string | null
          general_info_3: string | null
          general_info_4: string | null
          general_info_5: string | null
          general_info_6: string | null
          general_info_7: string | null
          general_info_8: string | null
          general_info_9: string | null
          grace_period: number | null
          grace_period2: number | null
          guarantee_required: string | null
          holdover_percentage: number | null
          ics_code: string | null
          id: number
          interest_index: string | null
          is_cml_lease: string | null
          late_fee_calc_type: number | null
          late_fee_calc_type2: number | null
          late_fee_interest_free: number | null
          late_fee_per_day: number | null
          lease_code: string | null
          lease_currency: string | null
          lease_end_date: string | null
          lease_move_in_date: string | null
          lease_name: string | null
          lease_start_date: string | null
          lease_term: number | null
          lease_type: string | null
          max_number_days: number | null
          max_percentage: number | null
          max_threshold: number | null
          max_total_fee_percentage: number | null
          max_total_fee_type: string | null
          method_of_payment: number | null
          min_percentage: number | null
          min_threshold: number | null
          minimum_due: number | null
          modification_type: number | null
          month_to_month: number | null
          move_out_date: string | null
          notes: string | null
          occupancy_cert_date: string | null
          other_info_1: string | null
          other_info_10: string | null
          other_info_11: string | null
          other_info_12: string | null
          other_info_13: string | null
          other_info_14: string | null
          other_info_15: string | null
          other_info_16: string | null
          other_info_17: string | null
          other_info_18: string | null
          other_info_19: string | null
          other_info_2: string | null
          other_info_20: string | null
          other_info_21: string | null
          other_info_3: string | null
          other_info_4: string | null
          other_info_5: string | null
          other_info_6: string | null
          other_info_7: string | null
          other_info_8: string | null
          other_info_9: string | null
          parent_amendment_sequence: string | null
          parent_amendment_type: string | null
          payment_type: number | null
          possession_date: string | null
          preferred_language: string | null
          primary_contact_code: string | null
          property_code: string | null
          rate_provider: string | null
          rate_type: string | null
          ref_customer_id: string | null
          ref_property_id: string | null
          sales_category: string | null
          sales_currency: string | null
          sales_rate_provider: string | null
          sales_rate_type: string | null
          security_deposit: number | null
          separate_amendment_terms: number | null
          sign_date: string | null
          sub_type: number | null
          tenant_notes: string | null
          vat_reg_number: string | null
        }
        Insert: {
          activate?: number | null
          activation_date?: string | null
          adjustment?: number | null
          amendment_description?: string | null
          amendment_sequence?: number | null
          amendment_status?: number | null
          amendment_type?: number | null
          anchor?: number | null
          at_risk?: string | null
          base_percentage?: number | null
          base_percentage2?: number | null
          bill_to_customer?: number | null
          billing_contact_code?: string | null
          brand?: string | null
          calc_basis_gross?: number | null
          charge_increase_type?: string | null
          charge_on_unpaid?: number | null
          company_name?: string | null
          contract_end_date?: string | null
          contracted_area?: number | null
          customer_code?: string | null
          days_in_year?: number | null
          default_sales_tran_type?: string | null
          due_day?: number | null
          ext_billing_contact_code?: string | null
          ext_primary_contact_code?: string | null
          ext_ref_lease_id?: string | null
          factor?: number | null
          general_info_1?: string | null
          general_info_10?: string | null
          general_info_11?: string | null
          general_info_12?: string | null
          general_info_13?: string | null
          general_info_14?: string | null
          general_info_2?: string | null
          general_info_3?: string | null
          general_info_4?: string | null
          general_info_5?: string | null
          general_info_6?: string | null
          general_info_7?: string | null
          general_info_8?: string | null
          general_info_9?: string | null
          grace_period?: number | null
          grace_period2?: number | null
          guarantee_required?: string | null
          holdover_percentage?: number | null
          ics_code?: string | null
          id?: number
          interest_index?: string | null
          is_cml_lease?: string | null
          late_fee_calc_type?: number | null
          late_fee_calc_type2?: number | null
          late_fee_interest_free?: number | null
          late_fee_per_day?: number | null
          lease_code?: string | null
          lease_currency?: string | null
          lease_end_date?: string | null
          lease_move_in_date?: string | null
          lease_name?: string | null
          lease_start_date?: string | null
          lease_term?: number | null
          lease_type?: string | null
          max_number_days?: number | null
          max_percentage?: number | null
          max_threshold?: number | null
          max_total_fee_percentage?: number | null
          max_total_fee_type?: string | null
          method_of_payment?: number | null
          min_percentage?: number | null
          min_threshold?: number | null
          minimum_due?: number | null
          modification_type?: number | null
          month_to_month?: number | null
          move_out_date?: string | null
          notes?: string | null
          occupancy_cert_date?: string | null
          other_info_1?: string | null
          other_info_10?: string | null
          other_info_11?: string | null
          other_info_12?: string | null
          other_info_13?: string | null
          other_info_14?: string | null
          other_info_15?: string | null
          other_info_16?: string | null
          other_info_17?: string | null
          other_info_18?: string | null
          other_info_19?: string | null
          other_info_2?: string | null
          other_info_20?: string | null
          other_info_21?: string | null
          other_info_3?: string | null
          other_info_4?: string | null
          other_info_5?: string | null
          other_info_6?: string | null
          other_info_7?: string | null
          other_info_8?: string | null
          other_info_9?: string | null
          parent_amendment_sequence?: string | null
          parent_amendment_type?: string | null
          payment_type?: number | null
          possession_date?: string | null
          preferred_language?: string | null
          primary_contact_code?: string | null
          property_code?: string | null
          rate_provider?: string | null
          rate_type?: string | null
          ref_customer_id?: string | null
          ref_property_id?: string | null
          sales_category?: string | null
          sales_currency?: string | null
          sales_rate_provider?: string | null
          sales_rate_type?: string | null
          security_deposit?: number | null
          separate_amendment_terms?: number | null
          sign_date?: string | null
          sub_type?: number | null
          tenant_notes?: string | null
          vat_reg_number?: string | null
        }
        Update: {
          activate?: number | null
          activation_date?: string | null
          adjustment?: number | null
          amendment_description?: string | null
          amendment_sequence?: number | null
          amendment_status?: number | null
          amendment_type?: number | null
          anchor?: number | null
          at_risk?: string | null
          base_percentage?: number | null
          base_percentage2?: number | null
          bill_to_customer?: number | null
          billing_contact_code?: string | null
          brand?: string | null
          calc_basis_gross?: number | null
          charge_increase_type?: string | null
          charge_on_unpaid?: number | null
          company_name?: string | null
          contract_end_date?: string | null
          contracted_area?: number | null
          customer_code?: string | null
          days_in_year?: number | null
          default_sales_tran_type?: string | null
          due_day?: number | null
          ext_billing_contact_code?: string | null
          ext_primary_contact_code?: string | null
          ext_ref_lease_id?: string | null
          factor?: number | null
          general_info_1?: string | null
          general_info_10?: string | null
          general_info_11?: string | null
          general_info_12?: string | null
          general_info_13?: string | null
          general_info_14?: string | null
          general_info_2?: string | null
          general_info_3?: string | null
          general_info_4?: string | null
          general_info_5?: string | null
          general_info_6?: string | null
          general_info_7?: string | null
          general_info_8?: string | null
          general_info_9?: string | null
          grace_period?: number | null
          grace_period2?: number | null
          guarantee_required?: string | null
          holdover_percentage?: number | null
          ics_code?: string | null
          id?: number
          interest_index?: string | null
          is_cml_lease?: string | null
          late_fee_calc_type?: number | null
          late_fee_calc_type2?: number | null
          late_fee_interest_free?: number | null
          late_fee_per_day?: number | null
          lease_code?: string | null
          lease_currency?: string | null
          lease_end_date?: string | null
          lease_move_in_date?: string | null
          lease_name?: string | null
          lease_start_date?: string | null
          lease_term?: number | null
          lease_type?: string | null
          max_number_days?: number | null
          max_percentage?: number | null
          max_threshold?: number | null
          max_total_fee_percentage?: number | null
          max_total_fee_type?: string | null
          method_of_payment?: number | null
          min_percentage?: number | null
          min_threshold?: number | null
          minimum_due?: number | null
          modification_type?: number | null
          month_to_month?: number | null
          move_out_date?: string | null
          notes?: string | null
          occupancy_cert_date?: string | null
          other_info_1?: string | null
          other_info_10?: string | null
          other_info_11?: string | null
          other_info_12?: string | null
          other_info_13?: string | null
          other_info_14?: string | null
          other_info_15?: string | null
          other_info_16?: string | null
          other_info_17?: string | null
          other_info_18?: string | null
          other_info_19?: string | null
          other_info_2?: string | null
          other_info_20?: string | null
          other_info_21?: string | null
          other_info_3?: string | null
          other_info_4?: string | null
          other_info_5?: string | null
          other_info_6?: string | null
          other_info_7?: string | null
          other_info_8?: string | null
          other_info_9?: string | null
          parent_amendment_sequence?: string | null
          parent_amendment_type?: string | null
          payment_type?: number | null
          possession_date?: string | null
          preferred_language?: string | null
          primary_contact_code?: string | null
          property_code?: string | null
          rate_provider?: string | null
          rate_type?: string | null
          ref_customer_id?: string | null
          ref_property_id?: string | null
          sales_category?: string | null
          sales_currency?: string | null
          sales_rate_provider?: string | null
          sales_rate_type?: string | null
          security_deposit?: number | null
          separate_amendment_terms?: number | null
          sign_date?: string | null
          sub_type?: number | null
          tenant_notes?: string | null
          vat_reg_number?: string | null
        }
        Relationships: []
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      product_details: {
        Row: {
          detail_text: string
          detail_type: string
          id: number
          product_id: string | null
        }
        Insert: {
          detail_text: string
          detail_type: string
          id?: number
          product_id?: string | null
        }
        Update: {
          detail_text?: string
          detail_type?: string
          id?: number
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_details_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      property: {
        Row: {
          baccrual: number | null
          bassociation: number | null
          bcommposted: number | null
          bcommtype: number | null
          bestate: number | null
          bexclude: number | null
          bexcludemodels: number | null
          binactive: number | null
          bresidentscreening: number | null
          bsite: number | null
          bsitestuff: number | null
          bvendorcafe: number | null
          cnsffee: number | null
          dcommamt: number | null
          dgstrate: number | null
          dlatepercent: number | null
          dpprice: number | null
          dsalesprice: number | null
          dtcreated: string | null
          dteffective: string | null
          dtinactive: string | null
          dtlastmodified: string | null
          dtmgmtdate: string | null
          dtncreifinservice: string | null
          dtncreifstopsubmission: string | null
          dtresidentscreeningsync: string | null
          dtstamp: string | null
          dtvcsync: string | null
          dwocomm: number | null
          fsalestax: number | null
          hcommmla: number | null
          hcompany: number | null
          hcopyfrom: number | null
          hcountry: number | null
          hestate: number | null
          hforeigndb: number | null
          hideallease: number | null
          hincentiverateid: number | null
          hinctable: number | null
          hlegalentity: number | null
          hmktrecexppool: number | null
          hmvendor: number | null
          hmy: number
          hnsfchgcode: number | null
          hpayer: number | null
          hpropstorage: number | null
          htax: number | null
          husercreatedby: number | null
          husermodifiedby: number | null
          husualacct: number | null
          iendofyear: number | null
          ienttype: number | null
          ilatetype: number | null
          imktrentaltype: number | null
          iportfolio: number | null
          ipropreportingtype: number | null
          iproptype: number | null
          irerent: number | null
          isubtypeassoc: number | null
          itype: number | null
          itype2: number | null
          itypeaffordable: number | null
          itypeassociation: number | null
          itypecommercial: number | null
          itypecondo: number | null
          itypecoop: number | null
          itypecsh: number | null
          itypeinternational: number | null
          itypemilitary: number | null
          itypepublichousing: number | null
          ityperes: number | null
          itypesenior: number | null
          itypestorage: number | null
          itypestudent: number | null
          iunittypes: number | null
          sacquire: string | null
          saddr1: string | null
          saddr2: string | null
          saddr3: string | null
          saddr4: string | null
          scashreserve: number | null
          scity: string | null
          scode: string | null
          scommmin: number | null
          scommpostedamt: number | null
          sdispose: string | null
          sextraaddrline: string | null
          sextreference: string | null
          shmprojecttype: string | null
          slatemin: number | null
          slateperday: number | null
          smaintlimit: number | null
          sncreif: string | null
          speriod: string | null
          spropstorattn: string | null
          sstate: string | null
          szipcode: string | null
          trowversion: string | null
        }
        Insert: {
          baccrual?: number | null
          bassociation?: number | null
          bcommposted?: number | null
          bcommtype?: number | null
          bestate?: number | null
          bexclude?: number | null
          bexcludemodels?: number | null
          binactive?: number | null
          bresidentscreening?: number | null
          bsite?: number | null
          bsitestuff?: number | null
          bvendorcafe?: number | null
          cnsffee?: number | null
          dcommamt?: number | null
          dgstrate?: number | null
          dlatepercent?: number | null
          dpprice?: number | null
          dsalesprice?: number | null
          dtcreated?: string | null
          dteffective?: string | null
          dtinactive?: string | null
          dtlastmodified?: string | null
          dtmgmtdate?: string | null
          dtncreifinservice?: string | null
          dtncreifstopsubmission?: string | null
          dtresidentscreeningsync?: string | null
          dtstamp?: string | null
          dtvcsync?: string | null
          dwocomm?: number | null
          fsalestax?: number | null
          hcommmla?: number | null
          hcompany?: number | null
          hcopyfrom?: number | null
          hcountry?: number | null
          hestate?: number | null
          hforeigndb?: number | null
          hideallease?: number | null
          hincentiverateid?: number | null
          hinctable?: number | null
          hlegalentity?: number | null
          hmktrecexppool?: number | null
          hmvendor?: number | null
          hmy?: number
          hnsfchgcode?: number | null
          hpayer?: number | null
          hpropstorage?: number | null
          htax?: number | null
          husercreatedby?: number | null
          husermodifiedby?: number | null
          husualacct?: number | null
          iendofyear?: number | null
          ienttype?: number | null
          ilatetype?: number | null
          imktrentaltype?: number | null
          iportfolio?: number | null
          ipropreportingtype?: number | null
          iproptype?: number | null
          irerent?: number | null
          isubtypeassoc?: number | null
          itype?: number | null
          itype2?: number | null
          itypeaffordable?: number | null
          itypeassociation?: number | null
          itypecommercial?: number | null
          itypecondo?: number | null
          itypecoop?: number | null
          itypecsh?: number | null
          itypeinternational?: number | null
          itypemilitary?: number | null
          itypepublichousing?: number | null
          ityperes?: number | null
          itypesenior?: number | null
          itypestorage?: number | null
          itypestudent?: number | null
          iunittypes?: number | null
          sacquire?: string | null
          saddr1?: string | null
          saddr2?: string | null
          saddr3?: string | null
          saddr4?: string | null
          scashreserve?: number | null
          scity?: string | null
          scode?: string | null
          scommmin?: number | null
          scommpostedamt?: number | null
          sdispose?: string | null
          sextraaddrline?: string | null
          sextreference?: string | null
          shmprojecttype?: string | null
          slatemin?: number | null
          slateperday?: number | null
          smaintlimit?: number | null
          sncreif?: string | null
          speriod?: string | null
          spropstorattn?: string | null
          sstate?: string | null
          szipcode?: string | null
          trowversion?: string | null
        }
        Update: {
          baccrual?: number | null
          bassociation?: number | null
          bcommposted?: number | null
          bcommtype?: number | null
          bestate?: number | null
          bexclude?: number | null
          bexcludemodels?: number | null
          binactive?: number | null
          bresidentscreening?: number | null
          bsite?: number | null
          bsitestuff?: number | null
          bvendorcafe?: number | null
          cnsffee?: number | null
          dcommamt?: number | null
          dgstrate?: number | null
          dlatepercent?: number | null
          dpprice?: number | null
          dsalesprice?: number | null
          dtcreated?: string | null
          dteffective?: string | null
          dtinactive?: string | null
          dtlastmodified?: string | null
          dtmgmtdate?: string | null
          dtncreifinservice?: string | null
          dtncreifstopsubmission?: string | null
          dtresidentscreeningsync?: string | null
          dtstamp?: string | null
          dtvcsync?: string | null
          dwocomm?: number | null
          fsalestax?: number | null
          hcommmla?: number | null
          hcompany?: number | null
          hcopyfrom?: number | null
          hcountry?: number | null
          hestate?: number | null
          hforeigndb?: number | null
          hideallease?: number | null
          hincentiverateid?: number | null
          hinctable?: number | null
          hlegalentity?: number | null
          hmktrecexppool?: number | null
          hmvendor?: number | null
          hmy?: number
          hnsfchgcode?: number | null
          hpayer?: number | null
          hpropstorage?: number | null
          htax?: number | null
          husercreatedby?: number | null
          husermodifiedby?: number | null
          husualacct?: number | null
          iendofyear?: number | null
          ienttype?: number | null
          ilatetype?: number | null
          imktrentaltype?: number | null
          iportfolio?: number | null
          ipropreportingtype?: number | null
          iproptype?: number | null
          irerent?: number | null
          isubtypeassoc?: number | null
          itype?: number | null
          itype2?: number | null
          itypeaffordable?: number | null
          itypeassociation?: number | null
          itypecommercial?: number | null
          itypecondo?: number | null
          itypecoop?: number | null
          itypecsh?: number | null
          itypeinternational?: number | null
          itypemilitary?: number | null
          itypepublichousing?: number | null
          ityperes?: number | null
          itypesenior?: number | null
          itypestorage?: number | null
          itypestudent?: number | null
          iunittypes?: number | null
          sacquire?: string | null
          saddr1?: string | null
          saddr2?: string | null
          saddr3?: string | null
          saddr4?: string | null
          scashreserve?: number | null
          scity?: string | null
          scode?: string | null
          scommmin?: number | null
          scommpostedamt?: number | null
          sdispose?: string | null
          sextraaddrline?: string | null
          sextreference?: string | null
          shmprojecttype?: string | null
          slatemin?: number | null
          slateperday?: number | null
          smaintlimit?: number | null
          sncreif?: string | null
          speriod?: string | null
          spropstorattn?: string | null
          sstate?: string | null
          szipcode?: string | null
          trowversion?: string | null
        }
        Relationships: []
      }
      propoptions: {
        Row: {
          client: string | null
          date: string | null
          handlevalue: string | null
          handlevalueint: string | null
          id: number
          property_code: string | null
          property_name: string | null
          stringvalue: string | null
          type: string | null
          userid: string
        }
        Insert: {
          client?: string | null
          date?: string | null
          handlevalue?: string | null
          handlevalueint?: string | null
          id?: number
          property_code?: string | null
          property_name?: string | null
          stringvalue?: string | null
          type?: string | null
          userid: string
        }
        Update: {
          client?: string | null
          date?: string | null
          handlevalue?: string | null
          handlevalueint?: string | null
          id?: number
          property_code?: string | null
          property_name?: string | null
          stringvalue?: string | null
          type?: string | null
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "propoptions_userid_fkey"
            columns: ["userid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recoveryprofiles: {
        Row: {
          adminchargeid: string | null
          adminfeepercentage: string | null
          adminfeetype: string | null
          baseamount: string | null
          baserule: string | null
          capappliesto: string | null
          capincreasebasis: string | null
          capincreaseoveryr: string | null
          capincreasepct: string | null
          ceilingamount: string | null
          ceilingtype: string | null
          cpifactor: string | null
          cpiid: string | null
          cpimonth: string | null
          dcfareacolumn: string | null
          dcfoverride: string | null
          dcfrecoverytype: string | null
          donotcreatecharges: string | null
          endofyearmonth: string | null
          estimatechargecode: string | null
          estimatechargeid: string | null
          expensepoolcode: string | null
          expensepooldescription: string | null
          frequencycalculation: string | null
          frequencyreconciliation: string | null
          groupcode: string | null
          groupid: string | null
          id: number
          isbaseamountcredit: string | null
          isexcludereconciliation: string | null
          issalestaxadmin: string | null
          leasetypecode: string | null
          leasetypedesc: string | null
          leasetypeid: string | null
          maxamounttype: string | null
          maximumamount: string | null
          maximumincrease: string | null
          minamounttype: string | null
          minimumincrease: string | null
          miscchargeid: string | null
          occupancydate: string | null
          parentgroupid: string | null
          propertycode: string | null
          propertyid: string | null
          reconcilechargecode: string | null
          recovcostsetid: string | null
          taxchargecodeid: string | null
          taxrate: string | null
          trueupchargeid: string | null
          useoccupancydate: string | null
        }
        Insert: {
          adminchargeid?: string | null
          adminfeepercentage?: string | null
          adminfeetype?: string | null
          baseamount?: string | null
          baserule?: string | null
          capappliesto?: string | null
          capincreasebasis?: string | null
          capincreaseoveryr?: string | null
          capincreasepct?: string | null
          ceilingamount?: string | null
          ceilingtype?: string | null
          cpifactor?: string | null
          cpiid?: string | null
          cpimonth?: string | null
          dcfareacolumn?: string | null
          dcfoverride?: string | null
          dcfrecoverytype?: string | null
          donotcreatecharges?: string | null
          endofyearmonth?: string | null
          estimatechargecode?: string | null
          estimatechargeid?: string | null
          expensepoolcode?: string | null
          expensepooldescription?: string | null
          frequencycalculation?: string | null
          frequencyreconciliation?: string | null
          groupcode?: string | null
          groupid?: string | null
          id: number
          isbaseamountcredit?: string | null
          isexcludereconciliation?: string | null
          issalestaxadmin?: string | null
          leasetypecode?: string | null
          leasetypedesc?: string | null
          leasetypeid?: string | null
          maxamounttype?: string | null
          maximumamount?: string | null
          maximumincrease?: string | null
          minamounttype?: string | null
          minimumincrease?: string | null
          miscchargeid?: string | null
          occupancydate?: string | null
          parentgroupid?: string | null
          propertycode?: string | null
          propertyid?: string | null
          reconcilechargecode?: string | null
          recovcostsetid?: string | null
          taxchargecodeid?: string | null
          taxrate?: string | null
          trueupchargeid?: string | null
          useoccupancydate?: string | null
        }
        Update: {
          adminchargeid?: string | null
          adminfeepercentage?: string | null
          adminfeetype?: string | null
          baseamount?: string | null
          baserule?: string | null
          capappliesto?: string | null
          capincreasebasis?: string | null
          capincreaseoveryr?: string | null
          capincreasepct?: string | null
          ceilingamount?: string | null
          ceilingtype?: string | null
          cpifactor?: string | null
          cpiid?: string | null
          cpimonth?: string | null
          dcfareacolumn?: string | null
          dcfoverride?: string | null
          dcfrecoverytype?: string | null
          donotcreatecharges?: string | null
          endofyearmonth?: string | null
          estimatechargecode?: string | null
          estimatechargeid?: string | null
          expensepoolcode?: string | null
          expensepooldescription?: string | null
          frequencycalculation?: string | null
          frequencyreconciliation?: string | null
          groupcode?: string | null
          groupid?: string | null
          id?: number
          isbaseamountcredit?: string | null
          isexcludereconciliation?: string | null
          issalestaxadmin?: string | null
          leasetypecode?: string | null
          leasetypedesc?: string | null
          leasetypeid?: string | null
          maxamounttype?: string | null
          maximumamount?: string | null
          maximumincrease?: string | null
          minamounttype?: string | null
          minimumincrease?: string | null
          miscchargeid?: string | null
          occupancydate?: string | null
          parentgroupid?: string | null
          propertycode?: string | null
          propertyid?: string | null
          reconcilechargecode?: string | null
          recovcostsetid?: string | null
          taxchargecodeid?: string | null
          taxrate?: string | null
          trueupchargeid?: string | null
          useoccupancydate?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          enabled: boolean | null
          id: number
          label: string
          name: string
          userid: string
          value: string | null
        }
        Insert: {
          enabled?: boolean | null
          id?: number
          label: string
          name: string
          userid: string
          value?: string | null
        }
        Update: {
          enabled?: boolean | null
          id?: number
          label?: string
          name?: string
          userid?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_userid_fkey"
            columns: ["userid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      trans_files: {
        Row: {
          filename: string | null
          id: number
          transetl_id: number | null
        }
        Insert: {
          filename?: string | null
          id?: number
          transetl_id?: number | null
        }
        Update: {
          filename?: string | null
          id?: number
          transetl_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trans_files_transetl_id_fkey"
            columns: ["transetl_id"]
            referencedRelation: "transetl"
            referencedColumns: ["id"]
          }
        ]
      }
      transetl: {
        Row: {
          account: string | null
          accrual: string | null
          adjustment: string | null
          amount: string | null
          amount2: string | null
          category: string | null
          checknum: string | null
          citblevy: string | null
          company: string | null
          contract: string | null
          costcode: string | null
          creditmemo: string | null
          date: string | null
          desc: string | null
          detailfield1: string | null
          detailfield2: string | null
          detailfield3: string | null
          detailfield4: string | null
          detailfield5: string | null
          detailfield6: string | null
          detailfield7: string | null
          detailfield8: string | null
          detailtaxamount1: string | null
          detailtaxamount2: string | null
          detailtranamount: string | null
          detailvatrateid: string | null
          detailvattrantypeid: string | null
          displaytype: string | null
          documentsequencenumber: string | null
          duedate: string | null
          exchangerate: string | null
          exchangerate2: string | null
          exchangeratedate: string | null
          exchangeratedate2: string | null
          expensetype: string | null
          fromdate: string | null
          fundingentity: string | null
          id: number
          internationalpaymenttype: string | null
          is1099exempt: number | null
          isconsolidatechecks: string | null
          job: string | null
          labour: string | null
          manufacturingcosts: string | null
          material: string | null
          noncislabor: string | null
          notes: string | null
          notes2: string | null
          offset: string | null
          originaluref: string | null
          person: string | null
          podetailid: string | null
          ponum: string | null
          postmonth: string | null
          property: string | null
          ref: string | null
          ref_property_id: string | null
          remittancevendor: string | null
          retention: string | null
          segment1: string | null
          segment10: string | null
          segment11: string | null
          segment12: string | null
          segment2: string | null
          segment3: string | null
          segment4: string | null
          segment5: string | null
          segment6: string | null
          segment7: string | null
          segment8: string | null
          segment9: string | null
          todate: string | null
          trancurrencyid: string | null
          trandate: string | null
          trannum: string | null
          travel: string | null
          userdefinedfield1: string | null
          userdefinedfield10: string | null
          userdefinedfield2: string | null
          userdefinedfield3: string | null
          userdefinedfield4: string | null
          userdefinedfield5: string | null
          userdefinedfield6: string | null
          userdefinedfield7: string | null
          userdefinedfield8: string | null
          userdefinedfield9: string | null
          userid: string | null
          workflow: string | null
          workflowstatus: string | null
          workflowstep: string | null
        }
        Insert: {
          account?: string | null
          accrual?: string | null
          adjustment?: string | null
          amount?: string | null
          amount2?: string | null
          category?: string | null
          checknum?: string | null
          citblevy?: string | null
          company?: string | null
          contract?: string | null
          costcode?: string | null
          creditmemo?: string | null
          date?: string | null
          desc?: string | null
          detailfield1?: string | null
          detailfield2?: string | null
          detailfield3?: string | null
          detailfield4?: string | null
          detailfield5?: string | null
          detailfield6?: string | null
          detailfield7?: string | null
          detailfield8?: string | null
          detailtaxamount1?: string | null
          detailtaxamount2?: string | null
          detailtranamount?: string | null
          detailvatrateid?: string | null
          detailvattrantypeid?: string | null
          displaytype?: string | null
          documentsequencenumber?: string | null
          duedate?: string | null
          exchangerate?: string | null
          exchangerate2?: string | null
          exchangeratedate?: string | null
          exchangeratedate2?: string | null
          expensetype?: string | null
          fromdate?: string | null
          fundingentity?: string | null
          id?: number
          internationalpaymenttype?: string | null
          is1099exempt?: number | null
          isconsolidatechecks?: string | null
          job?: string | null
          labour?: string | null
          manufacturingcosts?: string | null
          material?: string | null
          noncislabor?: string | null
          notes?: string | null
          notes2?: string | null
          offset?: string | null
          originaluref?: string | null
          person?: string | null
          podetailid?: string | null
          ponum?: string | null
          postmonth?: string | null
          property?: string | null
          ref?: string | null
          ref_property_id?: string | null
          remittancevendor?: string | null
          retention?: string | null
          segment1?: string | null
          segment10?: string | null
          segment11?: string | null
          segment12?: string | null
          segment2?: string | null
          segment3?: string | null
          segment4?: string | null
          segment5?: string | null
          segment6?: string | null
          segment7?: string | null
          segment8?: string | null
          segment9?: string | null
          todate?: string | null
          trancurrencyid?: string | null
          trandate?: string | null
          trannum?: string | null
          travel?: string | null
          userdefinedfield1?: string | null
          userdefinedfield10?: string | null
          userdefinedfield2?: string | null
          userdefinedfield3?: string | null
          userdefinedfield4?: string | null
          userdefinedfield5?: string | null
          userdefinedfield6?: string | null
          userdefinedfield7?: string | null
          userdefinedfield8?: string | null
          userdefinedfield9?: string | null
          userid?: string | null
          workflow?: string | null
          workflowstatus?: string | null
          workflowstep?: string | null
        }
        Update: {
          account?: string | null
          accrual?: string | null
          adjustment?: string | null
          amount?: string | null
          amount2?: string | null
          category?: string | null
          checknum?: string | null
          citblevy?: string | null
          company?: string | null
          contract?: string | null
          costcode?: string | null
          creditmemo?: string | null
          date?: string | null
          desc?: string | null
          detailfield1?: string | null
          detailfield2?: string | null
          detailfield3?: string | null
          detailfield4?: string | null
          detailfield5?: string | null
          detailfield6?: string | null
          detailfield7?: string | null
          detailfield8?: string | null
          detailtaxamount1?: string | null
          detailtaxamount2?: string | null
          detailtranamount?: string | null
          detailvatrateid?: string | null
          detailvattrantypeid?: string | null
          displaytype?: string | null
          documentsequencenumber?: string | null
          duedate?: string | null
          exchangerate?: string | null
          exchangerate2?: string | null
          exchangeratedate?: string | null
          exchangeratedate2?: string | null
          expensetype?: string | null
          fromdate?: string | null
          fundingentity?: string | null
          id?: number
          internationalpaymenttype?: string | null
          is1099exempt?: number | null
          isconsolidatechecks?: string | null
          job?: string | null
          labour?: string | null
          manufacturingcosts?: string | null
          material?: string | null
          noncislabor?: string | null
          notes?: string | null
          notes2?: string | null
          offset?: string | null
          originaluref?: string | null
          person?: string | null
          podetailid?: string | null
          ponum?: string | null
          postmonth?: string | null
          property?: string | null
          ref?: string | null
          ref_property_id?: string | null
          remittancevendor?: string | null
          retention?: string | null
          segment1?: string | null
          segment10?: string | null
          segment11?: string | null
          segment12?: string | null
          segment2?: string | null
          segment3?: string | null
          segment4?: string | null
          segment5?: string | null
          segment6?: string | null
          segment7?: string | null
          segment8?: string | null
          segment9?: string | null
          todate?: string | null
          trancurrencyid?: string | null
          trandate?: string | null
          trannum?: string | null
          travel?: string | null
          userdefinedfield1?: string | null
          userdefinedfield10?: string | null
          userdefinedfield2?: string | null
          userdefinedfield3?: string | null
          userdefinedfield4?: string | null
          userdefinedfield5?: string | null
          userdefinedfield6?: string | null
          userdefinedfield7?: string | null
          userdefinedfield8?: string | null
          userdefinedfield9?: string | null
          userid?: string | null
          workflow?: string | null
          workflowstatus?: string | null
          workflowstep?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          aud: string | null
          avatar_url: string | null
          banned_until: string | null
          billing_address: Json | null
          confirmation_sent_at: string | null
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          email_change: string | null
          email_change_confirm_status: number | null
          email_change_sent_at: string | null
          email_change_token_current: string | null
          email_change_token_new: string | null
          email_confirmed_at: string | null
          encrypted_password: string | null
          full_name: string | null
          id: string
          instance_id: string | null
          invited_at: string | null
          is_sso_user: boolean | null
          is_super_admin: boolean | null
          last_sign_in_at: string | null
          payment_method: Json | null
          phone: string | null
          phone_change: string | null
          phone_change_sent_at: string | null
          phone_change_token: string | null
          phone_confirmed_at: string | null
          raw_app_meta_data: Json | null
          raw_user_meta_data: Json | null
          reauthentication_sent_at: string | null
          reauthentication_token: string | null
          recovery_sent_at: string | null
          recovery_token: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          aud?: string | null
          avatar_url?: string | null
          banned_until?: string | null
          billing_address?: Json | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          full_name?: string | null
          id?: string
          instance_id?: string | null
          invited_at?: string | null
          is_sso_user?: boolean | null
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          payment_method?: Json | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          aud?: string | null
          avatar_url?: string | null
          banned_until?: string | null
          billing_address?: Json | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          full_name?: string | null
          id?: string
          instance_id?: string | null
          invited_at?: string | null
          is_sso_user?: boolean | null
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          payment_method?: Json | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_avatar: {
        Args: {
          avatar_url: string
        }
        Returns: Record<string, unknown>
      }
      delete_storage_object: {
        Args: {
          bucket: string
          object: string
        }
        Returns: Record<string, unknown>
      }
      exec_sql: {
        Args: {
          sql_query: string
        }
        Returns: string
      }
      get_chargecodes: {
        Args: Record<PropertyKey, never>
        Returns: {
          code: string
          description: string
          account_code: string
          accountdesc: string
        }[]
      }
      get_columns_information: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          ordinal_position: number
          table_name: string
          column_name: string
          data_type: string
          is_nullable: string
        }[]
      }
      get_function_information: {
        Args: {
          p_function_name: string
        }
        Returns: {
          function_name: string
          return_type: string
          arguments: string
        }[]
      }
      spcreatetable: {
        Args: {
          objname: string
        }
        Returns: string
      }
      spcreatetablepostgres: {
        Args: {
          objname: string
        }
        Returns: undefined
      }
      spgetinsert: {
        Args: {
          objname: string
        }
        Returns: string
      }
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
