export interface Account {
  id: number
  Account_Code: string | null;
  Normal_Balance: string | null;
  Account_Type: string | null;
  Report_Type: string | null;
  Description: string | null;
  User_defined_1: string | null;
  User_defined_2: string | null;
  User_defined_3: string | null;
  User_defined_4: string | null;
  Exempt_1099: string | null;
  Cash_Account: string | null;
  Tenant_Deposit: string | null;
  Commisionable: string | null;
  Subject_to_Late_Fee: string | null;
  Prepay_Holding: string | null;
  Exclude_from_Use: string | null;
  AP_Account: string | null;
  Control_Account: string | null;
  Expense_Account: string | null;
  Print_End_Inc_Stmt_Perc: string | null;
  Exclude_from_Reg: string | null;
  Include_in_Cash_Flow: string | null;
  Percentage_Divisor: string | null;
  Suppress_Financial: string | null;
  Summary: string | null;
  AR_Account: string | null;
  WIP_Account: string | null;
  Exclude_from_Budget: any | null;
  Margin: string | null;
  Advance: string | null;
  Double_Underline: string | null;
  Print_Bold: string | null;
  Print_Italic: string | null;
  Total_Into: any | null;
  Offset: any | null;
  Hold_For: any | null;
  Payable: any | null;
  Receivable: any | null;
  System_Account: any | null;
  Chart: any | null;
  Tax_Account: any | null;
  Construction: any | null;
  Exclude_From_AP_IAT: any | null;
  Recoverability: any | null;
  IAT_Account: any | null;
  Prepaid_AR_Account: any | null;
  Notes: string | null;
}

export const emptyAccount = {
    id: 0,
    account_Code: "",
    normal_Balance: "",
    account_Type: "",
    report_Type: "",
    description: "",
    user_defined_1: "",
    user_defined_2: "",
    user_defined_3: "",
    user_defined_4: "",
    exempt_1099: "",
    cash_Account: "",
    tenant_Deposit: "",
    commisionable: "",
    subject_to_Late_Fee: "",
    prepay_Holding: "",
    exclude_from_Use: "",
    aP_Account: "",
    control_Account: "",
    expense_Account: "",
    print_End_Inc_Stmt_Perc: "",
    exclude_from_Reg: "",
    include_in_Cash_Flow: "",
    percentage_Divisor: "",
    suppress_Financial: "",
    summary: "",
    aR_Account: "",
    wIP_Account: "",
    exclude_from_Budget: "",
    margin: "",
    advance: "",
    double_Underline: "",
    print_Bold: "",
    print_Italic: "",
    total_Into: "",
    offset: "",
    hold_For: "",
    payable: "",
    receivable: "",
    system_Account: "",
    chart: "",
    tax_Account: "",
    construction: "",
    exclude_From_AP_IAT: "",
    recoverability: "",
    iAT_Account: "",
    prepaid_AR_Account: "",
    notes: "",
}

export const AccountProperties: Account = Object.keys(emptyAccount).reduce(
    (acc, key) => ({ ...acc, [key]: "" }),
    {} as Account
  );

  export function isAccount(object: any | null): object is Account {
    return 'id' in object && 'Account_Code' in object;
  }