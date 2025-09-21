// src/templates/loader.ts
import type { TemplateEntry } from "./catalog";
import { getCustomTemplates } from "./templateStore";

// Note: Vite glob imports for JSON files had issues, using hardcoded approach for reliability
// TODO: Investigate proper Vite configuration for JSON glob imports

// Cache for loaded templates
let templatesCache: TemplateEntry[] | null = null;

// Async function to load templates with caching
export async function loadTemplatesAsync(): Promise<TemplateEntry[]> {
  if (templatesCache) {
    return templatesCache;
  }

  // Simulate async loading for heavy template data
  await new Promise(resolve => setTimeout(resolve, 0));

  templatesCache = loadTemplatesSyncInternal();
  return templatesCache;
}

// Synchronous fallback for immediate use (returns empty array first, then loads async)
export function loadTemplates(): TemplateEntry[] {
  if (templatesCache) {
    return templatesCache;
  }

  // Return empty array initially, load async in background
  loadTemplatesAsync();
  return [];
}

// Internal function with the actual template data
function loadTemplatesSyncInternal(): TemplateEntry[] {
  // Built-in templates (hardcoded for reliability)
  const builtInTemplates: TemplateEntry[] = [
    {
      id: "hcm/shift-swap-bid",
      title: "Shift Swap/Bid",
      summary: "Restaurant workers can swap shifts or bid on open shifts",
      tags: ["Scheduling", "HCM", "Restaurant"],
      canvasKit: ["Tabs", "Table", "Button", "Badge", "DatePicker"],
      prompt: "Create a shift management page with tabs for 'My Shifts', 'Available Shifts', and 'Swap Requests'. Include a table showing shift dates, times, positions, and status badges. Add primary buttons for 'Request Swap' and 'Bid on Shift'.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "finance/expense-report",
      title: "Expense Report",
      summary: "Submit and track business expense reports with receipts",
      tags: ["Finance", "Expenses", "Travel"],
      canvasKit: ["Form", "Table", "Button", "Field", "DatePicker", "Badge"],
      prompt: "Create an expense report form with header showing report status and total amount. Include a table of expense line items with columns for Date, Description, Category, Amount, and Receipt status. Add fields for business purpose and submission date. Include primary 'Submit' and secondary 'Save Draft' buttons.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "hr-engagement/charitable-donations",
      title: "Charitable Donations",
      summary: "Manage employee charitable giving campaigns and donation tracking",
      tags: ["HR", "Engagement", "Charity", "Donations", "Campaigns"],
      canvasKit: ["Card", "Form", "Table", "Button", "Badge", "ProgressBar"],
      prompt: "Create a charitable donations page with a header card showing current campaign details, total raised amount, and progress bar toward goal. Include a donation form with dropdown for charity selection, amount field, and payment method options. Add a table showing recent donations with columns for Date, Employee, Charity, Amount, and Status badges. Include primary 'Donate Now' and secondary 'View All Campaigns' buttons.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "finance/project-billing-review",
      title: "Project Billing Review",
      summary: "Review and approve project billing rates and time allocations",
      tags: ["Finance", "Billing", "Projects", "Time Tracking", "Approval"],
      canvasKit: ["Table", "Form", "Button", "Badge", "DatePicker", "Field"],
      prompt: "Create a project billing review page with a header showing project details and billing period. Include a table of time entries with columns for Date, Employee, Hours, Rate, Amount, and Approval Status badges. Add filter controls for date range, employee, and billing status. Include an approval section with comments field and primary 'Approve All' and 'Reject Selected' buttons. Show summary totals for billable hours and amounts.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "hr-engagement/worker-badges",
      title: "Worker Badges",
      summary: "Award and claim digital achievement badges for employee recognition",
      tags: ["HR", "Badges", "Recognition", "Achievement", "Gamification"],
      canvasKit: ["Card", "Badge", "Button", "Table", "Modal", "Avatar"],
      prompt: "Create a worker badges page with a header section showing the employee's badge collection using colorful badge components. Include tabs for 'My Badges', 'Available Badges', and 'Badge Claims'. Show a grid of available badges with descriptions, criteria, and 'Claim Badge' buttons. Add a recent activity table with columns for Date, Badge Name, Awarded To, and Status. Include a badge detail modal that opens when clicking on badges, showing criteria and progress.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "payroll-tax/sui-tax-rates",
      title: "SUI Tax Rates",
      summary: "Manage State Unemployment Insurance tax rates by location and period",
      tags: ["Payroll", "Tax", "SUI", "Rates", "Compliance"],
      canvasKit: ["Table", "Form", "Button", "DatePicker", "Field", "Select"],
      prompt: "Create a SUI tax rates management page with a header showing current tax period and jurisdiction. Include a searchable table with columns for State, Tax Rate, Wage Base, Effective Date, End Date, and Status badges. Add a form for updating tax rates with fields for state selection, rate percentage, wage base amount, and effective date range. Include filter controls for state, status, and date range. Provide primary 'Update Rates' and secondary 'Export Data' buttons.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "health-safety/vaccine-management",
      title: "Vaccine Management",
      summary: "Upload vaccine proof documents and track vaccination status for compliance",
      tags: ["Health", "Safety", "Vaccine", "Compliance", "Documents"],
      canvasKit: ["Form", "Upload", "Table", "Badge", "Button", "Card"],
      prompt: "Create a vaccine management page with a status card showing current vaccination compliance status and requirements. Include an upload form for vaccine documents with fields for vaccine type, date administered, healthcare provider, and document upload. Add a table showing vaccination history with columns for Vaccine Type, Date, Provider, Document Status, and Approval badges. Include document preview functionality and primary 'Submit for Review' and secondary 'Save Draft' buttons.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "finance/mileage-expense",
      title: "Mileage Expense",
      summary: "Track and submit mileage expenses for business travel reimbursement",
      tags: ["Finance", "Expenses", "Mileage", "Travel", "Reimbursement"],
      canvasKit: ["Form", "Table", "Button", "DatePicker", "Field", "Map"],
      prompt: "Create a mileage expense tracking page with a form for logging trips including start/end locations, date, purpose, and odometer readings. Show calculated mileage and reimbursement amount based on current rates. Include a table of submitted mileage entries with columns for Date, Route, Miles, Rate, Amount, and Status badges. Add a summary card showing total monthly mileage and reimbursement amounts. Include primary 'Submit Expense' and secondary 'Save Draft' buttons.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "health-safety/return-to-office",
      title: "Return to Office",
      summary: "Manage office return scheduling and health screening requirements",
      tags: ["Health", "Safety", "Office", "Scheduling", "Screening"],
      canvasKit: ["Form", "Calendar", "Table", "Badge", "Button", "Card"],
      prompt: "Create a return to office page with a health screening form including temperature check, symptom questionnaire, and exposure declaration. Show a calendar view for booking office desk reservations with availability indicators. Include a table of upcoming office visits with columns for Date, Location, Desk Number, Health Status, and Approval badges. Add capacity indicators showing current office occupancy levels and primary 'Book Desk' and 'Complete Screening' buttons.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "hr-engagement/gift-registry",
      title: "Gift Registry",
      summary: "Create and manage employee gift registries for special occasions and milestones",
      tags: ["HR", "Engagement", "Gifts", "Registry", "Occasions"],
      canvasKit: ["Card", "Form", "Table", "Button", "Badge", "Image"],
      prompt: "Create a gift registry page with a header card showing the occasion details and recipient information. Include a form for adding gift items with fields for item name, description, price range, and preferred retailer. Show a table of registry items with columns for Item, Description, Price, Contributor, and Status badges. Add contribution tracking with progress indicators and primary 'Contribute to Gift' and secondary 'Add New Item' buttons. Display recent activity feed for registry updates.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "hr-engagement/employee-recognition",
      title: "Employee Recognition",
      summary: "Nominate and recognize outstanding employee performance and achievements",
      tags: ["HR", "Recognition", "Performance", "Awards", "Engagement"],
      canvasKit: ["Form", "Card", "Table", "Button", "Badge", "Avatar"],
      prompt: "Create an employee recognition page with a nomination form including fields for nominee selection, recognition category, achievement description, and impact statement. Show a recognition feed with cards displaying recent awards, nominee photos, and achievement details. Include a table of pending nominations with columns for Nominee, Category, Submitted By, Date, and Status badges. Add recognition categories like 'Innovation', 'Teamwork', 'Customer Service' and primary 'Submit Nomination' and secondary 'View All Awards' buttons.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "esg/commuting-emissions-survey",
      title: "Commuting Emissions Survey",
      summary: "Track employee commuting methods to calculate carbon footprint and ESG metrics",
      tags: ["ESG", "Environment", "Commuting", "Survey", "Sustainability"],
      canvasKit: ["Form", "Chart", "Button", "Select", "Card", "ProgressBar"],
      prompt: "Create a commuting survey page with a form for employees to log their daily commute methods including transportation type, distance, frequency, and alternative options. Show environmental impact charts displaying CO2 emissions calculations and reduction potential. Include a sustainability goals card with progress bars toward carbon reduction targets. Add commute method comparison charts and primary 'Submit Survey' and secondary 'View Impact Report' buttons.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "it-admin/order-business-cards",
      title: "Order Business Cards",
      summary: "Request and customize business cards with company branding and contact information",
      tags: ["IT", "Admin", "Business Cards", "Orders", "Branding"],
      canvasKit: ["Form", "Card", "Button", "Field", "Select", "Preview"],
      prompt: "Create a business card ordering page with a form for personal information including name, title, department, phone, and email. Show a live preview card displaying the business card design with company branding. Include customization options for card style, paper type, and quantity selection. Add fields for special requests and delivery preferences. Include primary 'Place Order' and secondary 'Save Design' buttons with order tracking information.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "it-admin/vehicle-registration",
      title: "Vehicle Registration",
      summary: "Register and manage company vehicles for parking and security access",
      tags: ["IT", "Admin", "Vehicles", "Registration", "Parking"],
      canvasKit: ["Form", "Table", "Button", "Field", "Upload", "Badge"],
      prompt: "Create a vehicle registration page with a form for adding vehicle details including make, model, year, license plate, color, and employee assignment. Include document upload for registration and insurance proof. Show a table of registered vehicles with columns for License Plate, Vehicle Info, Owner, Parking Zone, and Status badges. Add filter controls for location, status, and vehicle type. Include primary 'Register Vehicle' and secondary 'Update Info' buttons.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "orchestration/project-forecasting",
      title: "Project Forecasting",
      summary: "Automated project planning and resource forecasting with Workday Orchestrate integration",
      tags: ["Orchestration", "Forecasting", "Projects", "Planning", "Automation"],
      canvasKit: ["Form", "Chart", "Table", "Button", "DatePicker", "Card"],
      prompt: "Create a project forecasting page with input form for project parameters including scope, timeline, resource requirements, and budget constraints. Show forecasting charts displaying resource allocation, timeline projections, and budget estimates. Include a table of similar past projects with columns for Name, Duration, Resources, Budget, and Outcome badges. Add automated recommendations from Orchestrate workflows and primary 'Generate Forecast' and secondary 'Save Scenario' buttons.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "orchestration/request-credit-card",
      title: "Request Credit Card",
      summary: "Automated corporate credit card request workflow with approval routing",
      tags: ["Orchestration", "Credit Card", "Requests", "Approval", "Finance"],
      canvasKit: ["Form", "Table", "Button", "Field", "Badge", "Stepper"],
      prompt: "Create a credit card request page with a form for business justification, spending limits, card type selection, and manager approval routing. Show a workflow stepper displaying approval stages from request to card delivery. Include a table of existing requests with columns for Date, Card Type, Limit, Approver, and Status badges. Add automated spending policy checks and primary 'Submit Request' and secondary 'Save Draft' buttons with Orchestrate workflow integration.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "orchestration/disable-account-during-leave",
      title: "Disable Workday Account During Leave",
      summary: "Automated account management for employees on extended leave with reactivation scheduling",
      tags: ["Orchestration", "Security", "Leave", "Account Management", "Automation"],
      canvasKit: ["Form", "Table", "Button", "DatePicker", "Badge", "Timeline"],
      prompt: "Create an account management page for leave periods with a form for leave dates, account access levels, and automated reactivation settings. Show a timeline view of account status changes with access restrictions and reactivation schedules. Include a table of employees on leave with columns for Name, Leave Type, Start Date, End Date, Account Status, and Access badges. Add Orchestrate workflow triggers and primary 'Schedule Deactivation' and secondary 'Manual Override' buttons.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "comp-rewards/create-spot-bonus",
      title: "Create Spot Bonus",
      summary: "Award immediate spot bonuses for exceptional performance and achievements",
      tags: ["Compensation", "Rewards", "Bonus", "Recognition", "Performance"],
      canvasKit: ["Form", "Table", "Button", "Field", "Select", "Badge"],
      prompt: "Create a spot bonus award page with a form for selecting employees, bonus amount, reason for award, and approval routing. Include fields for business justification, effective date, and budget allocation. Show a table of recent spot bonuses with columns for Employee, Amount, Reason, Date, Approver, and Status badges. Add validation for bonus limits and approval requirements. Include primary 'Award Bonus' and secondary 'Save Draft' buttons with real-time budget tracking.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "orchestration/cloud-commute-automation",
      title: "Cloud Commute Automation",
      summary: "Automated commute planning and expense tracking with cloud integration",
      tags: ["Orchestration", "Commute", "Automation", "Cloud", "Expenses"],
      canvasKit: ["Form", "Map", "Table", "Button", "Card", "Timeline"],
      prompt: "Create a commute automation page with intelligent route planning form including start/end locations, preferred departure times, and transportation preferences. Show automated expense calculations and route optimization suggestions. Include a timeline view of daily commute patterns with weather and traffic integration. Add a table of commute history with columns for Date, Route, Duration, Cost, Mode, and Efficiency badges. Include cloud-based predictions and primary 'Optimize Route' and secondary 'View Analytics' buttons.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "hcm/quick-add-additional-job",
      title: "Quick Add Additional Job",
      summary: "Rapidly assign additional job roles and responsibilities to existing workers",
      tags: ["HCM", "Jobs", "Assignments", "Roles", "Quick Actions"],
      canvasKit: ["Form", "Table", "Button", "Select", "Field", "Badge"],
      prompt: "Create an additional job assignment page with a quick form for selecting workers, job positions, effective dates, and reporting relationships. Include job details like department, location, work schedule, and compensation adjustments. Show a table of current job assignments with columns for Worker, Primary Job, Additional Jobs, Effective Date, and Status badges. Add validation for conflicts and approval workflows. Include primary 'Assign Job' and secondary 'Preview Changes' buttons with job hierarchy visualization.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "it-admin/asset-barcoding",
      title: "Asset Barcoding",
      summary: "Generate and manage barcode labels for IT assets and equipment tracking",
      tags: ["IT", "Admin", "Barcoding", "Assets", "Inventory"],
      canvasKit: ["Form", "Table", "Button", "Field", "Upload", "Code"],
      prompt: "Create an asset barcoding page with a form for generating barcode labels including asset ID, description, location, and owner information. Show barcode preview with customizable label formats and print options. Include a table of barcoded assets with columns for Asset ID, Barcode, Description, Location, Owner, and Status badges. Add bulk barcode generation and label printing capabilities. Include primary 'Generate Labels' and secondary 'Print Selected' buttons with barcode scanning integration.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "hcm/change-business-title",
      title: "Change Business Title",
      summary: "Update employee business titles and position information efficiently",
      tags: ["HCM", "Title", "Position", "Updates", "Management"],
      canvasKit: ["Form", "Table", "Button", "Field", "Select", "Badge"],
      prompt: "Create a business title change page with a form for selecting employees, new title information, effective dates, and approval routing. Include fields for title justification, grade level changes, and compensation impact assessment. Show a table of pending title changes with columns for Employee, Current Title, New Title, Effective Date, Approver, and Status badges. Add title hierarchy validation and approval workflow tracking. Include primary 'Submit Change' and secondary 'Save Draft' buttons with organizational chart integration.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "hr-benefits/tuition-reimbursement",
      title: "Tuition Reimbursement",
      summary: "Apply for and track educational tuition reimbursement benefits",
      tags: ["HR", "Benefits", "Education", "Tuition", "Reimbursement"],
      canvasKit: ["Form", "Table", "Button", "Field", "Upload", "Badge"],
      prompt: "Create a tuition reimbursement application page with a form for course information including institution, program details, cost breakdown, and business relevance. Include document upload for transcripts, receipts, and approval letters. Show a table of reimbursement requests with columns for Course, Institution, Amount, Semester, Grade, and Status badges. Add policy compliance checking and reimbursement calculation based on grades achieved. Include primary 'Submit Application' and secondary 'Save Progress' buttons with benefits balance tracking.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "hr-engagement/conflict-of-interest",
      title: "Conflict of Interest",
      summary: "Declare and manage potential conflicts of interest for compliance and transparency",
      tags: ["HR", "Compliance", "Ethics", "Conflict", "Disclosure"],
      canvasKit: ["Form", "Table", "Button", "Field", "Select", "Badge"],
      prompt: "Create a conflict of interest disclosure page with a comprehensive form for reporting potential conflicts including financial interests, business relationships, family connections, and outside activities. Include conflict assessment tools and risk evaluation criteria. Show a table of declared conflicts with columns for Type, Description, Risk Level, Mitigation Plan, Review Date, and Status badges. Add policy guidance and approval workflow tracking. Include primary 'Submit Declaration' and secondary 'Request Guidance' buttons with annual review reminders.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "talent/multi-rater-reviews",
      title: "Multi-Rater Reviews",
      summary: "Comprehensive 360-degree performance reviews with multiple rater perspectives",
      tags: ["Talent", "Reviews", "360", "Performance", "Feedback"],
      canvasKit: ["Form", "Table", "Button", "Chart", "Card", "Badge"],
      prompt: "Create a multi-rater review page with forms for different rater types including self-assessment, manager review, peer feedback, and direct report input. Show review progress tracking with completion status for each rater category. Include performance analytics charts comparing ratings across different dimensions and rater groups. Add a table of review participants with columns for Rater, Relationship, Completion Status, Submission Date, and Progress badges. Include primary 'Submit Review' and secondary 'Save Draft' buttons with review cycle management.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "learning-events/badge-scanning",
      title: "Badge Scanning",
      summary: "Scan employee badges to track attendance at learning events and training sessions",
      tags: ["Learning", "Events", "Scanning", "Attendance", "Training"],
      canvasKit: ["Form", "Table", "Button", "Badge", "Scanner", "Card"],
      prompt: "Create a badge scanning page with a live scanner interface for reading employee badges at learning events. Include event details card showing session information, location, and expected attendees. Show a real-time attendance table with columns for Employee, Badge ID, Scan Time, Status, and Attendance badges. Add manual entry options for badge failures and attendance corrections. Include primary 'Start Scanning' and secondary 'Manual Entry' buttons with attendance reporting and export features.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "hr-engagement/work-from-almost-anywhere",
      title: "Work From Almost Anywhere",
      summary: "Request and manage remote work arrangements from various global locations",
      tags: ["HR", "Remote Work", "Global", "Flexibility", "Arrangements"],
      canvasKit: ["Form", "Map", "Table", "Button", "Calendar", "Badge"],
      prompt: "Create a remote work request page with a form for selecting work locations, duration, business justification, and timezone considerations. Include an interactive map showing approved remote work locations and restrictions. Show a calendar view for scheduling remote work periods with approval status. Add a table of remote work history with columns for Location, Duration, Approval Status, Manager, and Compliance badges. Include policy guidance and primary 'Request Remote Work' and secondary 'View Policies' buttons.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "hr-engagement/rewards-recognition-kainos",
      title: "Rewards Recognition Kainos",
      summary: "Kainos-specific rewards and recognition platform for employee achievements",
      tags: ["HR", "Rewards", "Recognition", "Kainos", "Achievements"],
      canvasKit: ["Form", "Card", "Table", "Button", "Badge", "Points"],
      prompt: "Create a Kainos rewards platform with a points-based recognition system including nomination forms for various achievement categories. Show a recognition feed with achievement cards displaying photos, descriptions, and point values. Include a points balance dashboard and redemption catalog for rewards. Add a table of recent recognitions with columns for Recipient, Achievement, Points, Nominator, and Category badges. Include leaderboards and primary 'Nominate Colleague' and secondary 'Redeem Points' buttons with Kainos branding elements.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "hr-engagement/employee-docs-kainos",
      title: "Employee Docs Kainos",
      summary: "Kainos-specific employee document management and self-service portal",
      tags: ["HR", "Documents", "Kainos", "Self-Service", "Portal"],
      canvasKit: ["Form", "Table", "Button", "Upload", "Download", "Badge"],
      prompt: "Create a Kainos employee document portal with document categories including contracts, policies, benefits, and personal records. Include document upload and download functionality with version control. Show a table of available documents with columns for Document Type, Title, Version, Last Updated, and Access badges. Add document request forms for missing documents and approval workflows. Include search and filter capabilities with primary 'Request Document' and secondary 'Upload Document' buttons featuring Kainos-specific document templates.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "hr-benefits/benefits-plus",
      title: "Benefits Plus",
      summary: "Enhanced benefits platform with additional voluntary benefits and wellness programs",
      tags: ["HR", "Benefits", "Wellness", "Voluntary", "Platform"],
      canvasKit: ["Form", "Card", "Table", "Button", "Chart", "Badge"],
      prompt: "Create a comprehensive benefits platform with enhanced voluntary benefits enrollment including supplemental insurance, wellness programs, and lifestyle benefits. Show benefits comparison charts and cost calculators. Include a personalized benefits recommendation engine based on employee demographics and life events. Add a table of enrolled benefits with columns for Benefit Type, Coverage Level, Cost, Provider, and Status badges. Include wellness tracking integration and primary 'Enroll in Benefits' and secondary 'View Recommendations' buttons.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "time-absence/timesheet-assistant",
      title: "Timesheet Assistant",
      summary: "AI-powered timesheet completion assistant with smart suggestions and automation",
      tags: ["Time", "Absence", "Assistant", "AI", "Automation"],
      canvasKit: ["Form", "Table", "Button", "Calendar", "Field", "Badge"],
      prompt: "Create an intelligent timesheet assistant with automated time entry suggestions based on calendar events and historical patterns. Include a weekly timesheet grid with smart auto-completion and project code recommendations. Show time allocation charts and overtime alerts. Add a table of recent time entries with columns for Date, Project, Hours, Type, Status, and Approval badges. Include time tracking analytics and primary 'Submit Timesheet' and secondary 'Save Draft' buttons with AI-powered validation and error detection.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "data-capture/dynamic-data-capture",
      title: "Dynamic Data Capture",
      summary: "Configurable data capture forms with dynamic fields and validation rules",
      tags: ["Data", "Capture", "Dynamic", "Forms", "Configuration"],
      canvasKit: ["Form", "Table", "Button", "Field", "Select", "Badge"],
      prompt: "Create a dynamic data capture system with configurable form builder including field types, validation rules, and conditional logic. Show form templates and custom field options with real-time preview. Include a table of captured data with customizable columns based on form configuration. Add data export capabilities and validation reporting. Include primary 'Create Form' and secondary 'Capture Data' buttons with form versioning and approval workflows for data collection processes.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "hr-engagement/reward-my-team",
      title: "Reward My Team",
      summary: "Team-based rewards and recognition platform for group achievements and collaboration",
      tags: ["HR", "Rewards", "Team", "Recognition", "Collaboration"],
      canvasKit: ["Form", "Card", "Table", "Button", "Chart", "Badge"],
      prompt: "Create a team rewards platform with group nomination forms for collective achievements including project completions, innovation initiatives, and collaboration efforts. Show team achievement galleries with project highlights and success stories. Include team leaderboards and group reward distribution tools. Add a table of team rewards with columns for Team, Achievement, Members, Points, Date, and Status badges. Include team analytics and performance tracking with primary 'Nominate Team' and secondary 'View Team Stats' buttons.",
      version: "1.0",
      category: "Templates"
    }
  ];

  // Get custom templates from the template store
  const customTemplates = getCustomTemplates();

  // Combine built-in and custom templates
  const allTemplates = [...builtInTemplates, ...customTemplates];

  // Sort by title for consistent ordering
  return allTemplates.sort((a, b) => a.title.localeCompare(b.title));
}