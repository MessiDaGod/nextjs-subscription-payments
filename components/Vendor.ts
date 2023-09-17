export interface Vendor {
  id: number;
  vendor_Code: string | null;
  currency: string | null;
  tax_Authority: string | null;
  ext_Ref_Vendor_Id: string | null;
  last_Name: string | null;
  first_Name: string | null;
  salutation: string | null;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  address4: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  phone_Number_1: string | null;
  phone_Number_2: string | null;
  phone_Number_3: string | null;
  phone_Number_4: string | null;
  phone_Number_5: string | null;
  phone_Number_6: string | null;
  phone_Number_7: string | null;
  phone_Number_8: string | null;
  phone_Number_9: string | null;
  phone_Number_10: string | null;
  government_ID: string | null;
  government_Name: string | null;
  email: string | null;
  alternate_Email: string | null;
  workers_Comp_Expiration_Date: string | null;
  liability_Expiration_Date: string | null;
  contact: string | null;
  is_Contractor: string | null;
  is_InActive: string | null;
  inActive_Date: string | null;
  is_Require_Contract: string | null;
  user_Defined_Field1: string | null;
  user_Defined_Field2: string | null;
  user_Defined_Field3: string | null;
  user_Defined_Field4: string | null;
  user_Defined_Field5: string | null;
  user_Defined_Field6: string | null;
  user_Defined_Field7: string | null;
  user_Defined_Field8: string | null;
  user_Defined_Field9: string | null;
  user_Defined_Field10: string | null;
  user_Defined_Field11: string | null;
  user_Defined_Field12: string | null;
  gets: string | null;
  usual_Account_Code: string | null;
  default_AP_Account: string | null;
  default_Cash_Account: string | null;
  sales_Tax: string | null;
  tax_Registered: string | null;
  tax_Registration_Number: string | null;
  domestic_Tax_Tran_Type: string | null;
  cross_Border_Tax_Tran_Type: string | null;
  tax_Point: string | null;
  pST_Exempt: string | null;
  notes: string | null;
  consolidate: string | null;
  cheque_Memo_From_Invoice: string | null;
  hold_Payments: string | null;
  eFT: string | null;
  no_Signature: string | null;
  on_Cheques_Over: string | null;
  memo: string | null;
  pO_Required: string | null;
  discount_Percent: string | null;
  discount_Day: string | null;
  payment_Terms: string | null;
  days_From_Invoice_Or_Month: string | null;
  employee: string | null;
  vendor_Priority: string | null;
  language: string | null;
  tag: string | null;
  vendor_Status: string | null;
  expense_Type: string | null;
  priority: string | null;
  prop_Prompt: string | null;
  no_Duplicate_Invoice_on_Same_Date: string | null;
}

export const emptyVendor: Vendor = {
  id: 0,
  vendor_Code: "",
  currency: "",
  tax_Authority: "",
  ext_Ref_Vendor_Id: "",
  last_Name: "",
  first_Name: "",
  salutation: "",
  address1: "",
  address2: "",
  address3: "",
  address4: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  phone_Number_1: "",
  phone_Number_2: "",
  phone_Number_3: "",
  phone_Number_4: "",
  phone_Number_5: "",
  phone_Number_6: "",
  phone_Number_7: "",
  phone_Number_8: "",
  phone_Number_9: "",
  phone_Number_10: "",
  government_ID: "",
  government_Name: "",
  email: "",
  alternate_Email: "",
  workers_Comp_Expiration_Date: "",
  liability_Expiration_Date: "",
  contact: "",
  is_Contractor: "",
  is_InActive: "",
  inActive_Date: "",
  is_Require_Contract: "",
  user_Defined_Field1: "",
  user_Defined_Field2: "",
  user_Defined_Field3: "",
  user_Defined_Field4: "",
  user_Defined_Field5: "",
  user_Defined_Field6: "",
  user_Defined_Field7: "",
  user_Defined_Field8: "",
  user_Defined_Field9: "",
  user_Defined_Field10: "",
  user_Defined_Field11: "",
  user_Defined_Field12: "",
  gets: "",
  usual_Account_Code: "",
  default_AP_Account: "",
  default_Cash_Account: "",
  sales_Tax: "",
  tax_Registered: "",
  tax_Registration_Number: "",
  domestic_Tax_Tran_Type: "",
  cross_Border_Tax_Tran_Type: "",
  tax_Point: "",
  pST_Exempt: "",
  notes: "",
  consolidate: "",
  cheque_Memo_From_Invoice: "",
  hold_Payments: "",
  eFT: "",
  no_Signature: "",
  on_Cheques_Over: "",
  memo: "",
  pO_Required: "",
  discount_Percent: "",
  discount_Day: "",
  payment_Terms: "",
  days_From_Invoice_Or_Month: "",
  employee: "",
  vendor_Priority: "",
  language: "",
  tag: "",
  vendor_Status: "",
  expense_Type: "",
  priority: "",
  prop_Prompt: "",
  no_Duplicate_Invoice_on_Same_Date: "",
  // set other properties to empty strings
};

export const vendorProperties: Vendor = Object.keys(emptyVendor).reduce(
  (acc, key) => ({ ...acc, [key]: "" }),
  {} as Vendor
);

export function isVendor(object: any): object is Vendor {
  return 'id' in object && 'vendor_Code' in object;
}